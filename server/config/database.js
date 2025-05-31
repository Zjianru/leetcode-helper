import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { DATABASE_CONFIG } from './constants.js';

dotenv.config();

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'leetcode_helper',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: DATABASE_CONFIG.MAX_CONNECTIONS,
  queueLimit: 0
});

// 导出连接池，提供 execute 方法
export default pool;

// 同时导出 Sequelize 实例用于其他需要的地方
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'leetcode_helper',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4'
    },
    logging: false,
    pool: {
      max: DATABASE_CONFIG.MAX_CONNECTIONS,
      min: DATABASE_CONFIG.MIN_CONNECTIONS,
      acquire: DATABASE_CONFIG.ACQUIRE_TIMEOUT,
      idle: DATABASE_CONFIG.IDLE_TIMEOUT
    }
  }
);
