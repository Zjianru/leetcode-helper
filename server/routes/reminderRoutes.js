import express from 'express';
import reminderService from '../services/reminderService.js';

const router = express.Router();

/**
 * 获取提醒服务状态
 * GET /api/v1/reminders/status
 */
router.get('/status', async (req, res) => {
  try {
    const status = reminderService.getStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('获取提醒服务状态失败:', error);
    res.status(500).json({ 
      success: false, 
      error: '获取提醒服务状态失败' 
    });
  }
});

/**
 * 启动提醒服务
 * POST /api/v1/reminders/start
 */
router.post('/start', async (req, res) => {
  try {
    reminderService.start();
    res.json({
      success: true,
      message: '提醒服务已启动'
    });
  } catch (error) {
    console.error('启动提醒服务失败:', error);
    res.status(500).json({ 
      success: false, 
      error: '启动提醒服务失败' 
    });
  }
});

/**
 * 停止提醒服务
 * POST /api/v1/reminders/stop
 */
router.post('/stop', async (req, res) => {
  try {
    reminderService.stop();
    res.json({
      success: true,
      message: '提醒服务已停止'
    });
  } catch (error) {
    console.error('停止提醒服务失败:', error);
    res.status(500).json({ 
      success: false, 
      error: '停止提醒服务失败' 
    });
  }
});

/**
 * 手动触发每日提醒（测试用）
 * POST /api/v1/reminders/trigger/daily
 */
router.post('/trigger/daily', async (req, res) => {
  try {
    await reminderService.triggerDailyReminder();
    res.json({
      success: true,
      message: '每日提醒已手动触发'
    });
  } catch (error) {
    console.error('触发每日提醒失败:', error);
    res.status(500).json({ 
      success: false, 
      error: '触发每日提醒失败' 
    });
  }
});

/**
 * 手动触发进度检查（测试用）
 * POST /api/v1/reminders/trigger/progress
 */
router.post('/trigger/progress', async (req, res) => {
  try {
    await reminderService.triggerProgressCheck();
    res.json({
      success: true,
      message: '进度检查已手动触发'
    });
  } catch (error) {
    console.error('触发进度检查失败:', error);
    res.status(500).json({ 
      success: false, 
      error: '触发进度检查失败' 
    });
  }
});

/**
 * 更新提醒时间
 * POST /api/v1/reminders/time
 */
router.post('/time', async (req, res) => {
  try {
    const { reminderTime } = req.body;
    
    // 验证时间格式 (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(reminderTime)) {
      return res.status(400).json({
        success: false,
        error: '无效的时间格式，请使用 HH:MM 格式'
      });
    }
    
    await reminderService.updateReminderTime(reminderTime);
    res.json({
      success: true,
      message: `提醒时间已更新为 ${reminderTime}`
    });
  } catch (error) {
    console.error('更新提醒时间失败:', error);
    res.status(500).json({ 
      success: false, 
      error: '更新提醒时间失败' 
    });
  }
});

/**
 * 重置今日进度记录
 * POST /api/v1/reminders/reset
 */
router.post('/reset', async (req, res) => {
  try {
    reminderService.resetDailyProgress();
    res.json({
      success: true,
      message: '今日进度记录已重置'
    });
  } catch (error) {
    console.error('重置进度记录失败:', error);
    res.status(500).json({ 
      success: false, 
      error: '重置进度记录失败' 
    });
  }
});

export default router;