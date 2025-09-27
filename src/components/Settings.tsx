import { X, Globe, Cpu } from 'lucide-react';
import { Settings as SettingsType } from '../types';
import { LLMService } from '../services/llmService';
import { useEffect, useState } from 'react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsType;
  onSettingsChange: (settings: SettingsType) => void;
}

export function Settings({ isOpen, onClose, settings, onSettingsChange }: SettingsProps) {
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const llmService = LLMService.getInstance();

  useEffect(() => {
    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        let models: string[] = [];
        if (settings.provider === 'pollinations') {
          models = await llmService.fetchPollinationsModels();
        } else if (settings.provider === 'openai' && settings.openaiApiKey) {
          models = await llmService.fetchOpenAIModels(settings);
        }
        setAvailableModels(models);
        
        // Update settings with available models
        onSettingsChange({ ...settings, availableModels: models });
        
        // Set default model if current model is not in the list
        if (models.length > 0 && !models.includes(settings.model)) {
          const defaultModel = models.find(m => m.includes('gpt-3.5-turbo')) || models[0];
          onSettingsChange({ ...settings, model: defaultModel, availableModels: models });
        }
      } catch (error) {
        console.error('Failed to fetch models:', error);
      } finally {
        setLoadingModels(false);
      }
    };

    if (isOpen) {
      fetchModels();
    }
  }, [settings.provider, settings.openaiApiKey, isOpen]);

  if (!isOpen) return null;

  const handleChange = (key: keyof SettingsType, value: string) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handleProviderChange = (provider: 'openai' | 'pollinations') => {
    // Reset model when switching providers
    onSettingsChange({ 
      ...settings, 
      provider, 
      model: provider === 'pollinations' ? 'gpt-3.5-turbo' : 'gpt-3.5-turbo',
      availableModels: []
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              LLM Provider
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="provider"
                  value="openai"
                  checked={settings.provider === 'openai'}
                  onChange={(e) => handleProviderChange(e.target.value as 'openai')}
                  className="mr-3"
                />
                <Cpu className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">OpenAI Compatible</div>
                  <div className="text-sm text-gray-500">Use your own API key</div>
                </div>
              </label>
              
              <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="provider"
                  value="pollinations"
                  checked={settings.provider === 'pollinations'}
                  onChange={(e) => handleProviderChange(e.target.value as 'pollinations')}
                  className="mr-3"
                />
                <Globe className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Pollinations.ai</div>
                  <div className="text-sm text-gray-500">Free, no API key needed</div>
                </div>
              </label>
            </div>
          </div>

          {settings.provider === 'openai' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={settings.openaiApiKey}
                  onChange={(e) => handleChange('openaiApiKey', e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base URL (Optional)
                </label>
                <input
                  type="url"
                  value={settings.openaiBaseUrl}
                  onChange={(e) => handleChange('openaiBaseUrl', e.target.value)}
                  placeholder="https://api.openai.com/v1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model
                </label>
                <input
                  type="text"
                  value={settings.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  placeholder="gpt-3.5-turbo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Model Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model
          </label>
          {loadingModels ? (
            <div className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg bg-gray-50">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">Loading models...</span>
            </div>
          ) : availableModels.length > 0 ? (
            <select
              value={settings.model}
              onChange={(e) => handleChange('model', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {availableModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={settings.model}
              onChange={(e) => handleChange('model', e.target.value)}
              placeholder="Enter model name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}