const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NotificationPreference = sequelize.define('NotificationPreference', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  email_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  push_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  task_assigned: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  task_updated: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  task_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  comment_added: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  project_invite: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  project_updated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  mention: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'notification_preferences',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = NotificationPreference;

