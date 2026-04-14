const express = require('express');
const router = express.Router();
const { authMiddleware, optionalAuthMiddleware, adminMiddleware } = require('../middleware/auth');
const {
  obtenerCartas,
  obtenerCartaPorId,
  crearCarta,
  actualizarCarta,
  eliminarCarta,
} = require('../controllers/cartasController');

router.get('/', optionalAuthMiddleware, obtenerCartas);
router.get('/:id', optionalAuthMiddleware, obtenerCartaPorId);


router.post('/', authMiddleware, adminMiddleware, crearCarta);
router.put('/:id', authMiddleware, adminMiddleware, actualizarCarta);
router.delete('/:id', authMiddleware, adminMiddleware, eliminarCarta);

module.exports = router;
