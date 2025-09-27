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
          Effortlessly craft professional, clear, and effective emails in seconds with our AI Email Assistant.
          </p>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Simply describe your message, whether it's for sales, customer support, or marketing,
          and let AI generate the perfect draft.
        </p>
        
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center space-x-1 text-gray-500">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span>Intuitive conversational interface for natural and efficient email requests</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-500">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Advanced AI-powered content optimization and intelligent email generation</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-500">
            <Mail className="w-4 h-4 text-purple-500" />
            <span>Automated professional formatting and adaptable tone adjustment for any audience</span>
          </div>
        </div>
      </div>
    </div>
  );
}