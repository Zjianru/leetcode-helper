-- LeetCode 刷题助手数据库初始化脚本 (无外键约束版本)
-- 创建日期: 2025-05-31
-- 更新日期: 2025-01-XX (单用户模式，无需用户认证系统，无外键约束)

-- 1. 创建数据库
CREATE DATABASE IF NOT EXISTS leetcode_helper CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE leetcode_helper;

-- 2. 题目表
CREATE TABLE IF NOT EXISTS problems (
  id VARCHAR(20) PRIMARY KEY COMMENT '题目ID',
  title VARCHAR(100) NOT NULL COMMENT '题目标题',
  difficulty ENUM('easy', 'medium', 'hard') NOT NULL COMMENT '难度等级',
  tags JSON DEFAULT (JSON_ARRAY()) COMMENT '题目标签',
  url VARCHAR(255) COMMENT '题目链接',
  description TEXT COMMENT '题目描述',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_difficulty (difficulty),
  INDEX idx_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='题目表';

-- 3. 刷题记录表 (单用户模式，移除user_id，无外键约束)
CREATE TABLE IF NOT EXISTS records (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID',
  problem_id VARCHAR(20) NOT NULL COMMENT '题目ID',
  status ENUM('completed', 'attempted') NOT NULL COMMENT '完成状态',
  date DATE NOT NULL COMMENT '刷题日期',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_problem_id (problem_id),
  INDEX idx_date (date),
  INDEX idx_status (status),
  UNIQUE KEY uk_problem_date (problem_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='刷题记录表';

-- 4. 错题本表 (单用户模式，移除user_id，无外键约束)
CREATE TABLE IF NOT EXISTS error_problems (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '错题ID',
  problem_id VARCHAR(20) NOT NULL COMMENT '题目ID',
  error_reason TEXT COMMENT '错误原因',
  notes TEXT COMMENT '笔记',
  starred BOOLEAN DEFAULT FALSE COMMENT '是否收藏',
  reviewed BOOLEAN DEFAULT FALSE COMMENT '是否已复习',
  last_review DATE COMMENT '最后复习日期',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_problem_id (problem_id),
  INDEX idx_starred (starred),
  INDEX idx_reviewed (reviewed),
  UNIQUE KEY uk_problem (problem_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='错题本表';

-- 5. 通知表 (单用户模式，移除user_id)
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '通知ID',
  type ENUM('reminder', 'achievement', 'system') NOT NULL COMMENT '通知类型',
  title VARCHAR(100) NOT NULL COMMENT '通知标题',
  content TEXT NOT NULL COMMENT '通知内容',
  `read` BOOLEAN DEFAULT FALSE COMMENT '是否已读',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium' COMMENT '优先级',
  metadata JSON COMMENT '元数据',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_read (`read`),
  INDEX idx_type (type),
  INDEX idx_priority (priority),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知表';

-- 6. 用户设置表 (单用户模式，移除user_id作为主键)
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '设置ID',
  theme ENUM('light', 'dark', 'auto') DEFAULT 'light' COMMENT '主题设置',
  language ENUM('zh-CN', 'en-US') DEFAULT 'zh-CN' COMMENT '语言设置',
  notifications JSON DEFAULT (JSON_OBJECT('dailyReminder', true, 'achievementAlert', true, 'systemNotice', true)) COMMENT '通知设置',
  shortcuts JSON DEFAULT (JSON_OBJECT('addRecord', 'Ctrl+Shift+A', 'toggleTheme', 'Ctrl+Shift+T', 'openErrorBook', 'Ctrl+Shift+E')) COMMENT '快捷键设置',
  display JSON DEFAULT (JSON_OBJECT('itemsPerPage', 20, 'showDifficulty', true, 'showTags', true, 'compactMode', false)) COMMENT '显示设置',
  privacy JSON DEFAULT (JSON_OBJECT('shareProgress', false, 'publicProfile', false)) COMMENT '隐私设置',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_theme (theme),
  INDEX idx_language (language),
  INDEX idx_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户设置表';

-- 7. 目标设置表 (单用户模式，移除user_id作为主键)
CREATE TABLE IF NOT EXISTS goals (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '目标ID',
  daily_target INT DEFAULT 5 COMMENT '每日目标数量',
  total_target INT DEFAULT 100 COMMENT '总目标数量',
  difficulty_ratio JSON DEFAULT (JSON_OBJECT('easy', 50, 'medium', 30, 'hard', 20)) COMMENT '难度比例',
  is_active BOOLEAN DEFAULT TRUE COMMENT '是否激活',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_is_active (is_active),
  INDEX idx_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='目标设置表';

-- 8. 题目类别表
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- 十六进制颜色代码
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 9. 题目类别关联表 (无外键约束)
CREATE TABLE IF NOT EXISTS problem_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    problem_id VARCHAR(20) NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_problem_id (problem_id),
    INDEX idx_category_id (category_id),
    UNIQUE KEY unique_problem_category (problem_id, category_id)
);

-- 数据库表结构创建完成

-- 数据库初始化完成
-- 单用户模式 LeetCode 刷题助手数据库已就绪
