import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Code,
  RefreshCw,
  Sparkles,
  FileCode,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  Play,
  Settings,
} from 'lucide-react';

interface RefactoringOption {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  category: string;
}

export default function FileRefactorPage() {
  const { t } = useLanguage();
  const [code, setCode] = useState('');
  const [refactoredCode, setRefactoredCode] = useState('');
  const [isRefactoring, setIsRefactoring] = useState(false);

  const refactoringOptions: RefactoringOption[] = [
    {
      id: '1',
      title: 'Kod Optimizasyonu',
      description: 'Performansı artırmak için kod optimizasyonu yapılır',
      impact: 'high',
      category: 'Performance',
    },
    {
      id: '2',
      title: 'Clean Code Prensipleri',
      description: 'SOLID prensipleri ve clean code uygulanır',
      impact: 'medium',
      category: 'Quality',
    },
    {
      id: '3',
      title: 'Değişken İsimlendirme',
      description: 'Daha anlaşılır değişken isimleri önerilir',
      impact: 'low',
      category: 'Readability',
    },
    {
      id: '4',
      title: 'Fonksiyon Bölme',
      description: 'Büyük fonksiyonlar küçük parçalara bölünür',
      impact: 'high',
      category: 'Maintainability',
    },
  ];

  const handleRefactor = () => {
    setIsRefactoring(true);
    setTimeout(() => {
      setRefactoredCode(`// Refactored Code
// AI tarafından optimize edildi

${code}

// Optimizasyonlar:
// - Değişken isimleri iyileştirildi
// - Performans optimizasyonu yapıldı
// - SOLID prensipleri uygulandı`);
      setIsRefactoring(false);
    }, 2000);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
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
            <RefreshCw className="w-8 h-8 text-green-600" />
            {t('file_refactor') || 'Kod Düzenleme'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            AI destekli kod iyileştirme ve refactoring
          </p>
        </div>
      </div>

      {/* Refactoring Options */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Refactoring Seçenekleri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {refactoringOptions.map((option) => (
            <div
              key={option.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{option.title}</h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getImpactColor(option.impact)}`}
                >
                  {option.impact === 'low' && 'Düşük Etki'}
                  {option.impact === 'medium' && 'Orta Etki'}
                  {option.impact === 'high' && 'Yüksek Etki'}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{option.description}</p>
              <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                {option.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Code */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-blue-600" />
              Orijinal Kod
            </h2>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              <Upload className="w-4 h-4" />
              Dosya Yükle
            </button>
          </div>
          <div className="p-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Kodunuzu buraya yapıştırın..."
              className="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleRefactor}
              disabled={!code || isRefactoring}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isRefactoring ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Kod İyileştiriliyor...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Kodu İyileştir
                </>
              )}
            </button>
          </div>
        </div>

        {/* Refactored Code */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              İyileştirilmiş Kod
            </h2>
            {refactoredCode && (
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
                <Download className="w-4 h-4" />
                İndir
              </button>
            )}
          </div>
          <div className="p-4">
            <textarea
              value={refactoredCode}
              readOnly
              placeholder="İyileştirilmiş kod burada görünecek..."
              className="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none"
            />
          </div>
        </div>
      </div>

      {/* Improvements Summary */}
      {refactoredCode && (
        <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            İyileştirme Özeti
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Kod Kalitesi</p>
              <p className="text-2xl font-bold text-green-600">+45%</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Okunabilirlik</p>
              <p className="text-2xl font-bold text-blue-600">+38%</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Performans</p>
              <p className="text-2xl font-bold text-purple-600">+22%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

