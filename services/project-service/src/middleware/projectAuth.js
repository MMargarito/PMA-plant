const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const logger = require('../config/logger');

/**
 * Check if user has access to project
 */
const checkProjectAccess = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user is owner or member
    const isOwner = project.owner_id === userId;
    const member = await ProjectMember.findOne({
      where: { project_id: projectId, user_id: userId }
    });

    if (!isOwner && !member) {
      return res.status(403).json({ error: 'Access denied to this project' });
    }

    req.project = project;
    req.projectMember = member;
    req.isProjectOwner = isOwner;
    next();
  } catch (error) {
    logger.error('Project access check error:', error);
    res.status(500).json({ error: 'Failed to verify project access' });
  }
};

/**
 * Check if user has specific role in project
 */
const requireProjectRole = (...roles) => {
  return (req, res, next) => {
    if (req.isProjectOwner) {
      return next(); // Owner has all permissions
    }

    if (!req.projectMember || !roles.includes(req.projectMember.role)) {
      return res.status(403).json({ error: 'Insufficient project permissions' });
    }

    next();
  };
};

module.exports = {
  checkProjectAccess,
  requireProjectRole
};

