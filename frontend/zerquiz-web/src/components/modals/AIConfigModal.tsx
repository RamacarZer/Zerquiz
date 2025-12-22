import React, { useState, useEffect } from 'react';
import { X, Save, Zap } from 'lucide-react';
import { AIConfiguration } from '@/services/api/systemService';

interface AIConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: Partial<AIConfiguration>) => void;
  config?: AIConfiguration | null;
}

export default function AIConfigModal({
  isOpen,
  onClose,
  onSave,
  config,
}: AIConfigModalProps) {
  const [formData, setFormData] = useState<Partial<AIConfiguration>>({
    provider: 'OpenAI',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    questionGenerationEnabled: true,
    contentSummarizationEnabled: true,
    autoTranslationEnabled: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? parseFloat(value)
          : type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              AI Yapılandırması
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Provider and Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                AI Sağlayıcı
              </label>
              <select
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              >
                <option value="OpenAI">OpenAI</option>
                <option value="Anthropic">Anthropic (Claude)</option>
                <option value="Google">Google (Gemini)</option>
                <option value="Azure">Azure OpenAI</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Model
              </label>
              <select
                name="model"
                value={formData.model}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {formData.provider === 'OpenAI' && (
                  <>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  </>
                )}
                {formData.provider === 'Anthropic' && (
                  <>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    <option value="claude-3-haiku">Claude 3 Haiku</option>
                  </>
                )}
                {formData.provider === 'Google' && (
                  <>
                    <option value="gemini-pro">Gemini Pro</option>
                    <option value="gemini-ultra">Gemini Ultra</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Temperature and Max Tokens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Temperature (0-1)
              </label>
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                min="0"
                max="1"
                step="0.1"
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Düşük değer daha tutarlı, yüksek değer daha yaratıcı sonuçlar verir
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Tokens
              </label>
              <input
                type="number"
                name="maxTokens"
                value={formData.maxTokens}
                onChange={handleChange}
                min="100"
                max="8000"
                step="100"
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Maksimum yanıt uzunluğu
              </p>
            </div>
          </div>

          {/* API Key (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Key (Opsiyonel)
            </label>
            <input
              type="password"
              name="apiKey"
              value={formData.apiKey || ''}
              onChange={handleChange}
              placeholder="sk-..."
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              API anahtarınızı buraya girebilirsiniz (sunucu tarafında saklanır)
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              AI Özellikleri
            </h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="checkbox"
                  name="questionGenerationEnabled"
                  checked={formData.questionGenerationEnabled}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mt-0.5 disabled:opacity-50"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Otomatik Soru Üretimi
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    AI ile içerikten otomatik olarak sorular üretilir
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="checkbox"
                  name="contentSummarizationEnabled"
                  checked={formData.contentSummarizationEnabled}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mt-0.5 disabled:opacity-50"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    İçerik Özetleme
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Uzun içerikler otomatik olarak özetlenir
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="checkbox"
                  name="autoTranslationEnabled"
                  checked={formData.autoTranslationEnabled}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mt-0.5 disabled:opacity-50"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Otomatik Çeviri
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    İçerikler otomatik olarak diğer dillere çevrilir
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Kaydet
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

