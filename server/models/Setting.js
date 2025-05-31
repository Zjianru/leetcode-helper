import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

/**
 * 用户设置模型 - 单用户模式
 * 存储用户的个人偏好设置
 */
const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '设置ID'
  },
  theme: {
    type: DataTypes.ENUM('light', 'dark', 'auto'),
    allowNull: false,
    defaultValue: 'light',
    comment: '主题设置：light-浅色，dark-深色，auto-自动'
  },
  language: {
    type: DataTypes.ENUM('zh-CN', 'en-US'),
    allowNull: false,
    defaultValue: 'zh-CN',
    comment: '语言设置：zh-CN-中文，en-US-英文'
  },
  notifications: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      dailyReminder: true,
      achievementAlert: true,
      systemNotice: true
    },
    comment: '通知设置：每日提醒、成就提醒、系统通知'
  },
  shortcuts: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      addRecord: 'Ctrl+Shift+A',
      toggleTheme: 'Ctrl+Shift+T',
      openErrorBook: 'Ctrl+Shift+E'
    },
    comment: '快捷键设置'
  },
  display: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      itemsPerPage: 20,
      showDifficulty: true,
      showTags: true,
      compactMode: false
    },
    comment: '显示设置：每页条数、显示难度、显示标签、紧凑模式'
  },
  privacy: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      shareProgress: false,
      publicProfile: false
    },
    comment: '隐私设置：分享进度、公开资料'
  }
}, {
  tableName: 'settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: '用户设置表',
  indexes: [
    {
      fields: ['theme']
    },
    {
      fields: ['language']
    },
    {
      fields: ['updated_at']
    }
  ]
});

export default Setting;