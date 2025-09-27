export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isEmail?: boolean;
}

export interface Settings {
  provider: 'openai' | 'pollinations';
  openaiApiKey: string;
  openaiBaseUrl: string;
  model: string;
  availableModels: string[];
}

export interface LLMProvider {
  generateEmail: (prompt: string, settings: Settings) => Promise<string>;
}