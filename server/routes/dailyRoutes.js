import express from 'express';
import Record from '../models/Record.js';
import Problem from '../models/Problem.js';
import { DATE_FORMATS, ERROR_MESSAGES } from '../config/constants.js';

const router = express.Router();

/**
 * 获取指定日期的刷题记录
 * GET /api/v1/daily/:date
 */
router.get('/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    // 验证日期格式 (YYYY-MM-DD)
    if (!DATE_FORMATS.ISO_DATE.test(date)) {
      return res.status(400).json({
        success: false,
        error: ERROR_MESSAGES.INVALID_DATE_FORMAT,
        message: '日期格式应为 YYYY-MM-DD'
      });
    }

    // 查询指定日期的刷题记录，关联题目信息
    const records = await Record.findAll({
      where: {
        date: date
      },
      include: [{
        model: Problem,
        as: 'Problem',
        attributes: ['id', 'title', 'difficulty', 'description', 'tags']
      }],
      order: [['created_at', 'DESC']]
    });

    // 格式化返回数据
    const formattedRecords = records.map(record => ({
      id: record.id,
      problem_id: record.problemId,
      title: record.Problem?.title || '未知题目',
      difficulty: record.Problem?.difficulty || 'unknown',
      status: record.status,
      date: record.date,
      createdAt: record.createdAt,
      tags: record.Problem?.tags || []
    }));

    res.json({
      success: true,
      data: formattedRecords,
      message: `获取 ${date} 的刷题记录成功`,
      total: formattedRecords.length
    });

  } catch (error) {
    console.error('获取每日刷题记录失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器错误',
      message: '获取每日刷题记录失败'
    });
  }
});

export default router;