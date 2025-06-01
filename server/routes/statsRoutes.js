import express from 'express';
import Record from '../models/Record.js';
import Problem from '../models/Problem.js';
import { Op, fn, col, literal } from 'sequelize';
import { sequelize } from '../config/database.js';

const router = express.Router();

/**
 * 获取刷题统计 - 单用户模式
 * GET /api/v1/stats
 */
router.get('/', async (req, res) => {
  console.log('=== Stats API called ===');
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  try {
    // 获取总刷题数
    const total = await Record.count({
      where: { status: 'completed' }
    });
    
    // 声明变量
    let lastWeekTotal = 0;
    let thisWeekTotal = 0;

    // 获取上周刷题数（上周一到上周日）
    const now = new Date();
    const currentDay = now.getDay(); // 0=周日, 1=周一, ..., 6=周六
    const daysToLastMonday = currentDay === 0 ? 6 : currentDay - 1; // 距离本周一的天数
    
    // 计算上周一的日期
    const lastMonday = new Date(now);
    lastMonday.setDate(now.getDate() - daysToLastMonday - 7);
    lastMonday.setHours(0, 0, 0, 0);
    
    // 计算上周日的日期
    const lastSunday = new Date(lastMonday);
    lastSunday.setDate(lastMonday.getDate() + 6);
    lastSunday.setHours(23, 59, 59, 999);
    
    console.log('Debug - lastMonday:', lastMonday.toISOString().split('T')[0]);
    console.log('Debug - lastSunday:', lastSunday.toISOString().split('T')[0]);
    
    lastWeekTotal = await Record.count({
      where: { 
        status: 'completed',
        date: { 
          [Op.gte]: lastMonday.toISOString().split('T')[0],
          [Op.lte]: lastSunday.toISOString().split('T')[0]
        }
      }
    });
    
    console.log('Debug - lastWeekTotal:', lastWeekTotal);
    
    // 获取本周刷题数（本周一到今天）
    const thisMonday = new Date(now);
    thisMonday.setDate(now.getDate() - daysToLastMonday);
    thisMonday.setHours(0, 0, 0, 0);
    
    thisWeekTotal = await Record.count({
      where: { 
        status: 'completed',
        date: { [Op.gte]: thisMonday.toISOString().split('T')[0] }
      }
    });
    
    console.log('Debug - thisMonday:', thisMonday.toISOString().split('T')[0]);
    console.log('Debug - thisWeekTotal:', thisWeekTotal);

    // 获取7日趋势数据
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    const weeklyTrend = await Promise.all(dates.map(async date => {
      const count = await Record.count({
        where: {
          status: 'completed',
          date
        }
      });
      return { 
        date: date, // 保持完整的YYYY-MM-DD格式
        count 
      };
    }));

    // 获取难度分布统计
    const difficultyStats = await Record.findAll({
      attributes: [
        [fn('COUNT', col('Record.id')), 'count']
      ],
      include: [{
        model: Problem,
        as: 'Problem',
        attributes: ['difficulty'],
        required: true
      }],
      where: { status: 'completed' },
      group: ['Problem.difficulty'],
      raw: true
    });

    // 格式化难度统计数据
    const difficultyDistribution = {
      easy: 0,
      medium: 0,
      hard: 0
    };
    
    difficultyStats.forEach(stat => {
      const difficulty = stat['Problem.difficulty'];
      if (difficulty && difficultyDistribution.hasOwnProperty(difficulty)) {
        difficultyDistribution[difficulty] = parseInt(stat.count);
      }
    });

    // 获取今日完成数
    const today = new Date().toISOString().split('T')[0];
    const todayCompleted = await Record.count({
      where: {
        status: 'completed',
        date: today
      }
    });

    console.log('Before response - lastWeekTotal:', lastWeekTotal);
    console.log('Before response - thisWeekTotal:', thisWeekTotal);
    
    res.json({
      success: true,
      data: {
        total,
        lastWeekTotal,
        thisWeekTotal,
        todayCompleted,
        weeklyTrend,
        difficultyDistribution
      }
    });
  } catch (error) {
    console.error('获取统计数据错误:', error);
    res.status(500).json({ 
      success: false, 
      error: '服务器错误',
      message: error.message 
    });
  }
});

/**
 * 获取目标进度统计
 * GET /api/v1/stats/progress
 */
router.get('/progress', async (req, res) => {
  try {
    // 这里可以从goals表获取用户设置的目标
    // 暂时使用默认值
    const dailyTarget = 5;
    
    const today = new Date().toISOString().split('T')[0];
    const dailyCompleted = await Record.count({
      where: {
        status: 'completed',
        date: today
      }
    });

    const total = await Record.count({
      where: { status: 'completed' }
    });

    res.json({
      success: true,
      data: {
        current: total,
        target: 1000, // 可以从设置中获取
        dailyTarget,
        dailyCompleted,
        progress: Math.min((total / 1000) * 100, 100)
      }
    });
  } catch (error) {
    console.error('获取进度统计错误:', error);
    res.status(500).json({ 
      success: false, 
      error: '服务器错误',
      message: error.message 
    });
  }
});

export default router;

