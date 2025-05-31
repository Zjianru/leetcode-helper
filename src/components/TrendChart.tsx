import { cn } from '@/lib/utils';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';

interface TrendChartProps {
  data: { date: string; count: number; details?: { id: string; title: string; difficulty: string }[] }[];
  theme: 'light' | 'dark';
}

export function TrendChart({ data, theme }: TrendChartProps) {
  const navigate = useNavigate();

  const handleBarClick = (entry: any) => {
    if (entry && entry.activePayload) {
      const date = entry.activePayload[0].payload.date;
      navigate(`/daily/${date}`);
    }
  };

  return (
    <div className={cn(
      "p-6 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1",
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
    )}>
      <h3 className="text-lg font-medium mb-4">7日刷题趋势</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} onClick={handleBarClick}>
            <XAxis 
              dataKey="date" 
              tick={{ fill: theme === 'dark' ? '#fff' : '#000' }} 
              tickFormatter={(value) => value.substring(5)} // 显示为 MM-DD 格式
            />
            <YAxis 
              tick={{ fill: theme === 'dark' ? '#fff' : '#000' }} 
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#374151' : '#fff',
                borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
                borderRadius: '0.5rem'
              }}
            />
            <Bar 
              dataKey="count" 
              fill={theme === 'dark' ? '#3B82F6' : '#1E90FF'} 
              radius={[4, 4, 0, 0]} 
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}