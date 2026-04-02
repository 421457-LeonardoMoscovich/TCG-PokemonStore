const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const PRICE_MAP = {
  '◊': 20,
  '◊◊': 40,
  '◊◊◊': 100,
  '◊◊◊◊': 250,
  '☆': 500,
  '☆☆': 1200,
  '☆☆☆': 3000,
  'Crown Rare': 6000,
  'default': 10
};

async function run() {
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('cartas');

    console.log('--- Iniciando migración de precios ---');

    const rarities = Object.keys(PRICE_MAP).filter(r => r !== 'default');

    for (const rarity of rarities) {
      const price = PRICE_MAP[rarity];
      const result = await collection.updateMany(
        { rarity: rarity },
        { $set: { price: price } }
      );
      console.log(`Rareza [${rarity}]: Actualizadas ${result.modifiedCount} cartas con precio $${price}`);
    }

    // Default for empty or unknown rarities
    const resultDefault = await collection.updateMany(
      { $or: [{ rarity: "" }, { rarity: { $exists: false } }, { price: { $exists: false } }] },
      { $set: { price: PRICE_MAP.default } }
    );
    console.log(`Rarezas desconocidas: Actualizadas ${resultDefault.modifiedCount} cartas con precio $${PRICE_MAP.default}`);

    console.log('--- Migración completada con éxito ---');
  } catch (err) {
    console.error('Error durante la migración:', err);
  } finally {
    await client.close();
  }
}

run();
