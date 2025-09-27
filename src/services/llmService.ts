import OpenAI from 'openai';
import { Settings } from '../types';

export interface ModelInfo {
  id: string;
  object: string;
  created?: number;
  owned_by?: string;
}

export class LLMService {
  private static instance: LLMService;
  private openaiClient: OpenAI | null = null;
  private pollinationsModels: string[] = [];

  private constructor() {}

  static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  async fetchPollinationsModels(): Promise<string[]> {
    try {
      const response = await fetch('https://text.pollinations.ai/openai/models');
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }
      const data = await response.json();
      const models = data.data?.map((model: ModelInfo) => model.id) || [];
      this.pollinationsModels = models;
      return models;
    } catch (error) {
      console.error('Error fetching Pollinations models:', error);
      // Return fallback models if API fails
      const fallbackModels = ['mistral'];
      this.pollinationsModels = fallbackModels;
      return fallbackModels;
    }
  }

  async fetchOpenAIModels(settings: Settings): Promise<string[]> {
    try {
      this.initializeOpenAI(settings);
      if (!this.openaiClient) {
        throw new Error('OpenAI client not initialized');
      }
      
      const models = await this.openaiClient.models.list();
      return models.data.map(model => model.id).sort();
    } catch (error) {
      console.error('Error fetching OpenAI models:', error);
      // Return common OpenAI models as fallback
      return ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o'];
    }
  }

  private initializeOpenAI(settings: Settings) {
    if (settings.provider === 'openai' && settings.openaiApiKey) {
      this.openaiClient = new OpenAI({
        apiKey: settings.openaiApiKey,
        baseURL: settings.openaiBaseUrl || 'https://api.openai.com/v1',
        dangerouslyAllowBrowser: true
      });
    }
  }

  private async generateWithOpenAI(prompt: string, settings: Settings): Promise<string> {
    this.initializeOpenAI(settings);
    
    if (!this.openaiClient) {
      throw new Error('OpenAI client not initialized. Please check your API key.');
    }

    const systemPrompt = `You are an expert email writing assistant. Your task is to help users create professional, clear, and effective emails based on their requirements.

Guidelines:
- Create well-structured emails with appropriate subject lines
- Use professional tone unless otherwise specified
- Include proper greetings and closings
- Make the content clear and concise
- Adapt the tone and formality based on the context provided
- If the user asks for email optimization, improve the existing content while maintaining the original intent

Format your response as a complete email including:
- Subject line (marked as "Subject: ")
- Email body with proper formatting
- Professional closing when appropriate`;

    try {
      const completion = await this.openaiClient.chat.completions.create({
        model: settings.model || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return completion.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate email with OpenAI. Please check your API key and settings.');
    }
  }

  private async generateWithPollinations(prompt: string, settings: Settings): Promise<string> {
    try {
      const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert email writing assistant. Create professional, clear emails based on user requirements.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          model: settings.model || 'gpt-3.5-turbo',
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Pollinations API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result.choices?.[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('Pollinations API error:', error);
      throw new Error('Failed to generate email with Pollinations.ai. Please try again or select different model from settings.');
    }
  }

  async generateEmail(prompt: string, settings: Settings): Promise<string> {
    if (settings.provider === 'pollinations') {
      return this.generateWithPollinations(prompt, settings);
    } else {
      return this.generateWithOpenAI(prompt, settings);
    }
  }
}