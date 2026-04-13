#!/usr/bin/env node
/**
 * Script para agregar precios a las cartas en MongoDB
 * Los precios varían según la rareza:
 * - ◆ Diamante: $50
 * - ☆ Estrella: $35
 * - ◊ Rombo: $20
 * - ♪ Nota: $15
 * - Sin rareza especial: $10
 *
 * Uso: node scripts/add-prices.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const PRICE_MAP = {
  '◆': 50,   // Diamante
  '☆': 35,   // Estrella
  '◊': 20,   // Rombo
  '♪': 15,   // Nota
};

const DEFAULT_PRICE = 10;

async function addPrices() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');

    const db = client.db('pokemon_db');
    const collection = db.collection('cartas');

    // Obtener todas las cartas
    const cartas = await collection.find({}).toArray();
    console.log(`📊 Total de cartas: ${cartas.length}`);

    let updated = 0;
    let errors = 0;

    // Actualizar cada carta con precio
    for (const carta of cartas) {
      try {
        const price = PRICE_MAP[carta.rarity] || DEFAULT_PRICE;

        const result = await collection.updateOne(
          { _id: carta._id },
          { $set: { price } }
        );

        if (result.modifiedCount > 0 || result.upsertedCount > 0) {
          updated++;
        }
      } catch (err) {
        console.error(`❌ Error actualizando carta ${carta._id}:`, err.message);
        errors++;
      }
    }

    console.log(`\n=== RESULTADO ===`);
    console.log(`✅ Cartas actualizadas: ${updated}`);
    console.log(`❌ Errores: ${errors}`);

    // Verificar resultado
    const conPrice = await collection.countDocuments({ price: { $exists: true } });
    console.log(`\n📈 Total con campo price: ${conPrice}/${cartas.length}`);

    if (conPrice === cartas.length) {
      console.log('✨ ¡Todas las cartas tienen precio!');
    } else {
      console.warn(`⚠️  ${cartas.length - conPrice} cartas sin precio`);
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

addPrices();
