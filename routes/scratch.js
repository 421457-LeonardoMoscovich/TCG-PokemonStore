const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const { comprarTicketScratch } = require('../controllers/scratchController');

router.post('/comprar', authMiddleware, comprarTicketScratch);

module.exports = router;
