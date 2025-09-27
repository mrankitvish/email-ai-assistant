import { Mail, MessageSquare, Sparkles } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          AI Email Assistant
        </h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Describe the email you want to create, and I'll help you craft professional, 
          clear, and effective messages in seconds.
        </p>
        
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-center space-x-3 text-gray-500">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span>Conversational interface for natural email requests</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-500">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>AI-powered content optimization and generation</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-500">
            <Mail className="w-4 h-4 text-purple-500" />
            <span>Professional formatting and tone adjustment</span>
          </div>
        </div>
      </div>
    </div>
  );
}