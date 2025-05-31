
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useState } from 'react';


interface BatchImportPanelProps {
  theme: 'light' | 'dark';
}

export function BatchImportPanel({ theme }: BatchImportPanelProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    // Simulate import from file
    if (file) {
      toast.success(`成功导入文件: ${file.name}`);
      setFile(null);
    } else {
      // Simulate import from history
      toast.success('已导入历史记录');
    }
  };

  return (
    <div className={cn(
      "p-6 rounded-xl shadow-md",
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
    )}>
      <h2 className="text-2xl font-bold mb-6">批量导入</h2>
      <div className="mb-6">
        <label className="block mb-2 font-medium">上传文件</label>
        <div className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center",
          theme === 'dark' ? 'border-gray-600' : 'border-gray-300',
          file ? 'bg-blue-50 border-blue-300' : ''
        )}>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center justify-center">
              <i className="fa-solid fa-cloud-arrow-up text-4xl mb-2"></i>
              <p className="mb-1">
                {file ? file.name : '点击或拖拽文件到此处'}
              </p>
              <p className="text-sm opacity-70">
                {file ? '' : '支持JSON、CSV格式'}
              </p>
            </div>
          </label>
        </div>
      </div>
      <div className="mb-6">
        <p className="text-sm opacity-70 mb-2">或从历史记录导入</p>
        <button
          onClick={handleImport}
          className={cn(
            "w-full py-2 px-4 rounded-md font-medium transition-colors",
            theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600',
            "text-white"
          )}
        >
          导入历史记录
        </button>
      </div>
    </div>
  );
}
