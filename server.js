require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { connectDB } = require('./config/db');
const { connectRedis } = require('./config/redis');
const { closeDB } = require('./config/db');
const { closeRedis } = require('./config/redis');

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// CORS — restrict to known frontend origins
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('CORS: origen no permitido'));
  },
  credentials: true,
}));

// Request body limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate limiting on auth endpoints (20 requests / 15 min per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Demasiados intentos. Intentá de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/usuarios/login', authLimiter);
app.use('/api/usuarios/registro', authLimiter);

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
app.use('/api/tcg', require('./routes/tcg'));

// Servir frontend estático (SPA)
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// API 404 — debe ir antes del catch-all del SPA
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Ruta de API no encontrada' });
});

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

async function ensureIndexes() {
  const { getDB } = require('./config/db');
  const db = getDB();
  await db.collection('tcg_webhook_events').createIndex({ eventId: 1 }, { unique: true });
}

// Iniciar
async function start() {
  await connectDB();
  await connectRedis();
  await ensureIndexes();
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
