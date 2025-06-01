import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number;
  subTitle?: string;
  subValue?: number;
  subTitle2?: string;
  subValue2?: number;
  trend?: 'up' | 'down' | 'none';
  trendValue?: number;
  theme: 'light' | 'dark';
}

export function StatsCard({ 
  title, 
  value, 
  subTitle, 
  subValue, 
  subTitle2, 
  subValue2, 
  trend = 'none', 
  trendValue = 0, 
  theme 
}: StatsCardProps) {
  return (
    <div className={cn(
      "p-6 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1",
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
    )}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium">{title}</h3>
        {trend !== 'none' && (
          <span className={cn(
            "flex items-center text-sm",
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          )}>
            {trend === 'up' ? (
              <i className="fa-solid fa-arrow-up mr-1"></i>
            ) : (
              <i className="fa-solid fa-arrow-down mr-1"></i>
            )}
            {trendValue}%
            <span className="ml-1 text-xs opacity-70">(较上周)</span>
          </span>
        )}
      </div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="space-y-1">
        {subTitle && subValue !== undefined && (
          <div className="text-sm opacity-80">
            {subTitle}: <span className="font-medium">{subValue}</span>
          </div>
        )}
        {subTitle2 && subValue2 !== undefined && (
          <div className="text-sm opacity-80">
            {subTitle2}: <span className="font-medium">{subValue2}</span>
          </div>
        )}
      </div>
    </div>
  );
}