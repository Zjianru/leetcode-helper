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
};

const defaultGoalSettings: GoalSettings = {
  dailyTarget: 5,
  difficultyRatio: { easy: 50, medium: 30, hard: 20 }
};

export default function GoalsPage() {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState<GoalSettings>(defaultGoalSettings);

  useEffect(() => {
    // 从API获取目标设置和通知设置
    const fetchSettings = async () => {
      try {
        // 获取目标设置
        const goalResponse = await fetch('/api/v1/goals');
        const goalResult = await goalResponse.json();
        if (goalResult.success && goalResult.data) {
          setSettings(prev => ({
            ...prev,
            dailyTarget: goalResult.data.dailyTarget,
            difficultyRatio: goalResult.data.difficultyRatio || prev.difficultyRatio
          }));
        } else {
          // 如果API请求失败，尝试从localStorage获取
          const savedSettings = localStorage.getItem('goalSettings');
          if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
          }
        }

        // 通知设置已移至 SettingsPage 统一管理
      } catch (error) {
        console.error('获取设置失败:', error);
        // 网络错误时从localStorage获取目标设置
        const savedSettings = localStorage.getItem('goalSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      }
    };
    
    fetchSettings();
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

  // 通知设置功能已移至 SettingsPage 统一管理

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
          {/* 通知设置已移至设置页面 */}

        </div>
      </main>
      <Footer theme={theme} />
    </div>
  );
}
