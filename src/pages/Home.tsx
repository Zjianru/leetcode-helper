import { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FloatingButton } from '../components/FloatingButton';
import { StatsCard } from '../components/StatsCard';
import { ProgressChart } from '../components/ProgressChart';
import { TrendChart } from '../components/TrendChart';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [stats, setStats] = useState({
    total: 0,
    lastWeekTotal: 0,
    weeklyTrend: [],
    goalProgress: {
      current: 0,
      target: 0,
      dailyTarget: 0,
      dailyCompleted: 0,
      daysCompleted: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取统计数据
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/stats');
      const result = await response.json();
      if (result.success) {
        // 保留现有的 goalProgress，只更新其他字段
        setStats(prev => ({
          ...prev,
          ...result.data,
          goalProgress: prev.goalProgress // 保持现有的 goalProgress
        }));
      } else {
        setError(result.message || '获取统计数据失败');
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 获取目标进度数据
  const fetchGoalProgress = async () => {
    try {
      const response = await fetch('/api/v1/goals/progress');
      const result = await response.json();
      if (result.success) {
        setStats(prev => ({
          ...prev,
          goalProgress: result.data
        }));
      } else {
        console.error('获取目标进度失败:', result.message);
        // 确保 goalProgress 有默认值
        setStats(prev => ({
          ...prev,
          goalProgress: {
            current: 0,
            target: 0,
            dailyTarget: 0,
            dailyCompleted: 0,
            daysCompleted: 0
          }
        }));
      }
    } catch (error) {
      console.error('获取目标进度失败:', error);
      // 网络错误时也确保 goalProgress 有默认值
      setStats(prev => ({
        ...prev,
        goalProgress: {
          current: 0,
          target: 0,
          dailyTarget: 0,
          dailyCompleted: 0,
          daysCompleted: 0
        }
      }));
    }
  };

  useEffect(() => {
    fetchStats();
    fetchGoalProgress();
  }, []);

  // 计算增长率
  const growthRate = Math.round(((stats.total - stats.lastWeekTotal) / stats.lastWeekTotal) * 100);

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#2F4F4F]' : 'bg-[#F5F5F5]'}`}>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex flex-col gap-6 mb-8 w-full max-w-2xl mx-auto">
            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-[#3A5F5F]' : 'bg-white'} shadow-md`}>
              <div className="animate-pulse">
                <div className={`h-4 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-1/4 mb-2`}></div>
                <div className={`h-8 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-1/2 mb-4`}></div>
                <div className={`h-4 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-1/3`}></div>
              </div>
            </div>
            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-[#3A5F5F]' : 'bg-white'} shadow-md`}>
              <div className="animate-pulse">
                <div className={`h-4 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-1/4 mb-4`}></div>
                <div className={`h-32 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded`}></div>
              </div>
            </div>
          </div>
        </main>
        <Footer theme={theme} />
        <FloatingButton />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#2F4F4F]' : 'bg-[#F5F5F5]'}`}>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex flex-col gap-6 mb-8 w-full max-w-2xl mx-auto">
            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'} border ${theme === 'dark' ? 'border-red-800' : 'border-red-200'}`}>
              <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-800'}`}>加载失败</h3>
              <p className={`${theme === 'dark' ? 'text-red-300' : 'text-red-600'} mb-4`}>{error}</p>
              <button 
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  fetchStats();
                  fetchGoalProgress();
                }}
                className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'} text-white transition-colors`}
              >
                重试
              </button>
            </div>
          </div>
        </main>
        <Footer theme={theme} />
        <FloatingButton />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#2F4F4F]' : 'bg-[#F5F5F5]'}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 mb-8 w-full max-w-2xl mx-auto">
          <StatsCard 
            title="刷题统计" 
            value={stats.total} 
            subTitle="上周刷题数"
            subValue={stats.lastWeekTotal}
            trend={growthRate >= 0 ? 'up' : 'down'}
            trendValue={Math.abs(growthRate)}
            theme={theme} 
          />
          <ProgressChart 
            current={stats.goalProgress.dailyCompleted} 
            target={stats.goalProgress.dailyTarget} 
            theme={theme} 
          />
          <TrendChart 
            data={stats.weeklyTrend} 
            theme={theme} 
          />
        </div>
      </main>
      <Footer theme={theme} />
      <FloatingButton />
    </div>
  );
}