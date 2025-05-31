import express from 'express';
import Goal from '../models/Goal.js';
import { Op } from 'sequelize';
import Record from '../models/Record.js';
import { GOAL_CONFIG } from '../config/constants.js';

const router = express.Router();

/**
 * 获取目标进度 - 单用户模式
 * GET /api/v1/goals/progress
 */
router.get('/progress', async (req, res) => {
  try {
    // 获取用户设置的目标（单用户模式，取第一条记录）
    let goal = await Goal.findOne({
      order: [['created_at', 'DESC']]
    });

    // 如果没有设置目标，使用默认值
    if (!goal) {
      goal = {
        dailyTarget: GOAL_CONFIG.DEFAULT_TOTAL_TARGET,
        totalTarget: 1000,
        difficultyRatio: { 
          easy: GOAL_CONFIG.DEFAULT_EASY_TARGET, 
          medium: GOAL_CONFIG.DEFAULT_MEDIUM_TARGET, 
          hard: GOAL_CONFIG.DEFAULT_HARD_TARGET 
        }
      };
    }

    // 获取当前完成题数
    const current = await Record.count({
      where: { status: 'completed' }
    });

    // 获取今日完成题数
    const today = new Date().toISOString().split('T')[0];
    const dailyCompleted = await Record.count({
      where: {
        status: 'completed',
        date: today
      }
    });

    // 计算进度百分比
    const progress = Math.min((current / goal.totalTarget) * 100, 100);
    const dailyProgress = Math.min((dailyCompleted / goal.dailyTarget) * 100, 100);

    res.json({
      success: true,
      data: {
        current,
        target: goal.totalTarget,
        dailyTarget: goal.dailyTarget,
        dailyCompleted,
        progress: Math.round(progress * 100) / 100,
        dailyProgress: Math.round(dailyProgress * 100) / 100,
        difficultyRatio: goal.difficultyRatio
      }
    });
  } catch (error) {
    console.error('获取目标进度错误:', error);
    res.status(500).json({ 
      success: false,
      message: '获取目标进度失败' 
    });
  }
});

/**
 * 获取目标设置
 * GET /api/v1/goals
 */
router.get('/', async (req, res) => {
  try {
    const goal = await Goal.findOne({
      order: [['created_at', 'DESC']]
    });

    if (!goal) {
      // 返回默认设置
      return res.json({
        success: true,
        data: {
          dailyTarget: 5,
          totalTarget: 1000,
          difficultyRatio: { easy: 30, medium: 50, hard: 20 }
        }
      });
    }

    res.json({
      success: true,
      data: {
        dailyTarget: goal.dailyTarget,
        totalTarget: goal.totalTarget,
        difficultyRatio: goal.difficultyRatio
      }
    });
  } catch (error) {
    console.error('获取目标设置错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 获取目标设置（兼容性路由）
 * GET /api/v1/goals/settings
 */
router.get('/settings', async (req, res) => {
  try {
    const goal = await Goal.findOne({
      order: [['created_at', 'DESC']]
    });

    if (!goal) {
      // 返回默认设置
      return res.json({
        success: true,
        data: {
          dailyTarget: 5,
          totalTarget: 1000,
          difficultyRatio: { easy: 30, medium: 50, hard: 20 }
        }
      });
    }

    res.json({
      success: true,
      data: {
        dailyTarget: goal.dailyTarget,
        totalTarget: goal.totalTarget,
        difficultyRatio: goal.difficultyRatio
      }
    });
  } catch (error) {
    console.error('获取目标设置错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 保存目标设置 - 单用户模式
 * POST /api/v1/goals
 */
router.post('/', async (req, res) => {
  try {
    const { dailyTarget, totalTarget, difficultyRatio } = req.body;

    // 验证输入
    if (!dailyTarget || dailyTarget < 1 || dailyTarget > 50) {
      return res.status(400).json({ error: '每日目标必须在1-50之间' });
    }

    if (!totalTarget || totalTarget < 100 || totalTarget > 10000) {
      return res.status(400).json({ error: '总目标必须在100-10000之间' });
    }

    // 验证难度比例
    if (difficultyRatio) {
      const { easy = 0, medium = 0, hard = 0 } = difficultyRatio;
      if (easy + medium + hard !== 100) {
        return res.status(400).json({ error: '难度比例总和必须为100%' });
      }
    }

    // 创建新的目标设置
    const goal = await Goal.create({
      dailyTarget,
      totalTarget,
      difficultyRatio: difficultyRatio || { easy: 30, medium: 50, hard: 20 }
    });

    res.json({
      success: true,
      message: '目标设置保存成功',
      goal: {
        dailyTarget: goal.dailyTarget,
        totalTarget: goal.totalTarget,
        difficultyRatio: goal.difficultyRatio
      }
    });
  } catch (error) {
    console.error('保存目标设置错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 更新目标设置
 * PUT /api/v1/goals/settings
 */
router.put('/settings', async (req, res) => {
  try {
    const { dailyTarget, totalTarget, difficultyRatio } = req.body;

    // 获取最新的目标设置
    let goal = await Goal.findOne({
      order: [['created_at', 'DESC']]
    });

    if (!goal) {
      // 如果没有设置，创建新的
      goal = await Goal.create({
        dailyTarget: dailyTarget || 5,
        totalTarget: totalTarget || 1000,
        difficultyRatio: difficultyRatio || { easy: 30, medium: 50, hard: 20 }
      });
    } else {
      // 更新现有设置
      const updateData = {};
      if (dailyTarget !== undefined) updateData.dailyTarget = dailyTarget;
      if (totalTarget !== undefined) updateData.totalTarget = totalTarget;
      if (difficultyRatio !== undefined) updateData.difficultyRatio = difficultyRatio;

      await goal.update(updateData);
    }

    res.json({
      success: true,
      message: '目标设置更新成功',
      goal: {
        dailyTarget: goal.dailyTarget,
        totalTarget: goal.totalTarget,
        difficultyRatio: goal.difficultyRatio
      }
    });
  } catch (error) {
    console.error('更新目标设置错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;

