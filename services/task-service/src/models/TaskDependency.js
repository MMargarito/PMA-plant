const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Task = require('./Task');

const TaskDependency = sequelize.define('TaskDependency', {
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
  depends_on_task_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Task,
      key: 'id'
    }
  },
  dependency_type: {
    type: DataTypes.ENUM('blocks', 'requires', 'relates_to'),
    defaultValue: 'blocks'
  }
}, {
  tableName: 'task_dependencies',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = TaskDependency;

