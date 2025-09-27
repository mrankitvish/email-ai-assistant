import { useState } from 'react';
import { Mail, Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { Settings } from './components/Settings';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { EmptyState } from './components/EmptyState';
import { useLocalStorage } from './hooks/useLocalStorage';
import { LLMService } from './services/llmService';
import { Message, Settings as SettingsType } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [settings, setSettings] = useLocalStorage<SettingsType>('email-ai-settings', {
    provider: 'pollinations',
    openaiApiKey: '',
    openaiBaseUrl: '',
    model: 'mistral',
    availableModels: []
  });

  const llmService = LLMService.getInstance();

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Validate settings for OpenAI provider
      if (settings.provider === 'openai' && !settings.openaiApiKey.trim()) {
        throw new Error('Please configure your OpenAI API key in settings before using OpenAI-compatible providers.');
      }

      const response = await llmService.generateEmail(content, settings);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        isEmail: true
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `**Error**: ${error instanceof Error ? error.message : 'Failed to generate email. Please try again.'}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        onSettingsClick={() => setIsSettingsOpen(true)}
        settings={settings}
      />
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="max-w-4xl mx-auto px-6 py-8">
              {messages.map(message => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-6">
                  <div className="flex items-start space-x-3 max-w-3xl">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
      
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
}

export default App;