import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Filter, Eye, Edit, Trash2, Copy, Shuffle, FileText,
  BarChart3, Settings, Download, Upload, CheckCircle, AlertCircle, Play,
} from 'lucide-react';
import {
  QuestionPool, RandomizationSettings, ExamVariant,
  mockQuestionPools, createExamFromPool, getPoolStats,
} from '../../mocks/questionPoolData';

type ViewMode = 'pools' | 'randomization' | 'variants';

export default function QuestionPoolManagementPage() {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<ViewMode>('pools');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [selectedPool, setSelectedPool] = useState<QuestionPool | null>(null);
  const [showPoolModal, setShowPoolModal] = useState(false);
  const [showRandomizeModal, setShowRandomizeModal] = useState(false);
  const [generatedVariants, setGeneratedVariants] = useState<ExamVariant[]>([]);
  const [showCreatePoolModal, setShowCreatePoolModal] = useState(false);
  const [newPoolData, setNewPoolData] = useState({ name: '', description: '', difficulty: 'medium', tags: '' });

  // Randomization settings
  const [randomSettings, setRandomSettings] = useState<RandomizationSettings>({
    enableRandomization: true,
    questionOrderRandomization: true,
    optionOrderRandomization: true,
    generateVariants: true,
    variantCount: 4,
    poolBasedSelection: true,
    minQuestions: 10,
    maxQuestions: 40,
  });

  const [questionCount, setQuestionCount] = useState(20);

  const filteredPools = mockQuestionPools.filter(p =>
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     p.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (difficultyFilter === 'all' || p.difficulty === difficultyFilter)
  );

  const handleCreateExam = () => {
    if (!selectedPool) {
      alert('Lütfen bir havuz seçin!');
      return;
    }

    const result = createExamFromPool(selectedPool.id, questionCount, randomSettings);

    if (result.success) {
      if (result.variants) {
        setGeneratedVariants(result.variants);
        setViewMode('variants');
      }
      alert(`Sınav başarıyla oluşturuldu!\nSınav ID: ${result.examId}\nVaryant Sayısı: ${result.variants?.length || 0}`);
    } else {
      alert(`Hata: ${result.error}`);
    }
  };

  const statCards = [
    { label: 'Toplam Havuz', value: mockQuestionPools.length, icon: FileText, color: 'bg-blue-500' },
    { label: 'Toplam Soru', value: mockQuestionPools.reduce((sum, p) => sum + p.totalQuestions, 0), icon: BarChart3, color: 'bg-green-500' },
    { label: 'Halka Açık', value: mockQuestionPools.filter(p => p.isPublic).length, icon: CheckCircle, color: 'bg-purple-500' },
    { label: 'Kullanım', value: mockQuestionPools.reduce((sum, p) => sum + p.usageCount, 0), icon: Play, color: 'bg-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Shuffle className="h-7 w-7 text-blue-600" />
                Soru Havuzu & Randomizasyon
              </h1>
              <p className="text-sm text-gray-600 mt-1">Soru havuzlarından rastgele sınav oluştur, varyant üret</p>
            </div>
            <button
              onClick={() => setShowCreatePoolModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4" /> Yeni Havuz
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {statCards.map((card, index) => (
              <div key={index} className={`${card.color} text-white p-4 rounded-lg shadow-md flex items-center justify-between`}>
                <div>
                  <div className="text-sm font-medium opacity-80">{card.label}</div>
                  <div className="text-2xl font-bold">{card.value}</div>
                </div>
                <card.icon className="h-8 w-8 opacity-50" />
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mt-6">
            <button
              onClick={() => setViewMode('pools')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                viewMode === 'pools'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="h-4 w-4" /> Soru Havuzları
            </button>
            <button
              onClick={() => setViewMode('randomization')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                viewMode === 'randomization'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="h-4 w-4" /> Randomizasyon Ayarları
            </button>
            <button
              onClick={() => setViewMode('variants')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                viewMode === 'variants'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Shuffle className="h-4 w-4" /> Üretilen Varyantlar ({generatedVariants.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {viewMode === 'pools' && (
          <div>
            {/* Filters */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Havuz ara..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <option value="all">Tüm Zorluklar</option>
                <option value="easy">Kolay</option>
                <option value="medium">Orta</option>
                <option value="hard">Zor</option>
                <option value="mixed">Karma</option>
              </select>
            </div>

            {/* Pool Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPools.map(pool => {
                const stats = getPoolStats(pool);
                return (
                  <div key={pool.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{pool.name}</h3>
                        <p className="text-xs text-gray-600">{pool.category} • {pool.subject}</p>
                      </div>
                      {pool.isPublic && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Açık</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{pool.description}</p>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600">Toplam Soru</div>
                        <div className="text-lg font-bold text-blue-600">{pool.totalQuestions}</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600">Kullanım</div>
                        <div className="text-lg font-bold text-green-600">{pool.usageCount}</div>
                      </div>
                    </div>

                    {/* Difficulty Distribution */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Kolay: {stats.easy}</span>
                        <span>Orta: {stats.medium}</span>
                        <span>Zor: {stats.hard}</span>
                      </div>
                      <div className="flex h-2 rounded-full overflow-hidden">
                        <div className="bg-green-400" style={{ width: `${(stats.easy / stats.totalQuestions) * 100}%` }}></div>
                        <div className="bg-yellow-400" style={{ width: `${(stats.medium / stats.totalQuestions) * 100}%` }}></div>
                        <div className="bg-red-400" style={{ width: `${(stats.hard / stats.totalQuestions) * 100}%` }}></div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pool.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedPool(pool);
                          setShowPoolModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                      >
                        <Eye className="h-4 w-4" /> Görüntüle
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPool(pool);
                          setViewMode('randomization');
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                      >
                        <Shuffle className="h-4 w-4" /> Kullan
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === 'randomization' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Randomizasyon Ayarları</h2>
            
            {selectedPool ? (
              <div className="space-y-6">
                {/* Selected Pool Info */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-blue-900 mb-1">Seçili Havuz: {selectedPool.name}</h3>
                  <p className="text-sm text-blue-800">{selectedPool.totalQuestions} soru • {selectedPool.category}</p>
                </div>

                {/* Question Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sınav İçin Soru Sayısı: {questionCount}
                  </label>
                  <input
                    type="range"
                    min={randomSettings.minQuestions}
                    max={Math.min(randomSettings.maxQuestions, selectedPool.totalQuestions)}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Min: {randomSettings.minQuestions}</span>
                    <span>Max: {Math.min(randomSettings.maxQuestions, selectedPool.totalQuestions)}</span>
                  </div>
                </div>

                {/* Settings Checkboxes */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="questionOrder"
                      checked={randomSettings.questionOrderRandomization}
                      onChange={(e) => setRandomSettings({ ...randomSettings, questionOrderRandomization: e.target.checked })}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label htmlFor="questionOrder" className="ml-3 text-sm text-gray-700">
                      <span className="font-medium">Soru Sırasını Karıştır</span>
                      <p className="text-xs text-gray-500">Her öğrenciye sorular farklı sırada gelir</p>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="optionOrder"
                      checked={randomSettings.optionOrderRandomization}
                      onChange={(e) => setRandomSettings({ ...randomSettings, optionOrderRandomization: e.target.checked })}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label htmlFor="optionOrder" className="ml-3 text-sm text-gray-700">
                      <span className="font-medium">Şık Sırasını Karıştır</span>
                      <p className="text-xs text-gray-500">Çoktan seçmeli sorularda A, B, C, D şıkları karışır</p>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="generateVariants"
                      checked={randomSettings.generateVariants}
                      onChange={(e) => setRandomSettings({ ...randomSettings, generateVariants: e.target.checked })}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label htmlFor="generateVariants" className="ml-3 text-sm text-gray-700">
                      <span className="font-medium">Sınav Varyantları Oluştur</span>
                      <p className="text-xs text-gray-500">A, B, C, D kitapçıkları (farklı soru sıraları)</p>
                    </label>
                  </div>

                  {randomSettings.generateVariants && (
                    <div className="ml-7">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Varyant Sayısı: {randomSettings.variantCount}
                      </label>
                      <input
                        type="range"
                        min={2}
                        max={8}
                        value={randomSettings.variantCount}
                        onChange={(e) => setRandomSettings({ ...randomSettings, variantCount: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>2</span>
                        <span>8</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Create Exam Button */}
                <button
                  onClick={handleCreateExam}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-md"
                >
                  <Play className="h-5 w-5" /> Sınav Oluştur
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Lütfen önce "Soru Havuzları" sekmesinden bir havuz seçin</p>
              </div>
            )}
          </div>
        )}

        {viewMode === 'variants' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Üretilen Sınav Varyantları</h2>
            
            {generatedVariants.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
                <Shuffle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Henüz varyant oluşturulmadı</p>
                <button
                  onClick={() => setViewMode('randomization')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Varyant Oluştur
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {generatedVariants.map(variant => (
                  <div key={variant.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl font-bold text-blue-600">{variant.variantCode}</div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Kitapçık</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700 mb-4">
                      <div className="flex justify-between">
                        <span>Soru Sayısı:</span>
                        <span className="font-semibold">{variant.questions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Oluşturulma:</span>
                        <span className="font-semibold">{variant.createdAt.toLocaleTimeString('tr-TR')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                        <Eye className="h-4 w-4" /> Görüntüle
                      </button>
                      <button className="flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Pool Modal */}
      {showCreatePoolModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Yeni Soru Havuzu Oluştur</h2>
              <p className="text-sm text-gray-600 mt-1">Soru havuzu için temel bilgileri girin</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Havuz Adı *</label>
                <input
                  type="text"
                  value={newPoolData.name}
                  onChange={(e) => setNewPoolData({...newPoolData, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="örn: Matematik 10. Sınıf Genel Havuz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea
                  value={newPoolData.description}
                  onChange={(e) => setNewPoolData({...newPoolData, description: e.target.value})}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Havuz hakkında detaylı açıklama..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zorluk Seviyesi</label>
                <select
                  value={newPoolData.difficulty}
                  onChange={(e) => setNewPoolData({...newPoolData, difficulty: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="easy">Kolay</option>
                  <option value="medium">Orta</option>
                  <option value="hard">Zor</option>
                  <option value="mixed">Karışık</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Etiketler (virgülle ayırın)</label>
                <input
                  type="text"
                  value={newPoolData.tags}
                  onChange={(e) => setNewPoolData({...newPoolData, tags: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="örn: TYT, AYT, Matematik, Geometri"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowCreatePoolModal(false);
                  setNewPoolData({ name: '', description: '', difficulty: 'medium', tags: '' });
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  if (!newPoolData.name) {
                    alert('Lütfen havuz adı girin!');
                    return;
                  }
                  alert(`Yeni havuz oluşturuldu:\n${newPoolData.name}\n(Demo - Backend entegrasyonu gerekiyor)`);
                  setShowCreatePoolModal(false);
                  setNewPoolData({ name: '', description: '', difficulty: 'medium', tags: '' });
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

