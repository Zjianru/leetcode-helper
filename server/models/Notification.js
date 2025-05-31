import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('reminder', 'achievement', 'system', 'warning'),
    allowNull: false,
    comment: '通知类型：reminder-提醒，achievement-成就，system-系统，warning-警告'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '通知标题'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '通知内容'
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '是否已读'
  },
  priority: {
    type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
    defaultValue: 'normal',
    comment: '优先级'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '额外的元数据信息'
  }
}, {
  tableName: 'notifications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['read']
    },
    {
      fields: ['type']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['created_at']
    }
  ]
});

export default Notification;