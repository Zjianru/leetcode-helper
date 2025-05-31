import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NotificationCardProps {
  notification: {
    id: string;
    type: 'reminder' | 'achievement';
    title: string;
    content: string;
    read: boolean;
    timestamp: string;
  };
  theme: 'light' | 'dark';
  onRead: (id: string) => void;
}

export function NotificationCard({ notification, theme, onRead }: NotificationCardProps) {
  const [isRead, setIsRead] = useState(notification.read);

  const handleClick = () => {
    if (!isRead) {
      setIsRead(true);
      onRead(notification.id);
    }
  };

  const iconMap = {
    reminder: 'fa-bell',
    achievement: 'fa-trophy'
  };

  return (
    <div 
      className={cn(
        "relative pl-6 pb-6 border-l-2 transition-all",
        isRead 
          ? theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          : 'border-blue-500',
        "hover:opacity-80 cursor-pointer"
      )}
      onClick={handleClick}
    >
      <div className={cn(
        "absolute -left-1.5 top-0 w-3 h-3 rounded-full",
        isRead 
          ? theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
          : 'bg-blue-500'
      )}></div>
      
      <div className={cn(
        "p-4 rounded-lg shadow-sm",
        theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        !isRead && (theme === 'dark' ? 'ring-1 ring-blue-500' : 'ring-1 ring-blue-400')
      )}>
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-full",
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100',
            notification.type === 'reminder' 
              ? 'text-blue-500' 
              : 'text-yellow-500'
          )}>
            <i className={`fa-solid ${iconMap[notification.type]} text-lg`}></i>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className={cn(
                "font-medium",
                !isRead && 'font-semibold',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {notification.title}
              </h3>
              <span className={cn(
                "text-xs",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}>
                {notification.timestamp}
              </span>
            </div>
            <p className={cn(
              "mt-1 text-sm",
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            )}>
              {notification.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
