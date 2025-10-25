const { Op } = require('sequelize');
const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const logger = require('../config/logger');

/**
 * Create a new project
 */
const createProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectData = {
      ...req.validatedData,
      owner_id: userId
    };

    const project = await Project.create(projectData);

    // Add owner as project member with owner role
    await ProjectMember.create({
      project_id: project.id,
      user_id: userId,
      role: 'owner'
    });

    logger.info(`Project created: ${project.id} by user ${userId}`);

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    logger.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

/**
 * Get all projects for current user
 */
const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Find all project IDs where user is a member
    const memberProjects = await ProjectMember.findAll({
      where: { user_id: userId },
      attributes: ['project_id']
    });

    const projectIds = memberProjects.map(pm => pm.project_id);

    // Build query
    const where = {
      [Op.or]: [
        { owner_id: userId },
        { id: { [Op.in]: projectIds } }
      ]
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: projects } = await Project.findAndCountAll({
      where,
      include: [{
        model: ProjectMember,
        as: 'members',
        attributes: ['user_id', 'role']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      projects,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

/**
 * Get project by ID
 */
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.projectId, {
      include: [{
        model: ProjectMember,
        as: 'members',
        attributes: ['id', 'user_id', 'role', 'joined_at']
      }]
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    logger.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

/**
 * Update project
 */
const updateProject = async (req, res) => {
  try {
    const project = req.project;
    const updates = req.validatedData;

    await project.update(updates);

    logger.info(`Project updated: ${project.id}`);

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    logger.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

/**
 * Delete project
 */
const deleteProject = async (req, res) => {
  try {
    const project = req.project;

    await project.destroy();

    logger.info(`Project deleted: ${project.id}`);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    logger.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

/**
 * Add member to project
 */
const addMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { user_id, role } = req.validatedData;

    // Check if member already exists
    const existing = await ProjectMember.findOne({
      where: { project_id: projectId, user_id }
    });

    if (existing) {
      return res.status(409).json({ error: 'User is already a member' });
    }

    const member = await ProjectMember.create({
      project_id: projectId,
      user_id,
      role
    });

    logger.info(`Member added to project: ${user_id} -> ${projectId}`);

    res.status(201).json({
      message: 'Member added successfully',
      member
    });
  } catch (error) {
    logger.error('Add member error:', error);
    res.status(500).json({ error: 'Failed to add member' });
  }
};

/**
 * Remove member from project
 */
const removeMember = async (req, res) => {
  try {
    const { projectId, memberId } = req.params;

    const member = await ProjectMember.findOne({
      where: { id: memberId, project_id: projectId }
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Prevent removing owner
    if (member.role === 'owner') {
      return res.status(400).json({ error: 'Cannot remove project owner' });
    }

    await member.destroy();

    logger.info(`Member removed from project: ${memberId} from ${projectId}`);

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    logger.error('Remove member error:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
};

/**
 * Update member role
 */
const updateMemberRole = async (req, res) => {
  try {
    const { projectId, memberId } = req.params;
    const { role } = req.validatedData;

    const member = await ProjectMember.findOne({
      where: { id: memberId, project_id: projectId }
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Prevent changing owner role
    if (member.role === 'owner') {
      return res.status(400).json({ error: 'Cannot change owner role' });
    }

    member.role = role;
    await member.save();

    logger.info(`Member role updated: ${memberId} to ${role}`);

    res.json({
      message: 'Member role updated successfully',
      member
    });
  } catch (error) {
    logger.error('Update member role error:', error);
    res.status(500).json({ error: 'Failed to update member role' });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  updateMemberRole
};

