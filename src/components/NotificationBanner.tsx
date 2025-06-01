import React, { useState, useEffect } from 'react';
import { X, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationBannerProps {
  theme: 'light' | 'dark';
}

export function NotificationBanner({ theme }: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [dailyReminder, setDailyReminder] = useState(false);

  /**
   * 检查是否到了提醒时间
   */
  const checkReminderTime = () => {
    if (!dailyReminder) return;
    
    const now = new Date();
    const [reminderHour, reminderMinute] = reminderTime.split(':').map(Number);
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // 检查是否到了设定的提醒时间（精确匹配分钟）
    if (currentHour === reminderHour && currentMinute === reminderMinute) {
      setIsVisible(true);
    }
  };



  /**
   * 获取通知设置
   */
  const fetchNotificationSettings = async () => {
    try {
      const response = await fetch('/api/v1/settings');
      if (response.ok) {
        const settings = await response.json();
        console.log('获取到的设置:', settings.notifications);
        const newDailyReminder = settings.notifications?.dailyReminder || false;
        const newReminderTime = settings.notifications?.reminderTime || '20:00';
        console.log('设置更新 - dailyReminder:', newDailyReminder, 'reminderTime:', newReminderTime);
        setDailyReminder(newDailyReminder);
        setReminderTime(newReminderTime);
      }
    } catch (error) {
      console.error('获取通知设置失败:', error);
    }
  };

  useEffect(() => {
    // 初始化获取设置
    fetchNotificationSettings();
    
    // 定期检查设置变化（每5秒检查一次）
    const settingsInterval = setInterval(() => {
      fetchNotificationSettings();
    }, 5000);
    
    return () => clearInterval(settingsInterval);
  }, []);

  useEffect(() => {
    // 当设置变化时，重新设置定时器
    if (!dailyReminder) return;

    // 每分钟检查一次时间
    const interval = setInterval(() => {
      checkReminderTime();
    }, 60000);

    return () => clearInterval(interval);
  }, [dailyReminder, reminderTime]);

  /**
   * 关闭通知横幅
   */
  const handleClose = () => {
    setIsVisible(false);
  };

  /**
   * 开始刷题 - 跳转到记录页面
   */
  const handleStartCoding = () => {
    setIsVisible(false);
    window.location.href = '/record';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className={cn(
        "max-w-sm rounded-lg shadow-lg border p-4",
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700 text-white' 
          : 'bg-white border-gray-200 text-gray-800'
      )}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className={cn(
              "p-2 rounded-full",
              theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
            )}>
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">
                🎯 刷题时间到了！
              </h3>
              <p className="text-sm opacity-90">
                现在是 {reminderTime}，该开始今天的LeetCode刷题了！
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className={cn(
              "ml-2 p-1 rounded-full hover:bg-opacity-20 transition-colors",
              theme === 'dark' ? 'hover:bg-white' : 'hover:bg-gray-500'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-4">
          <button
            onClick={handleStartCoding}
            className={cn(
              "w-full px-4 py-2 rounded-md text-sm font-medium transition-colors",
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            )}
          >
            开始刷题
          </button>
        </div>
      </div>
    </div>
  );
}