import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Goal = sequelize.define('Goal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dailyTarget: {
    type: DataTypes.INTEGER,
    field: 'daily_target',
    allowNull: false,
    defaultValue: 5,
    validate: {
      min: 1,
      max: 50
    },
    comment: '每日刷题目标数量'
  },
  totalTarget: {
    type: DataTypes.INTEGER,
    field: 'total_target',
    allowNull: false,
    defaultValue: 1000,
    validate: {
      min: 100,
      max: 10000
    },
    comment: '总刷题目标数量'
  },
  difficultyRatio: {
    type: DataTypes.JSON,
    field: 'difficulty_ratio',
    allowNull: false,
    defaultValue: {
      easy: 30,
      medium: 50,
      hard: 20
    },
    comment: '难度分布比例 (%)'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    field: 'is_active',
    defaultValue: true,
    comment: '是否为当前活跃目标'
  }
}, {
  tableName: 'goals',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['is_active']
    },
    {
      fields: ['updated_at']
    }
  ]
});

export default Goal;