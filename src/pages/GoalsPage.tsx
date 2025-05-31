import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import DailyGoalCard from '@/components/DailyGoalCard';

type GoalSettings = {
  dailyTarget: number;
  difficultyRatio: {
    easy: number;
    medium: number;
    hard: number;
  };
  enableNotification: boolean;
  notificationTime?: string;
};

const defaultSettings: GoalSettings = {
  dailyTarget: 5,
  difficultyRatio: { easy: 50, medium: 30, hard: 20 },
  enableNotification: false,
  notificationTime: '20:00'
};

export default function GoalsPage() {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState<GoalSettings>(defaultSettings);

  useEffect(() => {
    // 从API获取目标设置
    const fetchGoalSettings = async () => {
      try {
        const response = await fetch('/api/v1/goals');
        const result = await response.json();
        if (result.success && result.data) {
          setSettings(prev => ({
            ...prev,
            dailyTarget: result.data.dailyTarget,
            difficultyRatio: result.data.difficultyRatio || prev.difficultyRatio
          }));
        } else {
          // 如果API请求失败，尝试从localStorage获取
          const savedSettings = localStorage.getItem('goalSettings');
          if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
          }
        }
      } catch (error) {
        console.error('获取目标设置失败:', error);
        // 网络错误时从localStorage获取
        const savedSettings = localStorage.getItem('goalSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      }
    };
    
    fetchGoalSettings();
  }, []);

  const handleSave = async (newSettings: GoalSettings) => {
    try {
      // 调用后端API保存目标设置
      const response = await fetch('/api/v1/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dailyTarget: newSettings.dailyTarget,
          totalTarget: 100, // 默认总目标
          difficultyRatio: newSettings.difficultyRatio
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSettings(prev => ({
          ...prev,
          dailyTarget: newSettings.dailyTarget,
          difficultyRatio: newSettings.difficultyRatio
        }));
        // 同时保存到localStorage作为备份
        localStorage.setItem('goalSettings', JSON.stringify(newSettings));
        toast.success('设置已保存');
      } else {
        toast.error(result.message || '保存失败');
      }
    } catch (error) {
      console.error('保存目标设置失败:', error);
      toast.error('网络错误，保存失败');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#2F4F4F]' : 'bg-[#F5F5F5]'}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
          <DailyGoalCard 
            settings={settings} 
            onSave={handleSave} 
            theme={theme} 
          />
          <div className={cn(
            "p-6 rounded-xl shadow-md",
            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          )}>
            <h2 className="text-xl font-bold mb-4">通知设置</h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">每日提醒</h3>
                <p className="text-sm opacity-70">设置每日刷题提醒时间</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.enableNotification}
                  onChange={() => handleSave({
                    ...settings,
                    enableNotification: !settings.enableNotification
                  })}
                  className="sr-only peer"
                />
                <div className={cn(
                  "w-11 h-6 rounded-full peer",
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200',
                  "peer-checked:after:translate-x-full peer-checked:after:border-white",
                  "after:content-[''] after:absolute after:top-[2px] after:left-[2px]",
                  "after:bg-white after:border-gray-300 after:border",
                  "after:rounded-full after:h-5 after:w-5 after:transition-all",
                  "peer-checked:bg-blue-600"
                )}></div>
              </label>
            </div>
          </div>

        </div>
      </main>
      <Footer theme={theme} />
    </div>
  );
}
