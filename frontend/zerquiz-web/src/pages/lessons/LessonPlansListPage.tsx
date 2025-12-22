import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { toast } from '@/components/common/Alert';
import Button from '@/components/common/Button';
import { 
  BookOpen, Plus, Search, Copy, Trash2, 
  Edit, Eye, Calendar, Clock, Users, Archive, Sparkles, Download, X, FileText, Zap, Loader2
} from 'lucide-react';

interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  grade: string;
  duration: number;
  templateType: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  studentsCount?: number;
  objectives?: string[];
  materials?: string[];
  activities?: string[];
}

const mockLessonPlans: LessonPlan[] = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    subject: 'Computer Science',
    grade: '12',
    duration: 90,
    templateType: '5E Model',
    status: 'published',
    createdAt: '2025-11-25',
    studentsCount: 28,
    objectives: ['Understand ML basics', 'Learn supervised learning', 'Practice with real data'],
    materials: ['Computer lab', 'Python environment', 'Sample datasets'],
    activities: ['Introduction lecture', 'Hands-on coding', 'Group project'],
  },
  {
    id: '2',
    title: 'Cell Structure and Function',
    subject: 'Biology',
    grade: '10',
    duration: 60,
    templateType: 'Project-Based',
    status: 'published',
    createdAt: '2025-11-24',
    studentsCount: 32,
    objectives: ['Identify cell parts', 'Understand cell functions', 'Compare plant and animal cells'],
    materials: ['Microscopes', 'Cell slides', 'Diagrams'],
    activities: ['Microscope observation', 'Diagram labeling', 'Quiz'],
  },
  {
    id: '3',
    title: 'World War II Overview',
    subject: 'History',
    grade: '11',
    duration: 45,
    templateType: 'Traditional',
    status: 'draft',
    createdAt: '2025-11-23',
    objectives: ['Understand causes of WWII', 'Identify key battles', 'Analyze impact'],
    materials: ['Textbook', 'Timeline posters', 'Video clips'],
    activities: ['Lecture', 'Timeline activity', 'Discussion'],
  },
];

