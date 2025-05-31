import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Problem = sequelize.define('Problem', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    allowNull: false
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  url: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'problems',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default Problem;
