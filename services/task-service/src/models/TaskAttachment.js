const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Task = require('./Task');

const TaskAttachment = sequelize.define('TaskAttachment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  task_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Task,
      key: 'id'
    }
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  original_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mime_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  uploaded_by: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'task_attachments',
  timestamps: true,
  underscored: true,
  createdAt: 'uploaded_at',
  updatedAt: false
});

Task.hasMany(TaskAttachment, { foreignKey: 'task_id', onDelete: 'CASCADE', as: 'attachments' });
TaskAttachment.belongsTo(Task, { foreignKey: 'task_id' });

module.exports = TaskAttachment;

