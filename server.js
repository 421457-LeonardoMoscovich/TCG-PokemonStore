require('dotenv').config();
const express = require('express');
const cors = require('cors');
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

// Ruta temporal de limpieza
app.post('/api/clear-atlas', async (req, res) => {
  try {
    const { getDB } = require('./config/db');
    const db = getDB();
    await db.collection('cartas').deleteMany({});
    res.json({ success: true, message: 'Colección cartas vaciada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta temporal de migración (append)
app.post('/api/migrate-atlas', async (req, res) => {
  try {
    const { getDB } = require('./config/db');
    const db = getDB();
    const cartas = req.body;
    
    if (!Array.isArray(cartas)) return res.status(400).json({ error: 'Body must be an array of cards' });
    
    const result = await db.collection('cartas').insertMany(cartas);
    res.json({ success: true, count: result.insertedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rutas
app.use('/api/cartas', require('./routes/cartas'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/compras', require('./routes/compras'));
app.use('/api/scratch', require('./routes/scratch'));

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
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Cartas: http://localhost:${PORT}/api/cartas`);
  });
}

start().catch(err => { console.error('Error al iniciar:', err); process.exit(1); });
