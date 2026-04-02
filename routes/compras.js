const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  agregarAlCarrito,
  quitarDelCarrito,
  obtenerCarrito,
  limpiarCarrito,
  completarCompra,
  obtenerHistorial,
} = require('../controllers/comprasController');

router.post('/carrito', authMiddleware, agregarAlCarrito);
router.delete('/carrito/:cardId', authMiddleware, quitarDelCarrito);
router.get('/carrito', authMiddleware, obtenerCarrito);
router.delete('/carrito', authMiddleware, limpiarCarrito);
router.post('/completar', authMiddleware, completarCompra);
router.get('/historial', authMiddleware, obtenerHistorial);

module.exports = router;
