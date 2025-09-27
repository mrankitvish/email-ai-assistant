import { Send, Loader2 } from 'lucide-react';
import { useState, FormEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the email you want to create... (e.g., 'Write a follow-up email to a client about project status')"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
              rows={3}
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`p-3 rounded-xl transition-all ${
              message.trim() && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            'Write a professional follow-up email',
            'Create a meeting request email',
            'Draft a thank you email after interview',
            'Write a project update email'
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => !isLoading && setMessage(suggestion)}
              disabled={isLoading}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}