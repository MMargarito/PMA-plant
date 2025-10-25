const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Task = require('./Task');

const TaskComment = sequelize.define('TaskComment', {
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
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_edited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'task_comments',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Task.hasMany(TaskComment, { foreignKey: 'task_id', onDelete: 'CASCADE', as: 'comments' });
TaskComment.belongsTo(Task, { foreignKey: 'task_id' });

module.exports = TaskComment;

