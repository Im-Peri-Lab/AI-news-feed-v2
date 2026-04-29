import { Category, TagSpec } from '../types';

export const TAGS: TagSpec[] = [
  // 기술
  { id: 'gen-ai', name: '생성형 AI', category: Category.TECH, keywords: ['생성형 AI', 'generative AI', '생성형 인공지능'] },
  { id: 'llm', name: 'LLM', category: Category.TECH, keywords: ['LLM', '대규모 언어모델', '언어모델', 'Large Language Model'] },
  { id: 'ai-agent', name: 'AI 에이전트', category: Category.TECH, keywords: ['AI 에이전트', 'agent', '에이전틱', 'autonomous agent'] },
  { id: 'multimodal', name: '멀티모달 AI', category: Category.TECH, keywords: ['멀티모달', '이미지 생성', '영상 생성', 'multimodal'] },
  { id: 'npu', name: 'AI 반도체', category: Category.TECH, keywords: ['AI 반도체', 'GPU', 'NPU', 'HBM', '엔비디아 반도체'] },
  { id: 'ai-security', name: 'AI 보안', category: Category.TECH, keywords: ['AI 보안', '보안 AI', '사이버 보안 AI', 'AI security'] },
  
  // 모델
  { id: 'gpt', name: 'GPT', category: Category.MODEL, keywords: ['GPT', 'ChatGPT', 'GPT-4', 'GPT-5'] },
  { id: 'claude', name: 'Claude', category: Category.MODEL, keywords: ['Claude', '클로드', 'Anthropic Claude'] },
  { id: 'gemini', name: 'Gemini', category: Category.MODEL, keywords: ['Gemini', '제미나이', 'Google Gemini'] },
  { id: 'exaone', name: 'Exaone', category: Category.MODEL, keywords: ['Exaone', 'EXAONE', '엑사원'] },
  
  // 글로벌
  { id: 'openai', name: 'OpenAI', category: Category.GLOBAL, keywords: ['OpenAI', '오픈에이아이', 'ChatGPT'] },
  { id: 'google', name: 'Google', category: Category.GLOBAL, keywords: ['Google', '구글', 'DeepMind', 'Gemini'] },
  { id: 'ms', name: 'Microsoft', category: Category.GLOBAL, keywords: ['Microsoft', '마이크로소프트', 'Copilot', 'Azure AI'] },
  { id: 'nvidia', name: 'NVIDIA', category: Category.GLOBAL, keywords: ['NVIDIA', '엔비디아'] },
  { id: 'amazon', name: 'Amazon', category: Category.GLOBAL, keywords: ['Amazon', '아마존', 'AWS', 'Bedrock'] },
  { id: 'meta', name: 'Meta', category: Category.GLOBAL, keywords: ['Meta', '메타', 'Llama'] },
  { id: 'anthropic', name: 'Anthropic', category: Category.GLOBAL, keywords: ['Anthropic', '앤스로픽', 'Claude'] },
  
  // 국내
  { id: 'naver-ai', name: '네이버 AI', category: Category.DOMESTIC, keywords: ['네이버 AI', '하이퍼클로바', 'HyperCLOVA', '네이버클라우드'] },
  { id: 'sk-ai', name: 'SK AI', category: Category.DOMESTIC, keywords: ['SK AI', 'SK텔레콤 AI', '에이닷', 'A.', 'SKT AI'] },
  { id: 'kt-ai', name: 'KT AI', category: Category.DOMESTIC, keywords: ['KT AI', 'KT 인공지능', '믿음', 'Mi:dm'] },
  { id: 'lg-ai', name: 'LG AI', category: Category.DOMESTIC, keywords: ['LG AI', 'LG AI연구원', '엑사원', 'EXAONE'] },
  { id: 'samsung-ai', name: '삼성 AI', category: Category.DOMESTIC, keywords: ['삼성 AI', 'Samsung AI', '갤럭시 AI', '가우스'] },
  { id: 'kakao-ai', name: '카카오 AI', category: Category.DOMESTIC, keywords: ['카카오 AI', 'Kakao AI', '카나나'] },
  { id: 'saltlux', name: '솔트룩스', category: Category.DOMESTIC, keywords: ['솔트룩스', 'Saltlux'] },
  { id: 'wrtn', name: '뤼튼', category: Category.DOMESTIC, keywords: ['뤼튼', 'Wrtn', '뤼튼테크놀로지스'] },
  { id: 'upstage', name: '업스테이지', category: Category.DOMESTIC, keywords: ['업스테이지', 'Upstage', 'Solar'] },
];

export const CATEGORY_COLORS: Record<Category, { bg: string, text: string, border: string }> = {
  [Category.ALL]: { bg: 'bg-brand-light', text: 'text-brand', border: 'border-brand/20' },
  [Category.GLOBAL]: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100' },
  [Category.DOMESTIC]: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
  [Category.TECH]: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
  [Category.MODEL]: { bg: 'bg-brand-light', text: 'text-brand', border: 'border-brand/20' },
};
