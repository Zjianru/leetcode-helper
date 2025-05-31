import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingButton } from '@/components/FloatingButton';
import { cn } from '@/lib/utils';
import { DifficultyTag } from '@/components/DifficultyTag';

export default function DailyDetailPage() {
  const { theme, toggleTheme } = useTheme();
  const { date } = useParams<{ date: string }>();
  
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDailyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/v1/daily/${date}`);
      const result = await response.json();
      
      if (result.success) {
        setDailyData(result.data || []);
      } else {
        setError(result.message || '获取每日刷题数据失败');
      }
    } catch (error) {
      console.error('获取每日刷题数据失败:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date) {
      fetchDailyData();
    }
  }, [date]);

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#2F4F4F]' : 'bg-[#F5F5F5]'}`}>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{date} 刷题记录</h1>
            <div className={cn(
              "p-6 rounded-xl shadow-md mb-6",
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            )}>
              <div className="animate-pulse">
                <div className={`h-6 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-1/3 mb-4`}></div>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="flex justify-between items-center">
                        <div className={`h-4 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-2/3`}></div>
                        <div className={`h-6 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-16`}></div>
                      </div>
                    </div>
                  ))}
                </div>
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
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{date} 刷题记录</h1>
            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'} border ${theme === 'dark' ? 'border-red-800' : 'border-red-200'}`}>
              <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-800'}`}>加载失败</h3>
              <p className={`${theme === 'dark' ? 'text-red-300' : 'text-red-600'} mb-4`}>{error}</p>
              <button 
                onClick={fetchDailyData}
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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">{date} 刷题记录</h1>
          <div className={cn(
            "p-6 rounded-xl shadow-md mb-6",
            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          )}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">共完成 {dailyData.length} 道题目</h2>
            </div>
            
            {dailyData.length === 0 ? (
              <div className="text-center py-8">
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>该日期暂无刷题记录</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dailyData.map(problem => (
                  <div 
                    key={problem.id} 
                    className={cn(
                      "p-4 rounded-lg",
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{problem.id}. {problem.title}</h3>
                      </div>
                      <DifficultyTag 
                        type={problem.difficulty as 'easy' | 'medium' | 'hard'} 
                        active={true} 
                        onClick={() => {}} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer theme={theme} />
      <FloatingButton />
    </div>
  );
}