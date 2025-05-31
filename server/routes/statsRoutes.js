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
  try {
    // 获取总刷题数
    const total = await Record.count({
      where: { status: 'completed' }
    });

    // 获取上周刷题数
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const lastWeekTotal = await Record.count({
      where: { 
        status: 'completed',
        date: { [Op.gte]: oneWeekAgo }
      }
    });

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

    res.json({
      success: true,
      data: {
        total,
        lastWeekTotal,
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

