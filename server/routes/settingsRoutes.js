import express from 'express';
import Setting from '../models/Setting.js';

const router = express.Router();

/**
 * 获取用户设置 - 单用户模式
 * GET /api/v1/settings
 */
router.get('/', async (req, res) => {
  try {
    // 获取最新的设置（单用户模式，取第一条记录）
    let setting = await Setting.findOne({
      order: [['updated_at', 'DESC']]
    });

    // 如果没有设置，返回默认值
    if (!setting) {
      const defaultSettings = {
        theme: 'light',
        language: 'zh-CN',
        notifications: {
          dailyReminder: true,
          achievementAlert: true,
          systemNotice: true
        },
        shortcuts: {
          addRecord: 'Ctrl+Shift+A',
          toggleTheme: 'Ctrl+Shift+T',
          openErrorBook: 'Ctrl+Shift+E'
        },
        display: {
          itemsPerPage: 20,
          showDifficulty: true,
          showTags: true,
          compactMode: false
        },
        privacy: {
          shareProgress: false,
          publicProfile: false
        }
      };
      
      return res.json(defaultSettings);
    }

    res.json({
      theme: setting.theme,
      language: setting.language,
      notifications: setting.notifications,
      shortcuts: setting.shortcuts,
      display: setting.display,
      privacy: setting.privacy
    });
  } catch (error) {
    console.error('获取用户设置错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 保存用户设置 - 单用户模式
 * POST /api/v1/settings
 */
router.post('/', async (req, res) => {
  try {
    const { theme, language, notifications, shortcuts, display, privacy } = req.body;

    // 验证主题设置
    if (theme && !['light', 'dark', 'auto'].includes(theme)) {
      return res.status(400).json({ error: '无效的主题设置' });
    }

    // 验证语言设置
    if (language && !['zh-CN', 'en-US'].includes(language)) {
      return res.status(400).json({ error: '无效的语言设置' });
    }

    // 获取现有设置或创建新设置
    let setting = await Setting.findOne({
      order: [['updated_at', 'DESC']]
    });

    const settingData = {
      theme: theme || 'light',
      language: language || 'zh-CN',
      notifications: notifications || {
        dailyReminder: true,
        achievementAlert: true,
        systemNotice: true
      },
      shortcuts: shortcuts || {
        addRecord: 'Ctrl+Shift+A',
        toggleTheme: 'Ctrl+Shift+T',
        openErrorBook: 'Ctrl+Shift+E'
      },
      display: display || {
        itemsPerPage: 20,
        showDifficulty: true,
        showTags: true,
        compactMode: false
      },
      privacy: privacy || {
        shareProgress: false,
        publicProfile: false
      }
    };

    if (!setting) {
      // 创建新设置
      setting = await Setting.create(settingData);
    } else {
      // 更新现有设置
      await setting.update(settingData);
    }

    res.json({
      success: true,
      message: '设置保存成功',
      settings: {
        theme: setting.theme,
        language: setting.language,
        notifications: setting.notifications,
        shortcuts: setting.shortcuts,
        display: setting.display,
        privacy: setting.privacy
      }
    });
  } catch (error) {
    console.error('保存用户设置错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 更新特定设置项
 * PATCH /api/v1/settings/:key
 */
router.patch('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const validKeys = ['theme', 'language', 'notifications', 'shortcuts', 'display', 'privacy'];
    if (!validKeys.includes(key)) {
      return res.status(400).json({ error: '无效的设置项' });
    }

    // 获取现有设置
    let setting = await Setting.findOne({
      order: [['updated_at', 'DESC']]
    });

    if (!setting) {
      // 如果没有设置，创建默认设置
      setting = await Setting.create({
        theme: 'light',
        language: 'zh-CN',
        notifications: { dailyReminder: true, achievementAlert: true, systemNotice: true },
        shortcuts: { addRecord: 'Ctrl+Shift+A', toggleTheme: 'Ctrl+Shift+T', openErrorBook: 'Ctrl+Shift+E' },
        display: { itemsPerPage: 20, showDifficulty: true, showTags: true, compactMode: false },
        privacy: { shareProgress: false, publicProfile: false }
      });
    }

    // 更新特定设置项
    const updateData = {};
    updateData[key] = value;
    await setting.update(updateData);

    res.json({
      success: true,
      message: `${key}设置更新成功`,
      [key]: setting[key]
    });
  } catch (error) {
    console.error('更新设置错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 重置设置为默认值
 * POST /api/v1/settings/reset
 */
router.post('/reset', async (req, res) => {
  try {
    const defaultSettings = {
      theme: 'light',
      language: 'zh-CN',
      notifications: {
        dailyReminder: true,
        achievementAlert: true,
        systemNotice: true
      },
      shortcuts: {
        addRecord: 'Ctrl+Shift+A',
        toggleTheme: 'Ctrl+Shift+T',
        openErrorBook: 'Ctrl+Shift+E'
      },
      display: {
        itemsPerPage: 20,
        showDifficulty: true,
        showTags: true,
        compactMode: false
      },
      privacy: {
        shareProgress: false,
        publicProfile: false
      }
    };

    // 获取现有设置或创建新设置
    let setting = await Setting.findOne({
      order: [['updated_at', 'DESC']]
    });

    if (!setting) {
      setting = await Setting.create(defaultSettings);
    } else {
      await setting.update(defaultSettings);
    }

    res.json({
      success: true,
      message: '设置已重置为默认值',
      settings: defaultSettings
    });
  } catch (error) {
    console.error('重置设置错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;

