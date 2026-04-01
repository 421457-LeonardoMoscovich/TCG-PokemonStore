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
router.post('/', authMiddleware, crearCarta);
router.put('/:id', authMiddleware, actualizarCarta);
router.delete('/:id', authMiddleware, eliminarCarta);

module.exports = router;
