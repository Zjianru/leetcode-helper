import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Shortcuts = {
  addRecord: string;
  toggleTheme: string;
};

type Settings = {
  theme: 'light' | 'dark';
  shortcuts: Shortcuts;
};

const defaultSettings: Settings = {
  theme: 'light',
  shortcuts: {
    addRecord: 'Ctrl+Shift+A',
    toggleTheme: 'Ctrl+Shift+T'
  }
};

export default function SettingsPage() {
  const { theme: currentTheme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    if (newTheme !== currentTheme) {
      toggleTheme();
    }
    setSettings(prev => ({
      ...prev,
      theme: newTheme
    }));
    setIsDirty(true);
  };

  const handleShortcutChange = (key: keyof Shortcuts, value: string) => {
    // Basic conflict detection
    const otherKey = key === 'addRecord' ? 'toggleTheme' : 'addRecord';
    if (value === settings.shortcuts[otherKey]) {
      toast.error('快捷键冲突，请选择不同的组合');
      return;
    }

    setSettings(prev => ({
      ...prev,
      shortcuts: {
        ...prev.shortcuts,
        [key]: value
      }
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setIsDirty(false);
    toast.success('设置已保存');
  };

  return (
    <div className={`min-h-screen flex flex-col ${currentTheme === 'dark' ? 'bg-[#2F4F4F]' : 'bg-[#F5F5F5]'}`}>
      <Navbar theme={currentTheme} toggleTheme={toggleTheme} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">体验设置</h1>
          
          <div className="grid grid-cols-1 gap-6">
            {/* 主题设置卡片 */}
            <div className={cn(
              "p-6 rounded-xl shadow-md",
              currentTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            )}>
              <h2 className="text-xl font-bold mb-4">主题设置</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-lg border-2 transition-colors",
                    settings.theme === 'light' 
                      ? currentTheme === 'dark' 
                        ? 'border-blue-500 bg-gray-700' 
                        : 'border-blue-500 bg-blue-50'
                      : currentTheme === 'dark' 
                        ? 'border-gray-600 hover:bg-gray-700' 
                        : 'border-gray-300 hover:bg-gray-100'
                  )}
                >
                  <i className="fa-regular fa-sun text-xl mb-2"></i>
                  <div className="font-medium">亮色模式</div>
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-lg border-2 transition-colors",
                    settings.theme === 'dark' 
                      ? currentTheme === 'dark' 
                        ? 'border-blue-500 bg-gray-700' 
                        : 'border-blue-500 bg-blue-50'
                      : currentTheme === 'dark' 
                        ? 'border-gray-600 hover:bg-gray-700' 
                        : 'border-gray-300 hover:bg-gray-100'
                  )}
                >
                  <i className="fa-regular fa-moon text-xl mb-2"></i>
                  <div className="font-medium">深色模式</div>
                </button>
              </div>
            </div>

            {/* 快捷键设置卡片 */}
            <div className={cn(
              "p-6 rounded-xl shadow-md",
              currentTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            )}>
              <h2 className="text-xl font-bold mb-4">快捷键设置</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">添加记录</label>
                  <input
                    type="text"
                    value={settings.shortcuts.addRecord}
                    onChange={(e) => handleShortcutChange('addRecord', e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 border rounded-md",
                      currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    )}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">切换主题</label>
                  <input
                    type="text"
                    value={settings.shortcuts.toggleTheme}
                    onChange={(e) => handleShortcutChange('toggleTheme', e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 border rounded-md",
                      currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    )}
                  />
                </div>
              </div>
            </div>

            {/* 保存按钮 */}
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className={cn(
                "w-full py-3 px-4 rounded-md font-medium transition-colors",
                currentTheme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600',
                !isDirty && 'opacity-50 cursor-not-allowed',
                "text-white"
              )}
            >
              保存设置
            </button>
          </div>
        </div>
      </main>
      <Footer theme={currentTheme} />
    </div>
  );
}
