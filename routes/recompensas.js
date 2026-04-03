const express = require('express');
const router = express.Router();
const { 
  obtenerEstadoRecompensas, 
  reclamarBonusDiario, 
  obtenerTrivia, 
  verificarTrivia,
  girarRuleta,
  obtenerLogros
} = require('../controllers/recompensasController');
const { authMiddleware } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get('/estado', obtenerEstadoRecompensas);
router.post('/diaria', reclamarBonusDiario);
router.get('/trivia', obtenerTrivia);
router.post('/trivia/verificar', verificarTrivia);
router.post('/ruleta/girar', girarRuleta);
router.get('/logros', obtenerLogros);

module.exports = router;
