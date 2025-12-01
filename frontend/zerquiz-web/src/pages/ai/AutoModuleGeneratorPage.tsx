// Auto Module Generator Page - Generate complete learning modules from a single source

import { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { 
  FileText, BookOpen, Brain, ClipboardList, FileSpreadsheet, 
  BookMarked, Upload, CheckCircle, Loader, Sparkles, Download 
} from 'lucide-react';

interface Module {
  id: string;
  name: string;
  icon: any;
  selected: boolean;
  color: string;
}

const availableModules: Module[] = [
  { id: 'lesson_plan', name: 'Lesson Plan', icon: BookOpen, selected: false, color: 'bg-blue-500' },
  { id: 'quiz', name: 'Quiz (26 types)', icon: Brain, selected: false, color: 'bg-purple-500' },
  { id: 'flashcards', name: 'Flashcards', icon: FileText, selected: false, color: 'bg-green-500' },
  { id: 'assignment', name: 'Assignment', icon: ClipboardList, selected: false, color: 'bg-orange-500' },
  { id: 'worksheet', name: 'Worksheet', icon: FileSpreadsheet, selected: false, color: 'bg-pink-500' },
  { id: 'study_guide', name: 'Study Guide', icon: BookMarked, selected: false, color: 'bg-teal-500' },
];

export default function AutoModuleGeneratorPage() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modules, setModules] = useState<Module[]>(availableModules);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedModules, setGeneratedModules] = useState<any[]>([]);

  const toggleModule = (id: string) => {
    setModules(modules.map(m => m.id === id ? { ...m, selected: !m.selected } : m));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setProgress(0);
    setStep(4);

    const selectedModulesList = modules.filter(m => m.selected);
    const generatedList: any[] = [];

    // Simulate generation for each module
    for (let i = 0; i < selectedModulesList.length; i++) {
      const module = selectedModulesList[i];
      
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      generatedList.push({
        id: module.id,
        name: module.name,
        status: 'completed',
        content: `Generated ${module.name} content`,
      });

      setProgress(Math.round(((i + 1) / selectedModulesList.length) * 100));
      setGeneratedModules([...generatedList]);
    }

    setGenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Auto Module Generator</h1>
        </div>
        <p className="text-purple-100 text-lg">
          Generate a complete learning module from a single PDF - lesson plan, quiz, flashcards, and more!
        </p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Upload Source' },
            { num: 2, label: 'Select Modules' },
            { num: 3, label: 'Configure' },
            { num: 4, label: 'Generate' },
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    ${step >= s.num
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }
                  `}
                >
                  {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                </div>
                <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                  {s.label}
                </span>
              </div>
              {idx < 3 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    step > s.num ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Step 1: Upload Source Document
          </h2>
          
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center">
            <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Upload PDF or DOCX
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Maximum file size: 50MB
            </p>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Choose File
            </label>
            {selectedFile && (
              <div className="mt-4 text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {selectedFile.name}
              </div>
            )}
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!selectedFile}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next: Select Modules
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Step 2: Select Modules to Generate
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => toggleModule(module.id)}
                className={`
                  p-6 rounded-xl border-2 transition-all text-left
                  ${module.selected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <div className={`${module.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                  <module.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                  {module.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {module.selected ? '✓ Selected' : 'Click to select'}
                </p>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!modules.some(m => m.selected)}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Configure
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Step 3: Configure Modules
          </h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                <option value="tr">Turkish</option>
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty Level
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Questions (for Quiz)
              </label>
              <input
                type="number"
                defaultValue={20}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleGenerate}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Generate All Modules 🚀
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            {generating ? 'Generating Modules...' : 'Generation Complete! 🎉'}
          </h2>

          {generating && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                <span className="text-sm font-semibold text-blue-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            {generatedModules.map((module) => (
              <div
                key={module.id}
                className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-800 dark:text-white">
                    {module.name}
                  </span>
                </div>
                <button className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-green-600" />
                </button>
              </div>
            ))}
            {generating && generatedModules.length < modules.filter(m => m.selected).length && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="font-medium text-gray-800 dark:text-white">
                  Generating next module...
                </span>
              </div>
            )}
          </div>

          {!generating && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setStep(1);
                  setSelectedFile(null);
                  setModules(availableModules);
                  setGeneratedModules([]);
                }}
                className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Generate Another
              </button>
              <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Save All to Library
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
