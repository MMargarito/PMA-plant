const { Op } = require('sequelize');
const Task = require('../models/Task');
const TaskComment = require('../models/TaskComment');
const TaskAttachment = require('../models/TaskAttachment');
const TaskDependency = require('../models/TaskDependency');
const logger = require('../config/logger');

/**
 * Create a new task
 */
const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskData = {
      ...req.validatedData,
      created_by: userId
    };

    const task = await Task.create(taskData);

    logger.info(`Task created: ${task.id} by user ${userId}`);

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    logger.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

/**
 * Get tasks with filters
 */
const getTasks = async (req, res) => {
  try {
    const { 
      project_id, 
      status, 
      priority, 
      assigned_to, 
      search, 
      page = 1, 
      limit = 50 
    } = req.query;
    
    const offset = (page - 1) * limit;
    const where = {};

    if (project_id) where.project_id = project_id;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assigned_to) where.assigned_to = assigned_to;

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: tasks } = await Task.findAndCountAll({
      where,
      include: [
        {
          model: TaskComment,
          as: 'comments',
          attributes: ['id', 'user_id', 'comment', 'created_at']
        },
        {
          model: TaskAttachment,
          as: 'attachments',
          attributes: ['id', 'filename', 'file_url', 'file_size', 'mime_type']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        ['order_index', 'ASC'],
        ['created_at', 'DESC']
      ]
    });

    res.json({
      tasks,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

/**
 * Get task by ID
 */
const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByPk(taskId, {
      include: [
        {
          model: TaskComment,
          as: 'comments',
          attributes: ['id', 'user_id', 'comment', 'is_edited', 'created_at', 'updated_at'],
          order: [['created_at', 'DESC']]
        },
        {
          model: TaskAttachment,
          as: 'attachments',
          attributes: ['id', 'filename', 'original_name', 'file_url', 'file_size', 'mime_type', 'uploaded_by', 'uploaded_at']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Get dependencies
    const dependencies = await TaskDependency.findAll({
      where: { task_id: taskId }
    });

    res.json({ 
      task,
      dependencies
    });
  } catch (error) {
    logger.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

/**
 * Update task
 */
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updates = req.validatedData;

    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.update(updates);

    logger.info(`Task updated: ${taskId}`);

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    logger.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

/**
 * Delete task
 */
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();

    logger.info(`Task deleted: ${taskId}`);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    logger.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

/**
 * Add comment to task
 */
const addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const { comment } = req.validatedData;

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const newComment = await TaskComment.create({
      task_id: taskId,
      user_id: userId,
      comment
    });

    logger.info(`Comment added to task: ${taskId}`);

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    logger.error('Add comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

/**
 * Update comment
 */
const updateComment = async (req, res) => {
  try {
    const { taskId, commentId } = req.params;
    const userId = req.user.id;
    const { comment } = req.validatedData;

    const existingComment = await TaskComment.findOne({
      where: { id: commentId, task_id: taskId }
    });

    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (existingComment.user_id !== userId) {
      return res.status(403).json({ error: 'Cannot edit other users\' comments' });
    }

    existingComment.comment = comment;
    existingComment.is_edited = true;
    await existingComment.save();

    logger.info(`Comment updated: ${commentId}`);

    res.json({
      message: 'Comment updated successfully',
      comment: existingComment
    });
  } catch (error) {
    logger.error('Update comment error:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

/**
 * Delete comment
 */
const deleteComment = async (req, res) => {
  try {
    const { taskId, commentId } = req.params;
    const userId = req.user.id;

    const comment = await TaskComment.findOne({
      where: { id: commentId, task_id: taskId }
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.user_id !== userId) {
      return res.status(403).json({ error: 'Cannot delete other users\' comments' });
    }

    await comment.destroy();

    logger.info(`Comment deleted: ${commentId}`);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    logger.error('Delete comment error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

/**
 * Get task statistics for a project
 */
const getProjectStats = async (req, res) => {
  try {
    const { project_id } = req.query;

    if (!project_id) {
      return res.status(400).json({ error: 'project_id is required' });
    }

    const stats = {
      total: await Task.count({ where: { project_id } }),
      todo: await Task.count({ where: { project_id, status: 'todo' } }),
      in_progress: await Task.count({ where: { project_id, status: 'in_progress' } }),
      review: await Task.count({ where: { project_id, status: 'review' } }),
      done: await Task.count({ where: { project_id, status: 'done' } }),
      by_priority: {
        low: await Task.count({ where: { project_id, priority: 'low' } }),
        medium: await Task.count({ where: { project_id, priority: 'medium' } }),
        high: await Task.count({ where: { project_id, priority: 'high' } }),
        critical: await Task.count({ where: { project_id, priority: 'critical' } })
      }
    };

    res.json({ stats });
  } catch (error) {
    logger.error('Get project stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addComment,
  updateComment,
  deleteComment,
  getProjectStats
};

