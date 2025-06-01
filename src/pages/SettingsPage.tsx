import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Notifications = {
  dailyReminder: boolean;
  achievementAlert: boolean;
  systemNotice: boolean;
  reminderTime: string;
};

type Settings = {
  theme: 'light' | 'dark';
  notifications: Notifications;
};

const defaultSettings: Settings = {
  theme: 'light',
  notifications: {
    dailyReminder: true,
    achievementAlert: true,
    systemNotice: true,
    reminderTime: '09:00'
  }
};

export default function SettingsPage() {
  const { theme: currentTheme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    // Load settings from localStorage and server
    const loadSettings = async () => {
      try {
        // 从服务器获取设置
        const response = await fetch('/api/v1/settings');
        if (response.ok) {
          const serverSettings = await response.json();
          setSettings({
            theme: serverSettings.theme || 'light',
            notifications: serverSettings.notifications || defaultSettings.notifications
          });
        } else {
          // 如果服务器请求失败，从 localStorage 加载
          const savedSettings = localStorage.getItem('appSettings');
          if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            setSettings({
              ...defaultSettings,
              ...parsed,
              notifications: {
                ...defaultSettings.notifications,
                ...parsed.notifications
              }
            });
          }
        }
      } catch (error) {
        console.error('加载设置失败:', error);
        // 使用默认设置
        setSettings(defaultSettings);
      }
    };
    
    loadSettings();
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    if (newTheme !== currentTheme) {
      toggleTheme();
    }
    setSettings(prev => ({
      ...prev,
      theme: newTheme
    }));
    setIsDirty(true);
  };



  const handleNotificationChange = (key: keyof Notifications, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      // 保存到服务器
      const response = await fetch('/api/v1/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (response.ok) {
        // 如果提醒时间发生变化，更新提醒服务
        await fetch('/api/v1/reminders/time', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reminderTime: settings.notifications.reminderTime }),
        });
        
        localStorage.setItem('appSettings', JSON.stringify(settings));
        setIsDirty(false);
        toast.success('设置已保存');
      } else {
        throw new Error('保存设置失败');
      }
    } catch (error) {
      console.error('保存设置失败:', error);
      toast.error('保存设置失败，请重试');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${currentTheme === 'dark' ? 'bg-[#2F4F4F]' : 'bg-[#F5F5F5]'}`}>
      <Navbar theme={currentTheme} toggleTheme={toggleTheme} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">体验设置</h1>
          
          <div className="grid grid-cols-1 gap-6">
            {/* 主题设置卡片 */}
            <div className={cn(
              "p-6 rounded-xl shadow-md",
              currentTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            )}>
              <h2 className="text-xl font-bold mb-4">主题设置</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-lg border-2 transition-colors",
                    settings.theme === 'light' 
                      ? currentTheme === 'dark' 
                        ? 'border-blue-500 bg-gray-700' 
                        : 'border-blue-500 bg-blue-50'
                      : currentTheme === 'dark' 
                        ? 'border-gray-600 hover:bg-gray-700' 
                        : 'border-gray-300 hover:bg-gray-100'
                  )}
                >
                  <i className="fa-regular fa-sun text-xl mb-2"></i>
                  <div className="font-medium">亮色模式</div>
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-lg border-2 transition-colors",
                    settings.theme === 'dark' 
                      ? currentTheme === 'dark' 
                        ? 'border-blue-500 bg-gray-700' 
                        : 'border-blue-500 bg-blue-50'
                      : currentTheme === 'dark' 
                        ? 'border-gray-600 hover:bg-gray-700' 
                        : 'border-gray-300 hover:bg-gray-100'
                  )}
                >
                  <i className="fa-regular fa-moon text-xl mb-2"></i>
                  <div className="font-medium">深色模式</div>
                </button>
              </div>
            </div>

            {/* 提醒设置卡片 */}
            <div className={cn(
              "p-6 rounded-xl shadow-md",
              currentTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            )}>
              <h2 className="text-xl font-bold mb-4">
                <i className="fa-regular fa-bell mr-2"></i>
                提醒设置
              </h2>
              <div className="space-y-4">
                {/* 每日提醒开关 */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-medium">每日刷题提醒</label>
                    <p className="text-sm opacity-70">在设定时间提醒你开始刷题</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.dailyReminder}
                      onChange={(e) => handleNotificationChange('dailyReminder', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {/* 提醒时间设置 */}
                {settings.notifications.dailyReminder && (
                  <div>
                    <label className="block mb-2 font-medium">提醒时间</label>
                    <input
                      type="time"
                      value={settings.notifications.reminderTime}
                      onChange={(e) => handleNotificationChange('reminderTime', e.target.value)}
                      className={cn(
                        "px-3 py-2 border rounded-md",
                        currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      )}
                    />
                  </div>
                )}
                
                {/* 成就提醒开关 */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-medium">进度提醒</label>
                    <p className="text-sm opacity-70">完成50%、75%、100%目标时提醒</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.achievementAlert}
                      onChange={(e) => handleNotificationChange('achievementAlert', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {/* 系统通知开关 */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-medium">系统通知</label>
                    <p className="text-sm opacity-70">接收系统更新和重要通知</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.systemNotice}
                      onChange={(e) => handleNotificationChange('systemNotice', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>



            {/* 保存按钮 */}
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className={cn(
                "w-full py-3 px-4 rounded-md font-medium transition-colors",
                currentTheme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600',
                !isDirty && 'opacity-50 cursor-not-allowed',
                "text-white"
              )}
            >
              保存设置
            </button>
          </div>
        </div>
      </main>
      <Footer theme={currentTheme} />
    </div>
  );
}
