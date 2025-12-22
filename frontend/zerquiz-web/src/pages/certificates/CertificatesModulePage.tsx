import React, { useState, useEffect, useMemo } from 'react';
import { toast } from '@/components/common/Alert';
import Tabs from '@/components/common/Tabs';
import Button from '@/components/common/Button';
import {
  Award,
  Download,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Share2,
  Mail,
  QrCode,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  Copy,
  ExternalLink,
  Settings,
  Plus,
  Edit,
  Trash2,
  Printer,
  Upload,
  Layout,
  Star,
  Shield,
  Clock,
  BarChart3,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

// Types
interface Certificate {
  id: string;
  certificateNumber: string;
  studentName: string;
  studentEmail: string;
  examTitle: string;
  examId: string;
  score: number;
  grade: string;
  maxScore: number;
  percentage: number;
  issueDate: string;
  expiryDate?: string;
  template: string;
  templateName: string;
  status: 'active' | 'revoked' | 'expired';
  qrCode: string;
  verificationUrl: string;
  downloadCount: number;
  viewCount: number;
  sharedCount: number;
  issuerName: string;
  issuerTitle: string;
  skills?: string[];
  achievements?: string[];
}

interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'classic' | 'modern' | 'minimal' | 'premium';
  orientation: 'landscape' | 'portrait';
  primaryColor: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

interface CertificateStats {
  totalIssued: number;
  activeCount: number;
  revokedCount: number;
  expiredCount: number;
  avgScore: number;
  totalDownloads: number;
  totalViews: number;
  monthlyIssued: number;
  topTemplate: string;
}

interface VerificationResult {
  valid: boolean;
  certificate?: Certificate;
  message: string;
}

// Mock Data
const mockStats: CertificateStats = {
  totalIssued: 1247,
  activeCount: 1189,
  revokedCount: 12,
  expiredCount: 46,
  avgScore: 85.4,
  totalDownloads: 3421,
  totalViews: 8956,
  monthlyIssued: 124,
  topTemplate: 'Premium Gold',
};

const mockTemplates: CertificateTemplate[] = [
  {
    id: '1',
    name: 'Classic Blue',
    description: 'Geleneksel mavi kenarlı sertifika tasarımı',
    preview: '🎓',
    category: 'classic',
    orientation: 'landscape',
    primaryColor: '#3B82F6',
    isActive: true,
    usageCount: 456,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Modern Gradient',
    description: 'Modern gradient arka planlı tasarım',
    preview: '✨',
    category: 'modern',
    orientation: 'landscape',
    primaryColor: '#8B5CF6',
    isActive: true,
    usageCount: 342,
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    name: 'Minimal White',
    description: 'Minimalist beyaz temiz tasarım',
    preview: '📄',
    category: 'minimal',
    orientation: 'portrait',
    primaryColor: '#6B7280',
    isActive: true,
    usageCount: 178,
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    name: 'Premium Gold',
    description: 'Lüks altın yaldızlı premium tasarım',
    preview: '👑',
    category: 'premium',
    orientation: 'landscape',
    primaryColor: '#F59E0B',
    isActive: true,
    usageCount: 271,
    createdAt: '2024-02-15',
  },
];

const mockCertificates: Certificate[] = [
  {
    id: '1',
    certificateNumber: 'CERT-2024-001247',
    studentName: 'Ahmet Yılmaz',
    studentEmail: 'ahmet@example.com',
    examTitle: 'Advanced Mathematics - Final Exam',
    examId: 'exam-123',
    score: 95,
    grade: 'A+',
    maxScore: 100,
    percentage: 95,
    issueDate: '2024-01-15',
    template: '4',
    templateName: 'Premium Gold',
    status: 'active',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CERT-2024-001247',
    verificationUrl: 'https://zerquiz.com/verify/CERT-2024-001247',
    downloadCount: 5,
    viewCount: 23,
    sharedCount: 2,
    issuerName: 'Dr. Mehmet Demir',
    issuerTitle: 'Matematik Departmanı Başkanı',
    skills: ['İleri Matematik', 'Problem Çözme', 'Analitik Düşünme'],
    achievements: ['En yüksek not', 'Dönem birincisi'],
  },
  {
    id: '2',
    certificateNumber: 'CERT-2024-001246',
    studentName: 'Ayşe Kaya',
    studentEmail: 'ayse@example.com',
    examTitle: 'Physics - Quantum Mechanics',
    examId: 'exam-124',
    score: 88,
    grade: 'A',
    maxScore: 100,
    percentage: 88,
    issueDate: '2024-01-14',
    template: '1',
    templateName: 'Classic Blue',
    status: 'active',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CERT-2024-001246',
    verificationUrl: 'https://zerquiz.com/verify/CERT-2024-001246',
    downloadCount: 3,
    viewCount: 15,
    sharedCount: 1,
    issuerName: 'Prof. Dr. Ali Veli',
    issuerTitle: 'Fizik Departmanı',
    skills: ['Kuantum Mekaniği', 'Teorik Fizik'],
  },
  {
    id: '3',
    certificateNumber: 'CERT-2024-001245',
    studentName: 'Mehmet Öz',
    studentEmail: 'mehmet@example.com',
    examTitle: 'Computer Science - Algorithms',
    examId: 'exam-125',
    score: 92,
    grade: 'A',
    maxScore: 100,
    percentage: 92,
    issueDate: '2024-01-13',
    template: '2',
    templateName: 'Modern Gradient',
    status: 'active',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CERT-2024-001245',
    verificationUrl: 'https://zerquiz.com/verify/CERT-2024-001245',
    downloadCount: 7,
    viewCount: 31,
    sharedCount: 3,
    issuerName: 'Dr. Zeynep Arslan',
    issuerTitle: 'Bilgisayar Bilimleri Bölümü',
    skills: ['Algoritmalar', 'Veri Yapıları', 'Problem Çözme'],
  },
];

export default function CertificatesModulePage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('certificates');
  const [loading, setLoading] = useState(false);

  // State
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);
  const [templates, setTemplates] = useState<CertificateTemplate[]>(mockTemplates);
  const [stats, setStats] = useState<CertificateStats>(mockStats);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Certificate['status']>('all');
  const [templateFilter, setTemplateFilter] = useState<'all' | string>('all');
  const [gradeFilter, setGradeFilter] = useState<'all' | string>('all');

  // Verification
  const [verifyToken, setVerifyToken] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  // Modal state
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isTemplatePreviewOpen, setIsTemplatePreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<CertificateTemplate | null>(null);

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Sertifika verileri yüklendi');
    } catch (error) {
      toast.error('Veri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Filtered certificates
  const filteredCertificates = useMemo(() => {
    return certificates.filter(cert => {
      const matchesSearch = 
        cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.examTitle.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
      const matchesTemplate = templateFilter === 'all' || cert.template === templateFilter;
      const matchesGrade = gradeFilter === 'all' || cert.grade === gradeFilter;

      return matchesSearch && matchesStatus && matchesTemplate && matchesGrade;
    });
  }, [certificates, searchTerm, statusFilter, templateFilter, gradeFilter]);

  // Tabs configuration
  const tabs = useMemo(() => [
    { id: 'certificates', label: t('certificates') || 'Sertifikalar' },
    { id: 'verification', label: t('verification') || 'Doğrulama' },
    { id: 'templates', label: t('templates') || 'Şablonlar' },
    { id: 'analytics', label: t('analytics') || 'Analitik' },
    { id: 'settings', label: t('settings') || 'Ayarlar' },
  ], [t]);

  // Handlers
  const handleVerify = async () => {
    if (!verifyToken.trim()) {
      toast.error('Lütfen sertifika numarası girin');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const cert = certificates.find(c => c.certificateNumber === verifyToken.toUpperCase());
      
      if (cert) {
        setVerificationResult({
          valid: true,
          certificate: cert,
          message: 'Sertifika geçerli ve doğrulandı',
        });
        toast.success('Sertifika doğrulandı!');
      } else {
        setVerificationResult({
          valid: false,
          message: 'Bu numaraya ait sertifika bulunamadı',
        });
        toast.error('Sertifika bulunamadı');
      }
    } catch (error) {
      toast.error('Doğrulama sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificateId: string) => {
    try {
      toast.info('Sertifika indiriliyor...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCertificates(prev => prev.map(c => 
        c.id === certificateId ? { ...c, downloadCount: c.downloadCount + 1 } : c
      ));
      
      toast.success('Sertifika başarıyla indirildi');
    } catch (error) {
      toast.error('İndirme sırasında hata oluştu');
    }
  };

  const handleShare = async (certificate: Certificate) => {
    try {
      await navigator.clipboard.writeText(certificate.verificationUrl);
      
      setCertificates(prev => prev.map(c => 
        c.id === certificate.id ? { ...c, sharedCount: c.sharedCount + 1 } : c
      ));
      
      toast.success('Doğrulama linki kopyalandı');
    } catch (error) {
      toast.error('Link kopyalanamadı');
    }
  };

  const handleSendEmail = async (certificate: Certificate) => {
    try {
      toast.info('E-posta gönderiliyor...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Sertifika ${certificate.studentEmail} adresine gönderildi`);
    } catch (error) {
      toast.error('E-posta gönderilemedi');
    }
  };

  const handleRevoke = async (certificateId: string) => {
    if (!window.confirm('Bu sertifikayı iptal etmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setCertificates(prev => prev.map(c => 
        c.id === certificateId ? { ...c, status: 'revoked' as const } : c
      ));
      toast.success('Sertifika iptal edildi');
    } catch (error) {
      toast.error('İptal işlemi başarısız');
    }
  };

  const handleBulkDownload = async () => {
    try {
      toast.info(`${filteredCertificates.length} sertifika toplu olarak indiriliyor...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simüle: Her bir sertifikanın indirme sayısını artır
      const ids = filteredCertificates.map(c => c.id);
      setCertificates(prev => prev.map(c => 
        ids.includes(c.id) ? { ...c, downloadCount: c.downloadCount + 1 } : c
      ));
      
      toast.success('Toplu indirme tamamlandı!');
    } catch (error) {
      toast.error('Toplu indirme başarısız');
    }
  };

  const getStatusBadge = (status: Certificate['status']) => {
    const configs = {
      active: { label: 'Aktif', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      revoked: { label: 'İptal', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
      expired: { label: 'Süresi Dolmuş', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
    };
    const config = configs[status];
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>{config.label}</span>;
  };

  const getGradeBadge = (grade: string, score: number) => {
    let color = 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    if (score >= 90) color = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    else if (score >= 80) color = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    else if (score >= 70) color = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    else if (score >= 60) color = 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    
    return <span className={`px-3 py-1 rounded-lg text-sm font-bold ${color}`}>{grade} ({score})</span>;
  };

  // Yeni sertifika oluşturma
  const handleCreateCertificate = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveNewCertificate = async (data: any) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCert: Certificate = {
        id: (certificates.length + 1).toString(),
        certificateNumber: `CERT-2024-${String(certificates.length + 1).padStart(6, '0')}`,
        studentName: data.studentName,
        studentEmail: data.studentEmail,
        examTitle: data.examTitle,
        examId: 'exam-' + Math.random().toString(36).substr(2, 9),
        score: data.score,
        grade: data.grade,
        maxScore: 100,
        percentage: data.score,
        issueDate: new Date().toISOString().split('T')[0],
        template: data.templateId,
        templateName: templates.find(t => t.id === data.templateId)?.name || 'Classic Blue',
        status: 'active',
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CERT-2024-${String(certificates.length + 1).padStart(6, '0')}`,
        verificationUrl: `https://zerquiz.com/verify/CERT-2024-${String(certificates.length + 1).padStart(6, '0')}`,
        downloadCount: 0,
        viewCount: 0,
        sharedCount: 0,
        issuerName: 'Dr. Admin User',
        issuerTitle: 'Platform Yöneticisi',
        skills: data.skills || [],
        achievements: data.achievements || [],
      };

      setCertificates(prev => [newCert, ...prev]);
      setStats(prev => ({
        ...prev,
        totalIssued: prev.totalIssued + 1,
        activeCount: prev.activeCount + 1,
        monthlyIssued: prev.monthlyIssued + 1,
      }));
      
      setIsCreateModalOpen(false);
      toast.success('Yeni sertifika başarıyla oluşturuldu!');
    } catch (error) {
      toast.error('Sertifika oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Şablon yönetimi
  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setIsTemplateModalOpen(true);
  };

  const handleEditTemplate = (template: CertificateTemplate) => {
    setEditingTemplate(template);
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplate = async (data: any) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingTemplate) {
        // Güncelleme
        setTemplates(prev => prev.map(t => 
          t.id === editingTemplate.id ? { ...t, ...data, usageCount: t.usageCount } : t
        ));
        toast.success('Şablon başarıyla güncellendi!');
      } else {
        // Yeni oluşturma
        const newTemplate: CertificateTemplate = {
          ...data,
          id: (templates.length + 1).toString(),
          usageCount: 0,
          createdAt: new Date().toISOString(),
        };
        setTemplates(prev => [...prev, newTemplate]);
        toast.success('Yeni şablon başarıyla oluşturuldu!');
      }
      
      setIsTemplateModalOpen(false);
    } catch (error) {
      toast.error('Şablon kaydedilirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!window.confirm('Bu şablonu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const template = templates.find(t => t.id === id);
      if (template && template.usageCount > 0) {
        toast.warning(`Bu şablon ${template.usageCount} sertifikada kullanılıyor. Yine de silmek istiyor musunuz?`);
        if (!window.confirm('Kullanılan şablonu silmek sertifikaları etkileyebilir. Devam edilsin mi?')) {
          return;
        }
      }

      setTemplates(prev => prev.filter(t => t.id !== id));
      toast.success('Şablon silindi');
    } catch (error) {
      toast.error('Şablon silinirken hata oluştu');
    }
  };

  const handlePreviewTemplate = (template: CertificateTemplate) => {
    setSelectedTemplate(template);
    setIsTemplatePreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Award className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('certificate_management') || 'Sertifika Yönetimi'}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Dijital sertifika oluşturma, yönetim ve doğrulama sistemi</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleBulkDownload} variant="secondary" className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              {t('bulk_download') || 'Toplu İndir'}
            </Button>
            <Button onClick={handleCreateCertificate} variant="primary" className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {t('create_certificate') || 'Yeni Sertifika'}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Certificates Tab */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Toplam Sertifika</p>
                  <p className="text-4xl font-bold mt-2">{stats.totalIssued.toLocaleString()}</p>
                </div>
                <Award className="w-12 h-12 text-blue-200" />
              </div>
              <div className="flex items-center gap-2 text-blue-100 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Bu ay: {stats.monthlyIssued}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-green-100 text-sm font-medium">Aktif Sertifikalar</p>
                  <p className="text-4xl font-bold mt-2">{stats.activeCount.toLocaleString()}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-200" />
              </div>
              <p className="text-green-100 text-sm">İptal: {stats.revokedCount} • Süresi Dolmuş: {stats.expiredCount}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Ortalama Not</p>
                  <p className="text-4xl font-bold mt-2">{stats.avgScore.toFixed(1)}</p>
                </div>
                <Star className="w-12 h-12 text-purple-200" />
              </div>
              <p className="text-purple-100 text-sm">Başarı ortalaması</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Toplam İndirme</p>
                  <p className="text-4xl font-bold mt-2">{stats.totalDownloads.toLocaleString()}</p>
                </div>
                <Download className="w-12 h-12 text-orange-200" />
              </div>
              <p className="text-orange-100 text-sm">Görüntüleme: {stats.totalViews.toLocaleString()}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Öğrenci adı, sertifika no veya sınav ara..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="active">Aktif</option>
                  <option value="revoked">İptal</option>
                  <option value="expired">Süresi Dolmuş</option>
                </select>
              </div>

              <div>
                <select
                  value={templateFilter}
                  onChange={(e) => setTemplateFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tüm Şablonlar</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCertificates.map((certificate) => (
              <div key={certificate.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{certificate.studentName}</h3>
                      {getStatusBadge(certificate.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{certificate.examTitle}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{certificate.certificateNumber}</p>
                  </div>
                  <div className="text-right">
                    {getGradeBadge(certificate.grade, certificate.score)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(certificate.issueDate).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Download className="w-4 h-4" />
                    <span>{certificate.downloadCount}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span>{certificate.viewCount}</span>
                  </div>
                </div>

                {certificate.skills && certificate.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {certificate.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedCertificate(certificate);
                      setIsPreviewOpen(true);
                    }}
                    variant="secondary"
                    className="flex-1 flex items-center justify-center gap-2 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Görüntüle
                  </Button>
                  <Button
                    onClick={() => handleDownload(certificate.id)}
                    variant="primary"
                    className="flex-1 flex items-center justify-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    İndir
                  </Button>
                  <Button
                    onClick={() => handleShare(certificate)}
                    variant="secondary"
                    className="flex items-center justify-center gap-2 text-sm px-3"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleSendEmail(certificate)}
                    variant="secondary"
                    className="flex items-center justify-center gap-2 text-sm px-3"
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredCertificates.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Sertifika bulunamadı</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Farklı filtreler deneyin</p>
            </div>
          )}
        </div>
      )}

      {/* Verification Tab */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sertifika Doğrulama</h2>
                <p className="text-gray-600 dark:text-gray-400">Sertifika numarasını girerek doğrulayın</p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={verifyToken}
                    onChange={(e) => setVerifyToken(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                    placeholder="CERT-2024-001247"
                    className="flex-1 px-6 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Button
                    onClick={handleVerify}
                    disabled={loading}
                    className="px-8 py-4 text-lg flex items-center gap-2"
                  >
                    {loading ? (
                      <Clock className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                    Doğrula
                  </Button>
                </div>

                {verificationResult && (
                  <div className={`p-6 rounded-xl border-2 ${
                    verificationResult.valid
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                  }`}>
                    {verificationResult.valid && verificationResult.certificate ? (
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                          <div>
                            <h3 className="text-xl font-bold text-green-900 dark:text-green-100">✓ Sertifika Geçerli</h3>
                            <p className="text-green-700 dark:text-green-300 text-sm">{verificationResult.message}</p>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Öğrenci</p>
                              <p className="font-semibold text-gray-900 dark:text-white">{verificationResult.certificate.studentName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Sınav</p>
                              <p className="font-semibold text-gray-900 dark:text-white">{verificationResult.certificate.examTitle}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Not</p>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {verificationResult.certificate.score} / {verificationResult.certificate.maxScore} ({verificationResult.certificate.grade})
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Tarih</p>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {new Date(verificationResult.certificate.issueDate).toLocaleDateString('tr-TR')}
                              </p>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Sertifikayı Veren</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{verificationResult.certificate.issuerName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{verificationResult.certificate.issuerTitle}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        <div>
                          <h3 className="text-xl font-bold text-red-900 dark:text-red-100">✗ Sertifika Geçersiz</h3>
                          <p className="text-red-700 dark:text-red-300 text-sm">{verificationResult.message}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sertifika Şablonları</h2>
            <Button onClick={handleCreateTemplate} className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Yeni Şablon
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-6xl">{template.preview}</div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                    template.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {template.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{template.description}</p>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Kategori:</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{template.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Yönelim:</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{template.orientation}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Kullanım:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{template.usageCount}x</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => handlePreviewTemplate(template)}
                    variant="secondary" 
                    className="flex-1 text-sm flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Önizle
                  </Button>
                  <Button 
                    onClick={() => handleEditTemplate(template)}
                    variant="secondary" 
                    className="text-sm px-3"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => handleDeleteTemplate(template.id)}
                    variant="danger" 
                    className="text-sm px-3"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center py-12">
              <BarChart3 className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analitik Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Detaylı grafik ve raporlar yakında eklenecek
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Aylık Trend</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">+{stats.monthlyIssued}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400 mb-1">Başarı Oranı</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{((stats.activeCount / stats.totalIssued) * 100).toFixed(1)}%</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">En Popüler</p>
                  <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{stats.topTemplate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center py-12">
              <Settings className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sertifika Ayarları</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yapılandırma seçenekleri yakında eklenecek
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Preview Modal */}
      {isPreviewOpen && selectedCertificate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsPreviewOpen(false);
                setSelectedCertificate(null);
              }}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              ✕
            </button>

            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Award className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{selectedCertificate.studentName}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">{selectedCertificate.examTitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sertifika Numarası</p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedCertificate.certificateNumber}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Düzenleme Tarihi</p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">
                  {new Date(selectedCertificate.issueDate).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Not</p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">
                  {selectedCertificate.score} / {selectedCertificate.maxScore}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Harf Notu</p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedCertificate.grade}</p>
              </div>
            </div>

            {selectedCertificate.skills && selectedCertificate.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Kazanılan Yetenekler</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCertificate.skills.map((skill, idx) => (
                    <span key={idx} className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8 text-center">
              <img 
                src={selectedCertificate.qrCode}
                alt="QR Code"
                className="w-40 h-40 mx-auto border-4 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                QR kodu tarayarak doğrulayın
              </p>
            </div>

            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl mb-8">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Düzenleyen</p>
              <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedCertificate.issuerName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCertificate.issuerTitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleDownload(selectedCertificate.id)}
                variant="primary"
                className="flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                PDF İndir
              </Button>
              <Button
                onClick={() => handleShare(selectedCertificate)}
                variant="secondary"
                className="flex items-center justify-center gap-2"
              >
                <Copy className="w-5 h-5" />
                Link Kopyala
              </Button>
              <Button
                onClick={() => handleSendEmail(selectedCertificate)}
                variant="secondary"
                className="flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                E-posta Gönder
              </Button>
              <Button
                onClick={() => window.open(selectedCertificate.verificationUrl, '_blank')}
                variant="secondary"
                className="flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                Online Doğrula
              </Button>
            </div>

            {selectedCertificate.status === 'active' && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={() => handleRevoke(selectedCertificate.id)}
                  variant="danger"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Sertifikayı İptal Et
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Create Certificate Modal */}
      {isCreateModalOpen && (
        <CreateCertificateModal
          templates={templates}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveNewCertificate}
          loading={loading}
        />
      )}

      {/* Template Form Modal */}
      {isTemplateModalOpen && (
        <TemplateFormModal
          template={editingTemplate}
          onClose={() => setIsTemplateModalOpen(false)}
          onSave={handleSaveTemplate}
          loading={loading}
        />
      )}

      {/* Template Preview Modal */}
      {isTemplatePreviewOpen && selectedTemplate && (
        <TemplatePreviewModal
          template={selectedTemplate}
          onClose={() => {
            setIsTemplatePreviewOpen(false);
            setSelectedTemplate(null);
          }}
        />
      )}
    </div>
  );
}

// Modal Components
interface CreateCertificateModalProps {
  templates: CertificateTemplate[];
  onClose: () => void;
  onSave: (data: any) => void;
  loading: boolean;
}

function CreateCertificateModal({ templates, onClose, onSave, loading }: CreateCertificateModalProps) {
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    examTitle: '',
    score: 0,
    grade: 'F',
    templateId: templates[0]?.id || '1',
    skills: [] as string[],
    achievements: [] as string[],
  });
  const [skillInput, setSkillInput] = useState('');

  const calculateGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'C+';
    if (score >= 65) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const handleScoreChange = (score: number) => {
    setFormData(prev => ({
      ...prev,
      score,
      grade: calculateGrade(score),
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.studentEmail || !formData.examTitle) {
      toast.error('Lütfen tüm zorunlu alanları doldurun');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Yeni Sertifika Oluştur</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Öğrenci bilgilerini girin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Öğrenci Adı *
            </label>
            <input
              type="text"
              value={formData.studentName}
              onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Ahmet Yılmaz"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-posta Adresi *
            </label>
            <input
              type="email"
              value={formData.studentEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, studentEmail: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="ahmet@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sınav Başlığı *
            </label>
            <input
              type="text"
              value={formData.examTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, examTitle: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Advanced Mathematics - Final Exam"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Not (0-100) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.score}
                onChange={(e) => handleScoreChange(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Harf Notu
              </label>
              <input
                type="text"
                value={formData.grade}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Şablon Seç *
            </label>
            <select
              value={formData.templateId}
              onChange={(e) => setFormData(prev => ({ ...prev, templateId: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Beceriler (Opsiyonel)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Beceri ekle ve Enter'a bas"
              />
              <Button type="button" onClick={handleAddSkill} variant="secondary">
                Ekle
              </Button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm flex items-center gap-2">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-600"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onClose} variant="secondary" className="flex-1">
              İptal
            </Button>
            <Button type="submit" disabled={loading} variant="primary" className="flex-1">
              {loading ? 'Oluşturuluyor...' : 'Oluştur'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface TemplateFormModalProps {
  template: CertificateTemplate | null;
  onClose: () => void;
  onSave: (data: any) => void;
  loading: boolean;
}

function TemplateFormModal({ template, onClose, onSave, loading }: TemplateFormModalProps) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    preview: template?.preview || '📜',
    category: template?.category || 'classic' as const,
    orientation: template?.orientation || 'landscape' as const,
    primaryColor: template?.primaryColor || '#3B82F6',
    isActive: template?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      toast.error('Lütfen tüm zorunlu alanları doldurun');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Layout className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {template ? 'Şablonu Düzenle' : 'Yeni Şablon Oluştur'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Şablon Adı *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Premium Gold"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Açıklama *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Lüks altın yaldızlı premium tasarım"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Emoji/Icon
              </label>
              <input
                type="text"
                value={formData.preview}
                onChange={(e) => setFormData(prev => ({ ...prev, preview: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-2xl text-center"
                maxLength={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ana Renk
              </label>
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
                <option value="minimal">Minimal</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Yönelim
              </label>
              <select
                value={formData.orientation}
                onChange={(e) => setFormData(prev => ({ ...prev, orientation: e.target.value as any }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="landscape">Landscape (Yatay)</option>
                <option value="portrait">Portrait (Dikey)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Şablon aktif olsun
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onClose} variant="secondary" className="flex-1">
              İptal
            </Button>
            <Button type="submit" disabled={loading} variant="primary" className="flex-1">
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface TemplatePreviewModalProps {
  template: CertificateTemplate;
  onClose: () => void;
}

function TemplatePreviewModal({ template, onClose }: TemplatePreviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="text-8xl mb-4">{template.preview}</div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{template.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">{template.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Kategori</p>
            <p className="font-bold text-gray-900 dark:text-white capitalize">{template.category}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Yönelim</p>
            <p className="font-bold text-gray-900 dark:text-white capitalize">{template.orientation}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Kullanım Sayısı</p>
            <p className="font-bold text-gray-900 dark:text-white">{template.usageCount}x</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ana Renk</p>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded border-2 border-gray-300" 
                style={{ backgroundColor: template.primaryColor }}
              />
              <p className="font-bold text-gray-900 dark:text-white">{template.primaryColor}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl mb-6">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Durum</p>
          <p className={`text-lg font-bold ${template.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {template.isActive ? '✓ Aktif' : '✗ Pasif'}
          </p>
        </div>

        <Button onClick={onClose} variant="primary" className="w-full">
          Kapat
        </Button>
      </div>
    </div>
  );
}

