import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLessonPlans, useGenerateLessonPlanWithAI } from '../../hooks/useLessonQueries';
import { toast } from 'react-toastify';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Star,
  Clock,
  Users,
  LayoutTemplate,
  Sparkles,
  Copy,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';

const LessonPlansPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiFormData, setAIFormData] = useState({
    subject: '',
    grade: '',
    topic: '',
    duration: 45,
    objectives: [] as string[]
  });

  // React Query hooks (scaffold - will work when backend is connected)
  const { data: plansData, isLoading } = useLessonPlans({ status: filterStatus !== 'all' ? filterStatus : undefined });
  const { mutate: generateWithAI, isPending: isGenerating } = useGenerateLessonPlanWithAI();

  // Fallback to mock data if backend not connected
  const mockPlans = [
    {
      id: '1',
      title: 'Geometri: Üçgenler ve Özellikler',
      subject: 'Matematik',
      grade: '10. Sınıf',
      duration: 45,
      templateName: '5E Modeli',
      status: 'published' as const,
      isPinned: true,
      updatedAt: '2024-01-20T10:00:00Z',
    },
    {
      id: '2',
      title: 'Newton Yasaları Lab',
      subject: 'Fizik',
      grade: '11. Sınıf',
      duration: 90,
      templateName: 'Proje Tabanlı Öğrenme',
      status: 'draft' as const,
      isPinned: false,
      updatedAt: '2024-01-19T14:30:00Z',
    },
  ];

  const plans = plansData?.items || mockPlans;

  const handleGenerateWithAI = () => {
    if (!aiFormData.subject || !aiFormData.topic || !aiFormData.grade) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    generateWithAI(aiFormData, {
      onSuccess: (response) => {
        toast.success(`✨ AI ile ders planı oluşturuluyor... (Job ID: ${response.jobId})`);
        setShowAIModal(false);
        setAIFormData({ subject: '', grade: '', topic: '', duration: 45, objectives: [] });
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Ders planı oluşturulamadı');
      }
    });
  };

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
      case 'archived':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    if (language === 'tr') {
      switch (status) {
        case 'published':
          return 'Yayında';
        case 'draft':
          return 'Taslak';
        case 'archived':
          return 'Arşiv';
        default:
          return status;
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              📚 {language === 'tr' ? 'Ders Planları' : 'Lesson Plans'}
            </h1>
            <p className="text-gray-600 mt-1">
              {language === 'tr'
                ? 'Ders planlarınızı oluşturun ve yönetin'
                : 'Create and manage your lesson plans'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAIModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 shadow-lg transition-all"
              disabled={isGenerating}
            >
              <Sparkles className="w-5 h-5" />
              {isGenerating ? 'Oluşturuluyor...' : (language === 'tr' ? 'AI ile Oluştur' : 'Generate with AI')}
            </button>
            <button
              onClick={() => navigate('/lessons/templates')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <LayoutTemplate className="w-5 h-5" />
              {language === 'tr' ? 'Şablonlar' : 'Templates'}
            </button>
            <button
              onClick={() => navigate('/lessons/create')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              {language === 'tr' ? 'Yeni Plan' : 'New Plan'}
            </button>
          </div>
            >
              <LayoutTemplate className="w-5 h-5" />
              {language === 'tr' ? 'Şablonlar' : 'Templates'}
            </button>
            <button
              onClick={() => navigate('/lessons/ai-create')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700"
            >
              <Sparkles className="w-5 h-5" />
              {language === 'tr' ? 'AI ile Oluştur' : 'AI Create'}
            </button>
            <button
              onClick={() => navigate('/lessons/create')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              {language === 'tr' ? 'Yeni Plan' : 'New Plan'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">{language === 'tr' ? 'Toplam' : 'Total'}</p>
            <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">{language === 'tr' ? 'Yayında' : 'Published'}</p>
            <p className="text-2xl font-bold text-green-600">
              {plans.filter((p) => p.status === 'published').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">{language === 'tr' ? 'Taslak' : 'Draft'}</p>
            <p className="text-2xl font-bold text-yellow-600">
              {plans.filter((p) => p.status === 'draft').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">{language === 'tr' ? 'Favoriler' : 'Pinned'}</p>
            <p className="text-2xl font-bold text-blue-600">
              {plans.filter((p) => p.isPinned).length}
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'tr' ? 'Ders planı ara...' : 'Search lesson plans...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{language === 'tr' ? 'Tüm Durumlar' : 'All Status'}</option>
              <option value="published">{language === 'tr' ? 'Yayında' : 'Published'}</option>
              <option value="draft">{language === 'tr' ? 'Taslak' : 'Draft'}</option>
              <option value="archived">{language === 'tr' ? 'Arşiv' : 'Archived'}</option>
            </select>
          </div>
        </div>

        {/* Lesson Plans List */}
        <div className="space-y-4">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate(`/lessons/${plan.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {plan.isPinned && <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                      {plan.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(plan.status)}`}>
                      {getStatusLabel(plan.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {plan.subject}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {plan.grade}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {plan.duration} {language === 'tr' ? 'dk' : 'min'}
                    </span>
                    <span className="flex items-center gap-1">
                      <LayoutTemplate className="w-4 h-4" />
                      {plan.templateName}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {language === 'tr' ? 'Güncellendi:' : 'Updated:'}{' '}
                    {new Date(plan.updatedAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                  </p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/lessons/${plan.id}`);
                    }}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/lessons/${plan.id}/edit`);
                    }}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Duplicate logic
                    }}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Delete logic
                    }}
                    className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPlans.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === 'tr' ? 'Ders Planı Bulunamadı' : 'No Lesson Plans Found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'tr' ? 'İlk ders planınızı oluşturun' : 'Create your first lesson plan'}
            </p>
            <button
              onClick={() => navigate('/lessons/create')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {language === 'tr' ? 'Yeni Plan Oluştur' : 'Create New Plan'}
            </button>
          </div>
        )}
      </div>

      {/* AI Generation Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">✨ AI ile Ders Planı Oluştur</h2>
              <button onClick={() => setShowAIModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Ders</label>
                <input
                  type="text"
                  value={aiFormData.subject}
                  onChange={(e) => setAIFormData({...aiFormData, subject: e.target.value})}
                  placeholder="Örn: Matematik, Fizik, Tarih"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sınıf</label>
                <select
                  value={aiFormData.grade}
                  onChange={(e) => setAIFormData({...aiFormData, grade: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Seçiniz</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={`${i+1}. Sınıf`}>{i+1}. Sınıf</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Konu</label>
                <input
                  type="text"
                  value={aiFormData.topic}
                  onChange={(e) => setAIFormData({...aiFormData, topic: e.target.value})}
                  placeholder="Örn: Üçgenler ve Özellikleri"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Süre (dakika)</label>
                <input
                  type="number"
                  value={aiFormData.duration}
                  onChange={(e) => setAIFormData({...aiFormData, duration: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Oluşturuluyor...' : '✨ AI ile Oluştur'}
                </button>
                <button
                  onClick={() => setShowAIModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPlansPage;

