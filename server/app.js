import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';

import problemRoutes from './routes/problemRoutes.js';
import recordRoutes from './routes/recordRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import errorBookRoutes from './routes/errorBookRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import dailyRoutes from './routes/dailyRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ charset: 'utf8' }));
app.use(bodyParser.urlencoded({ extended: true, charset: 'utf8' }));

// 设置响应头确保UTF-8编码
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// 添加请求日志中间件
app.use((req, res, next) => {
  // 请求日志记录（已移除调试输出）
  next();
});

// Test database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/v1/problems', problemRoutes);
app.use('/api/v1/records', recordRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/goals', goalRoutes);
app.use('/api/v1/error-book', errorBookRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/daily', dailyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
