const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { validate } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const { checkProjectAccess, requireProjectRole } = require('../middleware/projectAuth');

// All routes require authentication
router.use(authenticateToken);

// Project CRUD
router.post('/', validate('createProject'), projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:projectId', checkProjectAccess, projectController.getProjectById);
router.put('/:projectId', checkProjectAccess, requireProjectRole('owner', 'admin'), validate('updateProject'), projectController.updateProject);
router.delete('/:projectId', checkProjectAccess, requireProjectRole('owner'), projectController.deleteProject);

// Member management
router.post('/:projectId/members', checkProjectAccess, requireProjectRole('owner', 'admin'), validate('addMember'), projectController.addMember);
router.delete('/:projectId/members/:memberId', checkProjectAccess, requireProjectRole('owner', 'admin'), projectController.removeMember);
router.put('/:projectId/members/:memberId', checkProjectAccess, requireProjectRole('owner', 'admin'), validate('updateMemberRole'), projectController.updateMemberRole);

module.exports = router;

