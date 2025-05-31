import express from 'express';
import ErrorProblem from '../models/ErrorProblem.js';
import Problem from '../models/Problem.js';
import { Op } from 'sequelize';

const router = express.Router();

/**
 * 获取错题列表 - 单用户模式
 * GET /api/v1/error-book
 * Query params: page, limit, reviewed, starred
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, reviewed, starred } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // 构建查询条件
    const whereClause = {};
    if (reviewed !== undefined) {
      whereClause.reviewed = reviewed === 'true';
    }
    if (starred !== undefined) {
      whereClause.starred = starred === 'true';
    }

    // 获取错题列表，关联题目信息
    const { count, rows: errorProblems } = await ErrorProblem.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']],
      include: [{
        model: Problem,
        as: 'Problem',
        attributes: ['id', 'title', 'difficulty', 'tags', 'url']
      }]
    });

    // 格式化返回数据
    const formattedProblems = errorProblems.map(errorProblem => ({
      id: errorProblem.id,
      problemId: errorProblem.problemId,
      title: errorProblem.Problem.title,
      difficulty: errorProblem.Problem.difficulty,
      tags: errorProblem.Problem.tags,
      url: errorProblem.Problem.url,
      errorReason: errorProblem.errorReason,
      notes: errorProblem.notes,
      starred: errorProblem.starred,
      reviewed: errorProblem.reviewed,
      lastReview: errorProblem.lastReview,
      createdAt: errorProblem.created_at
    }));

    res.json({
      problems: formattedProblems,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit))
    });
  } catch (error) {
    console.error('获取错题列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 添加错题
 * POST /api/v1/error-book
 */
router.post('/', async (req, res) => {
  try {
    // 统一使用数据库字段命名：problem_id
    const { problem_id, errorReason, notes } = req.body;

    // 参数验证
    if (!problem_id) {
      return res.status(400).json({
        success: false,
        error: '参数错误',
        message: '题目ID不能为空'
      });
    }

    // 检查题目是否存在
    const problem = await Problem.findByPk(problem_id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: '题目不存在',
        message: `题目ID ${problem_id} 不存在`
      });
    }

    // 检查是否已经在错题本中
    const existingError = await ErrorProblem.findOne({
      where: { problemId: problem_id }
    });

    if (existingError) {
      return res.status(400).json({ error: '该题目已在错题本中' });
    }

    // 创建错题记录
    const errorProblem = await ErrorProblem.create({
      problemId: problem_id,
      errorReason: errorReason || '',
      notes: notes || '',
      starred: false,
      reviewed: false
    });

    res.status(201).json({
      success: true,
      message: '错题添加成功',
      data: {
        id: errorProblem.id,
        problem_id: problem_id,
        title: problem.title,
        difficulty: problem.difficulty,
        errorReason: errorProblem.errorReason,
        notes: errorProblem.notes,
        starred: errorProblem.starred,
        reviewed: errorProblem.reviewed,
        createdAt: errorProblem.createdAt
      }
    });
  } catch (error) {
    console.error('添加错题失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器错误',
      message: '添加错题失败'
    });
  }
});

/**
 * 标记错题为已复习
 * PATCH /api/v1/error-book/:id/reviewed
 */
router.patch('/:id/reviewed', async (req, res) => {
  try {
    const { id } = req.params;
    
    const errorProblem = await ErrorProblem.findByPk(id);
    if (!errorProblem) {
      return res.status(404).json({ error: '错题记录不存在' });
    }

    await errorProblem.update({
      reviewed: true,
      lastReview: new Date()
    });

    res.json({ 
      success: true,
      message: '已标记为复习完成'
    });
  } catch (error) {
    console.error('更新复习状态错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 切换错题收藏状态
 * PATCH /api/v1/error-book/:id/star
 */
router.patch('/:id/star', async (req, res) => {
  try {
    const { id } = req.params;
    
    const errorProblem = await ErrorProblem.findByPk(id);
    if (!errorProblem) {
      return res.status(404).json({ error: '错题记录不存在' });
    }

    await errorProblem.update({
      starred: !errorProblem.starred
    });

    res.json({ 
      success: true,
      starred: errorProblem.starred,
      message: errorProblem.starred ? '已收藏' : '已取消收藏'
    });
  } catch (error) {
    console.error('更新收藏状态错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 更新错题笔记
 * PATCH /api/v1/error-book/:id/notes
 */
router.patch('/:id/notes', async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, errorReason } = req.body;
    
    const errorProblem = await ErrorProblem.findByPk(id);
    if (!errorProblem) {
      return res.status(404).json({ error: '错题记录不存在' });
    }

    const updateData = {};
    if (notes !== undefined) updateData.notes = notes;
    if (errorReason !== undefined) updateData.errorReason = errorReason;

    await errorProblem.update(updateData);

    res.json({ 
      success: true,
      message: '笔记更新成功'
    });
  } catch (error) {
    console.error('更新笔记错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 删除错题
 * DELETE /api/v1/error-book/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const errorProblem = await ErrorProblem.findByPk(id);
    if (!errorProblem) {
      return res.status(404).json({ error: '错题记录不存在' });
    }

    await errorProblem.destroy();

    res.json({ 
      success: true,
      message: '错题删除成功'
    });
  } catch (error) {
    console.error('删除错题错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;

