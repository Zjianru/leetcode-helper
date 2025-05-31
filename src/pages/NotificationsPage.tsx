import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { useTheme } from '../hooks/useTheme';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FloatingButton } from '../components/FloatingButton';
import { CheckCircle, AlertCircle, Info, Bell, X } from 'lucide-react';

type Notification = {
  id: string;
  type: 'reminder' | 'achievement';
  title: string;
  content: string;
  read: boolean;
  timestamp: string;
};

export default function NotificationsPage() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/v1/notifications');
      const result = await response.json();
      
      if (result.success) {
        setNotifications(result.data || []);
      } else {
        setError(result.message || '获取通知数据失败');
      }
    } catch (error) {
      console.error('获取通知数据失败:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    // Filter notifications based on active tab
    let filtered = [...notifications];
    if (activeTab === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (activeTab === 'read') {
      filtered = filtered.filter(n => n.read);
    }
    setFilteredNotifications(filtered);
  }, [notifications, activeTab]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/notifications/${id}/read`, {
        method: 'PATCH'
      });
      const result = await response.json();
      
      if (result.success) {
        const updated = notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        );
        setNotifications(updated);
      }
    } catch (error) {
      console.error('标记已读失败:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/notifications/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (result.success) {
        setNotifications(notifications.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error('删除通知失败:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'reminder':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#2F4F4F]' : 'bg-[#F5F5F5]'}`}>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">消息中心</h1>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                  <div className="animate-pulse">
                    <div className={`h-4 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-3/4 mb-2`}></div>
                    <div className={`h-3 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-1/2 mb-2`}></div>
                    <div className={`h-3 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-1/4`}></div>
                  </div>
                </div>
              ))}
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
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">消息中心</h1>
            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'} border ${theme === 'dark' ? 'border-red-800' : 'border-red-200'}`}>
              <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-800'}`}>加载失败</h3>
              <p className={`${theme === 'dark' ? 'text-red-300' : 'text-red-600'} mb-4`}>{error}</p>
              <button 
                onClick={fetchNotifications}
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
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">消息中心</h1>
            
            {/* 筛选标签 */}
            <div className={`flex rounded-lg p-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              {(['all', 'unread', 'read'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    activeTab === tab
                      ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                      : theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  {tab === 'all' ? '全部' : tab === 'unread' ? '未读' : '已读'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => (
                <div key={notification.id} className={cn(
                  "p-4 rounded-lg shadow-md",
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white',
                  !notification.read && (theme === 'dark' ? 'border-l-4 border-blue-500' : 'border-l-4 border-blue-500')
                )}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <h3 className={cn(
                          "font-medium",
                          !notification.read && "font-semibold"
                        )}>
                          {notification.title}
                        </h3>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {notification.content}
                        </p>
                        <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                          title="标记为已读"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-500'} transition-colors`}
                        title="删除"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={cn(
                "text-center py-12 rounded-lg",
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              )}>
                <Bell className={`w-12 h-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {activeTab === 'all' ? '暂无消息' : activeTab === 'unread' ? '暂无未读消息' : '暂无已读消息'}
                </p>
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
