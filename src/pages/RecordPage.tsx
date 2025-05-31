import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { DifficultyTag } from '@/components/DifficultyTag';
import { AutoCompleteInput } from '@/components/AutoCompleteInput';

type ProblemRecord = {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'completed' | 'attempted';
  categoryIds: number[];
};

type Category = {
  id: number;
  name: string;
  description: string;
  color: string;
};

type Problem = {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  url: string;
  description: string;
};

export default function RecordPage() {
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState<ProblemRecord>({
    id: '',
    title: '',
    difficulty: 'easy',
    status: 'completed',
    categoryIds: []
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProblems();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/v1/categories');
      const result = await response.json();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('获取类别列表失败:', error);
    }
  };

  const fetchProblems = async () => {
    try {
      const response = await fetch('/api/v1/problems');
      const result = await response.json();
      if (result.success) {
        setProblems(result.data);
      }
    } catch (error) {
      console.error('获取题目列表失败:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDifficultyChange = (difficulty: 'easy' | 'medium' | 'hard') => {
    setFormData(prev => ({ ...prev, difficulty }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, status: e.target.value as 'completed' | 'attempted' }));
  };

  const handleCategoryChange = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));
  };

  const handleProblemSelect = async (problem: Problem) => {
    setFormData(prev => ({
      ...prev,
      id: problem.id,
      title: problem.title,
      difficulty: problem.difficulty
    }));
    
    // 获取题目已有的类别
    try {
      const response = await fetch(`/api/v1/categories/problem/${problem.id}`);
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        const existingCategoryIds = result.data.map((cat: Category) => cat.id);
        setFormData(prev => ({
          ...prev,
          categoryIds: existingCategoryIds
        }));
      }
    } catch (error) {
      console.error('获取题目类别失败:', error);
      // 如果获取失败，保持当前选择的类别不变
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.title) {
      toast.error('请填写题目ID和名称');
      return;
    }

    setLoading(true);
    try {
      // 提交刷题记录（包含题目信息，用于自动创建题目）
      const recordResponse = await fetch('/api/v1/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem_id: formData.id,
          status: formData.status,
          title: formData.title,
          difficulty: formData.difficulty,
          date: new Date().toISOString().split('T')[0]
        }),
      });

      const recordResult = await recordResponse.json();
      if (!recordResult.success) {
        throw new Error(recordResult.message || '保存记录失败');
      }

      // 如果选择了类别，设置题目类别
      if (formData.categoryIds.length > 0) {
        await fetch(`/api/v1/categories/problem/${formData.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            categoryIds: formData.categoryIds
          }),
        });
      }

      toast.success('记录已保存');
      setFormData({
        id: '',
        title: '',
        difficulty: 'easy',
        status: 'completed',
        categoryIds: []
      });
    } catch (error) {
      console.error('保存记录失败:', error);
      toast.error(error instanceof Error ? error.message : '保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#2F4F4F]' : 'bg-[#F5F5F5]'}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className={cn(
            "p-6 rounded-xl shadow-md",
            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          )}>
            <h2 className="text-2xl font-bold mb-6">添加刷题记录</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 font-medium">题目ID</label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-3 py-2 border rounded-md",
                    theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                  )}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">题目名称</label>
                <AutoCompleteInput
                  value={formData.title}
                  onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
                  suggestions={problems.map(p => p.title)}
                  onSelect={(title) => {
                    const problem = problems.find(p => p.title === title);
                    if (problem) {
                      handleProblemSelect(problem);
                    }
                  }}
                  placeholder="输入题目名称或从建议中选择"
                  className={cn(
                    "w-full px-3 py-2 border rounded-md",
                    theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                  )}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">题目类别</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.categoryIds.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                        className="rounded"
                      />
                      <div className="flex items-center space-x-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="text-sm">{category.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
                {categories.length === 0 && (
                  <p className="text-gray-500 text-sm mt-2">
                    暂无类别，请先到类别管理页面添加类别
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">难度</label>
                <div className="flex gap-2">
                  <DifficultyTag 
                    type="easy" 
                    active={formData.difficulty === 'easy'}
                    onClick={() => handleDifficultyChange('easy')}
                  />
                  <DifficultyTag 
                    type="medium" 
                    active={formData.difficulty === 'medium'}
                    onClick={() => handleDifficultyChange('medium')}
                  />
                  <DifficultyTag 
                    type="hard" 
                    active={formData.difficulty === 'hard'}
                    onClick={() => handleDifficultyChange('hard')}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-medium">完成状态</label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="completed"
                      checked={formData.status === 'completed'}
                      onChange={handleStatusChange}
                      className="mr-2"
                    />
                    <span>已完成</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="attempted"
                      checked={formData.status === 'attempted'}
                      onChange={handleStatusChange}
                      className="mr-2"
                    />
                    <span>尝试过</span>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full py-2 px-4 rounded-md font-medium transition-colors",
                  loading ? 'bg-gray-400 cursor-not-allowed' : theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600',
                  "text-white"
                )}
              >
                {loading ? '保存中...' : '提交记录'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer theme={theme} />
    </div>
  );
}
