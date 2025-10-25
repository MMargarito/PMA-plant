const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { validate } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Task CRUD
router.post('/', validate('createTask'), taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/stats', taskController.getProjectStats);
router.get('/:taskId', taskController.getTaskById);
router.put('/:taskId', validate('updateTask'), taskController.updateTask);
router.delete('/:taskId', taskController.deleteTask);

// Comments
router.post('/:taskId/comments', validate('addComment'), taskController.addComment);
router.put('/:taskId/comments/:commentId', validate('updateComment'), taskController.updateComment);
router.delete('/:taskId/comments/:commentId', taskController.deleteComment);

module.exports = router;