export default function LessonPlansListPage() {
  const { t } = useLanguage();
  const [plans, setPlans] = useState<LessonPlan[]>(mockLessonPlans);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400' },
      published: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400' },
      archived: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-400' },
    };
    const badge = badges[status as keyof typeof badges];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plan.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || plan.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [plans, searchTerm, filterStatus]);

  const stats = useMemo(() => ({
    total: plans.length,
    published: plans.filter(p => p.status === 'published').length,
    drafts: plans.filter(p => p.status === 'draft').length,
    thisMonth: plans.filter(p => {
      const planDate = new Date(p.createdAt);
      const now = new Date();
      return planDate.getMonth() === now.getMonth() && planDate.getFullYear() === now.getFullYear();
    }).length,
  }), [plans]);

  // Handlers
  const handleCreateNew = () => {
    setIsCreateModalOpen(true);
  };

  const handleBrowseTemplates = () => {
    setIsTemplateModalOpen(true);
  };

  const handleView = (plan: LessonPlan) => {
    setSelectedPlan(plan);
    setIsViewModalOpen(true);
  };

  const handleEdit = (plan: LessonPlan) => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleDuplicate = (plan: LessonPlan) => {
    const newPlan: LessonPlan = {
      ...plan,
      id: (plans.length + 1).toString(),
      title: `${plan.title} (${t('copy') || 'Kopya'})`,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setPlans(prev => [newPlan, ...prev]);
    toast.success(`"${plan.title}" ${t('successfully_duplicated') || 'başarıyla kopyalandı!'}`);
  };

  const handleArchive = (plan: LessonPlan) => {
    setPlans(prev => prev.map(p => 
      p.id === plan.id ? { ...p, status: 'archived' as const } : p
    ));
    toast.success(`"${plan.title}" ${t('archived') || 'arşivlendi'}`);
  };

  const handleDelete = (plan: LessonPlan) => {
    if (window.confirm(t('confirm_delete_lesson_plan') || `"${plan.title}" adlı ders planını silmek istediğinizden emin misiniz?`)) {
      setPlans(prev => prev.filter(p => p.id !== plan.id));
      toast.success(`"${plan.title}" ${t('successfully_deleted') || 'başarıyla silindi'}`);
    }
  };

  const handleAICreate = () => {
    setIsAIModalOpen(true);
  };

  const handleExport = async (plan: LessonPlan) => {
    toast.info(t('downloading_pdf') || 'PDF indiriliyor...');
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    toast.success(`"${plan.title}" ${t('pdf_downloaded') || 'PDF olarak indirildi!'}`);
  };

  const handleTemplateSelect = (template: any) => {
    toast.success(`"${template.name}" ${t('template_selected') || 'şablonu seçildi!'}`);
    setIsTemplateModalOpen(false);
    setIsCreateModalOpen(true);
  };

  const handleAIGenerate = async (formData: any) => {
    setLoading(true);
    toast.info(t('generating_with_ai') || 'AI ile ders planı oluşturuluyor...');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newPlan: LessonPlan = {
      id: (plans.length + 1).toString(),
      title: `${formData.topic} - AI Generated`,
      subject: formData.subject,
      grade: formData.grade,
      duration: formData.duration,
      templateType: 'AI Generated',
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      objectives: ['AI generated objective 1', 'AI generated objective 2', 'AI generated objective 3'],
      materials: ['AI generated material 1', 'AI generated material 2'],
      activities: ['AI generated activity 1', 'AI generated activity 2', 'AI generated activity 3'],
    };
    
    setPlans(prev => [newPlan, ...prev]);
    setLoading(false);
    setIsAIModalOpen(false);
    toast.success(t('lesson_plan_created') || 'Ders planı başarıyla oluşturuldu!');
  };

  const handleSaveNew = (formData: any) => {
    const newPlan: LessonPlan = {
      id: (plans.length + 1).toString(),
      title: formData.title,
      subject: formData.subject,
      grade: formData.grade,
      duration: formData.duration,
      templateType: formData.templateType || 'Custom',
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      objectives: formData.objectives || [],
      materials: formData.materials || [],
      activities: formData.activities || [],
    };
    
    setPlans(prev => [newPlan, ...prev]);
    setIsCreateModalOpen(false);
    toast.success(t('lesson_plan_created') || 'Ders planı başarıyla oluşturuldu!');
  };

  const handleSaveEdit = (formData: any) => {
    if (!selectedPlan) return;
    
    setPlans(prev => prev.map(p => 
      p.id === selectedPlan.id ? { ...p, ...formData } : p
    ));
    setIsEditModalOpen(false);
    toast.success(t('lesson_plan_updated') || 'Ders planı başarıyla güncellendi!');
  };

  return (
    <div className="p-6 space-y-6 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            {t('lesson_plans') || 'Ders Planları'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('manage_lesson_plans') || 'Ders planlarınızı oluşturun ve yönetin'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleAICreate}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            disabled={loading}
          >
            <Sparkles className="w-5 h-5" />
            {loading ? (t('generating') || 'Oluşturuluyor...') : (t('generate_with_ai') || 'AI ile Oluştur')}
          </Button>
          <Button
            onClick={handleBrowseTemplates}
            variant="secondary"
          >
            <FileText className="w-5 h-5" />
            {t('browse_templates') || 'Şablonlara Göz At'}
          </Button>
          <Button
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-5 h-5" />
            {t('new_plan') || 'Yeni Plan'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: t('total_plans') || 'Toplam Plan', value: stats.total, icon: BookOpen, color: 'bg-blue-500' },
          { label: t('published') || 'Yayınlanmış', value: stats.published, icon: Eye, color: 'bg-green-500' },
          { label: t('drafts') || 'Taslak', value: stats.drafts, icon: Edit, color: 'bg-yellow-500' },
          { label: t('this_month') || 'Bu Ay', value: stats.thisMonth, icon: Calendar, color: 'bg-purple-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search_lesson_plans') || 'Ders planlarında ara...'}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'draft', 'published', 'archived'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all
                  ${filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                {status === 'all' ? (t('all') || 'Tümü') : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lesson Plans Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white line-clamp-1">
                      {plan.title}
                    </h3>
                    {getStatusBadge(plan.status)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {plan.subject} • {t('grade') || 'Sınıf'} {plan.grade}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {plan.duration} {t('min') || 'dk'}
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {plan.templateType}
                  </div>
                  {plan.studentsCount && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {plan.studentsCount} {t('students') || 'öğrenci'}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Calendar className="w-3 h-3" />
                  {t('created') || 'Oluşturuldu'}: {plan.createdAt}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Button 
                  onClick={() => handleView(plan)}
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                >
                  <Eye className="w-4 h-4" />
                  {t('view') || 'Görüntüle'}
                </Button>
                <Button 
                  onClick={() => handleEdit(plan)}
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                >
                  <Edit className="w-4 h-4" />
                  {t('edit') || 'Düzenle'}
                </Button>
                <Button 
                  onClick={() => handleDuplicate(plan)}
                  variant="ghost"
                  size="icon"
                  className="p-2"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => handleExport(plan)}
                  variant="ghost"
                  size="icon"
                  className="p-2"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => handleArchive(plan)}
                  variant="ghost"
                  size="icon"
                  className="p-2"
                >
                  <Archive className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => handleDelete(plan)}
                  variant="ghost"
                  size="icon"
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
          <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            {t('no_lesson_plans_found') || 'Ders Planı Bulunamadı'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('adjust_search_or_create') || 'Aramanızı ayarlayın veya yeni bir ders planı oluşturun'}
          </p>
          <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700 text-white">
            {t('create_first_lesson_plan') || 'İlk Ders Planını Oluştur'}
          </Button>
        </div>
      )}

      {/* Modals */}
      {isTemplateModalOpen && (
        <TemplateBrowserModal
          onClose={() => setIsTemplateModalOpen(false)}
          onSelect={handleTemplateSelect}
          t={t}
        />
      )}

      {isAIModalOpen && (
        <AICreationModal
          onClose={() => setIsAIModalOpen(false)}
          onGenerate={handleAIGenerate}
          isGenerating={loading}
          t={t}
        />
      )}

      {isViewModalOpen && selectedPlan && (
        <ViewModal
          plan={selectedPlan}
          onClose={() => setIsViewModalOpen(false)}
          t={t}
        />
      )}

      {isEditModalOpen && selectedPlan && (
        <EditModal
          plan={selectedPlan}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
          t={t}
        />
      )}

      {isCreateModalOpen && (
        <CreateModal
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveNew}
          t={t}
        />
      )}
    </div>
  );
}

