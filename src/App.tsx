import { useEffect } from 'react';
import Header from './components/Header';
import NewsFeed from './components/NewsFeed';

export default function App() {
  useEffect(() => {
    const kakaoKey = (import.meta as any).env.VITE_KAKAO_JS_KEY;
    if (kakaoKey) {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoKey);
        console.log('Kakao SDK Initialized:', window.Kakao.isInitialized());
      }
    } else {
      console.warn('VITE_KAKAO_JS_KEY is missing in environment variables.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f9fb] dark:bg-[#0d0e12] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-16">
        <Header />
        <NewsFeed />
      </div>
    </div >
  );
}
