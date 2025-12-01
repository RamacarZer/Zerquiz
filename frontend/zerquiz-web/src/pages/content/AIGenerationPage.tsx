// AI Generation Page - 3-step wizard for generating content from PDFs

import { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { 
  FileText, Brain, BookOpen, CheckSquare, ArrowRight, 
  ArrowLeft, Sparkles, Settings, Languages 
} from 'lucide-react';

type GenerationType = 'quiz' | 'flashcards' | 'summary' | 'worksheet';
type Difficulty = 'easy' | 'medium' | 'hard';

const questionTypes = [
  { id: 'mcq_single', name: 'Multiple Choice (Single)', category: 'Classic' },
  { id: 'mcq_multiple', name: 'Multiple Choice (Multiple)', category: 'Classic' },
  { id: 'true_false', name: 'True/False', category: 'Classic' },
  { id: 'short_answer', name: 'Short Answer', category: 'Classic' },
  { id: 'essay', name: 'Essay', category: 'Classic' },
  { id: 'fill_blank', name: 'Fill in the Blank', category: 'Classic' },
  { id: 'drag_drop', name: 'Drag & Drop', category: 'Interactive' },
  { id: 'hotspot', name: 'Hotspot', category: 'Interactive' },
  { id: 'matching', name: 'Matching Pairs', category: 'Interactive' },
  { id: 'ordering', name: 'Ordering/Sequence', category: 'Interactive' },
];

export default function AIGenerationPage() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [generationType, setGenerationType] = useState<GenerationType>('quiz');
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>(['mcq_single']);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [count, setCount] = useState(10);
  const [language, setLanguage] = useState('tr');
  const [generating, setGenerating] = useState(false);

  const generationTypes = [
    { id: 'quiz', name: 'Quiz', icon: Brain, color: 'from-purple-500 to-pink-500', desc: 'Generate questions from content' },
    { id: 'flashcards', name: 'Flashcards', icon: FileText, color: 'from-green-500 to-teal-500', desc: 'Create study cards' },
    { id: 'summary', name: 'Summary', icon: BookOpen, color: 'from-blue-500 to-indigo-500', desc: 'AI-generated summary' },
    { id: 'worksheet', name: 'Worksheet', icon: CheckSquare, color: 'from-orange-500 to-red-500', desc: 'Practice worksheet' },
  ];

  const toggleQuestionType = (id: string) => {
    setSelectedQuestionTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    setGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setGenerating(false);
      alert('Content generated successfully!');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-8 h-8" />
          <h1 className="text-3xl font-bold">{t('ai_generation')}</h1>
        </div>
        <p className="text-purple-100 text-lg">
          Transform your content into engaging learning materials with AI
        </p>
      </div>

      {/* Steps Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Select Source' },
            { num: 2, label: 'Choose Type' },
            { num: 3, label: 'Configure & Generate' },
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    ${step >= s.num
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }
                  `}
                >
                  {s.num}
                </div>
                <span className="text-xs mt-2 text-gray-600 dark:text-gray-400 text-center">
                  {s.label}
                </span>
              </div>
              {idx < 2 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    step > s.num ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Select Source */}
      {step === 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Step 1: Select Content Source
          </h2>
          <div className="space-y-4 mb-6">
            {['Introduction to AI.pdf', 'Machine Learning Basics.pdf', 'Data Science Guide.docx'].map((file) => (
              <button
                key={file}
                onClick={() => setSelectedSource(file)}
                className={`
                  w-full p-4 rounded-lg border-2 transition-all text-left
                  ${selectedSource === file
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">{file}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">2.5 MB • 45 pages</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!selectedSource}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next: Choose Type
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Step 2: Choose Generation Type */}
      {step === 2 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Step 2: Choose Generation Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {generationTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setGenerationType(type.id as GenerationType)}
                className={`
                  p-6 rounded-xl border-2 transition-all text-left
                  ${generationType === type.id
                    ? 'border-purple-500 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${type.color} flex items-center justify-center mb-3`}>
                  <type.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-1">{type.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{type.desc}</p>
              </button>
            ))}
          </div>

          {generationType === 'quiz' && (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                Select Question Types (26 available)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {questionTypes.slice(0, 9).map((type) => (
                  <label
                    key={type.id}
                    className={`
                      flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all
                      ${selectedQuestionTypes.includes(type.id)
                        ? 'bg-purple-200 dark:bg-purple-800'
                        : 'bg-white dark:bg-gray-800'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={selectedQuestionTypes.includes(type.id)}
                      onChange={() => toggleQuestionType(type.id)}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">{type.name}</span>
                  </label>
                ))}
                <div className="flex items-center justify-center p-2 text-sm text-gray-500 dark:text-gray-400">
                  +17 more types...
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Next: Configure
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Configure & Generate */}
      {step === 3 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Step 3: Configure & Generate
          </h2>

          <div className="space-y-6 mb-6">
            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Settings className="w-4 h-4 inline mr-1" />
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`
                      py-3 rounded-lg font-semibold transition-all
                      ${difficulty === level
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Items
              </label>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Languages className="w-4 h-4 inline mr-1" />
                Output Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="tr">🇹🇷 Turkish</option>
                <option value="en">🇬🇧 English</option>
                <option value="ar">🇸🇦 Arabic</option>
              </select>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Generation Summary</h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• Source: <strong>{selectedSource}</strong></li>
              <li>• Type: <strong>{generationType}</strong></li>
              <li>• Difficulty: <strong>{difficulty}</strong></li>
              <li>• Count: <strong>{count} items</strong></li>
              <li>• Language: <strong>{language.toUpperCase()}</strong></li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
            >
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate with AI 🚀
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
