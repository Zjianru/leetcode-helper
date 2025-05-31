import express from 'express';
import Problem from '../models/Problem.js';
import Record from '../models/Record.js';
import { Op } from 'sequelize';

const router = express.Router();

/**
 * 获取题目列表 - 单用户模式
 * GET /api/v1/problems
 * Query params: difficulty, page, limit, search
 */
router.get('/', async (req, res) => {
  try {
    const { difficulty, page = 1, limit = 20, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // 构建查询条件
    const whereClause = {};
    if (difficulty) {
      whereClause.difficulty = difficulty;
    }
    if (search) {
      whereClause.title = {
        [Op.like]: `%${search}%`
      };
    }
    
    // 获取题目列表，包含完成状态
    const { count, rows: problems } = await Problem.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset,
      order: [['id', 'ASC']],
      include: [{
        model: Record,
        as: 'Records',
        required: false,
        where: { status: 'completed' },
        attributes: ['status', 'date']
      }]
    });

    // 格式化返回数据
    const formattedProblems = problems.map(problem => ({
      id: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      tags: problem.tags,
      url: problem.url,
      completed: problem.Records && problem.Records.length > 0,
      completedDate: problem.Records && problem.Records.length > 0 
        ? problem.Records[0].date 
        : null
    }));
    
    res.json({
      problems: formattedProblems,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / parseInt(limit))
    });
  } catch (error) {
    console.error('获取题目列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 获取单个题目详情
 * GET /api/v1/problems/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const problem = await Problem.findByPk(id, {
      include: [{
        model: Record,
        as: 'Records',
        required: false,
        attributes: ['status', 'date']
      }]
    });

    if (!problem) {
      return res.status(404).json({ error: '题目不存在' });
    }

    const formattedProblem = {
      id: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      tags: problem.tags,
      url: problem.url,
      records: problem.Records || []
    };

    res.json(formattedProblem);
  } catch (error) {
    console.error('获取题目详情错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 创建题目
 * POST /api/v1/problems
 */
router.post('/', async (req, res) => {
  try {
    const { id, title, difficulty = 'medium', tags = [], url, description } = req.body;
    
    // 检查题目是否已存在
    const existingProblem = await Problem.findByPk(id);
    if (existingProblem) {
      return res.status(409).json({ error: '题目已存在' });
    }
    
    // 创建新题目
    const problem = await Problem.create({
      id,
      title,
      difficulty,
      tags,
      url,
      description
    });
    
    res.status(201).json({
      success: true,
      data: problem,
      message: '题目创建成功'
    });
  } catch (error) {
    console.error('创建题目错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 搜索题目
 * GET /api/v1/problems/search
 */
router.get('/search/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    const { limit = 10 } = req.query;
    
    const problems = await Problem.findAll({
      where: {
        title: {
          [Op.like]: `%${keyword}%`
        }
      },
      limit: parseInt(limit),
      order: [['id', 'ASC']]
    });

    res.json({
      problems,
      total: problems.length
    });
  } catch (error) {
    console.error('搜索题目错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;