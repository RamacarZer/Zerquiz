import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Brain, 
  Eye, 
  Ear, 
  Hand, 
  TrendingUp,
  BookOpen,
  Target,
  Award,
  BarChart3,
  PieChart
} from 'lucide-react';

interface LearningStyleData {
  visual: number;
  auditory: number;
  kinesthetic: number;
  reading: number;
}

interface StudentLearningProfile {
  studentId: string;
  studentName: string;
  dominantStyle: string;
  styleScores: LearningStyleData;
  recommendations: string[];
  performanceByStyle: {
    style: string;
    avgScore: number;
    completionRate: number;
  }[];
}

export default function LearningStyleAnalysisPage() {
  const { t } = useLanguage();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // Mock data - gerçek uygulamada API'den gelecek
  const mockData: StudentLearningProfile = {
    studentId: '1',
    studentName: 'Ahmet Yılmaz',
    dominantStyle: 'visual',
    styleScores: {
      visual: 85,
      auditory: 60,
      kinesthetic: 70,
      reading: 55,
    },
    recommendations: [
      'Görsel materyaller kullanın (diyagramlar, grafikler, videolar)',
      'Renkli notlar ve zihin haritaları faydalı olacaktır',
      'İnfografikler ve illüstrasyonlar öğrenmeyi destekler',
      'Whiteboard ve çizim araçlarını tercih edin',
    ],
    performanceByStyle: [
      { style: 'Visual Content', avgScore: 88, completionRate: 95 },
      { style: 'Audio Lessons', avgScore: 65, completionRate: 78 },
      { style: 'Interactive Exercises', avgScore: 75, completionRate: 85 },
      { style: 'Reading Materials', avgScore: 60, completionRate: 72 },
    ],
  };

  const getLearningStyleInfo = () => [
    {
      icon: Eye,
      name: 'Görsel (Visual)',
      description: 'Resimler, grafikler ve videoları tercih eder',
      score: mockData.styleScores.visual,
      color: 'blue',
    },
    {
      icon: Ear,
      name: 'İşitsel (Auditory)',
      description: 'Dinleme ve konuşmayı tercih eder',
      score: mockData.styleScores.auditory,
      color: 'green',
    },
    {
      icon: Hand,
      name: 'Kinestetik (Kinesthetic)',
      description: 'Yaparak ve deneyimleyerek öğrenir',
      score: mockData.styleScores.kinesthetic,
      color: 'purple',
    },
    {
      icon: BookOpen,
      name: 'Okuma/Yazma',
      description: 'Metin tabanlı öğrenmeyi tercih eder',
      score: mockData.styleScores.reading,
      color: 'orange',
    },
  ];

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
    };
    return colors[color] || 'bg-gray-500';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-600" />
            {t('learning_style_analysis') || 'Öğrenme Stili Analizi'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Öğrencilerin öğrenme stillerini analiz edin ve kişiselleştirilmiş öneriler alın
          </p>
        </div>
      </div>

      {/* Learning Style Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getLearningStyleInfo().map((style, index) => {
          const Icon = style.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg ${getColorClass(style.color)} bg-opacity-10`}>
                  <Icon className={`w-6 h-6 text-${style.color}-600`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {style.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {style.description}
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Skor</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {style.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`${getColorClass(style.color)} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${style.score}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dominant Style */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8" />
            <h2 className="text-xl font-bold">Baskın Öğrenme Stili</h2>
          </div>
          <p className="text-3xl font-bold mb-2">Görsel (Visual)</p>
          <p className="text-purple-100">
            Bu öğrenci görsel materyallerle en iyi şekilde öğrenir
          </p>
        </div>

        {/* Performance Overview */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Stil Bazında Performans
            </h2>
          </div>
          <div className="space-y-4">
            {mockData.performanceByStyle.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.style}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Ortalama: <span className="font-semibold">{item.avgScore}%</span>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Tamamlama: <span className="font-semibold">{item.completionRate}%</span>
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.avgScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-yellow-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Kişiselleştirilmiş Öneriler
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockData.recommendations.map((recommendation, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
            >
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-gray-700 dark:text-gray-300">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Analiz</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">45</p>
            </div>
            <PieChart className="w-12 h-12 text-blue-600" />
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">+12% bu ay</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ortalama Doğruluk</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">87%</p>
            </div>
            <Target className="w-12 h-12 text-green-600" />
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">+5% geçen haftaya göre</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Aktif Öğrenci</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">156</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-600" />
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">+8% bu hafta</p>
        </div>
      </div>
    </div>
  );
}

