import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Problem from './Problem.js';

const Record = sequelize.define('Record', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // 移除userId字段，改为单用户模式
  problemId: {
    type: DataTypes.STRING(20),
    field: 'problem_id',
    allowNull: false,
    references: {
      model: Problem,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('completed', 'attempted'),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'records',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['problemId', 'date']
    },
    {
      fields: ['status']
    },
    {
      fields: ['date']
    }
  ]
});

// 定义关联关系
Record.belongsTo(Problem, {
  foreignKey: 'problemId',
  as: 'Problem'
});

Problem.hasMany(Record, {
  foreignKey: 'problemId',
  as: 'Records'
});

export default Record;
