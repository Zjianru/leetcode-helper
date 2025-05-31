import { cn } from '@/lib/utils';

interface FilterToolbarProps {
  theme: 'light' | 'dark';
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStatus: 'all' | 'reviewed' | 'unreviewed';
  setSelectedStatus: (status: 'all' | 'reviewed' | 'unreviewed') => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  allTags: string[];
}

export function FilterToolbar({
  theme,
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedTags,
  setSelectedTags,
  allTags
}: FilterToolbarProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className={cn(
      "sticky top-16 z-40 p-4 rounded-xl shadow-md mb-4",
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
    )}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">搜索</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索题目ID或名称"
            className={cn(
              "w-full px-3 py-2 border rounded-md",
              theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            )}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">复习状态</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'reviewed' | 'unreviewed')}
            className={cn(
              "w-full px-3 py-2 border rounded-md",
              theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            )}
          >
            <option value="all">全部</option>
            <option value="reviewed">已复习</option>
            <option value="unreviewed">未复习</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">标签筛选</label>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm",
                  selectedTags.includes(tag) 
                    ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
