import cron from 'node-cron';
import Setting from '../models/Setting.js';
import Goal from '../models/Goal.js';
import Record from '../models/Record.js';
import Notification from '../models/Notification.js';
import { Op } from 'sequelize';

/**
 * 极简提醒服务
 * 实现四种提醒场景：
 * 1. 每日定时提醒（默认每天9:00）
 * 2. 50%完成提醒
 * 3. 75%完成提醒
 * 4. 100%完成提醒
 */
class MinimalReminderService {
  constructor() {
    this.isRunning = false;
    this.dailyTask = null;
    this.progressCheckTask = null;
    this.lastProgressCheck = new Map(); // 记录今日已发送的进度提醒
  }

  /**
   * 启动提醒服务
   */
  async start() {
    if (this.isRunning) {
      console.log('提醒服务已在运行中');
      return;
    }

    try {
      // 获取用户设置的提醒时间
      const reminderTime = await this.getReminderTime();
      const [hour, minute] = reminderTime.split(':').map(Number);
      
      // 每日定时提醒任务 - 根据用户设置的时间执行
      this.dailyTask = cron.schedule(`${minute} ${hour} * * *`, async () => {
        await this.sendDailyReminder();
      }, {
        scheduled: false,
        timezone: 'Asia/Shanghai'
      });

      // 进度检查任务 - 每小时检查一次进度
      this.progressCheckTask = cron.schedule('0 * * * *', async () => {
        await this.checkProgressAndRemind();
      }, {
        scheduled: false,
        timezone: 'Asia/Shanghai'
      });

      // 启动定时任务
      this.dailyTask.start();
      this.progressCheckTask.start();
      
      this.isRunning = true;
      console.log(`提醒服务已启动 - 每日${reminderTime}提醒，每小时检查进度`);
    } catch (error) {
      console.error('启动提醒服务失败:', error);
    }
  }

  /**
   * 停止提醒服务
   */
  stop() {
    if (!this.isRunning) {
      console.log('提醒服务未运行');
      return;
    }

    try {
      if (this.dailyTask) {
        this.dailyTask.stop();
        this.dailyTask = null;
      }
      
      if (this.progressCheckTask) {
        this.progressCheckTask.stop();
        this.progressCheckTask = null;
      }
      
      this.isRunning = false;
      this.lastProgressCheck.clear();
      console.log('提醒服务已停止');
    } catch (error) {
      console.error('停止提醒服务失败:', error);
    }
  }

  /**
   * 发送每日提醒
   */
  async sendDailyReminder() {
    try {
      // 检查是否启用每日提醒
      const setting = await Setting.findOne({
        order: [['updated_at', 'DESC']]
      });
      
      if (!setting || !setting.notifications?.dailyReminder) {
        console.log('每日提醒已关闭，跳过发送');
        return;
      }

      // 获取当前目标
      const goal = await Goal.findOne({
        where: { isActive: true },
        order: [['updated_at', 'DESC']]
      });

      if (!goal) {
        console.log('未找到活跃目标，跳过每日提醒');
        return;
      }

      // 检查今天是否已经发送过每日提醒
      const today = new Date().toISOString().split('T')[0];
      const existingReminder = await Notification.findOne({
        where: {
          type: 'reminder',
          metadata: {
            reminderType: 'daily',
            date: today
          }
        }
      });

      if (existingReminder) {
        console.log('今日每日提醒已发送，跳过');
        return;
      }

      // 创建每日提醒通知
      await Notification.create({
        type: 'reminder',
        title: '每日刷题提醒',
        content: `今天的目标是完成 ${goal.dailyTarget} 道题目，开始你的刷题之旅吧！💪`,
        read: false,
        priority: 'medium',
        metadata: {
          reminderType: 'daily',
          date: today,
          targetCount: goal.dailyTarget
        }
      });

      console.log(`每日提醒已发送 - 目标: ${goal.dailyTarget} 道题`);
    } catch (error) {
      console.error('发送每日提醒失败:', error);
    }
  }

