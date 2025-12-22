import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import {
  FileSearch,
  Code,
  FolderTree,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Settings,
  Play,
  Download,
} from 'lucide-react';

interface AnalysisResult {
  id: string;
  fileName: string;
  fileType: string;
  issues: number;
  suggestions: number;
  complexity: 'low' | 'medium' | 'high';
  lastAnalyzed: string;
}

export default function ProjectAnalysisPage() {
  const { t } = useLanguage();
  const [analyzing, setAnalyzing] = useState(false);
  const [projectPath, setProjectPath] = useState('');

  // Mock data
  const mockResults: AnalysisResult[] = [
    {
      id: '1',
      fileName: 'UserService.cs',
      fileType: 'C#',
      issues: 3,
      suggestions: 5,
      complexity: 'medium',
      lastAnalyzed: '2024-01-15 14:30',
    },
    {
      id: '2',
      fileName: 'QuestionController.cs',
      fileType: 'C#',
      issues: 1,
      suggestions: 3,
      complexity: 'low',
      lastAnalyzed: '2024-01-15 14:28',
    },
    {
      id: '3',
      fileName: 'DatabaseContext.cs',
      fileType: 'C#',
      issues: 7,
      suggestions: 12,
      complexity: 'high',
      lastAnalyzed: '2024-01-15 14:25',
    },
  ];

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 3000);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FileSearch className="w-8 h-8 text-purple-600" />
            {t('project_analysis') || 'Proje Analizi'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            AI destekli kod analizi ve iyileştirme önerileri
          </p>
        </div>
      </div>

      {/* Analysis Input */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-blue-600" />
          Proje Seç ve Analiz Et
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Proje Dizini
            </label>
            <input
              type="text"
              value={projectPath}
              onChange={(e) => setProjectPath(e.target.value)}
              placeholder="/path/to/your/project"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Play className="w-5 h-5" />
              {analyzing ? 'Analiz Ediliyor...' : 'Analizi Başlat'}
            </button>

            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              <Settings className="w-5 h-5" />
              Ayarlar
            </button>
          </div>
        </div>

        {analyzing && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
              <p className="text-blue-800 dark:text-blue-400 font-medium">
                Proje analiz ediliyor... Bu işlem birkaç dakika sürebilir.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm">Analiz Edilen Dosya</p>
              <p className="text-3xl font-bold">156</p>
            </div>
            <Code className="w-12 h-12 text-blue-200" />
          </div>
          <p className="text-sm text-blue-100">Son analiz: 5 dk önce</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-red-100 text-sm">Toplam Sorun</p>
              <p className="text-3xl font-bold">23</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-200" />
          </div>
          <p className="text-sm text-red-100">-5 geçen haftaya göre</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-yellow-100 text-sm">İyileştirme Önerisi</p>
              <p className="text-3xl font-bold">45</p>
            </div>
            <TrendingUp className="w-12 h-12 text-yellow-200" />
          </div>
          <p className="text-sm text-yellow-100">AI tarafından önerildi</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-100 text-sm">Kod Kalitesi</p>
              <p className="text-3xl font-bold">87%</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-200" />
          </div>
          <p className="text-sm text-green-100">+12% bu ayda</p>
        </div>
      </div>

      {/* Analysis Results */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Analiz Sonuçları
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
            <Download className="w-4 h-4" />
            Raporu İndir
          </button>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {mockResults.map((result) => (
            <div
              key={result.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {result.fileName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {result.fileType} • {result.lastAnalyzed}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getComplexityColor(
                    result.complexity
                  )}`}
                >
                  {result.complexity === 'low' && 'Düşük Karmaşıklık'}
                  {result.complexity === 'medium' && 'Orta Karmaşıklık'}
                  {result.complexity === 'high' && 'Yüksek Karmaşıklık'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800 dark:text-red-400">
                      Tespit Edilen Sorunlar
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-300">
                    {result.issues}
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                      İyileştirme Önerileri
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">
                    {result.suggestions}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

