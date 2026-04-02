const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const {
  getDashboardStats,
  adminCreateCard,
  adminUpdateCard,
  adminDeleteCard,
  adminBulkDeleteCards,
  getUsers,
  updateUserRole,
  deleteUser,
} = require('../controllers/adminController');

// All routes require auth + admin
router.use(authMiddleware, adminMiddleware);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Card management
router.post('/cartas', adminCreateCard);
router.put('/cartas/:id', adminUpdateCard);
router.delete('/cartas/:id', adminDeleteCard);
router.post('/cartas/bulk-delete', adminBulkDeleteCards);

// User management
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;
