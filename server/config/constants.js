/**
 * 项目配置常量文件
 * 集中管理所有魔法数字和配置值
 */

// 服务器配置
export const SERVER_CONFIG = {
  DEFAULT_PORT: 5001,
  REQUEST_TIMEOUT: 30000, // 30秒
  MAX_REQUEST_SIZE: '10mb'
};

// 数据库配置
export const DATABASE_CONFIG = {
  CONNECTION_TIMEOUT: 60000, // 60秒
  ACQUIRE_TIMEOUT: 60000,
  IDLE_TIMEOUT: 10000,
  MAX_CONNECTIONS: 5,
  MIN_CONNECTIONS: 0
};

// 目标配置
export const GOAL_CONFIG = {
  DEFAULT_EASY_TARGET: 2,
  DEFAULT_MEDIUM_TARGET: 1,
  DEFAULT_HARD_TARGET: 0,
  DEFAULT_TOTAL_TARGET: 3
};

// 时间相关常量
export const TIME_CONFIG = {
  MILLISECONDS_PER_DAY: 24 * 60 * 60 * 1000,
  DAYS_IN_WEEK: 7,
  DAYS_IN_MONTH: 30,
  HOURS_PER_DAY: 24,
  MINUTES_PER_HOUR: 60,
  SECONDS_PER_MINUTE: 60
};

// API 响应状态
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  PENDING: 'pending'
};

// 题目难度
export const DIFFICULTY_LEVELS = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard'
};

// 刷题状态
export const RECORD_STATUS = {
  SOLVED: 'solved',
  ATTEMPTED: 'attempted',
  REVIEW: 'review'
};

// 通知类型
export const NOTIFICATION_TYPES = {
  GOAL_REMINDER: 'goal_reminder',
  ACHIEVEMENT: 'achievement',
  SYSTEM: 'system'
};

// 日期格式
export const DATE_FORMATS = {
  ISO_DATE: /^\d{4}-\d{2}-\d{2}$/,
  ISO_DATETIME: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
};

// 错误消息
export const ERROR_MESSAGES = {
  INVALID_DATE_FORMAT: '日期格式错误',
  RECORD_NOT_FOUND: '记录不存在',
  PROBLEM_NOT_FOUND: '题目不存在',
  GOAL_NOT_FOUND: '目标不存在',
  NOTIFICATION_NOT_FOUND: '通知不存在',
  DATABASE_ERROR: '数据库操作失败',
  VALIDATION_ERROR: '数据验证失败',
  INTERNAL_SERVER_ERROR: '服务器内部错误'
};

// 成功消息
export const SUCCESS_MESSAGES = {
  RECORD_CREATED: '记录创建成功',
  RECORD_UPDATED: '记录更新成功',
  RECORD_DELETED: '记录删除成功',
  GOAL_UPDATED: '目标更新成功',
  NOTIFICATION_SENT: '通知发送成功',
  SETTINGS_UPDATED: '设置更新成功'
};