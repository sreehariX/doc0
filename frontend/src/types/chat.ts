export interface ChatResponse {
  query: string;
  timestamp: string;
  results: {
    document: string;
    metadata: {
      char_count: number;
      techStackName: string;
      token_count: number;
      url: string;
    };
    similarity_score: number;
  }[];
  summary: string;
}

export type Framework = 'react' | 'angular' | 'astro' | 'vue';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    title: string;
    url: string;
  }>;
  timestamp: string;
  codeBlocks?: string[];
}