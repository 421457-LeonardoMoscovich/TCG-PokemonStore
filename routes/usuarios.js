const express = require('express');
const router = express.Router();
const { registro, login, logout, obtenerPerfil, actualizarPerfil, obtenerColeccion, obtenerWishlist, agregarAWishlist, quitarDeWishlist, obtenerSobres } = require('../controllers/usuariosController');
const { authMiddleware } = require('../middleware/auth');

router.post('/registro', registro);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/perfil', authMiddleware, obtenerPerfil);
router.put('/perfil', authMiddleware, actualizarPerfil);

// Colección (Pokédex)
router.get('/coleccion', authMiddleware, obtenerColeccion);

// Sobres TCG abiertos (Canal B)
router.get('/perfil/sobres', authMiddleware, obtenerSobres);

// Wishlist
router.get('/wishlist', authMiddleware, obtenerWishlist);
router.post('/wishlist/:cardId', authMiddleware, agregarAWishlist);
router.delete('/wishlist/:cardId', authMiddleware, quitarDeWishlist);

module.exports = router;
