/**
 * Migración: agrega `tcgCardId` a las cartas del sitio que tienen equivalente en el TPI.
 *
 * Estrategia de match (en orden):
 *   1. Nombre exacto (case-insensitive)
 *   2. Nombre normalizado: sin guiones, sin puntos, espacios colapsados
 *
 * Uso:
 *   node scripts/map-tcg-cards.js           # dry-run (muestra qué haría)
 *   node scripts/map-tcg-cards.js --apply   # aplica los cambios en MongoDB
 */

require('dotenv').config();
const { connectDB, getDB, closeDB } = require('../config/db');

const TCG_API = process.env.TCG_BASE_URL
  ? `${process.env.TCG_BASE_URL}/cards`
  : 'http://localhost:8090/cards';

const DRY_RUN = !process.argv.includes('--apply');

function normalize(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchTpiCards() {
  const res = await fetch(TCG_API);
  if (!res.ok) throw new Error(`TPI API respondió ${res.status}`);
  return res.json();
}

async function main() {
  console.log(`Modo: ${DRY_RUN ? 'DRY-RUN (sin cambios)' : 'APPLY (escribe en MongoDB)'}`);
  console.log(`TPI API: ${TCG_API}\n`);

  await connectDB();
  const db = getDB();

  const [tpiCards, siteCards] = await Promise.all([
    fetchTpiCards(),
    db.collection('cartas').find({}, { projection: { _id: 1, name: 1, tcgCardId: 1 } }).toArray(),
  ]);

  console.log(`Cartas TPI: ${tpiCards.length}`);
  console.log(`Cartas sitio: ${siteCards.length}\n`);

  // Índices para búsqueda rápida
  const tpiByExact = new Map(tpiCards.map(c => [c.name.toLowerCase(), c.id]));
  const tpiByNorm  = new Map(tpiCards.map(c => [normalize(c.name), c.id]));

  const matched   = [];
  const already   = [];
  const unmatched = [];

  for (const card of siteCards) {
    if (card.tcgCardId) {
      already.push(card.name);
      continue;
    }

    const nameLower = (card.name || '').toLowerCase();
    const nameNorm  = normalize(card.name || '');

    const tcgId = tpiByExact.get(nameLower) ?? tpiByNorm.get(nameNorm) ?? null;

    if (tcgId) {
      matched.push({ siteId: card._id, name: card.name, tcgCardId: tcgId });
    } else {
      unmatched.push(card.name);
    }
  }

  console.log(`✅ Match encontrado:  ${matched.length}`);
  console.log(`⏭️  Ya tenían tcgCardId: ${already.length}`);
  console.log(`❌ Sin match:         ${unmatched.length}\n`);

  if (matched.length > 0) {
    console.log('--- Cartas que se van a actualizar ---');
    for (const m of matched) {
      console.log(`  ${m.name.padEnd(30)} → ${m.tcgCardId}`);
    }
    console.log();
  }

  if (unmatched.length > 0) {
    console.log('--- Sin equivalente en el TPI ---');
    for (const name of unmatched) {
      console.log(`  ${name}`);
    }
    console.log();
  }

  if (!DRY_RUN && matched.length > 0) {
    const { MongoClient } = require('mongodb');
    const ops = matched.map(m => ({
      updateOne: {
        filter: { _id: m.siteId },
        update: { $set: { tcgCardId: m.tcgCardId } },
      },
    }));
    const result = await db.collection('cartas').bulkWrite(ops);
    console.log(`✅ Actualizado: ${result.modifiedCount} cartas en MongoDB.`);
  }

  await closeDB();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
