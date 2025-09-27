import { User, Mail, Copy, Check, Sparkles, BotIcon } from 'lucide-react';
import { Message } from '../types';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.type === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex items-start space-x-3 max-w-3xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
        }`}>
          {isUser ? <User className="w-4 h-4" /> : <BotIcon className="w-4 h-4" />}
        </div>
        
        <div className={`relative group ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-white border border-gray-200'
        } rounded-2xl px-4 py-3 shadow-sm`}>
          {!isUser && message.isEmail && (
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1.5 hover:bg-gray-100 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              title="Copy email"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
          
          <div className={`prose prose-sm max-w-none ${
            isUser ? 'prose-invert' : ''
          }`}>
            {isUser ? (
              <p className="whitespace-pre-wrap m-0">{message.content}</p>
            ) : (
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="m-0 mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
          
          <div className={`text-xs mt-2 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
}