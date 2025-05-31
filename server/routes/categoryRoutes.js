import express from 'express';
import Category from '../models/Category.js';
const router = express.Router();

// 获取所有类别
router.get('/', async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('获取类别列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取类别列表失败',
      error: error.message
    });
  }
});

// 获取类别统计信息
router.get('/stats', async (req, res) => {
  try {
    const stats = await Category.getCategoryStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('获取类别统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取类别统计失败',
      error: error.message
    });
  }
});

// 根据ID获取类别
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.getById(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: '类别不存在'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('获取类别详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取类别详情失败',
      error: error.message
    });
  }
});

// 创建新类别
router.post('/', async (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: '类别名称不能为空'
      });
    }
    
    const category = await Category.create({ name, description, color });
    res.status(201).json({
      success: true,
      data: category,
      message: '类别创建成功'
    });
  } catch (error) {
    console.error('创建类别失败:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({
        success: false,
        message: '类别名称已存在'
      });
    } else {
      res.status(500).json({
        success: false,
        message: '创建类别失败',
        error: error.message
      });
    }
  }
});

// 更新类别
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: '类别名称不能为空'
      });
    }
    
    const existingCategory = await Category.getById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: '类别不存在'
      });
    }
    
    const category = await Category.update(id, { name, description, color });
    res.json({
      success: true,
      data: category,
      message: '类别更新成功'
    });
  } catch (error) {
    console.error('更新类别失败:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({
        success: false,
        message: '类别名称已存在'
      });
    } else {
      res.status(500).json({
        success: false,
        message: '更新类别失败',
        error: error.message
      });
    }
  }
});

// 删除类别
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingCategory = await Category.getById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: '类别不存在'
      });
    }
    
    const deleted = await Category.delete(id);
    if (deleted) {
      res.json({
        success: true,
        message: '类别删除成功'
      });
    } else {
      res.status(500).json({
        success: false,
        message: '删除类别失败'
      });
    }
  } catch (error) {
    console.error('删除类别失败:', error);
    res.status(500).json({
      success: false,
      message: '删除类别失败',
      error: error.message
    });
  }
});

// 获取题目的类别
router.get('/problem/:problemId', async (req, res) => {
  try {
    const { problemId } = req.params;
    const categories = await Category.getProblemCategories(problemId);
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('获取题目类别失败:', error);
    res.status(500).json({
      success: false,
      message: '获取题目类别失败',
      error: error.message
    });
  }
});

// 为题目设置类别
router.post('/problem/:problemId', async (req, res) => {
  try {
    const { problemId } = req.params;
    const { categoryIds } = req.body;
    
    if (!Array.isArray(categoryIds)) {
      return res.status(400).json({
        success: false,
        message: '类别ID必须是数组格式'
      });
    }
    
    await Category.setProblemCategories(problemId, categoryIds);
    res.json({
      success: true,
      message: '题目类别设置成功'
    });
  } catch (error) {
    console.error('设置题目类别失败:', error);
    res.status(500).json({
      success: false,
      message: '设置题目类别失败',
      error: error.message
    });
  }
});

// 为题目添加单个类别
router.post('/problem/:problemId/category/:categoryId', async (req, res) => {
  try {
    const { problemId, categoryId } = req.params;
    const added = await Category.addProblemCategory(problemId, categoryId);
    
    if (added) {
      res.json({
        success: true,
        message: '类别添加成功'
      });
    } else {
      res.status(400).json({
        success: false,
        message: '该题目已包含此类别'
      });
    }
  } catch (error) {
    console.error('添加题目类别失败:', error);
    res.status(500).json({
      success: false,
      message: '添加题目类别失败',
      error: error.message
    });
  }
});

// 移除题目的单个类别
router.delete('/problem/:problemId/category/:categoryId', async (req, res) => {
  try {
    const { problemId, categoryId } = req.params;
    const removed = await Category.removeProblemCategory(problemId, categoryId);
    
    if (removed) {
      res.json({
        success: true,
        message: '类别移除成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '该题目不包含此类别'
      });
    }
  } catch (error) {
    console.error('移除题目类别失败:', error);
    res.status(500).json({
      success: false,
      message: '移除题目类别失败',
      error: error.message
    });
  }
});

export default router;