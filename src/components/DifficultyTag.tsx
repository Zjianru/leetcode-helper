import { cn } from '@/lib/utils';

interface DifficultyTagProps {
  type: 'easy' | 'medium' | 'hard';
  active: boolean;
  onClick: () => void;
}

export function DifficultyTag({ type, active, onClick }: DifficultyTagProps) {
  const baseClasses = "px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors";
  
  const typeClasses = {
    easy: active ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200',
    medium: active ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    hard: active ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800 hover:bg-red-200',
  };

  const textMap = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  };

  return (
    <span 
      className={cn(baseClasses, typeClasses[type])}
      onClick={onClick}
    >
      {textMap[type]}
    </span>
  );
}
