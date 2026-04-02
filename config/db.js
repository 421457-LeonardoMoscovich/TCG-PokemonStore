const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
let client = null;
let db = null;

async function connectDB() {
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  console.log(`✅ MongoDB conectado: ${uri}`);
  return db;
}

function getDB() {
  if (!db) throw new Error('MongoDB no inicializado. Llamá connectDB() primero.');
  return db;
}

function getClient() {
  if (!client) throw new Error('MongoDB no inicializado. Llamá connectDB() primero.');
  return client;
}

async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB conexión cerrada.');
  }
}

module.exports = { connectDB, getDB, getClient, closeDB };
