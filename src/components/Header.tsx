import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-gray-100 dark:border-gray-800">
      <div className="title-area flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-brand rounded-full"></span>
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Curated Intelligence</span>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">
            AI<span className="text-brand mx-0.5">/</span>AX NEWS FEED
          </h1>
          <p className="mt-3 text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            인공지능과 디지털 혁신의 흐름을 <br className="md:hidden" /> 가장 명확한 시선으로 읽어드립니다.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsDark(!isDark)}
          className="group inline-flex items-center gap-2.5 font-bold text-[11px] text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-4 py-2.5 rounded-full transition-all hover:border-brand/30"
          title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
        >
          {isDark ? (
            <Sun className="w-3.5 h-3.5 transition-transform group-hover:rotate-45" />
          ) : (
            <Moon className="w-3.5 h-3.5 transition-transform group-hover:-rotate-12" />
          )}
          <span className="uppercase tracking-widest">{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </header>
  );
}
