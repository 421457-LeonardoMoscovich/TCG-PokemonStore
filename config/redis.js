const { createClient } = require('redis');
require('dotenv').config();

let redisClient = null;

async function connectRedis() {
  if (redisClient) return redisClient;

  redisClient = createClient({ url: process.env.REDIS_URL });

  redisClient.on('error', (err) => console.error('❌ Redis error:', err.message));
  redisClient.on('connect', () => console.log('✅ Redis conectado:', process.env.REDIS_URL));
  redisClient.on('reconnecting', () => console.log('🔄 Redis reconectando...'));

  await redisClient.connect();
  return redisClient;
}

function getRedis() {
  if (!redisClient || !redisClient.isOpen) {
    throw new Error('Redis no inicializado. Llamá connectRedis() primero.');
  }
  return redisClient;
}

async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log('Redis conexión cerrada.');
  }
}

module.exports = { connectRedis, getRedis, closeRedis };
