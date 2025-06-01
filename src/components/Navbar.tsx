import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function Navbar({ theme, toggleTheme }: NavbarProps) {
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b",
      theme === 'dark' ? 'bg-[#0077CC] border-gray-700' : 'bg-[#1E90FF] border-gray-200'
    )}>
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="text-xl font-bold text-white hover:text-blue-200 transition-colors">
          LeetCode刷题助手
        </Link>
        <div className="flex items-center gap-6 ml-auto">
          <Link 
            to="/goals" 
            className="text-white hover:underline flex items-center gap-1"
          >
            <i className="fa-solid fa-bullseye"></i>
            <span>目标设置</span>
          </Link>
          <Link 
            to="/categories" 
            className="text-white hover:underline flex items-center gap-1"
          >
            <i className="fa-solid fa-tags"></i>
            <span>类别管理</span>
          </Link>
          <Link 
            to="/settings" 
            className="text-white hover:underline flex items-center gap-1"
          >
            <i className="fa-solid fa-cog"></i>
            <span>设置</span>
          </Link>
          <button
            onClick={toggleTheme}
            className={cn(
              "p-2 rounded-full",
              theme === 'dark' ? 'bg-gray-800 text-yellow-300' : 'bg-white text-gray-800'
            )}
          >
            {theme === 'dark' ? (
              <i className="fa-solid fa-sun"></i>
            ) : (
              <i className="fa-solid fa-moon"></i>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}