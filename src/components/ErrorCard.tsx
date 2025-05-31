import { cn } from '@/lib/utils';
import { DifficultyTag } from './DifficultyTag';

interface ErrorCardProps {
  problem: {
    id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    lastReview: string;
    tags: string[];
    starred: boolean;
    reviewed: boolean;
  };
  theme: 'light' | 'dark';
  onReview: () => void;
  onStar: () => void;
  onJump: () => void;
}

export function ErrorCard({ problem, theme, onReview, onStar, onJump }: ErrorCardProps) {
  const difficultyColor = {
    easy: theme === 'dark' ? 'bg-green-500' : 'bg-green-400',
    medium: theme === 'dark' ? 'bg-yellow-500' : 'bg-yellow-400',
    hard: theme === 'dark' ? 'bg-red-500' : 'bg-red-400'
  };

  return (
    <div className={cn(
      "relative rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1",
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
    )}>
      <div className={`absolute left-0 top-0 bottom-0 w-2 ${difficultyColor[problem.difficulty]}`}></div>
      
      <div className="p-5 pl-7">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium">{problem.id}. {problem.title}</h3>
          <DifficultyTag 
            type={problem.difficulty} 
            active={true} 
            onClick={() => {}} 
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {problem.tags.map(tag => (
            <span 
              key={tag} 
              className={cn(
                "px-2 py-1 rounded-md text-xs",
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              )}
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="text-sm opacity-70 mb-4">
          上次复习: {problem.lastReview}
        </div>
        
        <div className="flex justify-between items-center">
          <button
            onClick={onJump}
            className={cn(
              "px-3 py-1 rounded-md text-sm font-medium",
              theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            )}
          >
            跳转LeetCode
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={onReview}
              className={cn(
                "p-2 rounded-full",
                problem.reviewed 
                  ? theme === 'dark' ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
                  : theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
              )}
              title={problem.reviewed ? '已复习' : '标记为已复习'}
            >
              <i className={`fa-solid fa-${problem.reviewed ? 'check-circle' : 'circle-check'}`}></i>
            </button>
            
            <button
              onClick={onStar}
              className={cn(
                "p-2 rounded-full",
                problem.starred 
                  ? theme === 'dark' ? 'bg-yellow-600 text-white' : 'bg-yellow-500 text-white'
                  : theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
              )}
              title={problem.starred ? '已收藏' : '收藏'}
            >
              <i className={`fa-solid fa-${problem.starred ? 'star' : 'star'}`}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
