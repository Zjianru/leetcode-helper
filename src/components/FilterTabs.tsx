import { cn } from '@/lib/utils';

interface FilterTabsProps {
  activeTab: 'all' | 'unread' | 'read';
  onTabChange: (tab: 'all' | 'unread' | 'read') => void;
  theme: 'light' | 'dark';
}

export function FilterTabs({ activeTab, onTabChange, theme }: FilterTabsProps) {
  return (
    <div className={cn(
      "flex gap-2 p-1 rounded-lg",
      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
    )}>
      {(['all', 'unread', 'read'] as const).map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
            activeTab === tab
              ? theme === 'dark' 
                ? 'bg-gray-700 text-white' 
                : 'bg-white text-gray-900 shadow-sm'
              : theme === 'dark' 
                ? 'text-gray-300 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-gray-200'
          )}
        >
          {tab === 'all' && '全部'}
          {tab === 'unread' && '未读'}
          {tab === 'read' && '已读'}
        </button>
      ))}
    </div>
  );
}