// Template Browser Modal
interface TemplateBrowserModalProps {
  onClose: () => void;
  onSelect: (template: any) => void;
  t: (key: string) => string;
}

function TemplateBrowserModal({ onClose, onSelect, t }: TemplateBrowserModalProps) {
  const templates = [
    { 
      id: '1', 
      name: '5E Model', 
      description: 'Engage, Explore, Explain, Elaborate, Evaluate', 
      icon: '🔬',
      features: ['Inquiry-based', 'Hands-on', 'Collaborative']
    },
    { 
      id: '2', 
      name: 'Project-Based Learning', 
      description: 'Student-driven project approach', 
      icon: '📊',
      features: ['Real-world problems', 'Extended duration', 'Presentation']
    },
    { 
      id: '3', 
      name: 'Traditional Lecture', 
      description: 'Classic lecture-based teaching', 
      icon: '📚',
      features: ['Teacher-centered', 'Direct instruction', 'Note-taking']
    },
    { 
      id: '4', 
      name: 'Flipped Classroom', 
      description: 'Pre-class learning, in-class activities', 
      icon: '🔄',
      features: ['Video content', 'Active learning', 'Differentiated']
    },
    { 
      id: '5', 
      name: 'Socratic Seminar', 
      description: 'Discussion-based collaborative learning', 
      icon: '💬',
      features: ['Critical thinking', 'Discussion', 'Text-based']
    },
    { 
      id: '6', 
      name: 'Station Rotation', 
      description: 'Students rotate through learning stations', 
      icon: '🔄',
      features: ['Differentiation', 'Variety', 'Self-paced']
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('lesson_plan_templates') || 'Ders Planı Şablonları'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('select_template_description') || 'Hazır şablonlardan birini seçin ve özelleştirin'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => onSelect(template)}
            >
              <div className="text-4xl mb-3">{template.icon}</div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
              <div className="flex flex-wrap gap-2">
                {template.features.map((feature, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// AI Creation Modal
interface AICreationModalProps {
  onClose: () => void;
  onGenerate: (formData: any) => void;
  isGenerating: boolean;
  t: (key: string) => string;
}

function AICreationModal({ onClose, onGenerate, isGenerating, t }: AICreationModalProps) {
  const [formData, setFormData] = useState({
    subject: '',
    grade: '',
    topic: '',
    duration: 45,
    learningObjectives: '',
    teachingStyle: 'interactive',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('generate_with_ai') || 'AI ile Ders Planı Oluştur'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('ai_description') || 'Yapay zeka ile otomatik ders planı oluşturun'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('subject') || 'Ders'}
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="Matematik, Fizik, vs."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('grade') || 'Sınıf'}
              </label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="9, 10, 11, 12"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('topic') || 'Konu'}
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Örn: Trigonometri Giriş"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('duration') || 'Süre'} ({t('minutes') || 'dakika'})
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              min="15"
              max="180"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('learning_objectives') || 'Öğrenme Hedefleri'} ({t('optional') || 'opsiyonel'})
            </label>
            <textarea
              value={formData.learningObjectives}
              onChange={(e) => setFormData({ ...formData, learningObjectives: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder="Öğrencilerin kazanması gereken beceriler..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('teaching_style') || 'Öğretim Stili'}
            </label>
            <select
              value={formData.teachingStyle}
              onChange={(e) => setFormData({ ...formData, teachingStyle: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="interactive">{t('interactive') || 'Etkileşimli'}</option>
              <option value="lecture">{t('lecture') || 'Sunum'}</option>
              <option value="hands-on">{t('hands_on') || 'Uygulamalı'}</option>
              <option value="discussion">{t('discussion') || 'Tartışma'}</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="flex-1"
              disabled={isGenerating}
            >
              {t('cancel') || 'İptal'}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  {t('generating') || 'Oluşturuluyor...'}
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  {t('generate') || 'Oluştur'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// View Modal
interface ViewModalProps {
  plan: LessonPlan;
  onClose: () => void;
  t: (key: string) => string;
}

function ViewModal({ plan, onClose, t }: ViewModalProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.title}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              plan.status === 'published' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
              plan.status === 'draft' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
              'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
            }`}>
              {plan.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{plan.subject}</span>
            <span>•</span>
            <span>{t('grade') || 'Sınıf'} {plan.grade}</span>
            <span>•</span>
            <span>{plan.duration} {t('minutes') || 'dk'}</span>
            <span>•</span>
            <span>{plan.templateType}</span>
          </div>
        </div>

        <div className="space-y-6">
          {plan.objectives && plan.objectives.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {t('learning_objectives') || 'Öğrenme Hedefleri'}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {plan.objectives.map((obj, idx) => (
                  <li key={idx}>{obj}</li>
                ))}
              </ul>
            </div>
          )}

          {plan.materials && plan.materials.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {t('materials') || 'Materyaller'}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {plan.materials.map((mat, idx) => (
                  <li key={idx}>{mat}</li>
                ))}
              </ul>
            </div>
          )}

          {plan.activities && plan.activities.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {t('activities') || 'Etkinlikler'}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {plan.activities.map((act, idx) => (
                  <li key={idx}>{act}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div>
                <span className="font-medium">{t('created') || 'Oluşturuldu'}:</span> {plan.createdAt}
              </div>
              {plan.studentsCount && (
                <div>
                  <span className="font-medium">{t('students') || 'Öğrenci'}:</span> {plan.studentsCount}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
          <Button onClick={onClose} variant="secondary" className="flex-1">
            {t('close') || 'Kapat'}
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="w-5 h-5" />
            {t('download_pdf') || 'PDF İndir'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Edit Modal
interface EditModalProps {
  plan: LessonPlan;
  onClose: () => void;
  onSave: (formData: any) => void;
  t: (key: string) => string;
}

function EditModal({ plan, onClose, onSave, t }: EditModalProps) {
  const [formData, setFormData] = useState({
    title: plan.title,
    subject: plan.subject,
    grade: plan.grade,
    duration: plan.duration,
    templateType: plan.templateType,
    status: plan.status,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('edit_lesson_plan') || 'Ders Planını Düzenle'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('edit_description') || 'Ders planı bilgilerini güncelleyin'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('title') || 'Başlık'}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('subject') || 'Ders'}
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('grade') || 'Sınıf'}
              </label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('duration') || 'Süre'} ({t('minutes') || 'dk'})
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                min="15"
                max="180"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('template_type') || 'Şablon Tipi'}
              </label>
              <input
                type="text"
                value={formData.templateType}
                onChange={(e) => setFormData({ ...formData, templateType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('status') || 'Durum'}
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="draft">{t('draft') || 'Taslak'}</option>
              <option value="published">{t('published') || 'Yayınlanmış'}</option>
              <option value="archived">{t('archived') || 'Arşivlenmiş'}</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              {t('cancel') || 'İptal'}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {t('save_changes') || 'Değişiklikleri Kaydet'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Create Modal
interface CreateModalProps {
  onClose: () => void;
  onSave: (formData: any) => void;
  t: (key: string) => string;
}

function CreateModal({ onClose, onSave, t }: CreateModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    grade: '',
    duration: 45,
    templateType: 'Custom',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('create_new_lesson_plan') || 'Yeni Ders Planı Oluştur'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('create_description') || 'Yeni bir ders planı oluşturmak için bilgileri girin'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('title') || 'Başlık'}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Ders planı başlığı"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('subject') || 'Ders'}
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Matematik, Fizik, vs."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('grade') || 'Sınıf'}
              </label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="9, 10, 11, 12"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('duration') || 'Süre'} ({t('minutes') || 'dk'})
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                min="15"
                max="180"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('template_type') || 'Şablon Tipi'}
              </label>
              <select
                value={formData.templateType}
                onChange={(e) => setFormData({ ...formData, templateType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="Custom">{t('custom') || 'Özel'}</option>
                <option value="5E Model">5E Model</option>
                <option value="Project-Based">Project-Based</option>
                <option value="Traditional">Traditional</option>
                <option value="Flipped">Flipped Classroom</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              {t('cancel') || 'İptal'}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-5 h-5" />
              {t('create') || 'Oluştur'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
