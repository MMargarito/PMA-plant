const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Project = require('./Project');

const ProjectMember = sequelize.define('ProjectMember', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  project_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Project,
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('owner', 'admin', 'member', 'viewer'),
    defaultValue: 'member'
  },
  joined_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'project_members',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['project_id', 'user_id']
    }
  ]
});

// Associations
Project.hasMany(ProjectMember, { foreignKey: 'project_id', onDelete: 'CASCADE', as: 'members' });
ProjectMember.belongsTo(Project, { foreignKey: 'project_id' });

module.exports = ProjectMember;

