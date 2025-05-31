import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Problem from './Problem.js';

const ErrorProblem = sequelize.define('ErrorProblem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  problemId: {
    type: DataTypes.STRING(20),
    field: 'problem_id',
    allowNull: false,
    references: {
      model: Problem,
      key: 'id'
    }
  },
  errorReason: {
    type: DataTypes.TEXT,
    field: 'error_reason',
    allowNull: true,
    comment: '错误原因'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '学习笔记'
  },
  starred: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '是否收藏'
  },
  reviewed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '是否已复习'
  },
  lastReview: {
    type: DataTypes.DATE,
    field: 'last_review',
    allowNull: true,
    comment: '最后复习时间'
  }
}, {
  tableName: 'error_problems',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['problemId']
    }
  ]
});

// 定义关联关系
ErrorProblem.belongsTo(Problem, {
  foreignKey: 'problemId',
  as: 'Problem'
});

Problem.hasMany(ErrorProblem, {
  foreignKey: 'problemId',
  as: 'ErrorProblems'
});

export default ErrorProblem;