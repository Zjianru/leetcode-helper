import express from 'express';
import Notification from '../models/Notification.js';
import Record from '../models/Record.js';
import Goal from '../models/Goal.js';
import { Op } from 'sequelize';

const router = express.Router();

/**
 * 获取通知列表 - 单用户模式
 * GET /api/v1/notifications
 * Query params: page, limit, read
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, read } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // 构建查询条件
    const whereClause = {};
    if (read !== undefined) {
      whereClause.read = read === 'true';
    }

    // 获取通知列表
    const { count, rows: notifications } = await Notification.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    // 格式化返回数据
    const formattedNotifications = notifications.map(notification => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      content: notification.content,
      read: notification.read,
      createdAt: notification.created_at,
      timestamp: formatTimestamp(notification.created_at)
    }));

    res.json({
      notifications: formattedNotifications,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit))
    });
  } catch (error) {
    console.error('获取通知列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 创建通知
 * POST /api/v1/notifications
 */
router.post('/', async (req, res) => {
  try {
    const { type, title, content } = req.body;

    if (!type || !title || !content) {
      return res.status(400).json({ error: '通知类型、标题和内容不能为空' });
    }

    const notification = await Notification.create({
      type,
      title,
      content,
      read: false
    });

    res.status(201).json({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      content: notification.content,
      read: notification.read,
      createdAt: notification.created_at
    });
  } catch (error) {
    console.error('创建通知错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 标记通知为已读
 * PATCH /api/v1/notifications/:id/read
 */
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ error: '通知不存在' });
    }

    await notification.update({ read: true });

    res.json({ 
      success: true,
      message: '通知已标记为已读'
    });
  } catch (error) {
    console.error('标记通知为已读错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 标记所有通知为已读
 * PATCH /api/v1/notifications/read-all
 */
router.patch('/read-all', async (req, res) => {
  try {
    await Notification.update(
      { read: true },
      { where: { read: false } }
    );

    res.json({ 
      success: true,
      message: '所有通知已标记为已读'
    });
  } catch (error) {
    console.error('标记所有通知为已读错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 删除通知
 * DELETE /api/v1/notifications/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ error: '通知不存在' });
    }

    await notification.destroy();

    res.json({ 
      success: true,
      message: '通知删除成功'
    });
  } catch (error) {
    console.error('删除通知错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 生成每日提醒通知
 * POST /api/v1/notifications/daily-reminder
 */
router.post('/daily-reminder', async (req, res) => {
  try {
    // 获取今日完成情况
    const today = new Date().toISOString().split('T')[0];
    const dailyCompleted = await Record.count({
      where: {
        status: 'completed',
        date: today
      }
    });

    // 获取目标设置
    const goal = await Goal.findOne({
      order: [['created_at', 'DESC']]
    });
    const dailyTarget = goal ? goal.dailyTarget : 5;

    // 计算剩余题目数
    const remaining = Math.max(0, dailyTarget - dailyCompleted);

    let title, content;
    if (remaining === 0) {
      title = '今日目标已完成！';
      content = `恭喜你完成了今日的刷题目标（${dailyTarget}题），继续保持！`;
    } else {
      title = '每日目标提醒';
      content = `今日还有${remaining}道题目未完成，继续加油！目标：${dailyTarget}题`;
    }

    const notification = await Notification.create({
      type: 'reminder',
      title,
      content,
      read: false
    });

    res.status(201).json({
      success: true,
      notification: {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        content: notification.content,
        read: notification.read,
        createdAt: notification.created_at
      }
    });
  } catch (error) {
    console.error('生成每日提醒通知错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 辅助函数：格式化时间戳
function formatTimestamp(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days === 1) return '昨天';
  if (days < 7) return `${days}天前`;
  
  return new Date(date).toLocaleDateString('zh-CN');
}

export default router;

