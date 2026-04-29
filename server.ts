import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Parser from 'rss-parser';
import crypto from 'crypto';
import { format } from 'date-fns';

const app = express();
const parser = new Parser();

// Core Tagging Logic (Shared or implemented here)
const TAGS = [
  { id: 'gen-ai', name: '생성형 AI', category: '기술', keywords: ['생성형 AI', 'generative AI', '생성형 인공지능'] },
  { id: 'llm', name: 'LLM', category: '기술', keywords: ['LLM', '대규모 언어모델', '언어모델', 'Large Language Model'] },
  { id: 'ai-agent', name: 'AI 에이전트', category: '기술', keywords: ['AI 에이전트', 'agent', '에이전틱', 'autonomous agent'] },
  { id: 'multimodal', name: '멀티모달 AI', category: '기술', keywords: ['멀티모달', '이미지 생성', '영상 생성', 'multimodal'] },
  { id: 'npu', name: 'AI 반도체', category: '기술', keywords: ['AI 반도체', 'GPU', 'NPU', 'HBM', '엔비디아 반도체'] },
  { id: 'ai-security', name: 'AI 보안', category: '기술', keywords: ['AI 보안', '보안 AI', '사이버 보안 AI', 'AI security'] },
  { id: 'gpt', name: 'GPT', category: '모델', keywords: ['GPT', 'ChatGPT', 'GPT-4', 'GPT-5'] },
  { id: 'claude', name: 'Claude', category: '모델', keywords: ['Claude', '클로드', 'Anthropic Claude'] },
  { id: 'gemini', name: 'Gemini', category: '모델', keywords: ['Gemini', '제미나이', 'Google Gemini'] },
  { id: 'exaone', name: 'Exaone', category: '모델', keywords: ['Exaone', 'EXAONE', '엑사원'] },
  { id: 'openai', name: 'OpenAI', category: '글로벌', keywords: ['OpenAI', '오픈에이아이', 'ChatGPT'] },
  { id: 'google', name: 'Google', category: '글로벌', keywords: ['Google', '구글', 'DeepMind', 'Gemini'] },
  { id: 'ms', name: 'Microsoft', category: '글로벌', keywords: ['Microsoft', '마이크로소프트', 'Copilot', 'Azure AI'] },
  { id: 'nvidia', name: 'NVIDIA', category: '글로벌', keywords: ['NVIDIA', '엔비디아'] },
  { id: 'amazon', name: 'Amazon', category: '글로벌', keywords: ['Amazon', '아마존', 'AWS', 'Bedrock'] },
  { id: 'meta', name: 'Meta', category: '글로벌', keywords: ['Meta', '메타', 'Llama'] },
  { id: 'anthropic', name: 'Anthropic', category: '글로벌', keywords: ['Anthropic', '앤스로픽', 'Claude'] },
  { id: 'naver-ai', name: '네이버 AI', category: '국내', keywords: ['네이버 AI', '하이퍼클로바', 'HyperCLOVA', '네이버클라우드'] },
  { id: 'sk-ai', name: 'SK AI', category: '국내', keywords: ['SK AI', 'SK텔레콤 AI', '에이닷', 'A.', 'SKT AI'] },
  { id: 'kt-ai', name: 'KT AI', category: '국내', keywords: ['KT AI', 'KT 인공지능', '믿음', 'Mi:dm'] },
  { id: 'lg-ai', name: 'LG AI', category: '국내', keywords: ['LG AI', 'LG AI연구원', '엑사원', 'EXAONE'] },
  { id: 'samsung-ai', name: '삼성 AI', category: '국내', keywords: ['삼성 AI', 'Samsung AI', '갤럭시 AI', '가우스'] },
  { id: 'kakao-ai', name: '카카오 AI', category: '국내', keywords: ['카카오 AI', 'Kakao AI', '카나나'] },
  { id: 'saltlux', name: '솔트룩스', category: '국내', keywords: ['솔트룩스', 'Saltlux'] },
  { id: 'wrtn', name: '뤼튼', category: '국내', keywords: ['뤼튼', 'Wrtn', '뤼튼테크놀로지스'] },
  { id: 'upstage', name: '업스테이지', category: '국내', keywords: ['업스테이지', 'Upstage', 'Solar'] },
];

const SEARCH_QUERIES = ["AI", "인공지능", "생성형 AI", "LLM", "AI 에이전트", "AI 반도체", "AX"];

// In-memory store (PRD suggests Sheets, but for this environment we use a variable)
let articleStore: any[] = [];

function generateId(url: string) {
  return crypto.createHash('md5').update(url).digest('hex');
}

function processArticle(item: any) {
  let title = item.title || '';
  let source = item.creator || item.author || 'AI News';
  
  // Google News RSS titles usually end with " - Source Name"
  const sourceMatch = title.match(/(.*) - (.*)$/);
  if (sourceMatch) {
    title = sourceMatch[1].trim();
    source = sourceMatch[2].trim();
  }

  const url = item.link || '';
  const pubDate = new Date(item.pubDate);
  const isoDate = pubDate.toISOString();
  const dateString = format(pubDate, 'yyyy-MM-dd');

  const tags: string[] = [];
  const categories: string[] = [];
  const matchedTerms: string[] = [];

  TAGS.forEach(tag => {
    const isMatched = tag.keywords.some(keyword => 
      title.toLowerCase().includes(keyword.toLowerCase())
    );
    if (isMatched) {
      if (!tags.includes(tag.name)) tags.push(tag.name);
      if (!categories.includes(tag.category)) categories.push(tag.category);
      matchedTerms.push(tag.name);
    }
  });

  return {
    id: generateId(url),
    title,
    url,
    source,
    publishedAt: isoDate,
    publishedDate: dateString,
    tags,
    categories,
    matchedTerms,
    collector: 'google_news_rss',
    fetchedAt: new Date().toISOString()
  };
}

async function fetchNews() {
  const allResults: any[] = [];
  const seenUrls = new Set<string>();

  const fetchPromises = SEARCH_QUERIES.map(async query => {
    try {
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`;
      const feed = await parser.parseURL(url);
      return feed.items;
    } catch (e) {
      console.error(`Fetch error for ${query}:`, e);
      return [];
    }
  });

  const results = await Promise.all(fetchPromises);
  const flattened = results.flat();

  flattened.forEach(item => {
    if (!item.link || seenUrls.has(item.link)) return;
    seenUrls.add(item.link);
    allResults.push(processArticle(item));
  });

  // Unique by URL/ID
  const uniqueResults = allResults.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
  
  // Merge with store
  const existingIds = new Set(articleStore.map(a => a.id));
  const newArticles = uniqueResults.filter(a => !existingIds.has(a.id));
  
  articleStore = [...newArticles, ...articleStore].slice(0, 1000); // Keep last 1000
}

async function startServer() {
  const PORT = 3000;

  // Initial fetch
  await fetchNews();

  app.get('/api/news', (req, res) => {
    const { date } = req.query;
    let filtered = articleStore;
    if (date) {
      filtered = articleStore.filter(a => a.publishedDate === date);
    }
    // Sort by latest
    filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    res.json({ total: filtered.length, articles: filtered });
  });

  app.post('/api/fetch', async (req, res) => {
    const beforeCount = articleStore.length;
    await fetchNews();
    const afterCount = articleStore.length;
    res.json({ saved: afterCount - beforeCount, total: afterCount });
  });

  app.get('/api/tags', (req, res) => {
    res.json({ tags: TAGS });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
