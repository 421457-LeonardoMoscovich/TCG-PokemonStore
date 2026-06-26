const express = require('express');
const router = express.Router();
const { matchResult, syncUser, gameEnded, coinsSpent, packOpened, balanceSync } = require('../controllers/tcgController');

// Webhook server-a-server desde el TPI (Spring Boot) — autenticado por X-TCG-Webhook-Secret,
// no por JWT de usuario.
router.post('/match-result', matchResult);

// Crea/vincula una cuenta cuando alguien se registra en el TPI sin venir desde el sitio.
router.post('/users', syncUser);

// Suma coinsEarned (monedas in-game del TPI) al balance de la cuenta vinculada.
router.post('/game-ended', gameEnded);

// Descuenta del balance un gasto de coins hecho en el TPI (mascotas, cosméticos, etc.).
router.post('/coins-spent', coinsSpent);

// Persiste las cartas obtenidas al abrir un sobre en el TPI (Canal B).
router.post('/pack-opened', packOpened);

// Fuerza la sincronización del balance del sitio con los coins actuales del TPI.
router.post('/balance-sync', balanceSync);

module.exports = router;
