import { RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '../lib/utils';

interface ProgressChartProps {
  current: number;
  target: number;
  theme: 'light' | 'dark';
}

export function ProgressChart({ current, target, theme }: ProgressChartProps) {
  const percentage = Math.round((current / target) * 100);
  const remaining = 100 - percentage;
  
  // 创建两个数据项：已完成和未完成
  const data = [
    {
      name: 'Completed',
      value: percentage,
      fill: theme === 'dark' ? '#10B981' : '#059669' // 绿色表示已完成
    },
    {
      name: 'Remaining', 
      value: remaining,
      fill: theme === 'dark' ? '#374151' : '#E5E7EB' // 灰色表示未完成
    }
  ];

  return (
    <div className={cn(
      "p-6 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1",
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
    )}>
      <h3 className="text-lg font-medium mb-4">每日目标进度</h3>
      <p className="text-sm mb-2 opacity-80">今日完成度: {percentage}%</p>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="80%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              background={false}
              dataKey="value"
              cornerRadius={10}
              stackId="progress"
            />
            <Tooltip 
              content={({ payload }) => {
                if (!payload || payload.length === 0) return null;
                const data = payload[0].payload;
                const isCompleted = data.name === 'Completed';
                return (
                  <div className={cn(
                    "p-3 rounded-md text-sm shadow-lg",
                    theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800',
                    "border",
                    theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                  )}>
                    <div className="font-medium mb-1">
                      {isCompleted ? '已完成' : '剩余'}
                    </div>
                    <div className="text-lg font-bold">
                      {isCompleted ? current : target - current} 题
                    </div>
                    <div className="text-xs opacity-75">
                      {data.value}% 占比
                    </div>
                  </div>
                );
              }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center mt-2">
        <span className="text-xl font-bold">{current}</span>
        <span className="mx-1">/</span>
        <span>{target}</span>
        <p className="text-sm mt-1 opacity-80">今日完成/每日目标</p>
        <p className="text-xs mt-2 opacity-60">
          基于您在设置中配置的每日刷题目标
        </p>
      </div>
    </div>
  );
}