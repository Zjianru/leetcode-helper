import db from '../config/database.js';

class Category {
  // 获取所有类别
  static async getAll() {
    const [rows] = await db.execute(
      'SELECT * FROM categories ORDER BY name ASC'
    );
    return rows;
  }

  // 根据ID获取类别
  static async getById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // 创建新类别
  static async create(categoryData) {
    const { name, description, color } = categoryData;
    const [result] = await db.execute(
      'INSERT INTO categories (name, description, color) VALUES (?, ?, ?)',
      [name, description, color || '#3B82F6']
    );
    return { id: result.insertId, ...categoryData };
  }

  // 更新类别
  static async update(id, categoryData) {
    const { name, description, color } = categoryData;
    await db.execute(
      'UPDATE categories SET name = ?, description = ?, color = ? WHERE id = ?',
      [name, description, color, id]
    );
    return this.getById(id);
  }

  // 删除类别
  static async delete(id) {
    // 先删除关联关系
    await db.execute(
      'DELETE FROM problem_categories WHERE category_id = ?',
      [id]
    );
    // 再删除类别
    const [result] = await db.execute(
      'DELETE FROM categories WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  // 获取类别下的题目数量 - 修复时间戳字段缺失问题
  static async getCategoryStats() {
    const [rows] = await db.execute(`
      SELECT 
        c.id,
        c.name,
        c.description,
        c.color,
        c.created_at,
        c.updated_at,
        COUNT(pc.problem_id) as problem_count
      FROM categories c
      LEFT JOIN problem_categories pc ON c.id = pc.category_id
      GROUP BY c.id, c.name, c.description, c.color, c.created_at, c.updated_at
      ORDER BY c.name ASC
    `);
    return rows;
  }

  // 获取题目的类别
  static async getProblemCategories(problemId) {
    console.log(`获取题目类别: problemId=${problemId}`);
    const [rows] = await db.execute(`
      SELECT c.* 
      FROM categories c
      JOIN problem_categories pc ON c.id = pc.category_id
      WHERE pc.problem_id = ?
      ORDER BY c.name ASC
    `, [problemId]);
    console.log(`查询结果: problemId=${problemId}, 找到${rows.length}个类别`);
    return rows;
  }

  // 为题目添加类别
  static async addProblemCategory(problemId, categoryId) {
    try {
      await db.execute(
        'INSERT INTO problem_categories (problem_id, category_id) VALUES (?, ?)',
        [problemId, categoryId]
      );
      return true;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return false; // 已存在关联
      }
      throw error;
    }
  }

  // 移除题目类别
  static async removeProblemCategory(problemId, categoryId) {
    const [result] = await db.execute(
      'DELETE FROM problem_categories WHERE problem_id = ? AND category_id = ?',
      [problemId, categoryId]
    );
    return result.affectedRows > 0;
  }

  // 批量设置题目类别
  static async setProblemCategories(problemId, categoryIds) {
    console.log(`设置题目类别: problemId=${problemId}, categoryIds=${JSON.stringify(categoryIds)}`);
    
    // 获取数据库连接并开始事务
    const connection = await db.getConnection();
    
    try {
      // 开始事务
      await connection.beginTransaction();
      
      // 删除现有关联
      const [deleteResult] = await connection.execute(
        'DELETE FROM problem_categories WHERE problem_id = ?',
        [problemId]
      );
      console.log(`删除现有关联: 影响行数=${deleteResult.affectedRows}`);
      
      // 添加新关联 - 使用循环插入避免动态SQL问题
      if (categoryIds && categoryIds.length > 0) {
        for (const categoryId of categoryIds) {
          const [insertResult] = await connection.execute(
            'INSERT INTO problem_categories (problem_id, category_id) VALUES (?, ?)',
            [problemId, categoryId]
          );
          console.log(`插入关联: problemId=${problemId}, categoryId=${categoryId}, insertId=${insertResult.insertId}`);
        }
      }
      
      // 提交事务
      await connection.commit();
      console.log(`题目类别设置成功: problemId=${problemId}`);
      return true;
    } catch (error) {
      // 回滚事务
      await connection.rollback();
      console.error(`设置题目类别失败: problemId=${problemId}, error=${error.message}`);
      throw error;
    } finally {
      // 释放连接
      connection.release();
    }
  }
}

export default Category;