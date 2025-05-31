import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingButton } from '@/components/FloatingButton';
import { DifficultyTag } from '@/components/DifficultyTag';
import { Trash2, RotateCcw } from 'lucide-react';

type ErrorProblem = {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReview: string;
  tags: string[];
  starred: boolean;
  reviewed: boolean;
};

export default function ErrorBook() {
  const { theme, toggleTheme } = useTheme();
  const [problems, setProblems] = useState<ErrorProblem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<ErrorProblem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'reviewed' | 'unreviewed'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchErrorProblems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/v1/error-book');
      const result = await response.json();
      
      if (result.success) {
        setProblems(result.data || []);
      } else {
        setError(result.message || '获取错题本数据失败');
      }
    } catch (error) {
      console.error('获取错题本数据失败:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrorProblems();
  }, []);

  useEffect(() => {
    // Filter logic
    let result = [...problems];
    
    if (searchTerm) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedStatus !== 'all') {
      result = result.filter(p => 
        selectedStatus === 'reviewed' ? p.reviewed : !p.reviewed
      );
    }
    
    if (selectedTags.length > 0) {
      result = result.filter(p => 
        selectedTags.every(tag => p.tags.includes(tag))
      );
    }
    
    setFilteredProblems(result);
  }, [problems, searchTerm, selectedStatus, selectedTags]);

  const handleReview = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/error-book/${id}/reviewed`, {
        method: 'PATCH'
      });
      const result = await response.json();
      
      if (result.success) {
        const updated = problems.map(p => 
          p.id === id ? { ...p, reviewed: !p.reviewed } : p
        );
        setProblems(updated);
      }
    } catch (error) {
      console.error('更新复习状态失败:', error);
    }
  };

  const handleStar = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/error-book/${id}/starred`, {
        method: 'PATCH'
      });
      const result = await response.json();
      
      if (result.success) {
        const updated = problems.map(p => 
          p.id === id ? { ...p, starred: !p.starred } : p
        );
        setProblems(updated);
      }
    } catch (error) {
      console.error('更新收藏状态失败:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/error-book/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (result.success) {
        setProblems(problems.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('删除错题失败:', error);
    }
  };

  const handleJumpToLeetCode = (id: string) => {
    const problem = problems.find(p => p.id === id);
    if (problem) {
      window.open(`https://leetcode.cn/problems/${titleToUrl(problem.title)}`, '_blank');
    }
  };

  const titleToUrl = (title: string) => {
    return title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#2F4F4F]' : 'bg-[#F5F5F5]'}`}>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">错题本</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                  <div className="animate-pulse">
                    <div className={`h-4 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-3/4 mb-2`}></div>
                    <div className={`h-6 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-16 mb-4`}></div>
                    <div className={`h-4 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-1/2`}></div>
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">错题本</h1>
            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'} border ${theme === 'dark' ? 'border-red-800' : 'border-red-200'}`}>
              <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-800'}`}>加载失败</h3>
              <p className={`${theme === 'dark' ? 'text-red-300' : 'text-red-600'} mb-4`}>{error}</p>
              <button 
                onClick={fetchErrorProblems}
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">错题本</h1>
          
          {/* 搜索和筛选 */}
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md mb-6`}>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="搜索题目..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`flex-1 px-3 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className={`px-3 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                <option value="all">全部状态</option>
                <option value="reviewed">已复习</option>
                <option value="unreviewed">未复习</option>
              </select>
            </div>
          </div>
          
          {filteredProblems.length === 0 ? (
            <div className="text-center py-12">
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {problems.length === 0 ? '错题本为空' : '没有找到匹配的题目'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProblems.map(problem => (
                <div key={problem.id} className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">{problem.id}. {problem.title}</h3>
                      <DifficultyTag 
                        type={problem.difficulty} 
                        active={true} 
                        onClick={() => {}} 
                      />
                    </div>
                    <button
                      onClick={() => handleStar(problem.id)}
                      className={`ml-2 p-1 rounded ${problem.starred ? 'text-yellow-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                      ★
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      最后复习: {problem.lastReview}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {problem.tags.map(tag => (
                        <span key={tag} className={`px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReview(problem.id)}
                      className={`flex-1 px-3 py-2 rounded text-sm ${problem.reviewed ? 'bg-green-600 text-white' : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} transition-colors`}
                    >
                      <RotateCcw className="w-4 h-4 inline mr-1" />
                      {problem.reviewed ? '已复习' : '标记复习'}
                    </button>
                    <button
                      onClick={() => handleDelete(problem.id)}
                      className={`px-3 py-2 rounded text-sm ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white transition-colors`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer theme={theme} />
      <FloatingButton />
    </div>
  );
}
