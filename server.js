require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const { connectRedis } = require('./config/redis');
const { closeDB } = require('./config/db');
const { closeRedis } = require('./config/redis');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
// Aumentar el límite para la migración de datos
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/health', async (req, res) => {
  let mongoOk = false;
  let redisOk = false;
  try {
    const { getDB } = require('./config/db');
    await getDB().command({ ping: 1 });
    mongoOk = true;
  } catch {}
  try {
    const { getRedis } = require('./config/redis');
    await getRedis().ping();
    redisOk = true;
  } catch {}
  res.json({ status: 'ok', timestamp: new Date().toISOString(), services: { mongodb: mongoOk, redis: redisOk } });
});

// Rutas API
app.use('/api/cartas', require('./routes/cartas'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/compras', require('./routes/compras'));
app.use('/api/scratch', require('./routes/scratch'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/recompensas', require('./routes/recompensas'));

// Servir frontend estático (SPA)
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Catch-all para rutas del cliente (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// Graceful shutdown
async function shutdown() {
  console.log('\nCerrando servidor...');
  await closeDB();
  await closeRedis();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Iniciar
async function start() {
  await connectDB();
  await connectRedis();
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Cartas: http://localhost:${PORT}/api/cartas`);
  });

  return server;
}

if (require.main === module) {
  start().catch(err => {
    console.error('Error al iniciar:', err);
    process.exit(1);
  });
}

module.exports = { app, start };
