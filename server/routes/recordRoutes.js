import express from 'express';
import Record from '../models/Record.js';
import Problem from '../models/Problem.js';
import { Op } from 'sequelize';

const router = express.Router();

/**
 * 记录刷题 - 单用户模式
 * POST /api/v1/records
 */
router.post('/', async (req, res) => {
  // 统一使用数据库字段命名：problem_id
  const { problem_id, status, title, difficulty } = req.body;
  
  try {

  // 参数验证
  if (!problem_id || !status) {
    return res.status(400).json({
      success: false,
      error: '参数错误',
      message: '题目ID和状态不能为空'
    });
  }
    
    // 验证状态值
    if (!['completed', 'attempted'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        error: '参数错误',
        message: '状态值无效，只能是 completed 或 attempted' 
      });
    }
    
    // 检查题目是否存在，如果不存在则自动创建
    let problem = await Problem.findByPk(problem_id);
    if (!problem) {
      // 自动创建题目记录
      problem = await Problem.create({
        id: problem_id,
        title: title || `题目 ${problem_id}`, // 如果没有提供标题，使用默认标题
        difficulty: difficulty || 'medium', // 如果没有提供难度，默认为中等
        tags: [],
        url: null,
        description: null
      });
      console.log(`自动创建题目记录: ID=${problem_id}, Title=${problem.title}`);
    }
    
    // 检查今天是否已经记录过这道题
    const today = new Date().toISOString().split('T')[0];
    const existingRecord = await Record.findOne({
      where: {
        problemId: problem_id,
        date: today
      }
    });
    
    if (existingRecord) {
      // 更新现有记录
      existingRecord.status = status;
      await existingRecord.save();
      console.log(`更新刷题记录: ID=${problem_id}, Status=${status}`);
    } else {
      // 创建新记录
      await Record.create({
        problemId: problem_id,
        status,
        date: today
      });
      console.log(`创建新刷题记录: ID=${problem_id}, Status=${status}`);
    }
    
    res.json({ 
      success: true, 
      message: '记录成功',
      data: { problem_id: problem_id, status, date: today }
    });
  } catch (error) {
    console.error('记录刷题错误:', error);
    
    // 检查是否是外键约束错误
    if (error.name === 'SequelizeForeignKeyConstraintError' || 
        error.original?.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ 
        success: false,
        error: '题目不存在',
        message: `题目ID ${req.body.problem_id || 'unknown'} 不存在，请检查题目ID是否正确` 
      });
    }
    
    // 检查是否是重复键错误
    if (error.name === 'SequelizeUniqueConstraintError' || 
        error.original?.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false,
        error: '记录已存在',
        message: '今天已经记录过这道题目了' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: '服务器错误',
      message: error.message 
    });
  }
});

/**
 * 获取刷题记录列表
 * GET /api/v1/records
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, date } = req.query;
    
    // 构建查询条件
    const where = {};
    if (status) where.status = status;
    if (date) where.date = date;
    
    // 分页查询
    const offset = (page - 1) * limit;
    const records = await Record.findAndCountAll({
      where,
      include: [{
        model: Problem,
        as: 'Problem',
        attributes: ['title', 'difficulty', 'tags']
      }],
      order: [['date', 'DESC'], ['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      records: records.rows,
      total: records.count,
      page: parseInt(page),
      totalPages: Math.ceil(records.count / limit)
    });
  } catch (error) {
    console.error('获取记录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 删除刷题记录
 * DELETE /api/v1/records/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const record = await Record.findByPk(id);
    if (!record) {
      return res.status(404).json({ error: '记录不存在' });
    }
    
    await record.destroy();
    // 删除指定记录
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除记录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
