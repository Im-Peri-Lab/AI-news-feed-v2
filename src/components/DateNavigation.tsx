import { Calendar, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useRef } from 'react';

interface DateNavigationProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: string;
}

export default function DateNavigation({ 
  currentDate, 
  setCurrentDate, 
  onRefresh, 
  isRefreshing,
  lastUpdated
}: DateNavigationProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  
  const formattedDate = format(currentDate, 'yyyy.MM.dd (eee)', { locale: ko });
  const isToday = format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
      <div className="flex flex-1 gap-3 items-center min-w-0">
        <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 h-12 md:h-14 flex-1 md:flex-none relative overflow-hidden shadow-sm">
          <button 
            onClick={() => setCurrentDate(subDays(currentDate, 1))}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors shrink-0"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <div 
            onClick={() => dateInputRef.current?.showPicker?.()}
            className="flex-1 flex items-center justify-center gap-3 px-2 font-medium text-lg text-gray-900 dark:text-white whitespace-nowrap relative cursor-pointer group"
          >
            <Calendar className="w-5 h-5 text-brand" />
            <span>{formattedDate}</span>
            <input 
              ref={dateInputRef}
              type="date"
              value={format(currentDate, 'yyyy-MM-dd')}
              onChange={(e) => {
                if (e.target.value) setCurrentDate(new Date(e.target.value));
              }}
              max={format(new Date(), 'yyyy-MM-dd')}
              className="absolute inset-0 opacity-0 pointer-events-none w-0 h-0"
              title="날짜 선택"
            />
          </div>

          <button 
            onClick={() => setCurrentDate(addDays(currentDate, 1))}
            disabled={isToday}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <button 
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center justify-center gap-2 font-bold px-4 md:px-6 h-12 md:h-14 bg-brand hover:bg-brand-hover text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-light dark:shadow-none"
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? '수집중' : '조회'}</span>
        </button>
      </div>

      <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end gap-2">
        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">업데이트: {lastUpdated || '-'}</span>
      </div>
    </div>
  );
}
