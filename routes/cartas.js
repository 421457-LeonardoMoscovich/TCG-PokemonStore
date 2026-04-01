const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  obtenerCartas,
  obtenerCartaPorId,
  crearCarta,
  actualizarCarta,
  eliminarCarta,
} = require('../controllers/cartasController');

router.get('/', obtenerCartas);
router.get('/:id', obtenerCartaPorId);

// Rutas de migración (temporales)
router.post('/clear', async (req, res) => {
  try {
    const { getDB } = require('../config/db');
    const db = getDB();
    await db.collection('cartas').deleteMany({});
    res.json({ success: true, message: 'Colección vaciada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/migrate', async (req, res) => {
  try {
    const { getDB } = require('../config/db');
    const db = getDB();
    const cartas = req.body;
    if (!Array.isArray(cartas)) return res.status(400).json({ error: 'Array esperado' });
    const result = await db.collection('cartas').insertMany(cartas);
    res.json({ success: true, count: result.insertedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, crearCarta);
router.put('/:id', authMiddleware, actualizarCarta);
router.delete('/:id', authMiddleware, eliminarCarta);

module.exports = router;
