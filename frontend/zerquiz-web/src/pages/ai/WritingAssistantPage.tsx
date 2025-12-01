// Writing Assistant Page - AI-powered writing tools

import { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Wand2, CheckCircle, Copy, RotateCcw } from 'lucide-react';

type WritingTool = 'grammar' | 'clarity' | 'expand' | 'shorten' | 'tone' | 'translate' | 'restructure' | 'keywords';

interface WritingToolConfig {
  id: WritingTool;
  labelKey: string;
  icon: string;
  color: string;
}

const writingTools: WritingToolConfig[] = [
  { id: 'grammar', labelKey: 'Grammar & Spelling', icon: '✓', color: 'bg-green-500' },
  { id: 'clarity', labelKey: 'Improve Clarity', icon: '💡', color: 'bg-blue-500' },
  { id: 'expand', labelKey: 'Expand Text', icon: '📝', color: 'bg-purple-500' },
  { id: 'shorten', labelKey: 'Shorten Text', icon: '✂️', color: 'bg-orange-500' },
  { id: 'tone', labelKey: 'Change Tone', icon: '🎭', color: 'bg-pink-500' },
  { id: 'translate', labelKey: 'Translate', icon: '🌍', color: 'bg-teal-500' },
  { id: 'restructure', labelKey: 'Restructure', icon: '🔄', color: 'bg-indigo-500' },
  { id: 'keywords', labelKey: 'Extract Keywords', icon: '🔑', color: 'bg-yellow-500' },
];

export default function WritingAssistantPage() {
  const { t } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedTool, setSelectedTool] = useState<WritingTool>('grammar');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Mock AI response based on tool
      let result = inputText;
      
      switch (selectedTool) {
        case 'grammar':
          result = `✅ Corrected text:\n\n${inputText}\n\n(Grammar and spelling checked)`;
          break;
        case 'clarity':
          result = `✨ Improved version:\n\n${inputText}\n\n(More clear and concise)`;
          break;
        case 'expand':
          result = `📝 Expanded version:\n\n${inputText}\n\nThis text has been expanded with more details and context to provide a fuller explanation...`;
          break;
        case 'shorten':
          result = inputText.slice(0, Math.floor(inputText.length / 2)) + '...';
          break;
        case 'tone':
          result = `🎭 Formal tone:\n\n${inputText.replace(/!/g, '.').replace(/\?/g, '.')}`;
          break;
        case 'translate':
          result = `🌍 Translation:\n\n[Translated version of the text]`;
          break;
        case 'restructure':
          result = `🔄 Restructured:\n\n${inputText.split('.').reverse().join('. ')}`;
          break;
        case 'keywords':
          result = `🔑 Keywords:\n\n• Keyword 1\n• Keyword 2\n• Keyword 3`;
          break;
      }
      
      setOutputText(result);
      setLoading(false);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          {t('writing_assistant')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered tools to improve your writing
        </p>
      </div>

      {/* Tool Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Select Tool
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {writingTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`
                p-4 rounded-lg border-2 transition-all text-left
                ${selectedTool === tool.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }
              `}
            >
              <div className="text-2xl mb-2">{tool.icon}</div>
              <div className="text-sm font-medium text-gray-800 dark:text-white">
                {tool.labelKey}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Input/Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Original Text
            </h2>
            <button
              onClick={handleReset}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            placeholder="Enter your text here..."
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !inputText.trim()}
            className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate
              </>
            )}
          </button>
        </div>

        {/* Output */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              AI Result
            </h2>
            {outputText && (
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white overflow-y-auto whitespace-pre-wrap">
            {outputText || (
              <div className="text-gray-400 italic">
                AI-generated result will appear here...
              </div>
            )}
          </div>
          {outputText && (
            <div className="mt-4 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              Text processed successfully
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          💡 Tips for Better Results
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• Provide context: More text gives better AI suggestions</li>
          <li>• Be specific: Choose the right tool for your goal</li>
          <li>• Review output: AI suggestions may need human refinement</li>
          <li>• Iterate: Try multiple tools for best results</li>
        </ul>
      </div>
    </div>
  );
}
