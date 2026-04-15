const { MongoClient } = require('mongodb');
require('dotenv').config();
const { DEFAULT_CARD_PRICE, PRICE_BY_RARITY } = require('../utils/cardPricing');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('cartas');

    console.log('--- Iniciando migración de precios ---');

    for (const [rarity, price] of Object.entries(PRICE_BY_RARITY)) {
      const result = await collection.updateMany(
        { rarity: rarity },
        { $set: { price: price } }
      );
      console.log(`Rareza [${rarity}]: Actualizadas ${result.modifiedCount} cartas con precio $${price}`);
    }

    // Default for empty or unknown rarities
    const resultDefault = await collection.updateMany(
      { $or: [{ rarity: "" }, { rarity: { $exists: false } }, { price: { $exists: false } }] },
      { $set: { price: DEFAULT_CARD_PRICE } }
    );
    console.log(`Rarezas desconocidas: Actualizadas ${resultDefault.modifiedCount} cartas con precio $${DEFAULT_CARD_PRICE}`);

    console.log('--- Migración completada con éxito ---');
  } catch (err) {
    console.error('Error durante la migración:', err);
  } finally {
    await client.close();
  }
}

run();
