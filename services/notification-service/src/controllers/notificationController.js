const { Op } = require('sequelize');
const Notification = require('../models/Notification');
const NotificationPreference = require('../models/NotificationPreference');
const logger = require('../config/logger');
const { emitToUser } = require('../websocket/socketManager');

/**
 * Create a notification
 */
const createNotification = async (req, res) => {
  try {
    const { user_id, type, title, message, data, link, priority } = req.body;

    // Check if user has this notification type enabled
    let prefs = await NotificationPreference.findOne({ where: { user_id } });
    
    if (!prefs) {
      // Create default preferences if they don't exist
      prefs = await NotificationPreference.create({ user_id });
    }

    // Check if notification type is enabled
    if (prefs[type] === false) {
      return res.json({ message: 'Notification type disabled for user' });
    }

    const notification = await Notification.create({
      user_id,
      type,
      title,
      message,
      data,
      link,
      priority
    });

    // Emit real-time notification via WebSocket
    emitToUser(user_id, 'notification', notification.toJSON());

    logger.info(`Notification created for user: ${user_id}`);

    res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    logger.error('Create notification error:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

/**
 * Get notifications for current user
 */
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { unread_only, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const where = { user_id: userId };
    if (unread_only === 'true') {
      where.is_read = false;
    }

    const { count, rows: notifications } = await Notification.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    const unreadCount = await Notification.count({
      where: { user_id: userId, is_read: false }
    });

    res.json({
      notifications,
      unreadCount,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

/**
 * Mark notification as read
 */
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id: notificationId, user_id: userId }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (!notification.is_read) {
      notification.is_read = true;
      notification.read_at = new Date();
      await notification.save();

      // Emit updated unread count
      const unreadCount = await Notification.count({
        where: { user_id: userId, is_read: false }
      });
      emitToUser(userId, 'unread_count', { count: unreadCount });
    }

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    logger.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

/**
 * Mark all notifications as read
 */
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.update(
      { 
        is_read: true,
        read_at: new Date()
      },
      { 
        where: { 
          user_id: userId,
          is_read: false
        }
      }
    );

    // Emit updated unread count
    emitToUser(userId, 'unread_count', { count: 0 });

    logger.info(`All notifications marked as read for user: ${userId}`);

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    logger.error('Mark all as read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

/**
 * Delete notification
 */
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id: notificationId, user_id: userId }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await notification.destroy();

    logger.info(`Notification deleted: ${notificationId}`);

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    logger.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

/**
 * Get notification preferences
 */
const getPreferences = async (req, res) => {
  try {
    const userId = req.user.id;

    let preferences = await NotificationPreference.findOne({
      where: { user_id: userId }
    });

    if (!preferences) {
      preferences = await NotificationPreference.create({ user_id: userId });
    }

    res.json({ preferences });
  } catch (error) {
    logger.error('Get preferences error:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
};

/**
 * Update notification preferences
 */
const updatePreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    let preferences = await NotificationPreference.findOne({
      where: { user_id: userId }
    });

    if (!preferences) {
      preferences = await NotificationPreference.create({
        user_id: userId,
        ...updates
      });
    } else {
      await preferences.update(updates);
    }

    logger.info(`Notification preferences updated for user: ${userId}`);

    res.json({
      message: 'Preferences updated successfully',
      preferences
    });
  } catch (error) {
    logger.error('Update preferences error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getPreferences,
  updatePreferences
};

