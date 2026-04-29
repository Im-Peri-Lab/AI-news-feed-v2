import { ExternalLink, Link2, Share2, MessageSquare, Send } from 'lucide-react';
import { Article, Category } from '../types';
import { TAGS, CATEGORY_COLORS } from '../constants/tags';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState, useRef, useEffect } from 'react';

interface NewsCardProps {
  article: Article;
}

export default function NewsCard({ article }: NewsCardProps) {
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const copyMenuRef = useRef<HTMLDivElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  const displayTime = format(new Date(article.publishedAt), 'yyyy.MM.dd HH:mm', { locale: ko });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (copyMenuRef.current && !copyMenuRef.current.contains(event.target as Node)) {
        setShowCopyMenu(false);
      }
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = (mode: 'url' | 'both') => {
    const text = mode === 'url' ? article.url : `${article.title}\n${article.url}`;
    navigator.clipboard.writeText(text);
    alert('복사되었습니다.');
    setShowCopyMenu(false);
  };

  const handleShare = (target: 'kakao' | 'teams') => {
    if (target === 'kakao') {
      const Kakao = window.Kakao;
      if (Kakao && Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: article.title,
            description: article.source + ' | ' + displayTime,
            imageUrl: 'https://ais-pre-asshw6w3ofbzebxce7exft-554198756217.asia-east1.run.app/favicon.ico', // 기본 아이콘 사용 가능
            link: {
              mobileWebUrl: article.url,
              webUrl: article.url,
            },
          },
          buttons: [
            {
              title: '기사 보기',
              link: {
                mobileWebUrl: article.url,
                webUrl: article.url,
              },
            },
          ],
        });
      } else {
        alert('카카오 SDK 초기화에 실패했습니다. 자바스크립트 키 설정을 확인해주세요.');
      }
    } else {
      const teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=&message=${encodeURIComponent(article.title + '\n' + article.url)}`;
      window.open(teamsUrl, '_blank');
    }
    setShowShareMenu(false);
  };

  return (
    <article className="group relative bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-5 md:p-6 transition-all hover:bg-gray-50 dark:hover:bg-white/[0.03] grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
      <div className="w-full">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-tighter">{article.source}</span>
        </div>
        
        <h2 className="text-lg md:text-xl font-extrabold leading-snug tracking-tight text-gray-900 dark:text-white mb-3">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="transition-colors group-hover:text-brand inline-flex items-center gap-1.5 flex-wrap">
            {article.title}
          </a>
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-flex ml-2 text-gray-300 hover:text-brand transition-colors">
            <ExternalLink className="w-4 h-4" />
          </a>
        </h2>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {article.tags.map(tagName => {
            const tagSpec = TAGS.find(t => t.name === tagName);
            const color = tagSpec ? CATEGORY_COLORS[tagSpec.category] : CATEGORY_COLORS[Category.ALL];
            return (
              <span 
                key={tagName}
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-black border",
                  color.bg, color.text, color.border
                )}
              >
                {tagName}
              </span>
            );
          })}
        </div>

        {/* Time Info at Bottom */}
        <div className="text-[11px] text-gray-400 font-medium">
          {displayTime}
        </div>
      </div>

      <div className="flex justify-end gap-3 self-center relative">
        {/* Copy Menu */}
        <div className="relative" ref={copyMenuRef}>
          <button 
            onClick={() => setShowCopyMenu(!showCopyMenu)}
            className="p-2.5 text-gray-400 hover:text-brand bg-gray-50 dark:bg-gray-700 rounded-full transition-colors"
            title="복사 옵션"
          >
            <Link2 className="w-5 h-5" />
          </button>
          {showCopyMenu && (
            <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden transform origin-top-right">
              <button 
                onClick={() => handleCopy('url')}
                className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700"
              >
                링크만 복사
              </button>
              <button 
                onClick={() => handleCopy('both')}
                className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                제목 + 링크 복사
              </button>
            </div>
          )}
        </div>

        {/* Share Menu */}
        <div className="relative" ref={shareMenuRef}>
          <button 
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="p-2.5 text-gray-400 hover:text-brand bg-gray-50 dark:bg-gray-700 rounded-full transition-colors"
            title="공유"
          >
            <Share2 className="w-5 h-5" />
          </button>
          {showShareMenu && (
            <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden transform origin-top-right">
              <button 
                onClick={() => handleShare('kakao')}
                className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2.5"
              >
                <div className="w-5 h-5 shrink-0 shadow-sm overflow-hidden rounded-md flex items-center justify-center bg-[#FEE500]">
                  <svg viewBox="0 0 48 48" className="w-full h-full">
                    <rect width="48" height="48" fill="#FEE500"/>
                    <path d="M24 10c-8.837 0-16 5.671-16 12.667 0 4.542 3.056 8.52 7.643 10.74l-1.94 7.108c-.12.438.39.814.767.565l8.36-5.514c.386.046.777.068 1.17.068 8.837 0 16-5.671 16-12.667S32.837 10 24 10z" fill="#3C1E1E"/>
                  </svg>
                </div>
                카톡 공유
              </button>
              <button 
                onClick={() => handleShare('teams')}
                className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2.5"
              >
                <div className="w-5 h-5 shrink-0 shadow-sm overflow-hidden rounded-md flex items-center justify-center bg-[#4B53BC]">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path fill="#4B53BC" d="M0 0h24v24H0z"/>
                    <path fill="#FFF" d="M11.5 6.5s.5-.5 1.5-.5 1.5.5 1.5.5V11s1 0 1.5.5 1 2 1 2 .5 1 .5 2v3h-5.5v-3s0-1 .5-2 1.5-3 1.5-3H11v-4h.5zM7 9h4v8H7V9z"/>
                  </svg>
                </div>
                Teams 공유
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
