import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Database,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Copy,
  BookOpen,
  Award,
  Target,
  TrendingUp,
  FileText,
} from 'lucide-react';

interface Question {
  id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: string;
  usageCount: number;
  avgScore: number;
  createdAt: string;
  author: string;
}

export default function QuestionBankPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Mock data
  const mockQuestions: Question[] = [
    {
      id: '1',
      title: 'Pisagor Teoremi Uygulaması',
      subject: 'Matematik',
      topic: 'Geometri',
      difficulty: 'medium',
      type: 'Çoktan Seçmeli',
      usageCount: 45,
      avgScore: 78,
      createdAt: '2024-01-15',
      author: 'Ahmet Yılmaz',
    },
    {
      id: '2',
      title: 'Newton\'un Hareket Yasaları',
      subject: 'Fizik',
      topic: 'Mekanik',
      difficulty: 'hard',
      type: 'Çözümlü Soru',
      usageCount: 32,
      avgScore: 65,
      createdAt: '2024-01-14',
      author: 'Ayşe Demir',
    },
    {
      id: '3',
      title: 'Basit Toplama İşlemi',
      subject: 'Matematik',
      topic: 'Aritmetik',
      difficulty: 'easy',
      type: 'Kısa Cevaplı',
      usageCount: 89,
      avgScore: 92,
      createdAt: '2024-01-13',
      author: 'Mehmet Kaya',
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Kolay';
      case 'medium':
        return 'Orta';
      case 'hard':
        return 'Zor';
      default:
        return 'Bilinmiyor';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-600" />
            {t('question_bank') || 'Soru Bankası'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Tüm soruları görüntüleyin, düzenleyin ve yönetin
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
          <Plus className="w-5 h-5" />
          Yeni Soru Ekle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm">Toplam Soru</p>
              <p className="text-3xl font-bold">1,247</p>
            </div>
            <Database className="w-12 h-12 text-blue-200" />
          </div>
          <p className="text-sm text-blue-100">+89 bu ayda</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-100 text-sm">Kullanım Sayısı</p>
              <p className="text-3xl font-bold">5,432</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-200" />
          </div>
          <p className="text-sm text-green-100">+15% bu hafta</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-purple-100 text-sm">Ortalama Başarı</p>
              <p className="text-3xl font-bold">76%</p>
            </div>
            <Award className="w-12 h-12 text-purple-200" />
          </div>
          <p className="text-sm text-purple-100">+3% geçen aya göre</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-orange-100 text-sm">Konu Sayısı</p>
              <p className="text-3xl font-bold">48</p>
            </div>
            <BookOpen className="w-12 h-12 text-orange-200" />
          </div>
          <p className="text-sm text-orange-100">12 ders kapsamı</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Soru ara..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Zorluklar</option>
              <option value="easy">Kolay</option>
              <option value="medium">Orta</option>
              <option value="hard">Zor</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Dersler</option>
              <option value="math">Matematik</option>
              <option value="physics">Fizik</option>
              <option value="chemistry">Kimya</option>
              <option value="biology">Biyoloji</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Sorular ({mockQuestions.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {mockQuestions.map((question) => (
            <div
              key={question.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {question.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
                        question.difficulty
                      )}`}
                    >
                      {getDifficultyLabel(question.difficulty)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {question.subject} • {question.topic}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {question.type}
                    </span>
                    <span>Yazar: {question.author}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                    <Copy className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Kullanım</p>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-300">
                    {question.usageCount} kez
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-green-600 dark:text-green-400 mb-1">Ort. Başarı</p>
                  <p className="text-lg font-bold text-green-900 dark:text-green-300">
                    %{question.avgScore}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Tarih</p>
                  <p className="text-lg font-bold text-purple-900 dark:text-purple-300">
                    {new Date(question.createdAt).toLocaleDateString('tr-TR')}
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