  /**
   * 检查进度并发送相应提醒
   */
  async checkProgressAndRemind() {
    try {
      // 检查是否启用成就提醒
      const setting = await Setting.findOne({
        order: [['updated_at', 'DESC']]
      });
      
      if (!setting || !setting.notifications?.achievementAlert) {
        return;
      }

      // 获取当前目标
      const goal = await Goal.findOne({
        where: { isActive: true },
        order: [['updated_at', 'DESC']]
      });

      if (!goal) {
        return;
      }

      // 获取今日完成的题目数量
      const today = new Date().toISOString().split('T')[0];
      const todayCount = await Record.count({
        where: {
          status: 'completed',
          date: today
        }
      });

      // 计算完成百分比
      const progressPercent = Math.floor((todayCount / goal.dailyTarget) * 100);
      
      // 生成今日进度检查的唯一键
      const progressKey = `${today}-${progressPercent >= 100 ? 100 : progressPercent >= 75 ? 75 : progressPercent >= 50 ? 50 : 0}`;
      
      // 检查是否已经发送过此进度的提醒
      if (this.lastProgressCheck.has(progressKey)) {
        return;
      }

      let reminderType = null;
      let title = '';
      let content = '';
      let priority = 'medium';

      // 根据完成百分比发送不同的提醒
      if (progressPercent >= 100) {
        reminderType = 'complete';
        title = '🎉 今日目标完成！';
        content = `恭喜你！今天已经完成了 ${todayCount} 道题目，超额完成了每日目标！继续保持这个节奏！`;
        priority = 'high';
      } else if (progressPercent >= 75) {
        reminderType = 'progress75';
        title = '💪 即将完成目标！';
        content = `你已经完成了 ${todayCount}/${goal.dailyTarget} 道题目（${progressPercent}%），距离目标只差一点点了！`;
        priority = 'medium';
      } else if (progressPercent >= 50) {
        reminderType = 'progress50';
        title = '👍 已完成一半！';
        content = `你已经完成了 ${todayCount}/${goal.dailyTarget} 道题目（${progressPercent}%），已经过半了，继续加油！`;
        priority = 'medium';
      }

      // 如果需要发送提醒
      if (reminderType) {
        // 检查数据库中是否已存在相同类型的提醒
        const existingReminder = await Notification.findOne({
          where: {
            type: 'reminder',
            metadata: {
              reminderType: reminderType,
              date: today
            }
          }
        });

        if (!existingReminder) {
          // 创建进度提醒通知
          await Notification.create({
            type: 'reminder',
            title: title,
            content: content,
            read: false,
            priority: priority,
            metadata: {
              reminderType: reminderType,
              date: today,
              completedCount: todayCount,
              targetCount: goal.dailyTarget,
              progressPercent: progressPercent
            }
          });

          // 记录已发送的提醒
          this.lastProgressCheck.set(progressKey, true);
          console.log(`进度提醒已发送 - ${reminderType}: ${progressPercent}% (${todayCount}/${goal.dailyTarget})`);
        }
      }
    } catch (error) {
      console.error('检查进度提醒失败:', error);
    }
  }

  /**
   * 手动触发每日提醒（用于测试）
   */
  async triggerDailyReminder() {
    console.log('手动触发每日提醒...');
    await this.sendDailyReminder();
  }

  /**
   * 手动触发进度检查（用于测试）
   */
  async triggerProgressCheck() {
    console.log('手动触发进度检查...');
    await this.checkProgressAndRemind();
  }

  /**
   * 获取服务状态
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      dailyTaskActive: this.dailyTask ? this.dailyTask.running : false,
      progressCheckActive: this.progressCheckTask ? this.progressCheckTask.running : false,
      lastProgressChecks: Array.from(this.lastProgressCheck.keys())
    };
  }

  /**
   * 获取用户设置的提醒时间
   */
  async getReminderTime() {
    try {
      const setting = await Setting.findOne({
        order: [['updated_at', 'DESC']]
      });
      
      return setting?.notifications?.reminderTime || '09:00';
    } catch (error) {
      console.error('获取提醒时间失败:', error);
      return '09:00'; // 默认时间
    }
  }

  /**
   * 更新提醒时间（重新启动定时任务）
   */
  async updateReminderTime(newTime) {
    try {
      if (this.isRunning) {
        // 停止当前的每日任务
        if (this.dailyTask) {
          this.dailyTask.stop();
        }
        
        // 创建新的每日任务
        const [hour, minute] = newTime.split(':').map(Number);
        this.dailyTask = cron.schedule(`${minute} ${hour} * * *`, async () => {
          await this.sendDailyReminder();
        }, {
          scheduled: true,
          timezone: 'Asia/Shanghai'
        });
        
        console.log(`提醒时间已更新为 ${newTime}`);
      }
    } catch (error) {
      console.error('更新提醒时间失败:', error);
    }
  }

  /**
   * 清除今日进度检查记录（每日重置）
   */
  resetDailyProgress() {
    this.lastProgressCheck.clear();
    console.log('今日进度检查记录已重置');
  }
}

// 创建单例实例
const reminderService = new MinimalReminderService();

export default reminderService;