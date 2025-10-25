const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validate } = require('../middleware/validation');
const { authenticateToken, requireRole } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', validate('updateProfile'), userController.updateProfile);
router.put('/password', validate('changePassword'), userController.changePassword);

// Admin routes
router.get('/', requireRole('admin'), userController.getAllUsers);
router.get('/:id', requireRole('admin'), userController.getUserById);
router.delete('/:id', requireRole('admin'), userController.deactivateUser);

module.exports = router;

