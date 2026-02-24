export interface Chapter {
  id: string;
  title: string;
  category: 'Foundation' | 'Tools' | 'Builds';
  readTime: string; // e.g., "5 min read"
  imageUrl: string;
  content: string; // Markdown-like string
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type Language = 'en' | 'es' | 'fr' | 'de';

export interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
}