import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface DailyGoalCardProps {
  settings: {
    dailyTarget: number;
    difficultyRatio: {
      easy: number;
      medium: number;
      hard: number;
    };
  };
  onSave: (settings: any) => void;
  theme: 'light' | 'dark';
}

export default function DailyGoalCard({ settings, onSave, theme }: DailyGoalCardProps) {
  const [dailyTarget, setDailyTarget] = useState(settings.dailyTarget);
  const [difficultyRatio, setDifficultyRatio] = useState(settings.difficultyRatio);

  // 当props.settings变化时，更新本地状态
  useEffect(() => {
    setDailyTarget(settings.dailyTarget);
    setDifficultyRatio(settings.difficultyRatio);
  }, [settings.dailyTarget, settings.difficultyRatio]);

  const handleSave = () => {
    onSave({
      ...settings,
      dailyTarget,
      difficultyRatio
    });
  };

  const handleRatioChange = (type: 'easy' | 'medium' | 'hard', value: number) => {
    const newRatio = { ...difficultyRatio, [type]: value };
    // Ensure total is 100%
    const total = Object.values(newRatio).reduce((a, b) => a + b, 0);
    if (total <= 100) {
      setDifficultyRatio(newRatio);
    }
  };

  return (
    <div className={cn(
      "p-6 rounded-xl shadow-md",
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
    )}>
      <h2 className="text-xl font-bold mb-4">每日目标设置</h2>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium">
          每日刷题数量: <span className="font-bold text-blue-500">{dailyTarget}</span>
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={dailyTarget}
          onChange={(e) => setDailyTarget(Number(e.target.value))}
          className={cn(
            "w-full h-2 rounded-lg appearance-none cursor-pointer",
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          )}
        />
        <div className="flex justify-between text-sm mt-1">
          <span>1</span>
          <span>20</span>
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium">难度比例分配</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-sm">简单</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={difficultyRatio.easy}
                onChange={(e) => handleRatioChange('easy', Number(e.target.value))}
                className={cn(
                  "w-full h-2 rounded-lg appearance-none cursor-pointer",
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                )}
              />
              <span className="text-sm w-8">{difficultyRatio.easy}%</span>
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm">中等</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={difficultyRatio.medium}
                onChange={(e) => handleRatioChange('medium', Number(e.target.value))}
                className={cn(
                  "w-full h-2 rounded-lg appearance-none cursor-pointer",
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                )}
              />
              <span className="text-sm w-8">{difficultyRatio.medium}%</span>
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm">困难</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={difficultyRatio.hard}
                onChange={(e) => handleRatioChange('hard', Number(e.target.value))}
                className={cn(
                  "w-full h-2 rounded-lg appearance-none cursor-pointer",
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                )}
              />
              <span className="text-sm w-8">{difficultyRatio.hard}%</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className={cn(
          "w-full mt-6 py-2 px-4 rounded-md font-medium transition-colors",
          theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600',
          "text-white"
        )}
      >
        保存设置
      </button>
    </div>
  );
}
