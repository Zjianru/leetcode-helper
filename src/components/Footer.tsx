import { cn } from '@/lib/utils';

interface FooterProps {
  theme: 'light' | 'dark';
}

export function Footer({ theme }: FooterProps) {
  return (
    <footer className={cn(
      "py-4 border-t",
      theme === 'dark' ? 'bg-[#0077CC] border-gray-700 text-white' : 'bg-[#1E90FF] border-gray-200 text-white'
    )}>
      <div className="container mx-auto px-4 text-center">
        <p>© 2025 LeetCode刷题助手 - 个人版</p>
      </div>
    </footer>
  );
}