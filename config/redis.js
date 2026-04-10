const { createClient } = require('redis');
require('dotenv').config();

let redisClient = null;
let isConnected = false;

async function connectRedis() {
  if (redisClient && isConnected) return redisClient;

  redisClient = createClient({ 
    url: process.env.REDIS_URL,
    // Add logic to avoid infinite retry loops during startup if it's down
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 5) {
          console.error('❌ Redis: Maximum reconnection attempts reached. Continuing in LITE mode.');
          return false; // Stop retrying
        }
        return Math.min(retries * 100, 3000);
      }
    }
  });

  redisClient.on('error', (err) => {
    // Only log significant errors
    if (!isConnected) {
       console.error('⚠️ Redis connection failed. The server will continue, but Cache/Cart features will be disabled.');
    } else {
       console.error('❌ Redis error:', err.message);
    }
  });

  redisClient.on('connect', () => {
    isConnected = true;
    console.log('✅ Redis conectado:', process.env.REDIS_URL);
  });

  try {
    await redisClient.connect();
    isConnected = true;
  } catch (err) {
    isConnected = false;
    console.warn('⚠️ Warning: Could not establish initial connection to Redis. Working without cache.');
  }

  return redisClient;
}

function getRedis() {
  // If Redis is not initialized at all, that's still an error
  if (!redisClient) {
    throw new Error('Redis no inicializado. Llamá connectRedis() primero.');
  }
  return redisClient;
}

async function closeRedis() {
  if (redisClient && isConnected) {
    try {
      await redisClient.quit();
    } catch (err) {
      console.warn('Error closing Redis:', err.message);
    }
    redisClient = null;
    isConnected = false;
    console.log('Redis conexión cerrada.');
  }
}

module.exports = { connectRedis, getRedis, closeRedis };
