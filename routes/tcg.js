const express = require('express');
const router = express.Router();
const { matchResult, syncUser } = require('../controllers/tcgController');

// Webhook server-a-server desde el TPI (Spring Boot) — autenticado por X-TCG-Webhook-Secret,
// no por JWT de usuario.
router.post('/match-result', matchResult);

// Crea/vincula una cuenta cuando alguien se registra en el TPI sin venir desde el sitio.
router.post('/users', syncUser);

module.exports = router;
