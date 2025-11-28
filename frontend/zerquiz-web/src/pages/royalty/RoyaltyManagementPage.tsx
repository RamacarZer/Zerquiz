import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Search,
  Filter,
  BarChart3,
  UserCheck,
  Building2,
  Home,
  Globe,
  ShoppingCart,
  Eye,
  Edit,
  XCircle,
  Plus,
  FileCheck,
  Scale,
} from 'lucide-react';
import {
  demoAuthors,
  demoRoyaltyWorks,
  demoRoyaltyPayments,
  demoRoyaltyAudits,
  demoRoyaltyContracts,
  demoRoyaltyDisputes,
  demoRoyaltyReport,
  getAuthorsByType,
  getTotalPendingPayments,
  getTotalEarningsByType,
  getAuditSummary,
  type RoyaltyType,
  type Author,
  type RoyaltyWork,
  type RoyaltyPayment,
  type RoyaltyAudit,
  type RoyaltyDispute,
} from '../../mocks/royaltyData';

type ActiveTab = 
  | 'overview' 
  | 'internal' 
  | 'external' 
  | 'employee' 
  | 'remote' 
  | 'customer'
  | 'payments'
  | 'audits'
  | 'disputes'
  | 'contracts'
  | 'reports';

export default function RoyaltyManagementPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoyaltyType, setSelectedRoyaltyType] = useState<RoyaltyType | 'all'>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'bank_transfer' | 'paypal' | 'stripe' | 'check'>('bank_transfer');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const overviewRef = useRef<HTMLDivElement>(null);
  const employeeRef = useRef<HTMLDivElement>(null);
  const externalRef = useRef<HTMLDivElement>(null);
  const remoteRef = useRef<HTMLDivElement>(null);
  const customerRef = useRef<HTMLDivElement>(null);
  const paymentsRef = useRef<HTMLDivElement>(null);
  const auditsRef = useRef<HTMLDivElement>(null);

  const auditSummary = getAuditSummary();
  const totalPendingPayments = getTotalPendingPayments();
  const earningsByType = getTotalEarningsByType();

  // URL'e göre aktif sekmeyi belirle
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    const tabMap: Record<string, { tab: ActiveTab; ref: React.RefObject<HTMLDivElement> }> = {
      'overview': { tab: 'overview', ref: overviewRef },
      'employee': { tab: 'employee', ref: employeeRef },
      'internal': { tab: 'employee', ref: employeeRef },
      'external': { tab: 'external', ref: externalRef },
      'remote': { tab: 'remote', ref: remoteRef },
      'customer': { tab: 'customer', ref: customerRef },
      'payments': { tab: 'payments', ref: paymentsRef },
      'audits': { tab: 'audits', ref: auditsRef },
    };

    if (path && tabMap[path]) {
      setActiveTab(tabMap[path].tab);
      setTimeout(() => {
        tabMap[path].ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location.pathname]);

  const getRoyaltyTypeIcon = (type: RoyaltyType) => {
    switch (type) {
      case 'employee': return <UserCheck className="h-5 w-5" />;
      case 'external': return <Globe className="h-5 w-5" />;
      case 'remote': return <Home className="h-5 w-5" />;
      case 'customer': return <ShoppingCart className="h-5 w-5" />;
      case 'internal': return <Building2 className="h-5 w-5" />;
    }
  };

  const getRoyaltyTypeColor = (type: RoyaltyType) => {
    switch (type) {
      case 'employee': return 'bg-blue-100 text-blue-700';
      case 'external': return 'bg-purple-100 text-purple-700';
      case 'remote': return 'bg-green-100 text-green-700';
      case 'customer': return 'bg-orange-100 text-orange-700';
      case 'internal': return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      active: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle className="h-3 w-3" /> },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock className="h-3 w-3" /> },
      approved: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle className="h-3 w-3" /> },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle className="h-3 w-3" /> },
      completed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <CheckCircle className="h-3 w-3" /> },
      suspended: { bg: 'bg-gray-100', text: 'text-gray-700', icon: <AlertTriangle className="h-3 w-3" /> },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredAuthors = demoAuthors.filter((author) => {
    const matchesSearch = author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         author.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedRoyaltyType === 'all' || author.type === selectedRoyaltyType;
    return matchesSearch && matchesType;
  });

  // Helper functions
  const handleOpenPaymentModal = (author?: Author) => {
    if (author) {
      // Seçili yazar için bekleyen ödemelerini bul ve otomatik seç
      const authorPendingPayments = demoRoyaltyPayments
        .filter(p => p.authorId === author.id && p.status === 'pending')
        .map(p => p.id);
      setSelectedPayments(authorPendingPayments);
    } else {
      // Tüm bekleyen ödemeleri seç
      const allPendingPayments = demoRoyaltyPayments
        .filter(p => p.status === 'pending')
        .map(p => p.id);
      setSelectedPayments(allPendingPayments);
    }
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPaymentData = demoRoyaltyPayments.filter(p => selectedPayments.includes(p.id));
    const totalAmount = selectedPaymentData.reduce((sum, p) => sum + p.netAmount, 0);
    
    setSuccessMessage(
      `✅ Ödeme işlemi başarılı! ${selectedPayments.length} ödeme (${totalAmount.toLocaleString()} ₺) ${selectedPaymentMethod} ile işleme alındı.`
    );
    setShowSuccessMessage(true);
    setShowPaymentModal(false);
    setSelectedPayments([]);
    
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  const handleTogglePayment = (paymentId: string) => {
    setSelectedPayments(prev => 
      prev.includes(paymentId) 
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleSelectAllPayments = () => {
    const allPendingIds = demoRoyaltyPayments
      .filter(p => p.status === 'pending')
      .map(p => p.id);
    setSelectedPayments(allPendingIds);
  };

  const handleDeselectAllPayments = () => {
    setSelectedPayments([]);
  };

  const selectedPaymentTotal = demoRoyaltyPayments
    .filter(p => selectedPayments.includes(p.id))
    .reduce((sum, p) => sum + p.netAmount, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 max-w-md">
            <CheckCircle className="h-6 w-6 flex-shrink-0" />
            <p className="text-sm font-medium">{successMessage}</p>
            <button
              onClick={() => setShowSuccessMessage(false)}
              className="ml-auto p-1 hover:bg-green-700 rounded transition"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Telif Yönetim Sistemi</h1>
                <p className="text-sm text-gray-600">İç/Dış Telif, Personel, Uzaktan & Müşteri Yönetimi</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedAuthor(null);
                  setShowAuthorModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                <Plus className="h-4 w-4" />
                Yeni Yazar
              </button>
              <button
                onClick={() => handleOpenPaymentModal()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                <Download className="h-4 w-4" />
                Rapor İndir
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'overview', label: 'Genel Bakış', icon: '📊', ref: overviewRef },
              { id: 'employee', label: 'İç Telif (Personel)', icon: '👥', ref: employeeRef },
              { id: 'external', label: 'Dış Telif', icon: '🌐', ref: externalRef },
              { id: 'remote', label: 'Uzaktan Çalışan', icon: '🏠', ref: remoteRef },
              { id: 'customer', label: 'Müşteri Telif', icon: '🛒', ref: customerRef },
              { id: 'payments', label: 'Ödemeler', icon: '💰', ref: paymentsRef },
              { id: 'audits', label: 'Denetimler', icon: '🔍', ref: auditsRef },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as ActiveTab);
                  tab.ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Overview Statistics */}
        <div ref={overviewRef} className="scroll-mt-24 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Genel Bakış</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm text-gray-600">Toplam Yazar</div>
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{demoAuthors.length}</div>
              <div className="text-sm text-gray-500 mt-2">
                {demoAuthors.filter(a => a.status === 'active').length} aktif
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm text-gray-600">Toplam İçerik</div>
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{demoRoyaltyWorks.length}</div>
              <div className="text-sm text-gray-500 mt-2">
                {demoRoyaltyWorks.filter(w => w.status === 'approved').length} onaylı
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm text-gray-600">Bekleyen Ödeme</div>
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {totalPendingPayments.toLocaleString()} ₺
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {demoRoyaltyPayments.filter(p => p.status === 'pending').length} ödeme
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm text-gray-600">Denetim Uyum</div>
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">%{auditSummary.complianceRate}</div>
              <div className="text-sm text-gray-500 mt-2">
                {auditSummary.issuesResolved}/{auditSummary.issuesFound} sorun çözüldü
              </div>
            </div>
          </div>

          {/* Royalty Type Breakdown */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Telif Tiplerine Göre Dağılım</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {(['employee', 'external', 'remote', 'customer', 'internal'] as RoyaltyType[]).map((type) => {
                const authors = getAuthorsByType(type);
                const earnings = earningsByType[type];
                const typeLabels: Record<RoyaltyType, string> = {
                  employee: 'İç Telif (Personel)',
                  external: 'Dış Telif',
                  remote: 'Uzaktan Çalışan',
                  customer: 'Müşteri',
                  internal: 'Kurum İçi',
                };

                return (
                  <div key={type} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-2 rounded-lg ${getRoyaltyTypeColor(type)}`}>
                        {getRoyaltyTypeIcon(type)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{typeLabels[type]}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-gray-900">{authors.length}</p>
                      <p className="text-xs text-gray-500">Yazar</p>
                      <p className="text-lg font-semibold text-indigo-600">{earnings.toLocaleString()} ₺</p>
                      <p className="text-xs text-gray-500">Toplam Kazanç</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Yazar adı veya e-posta ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={selectedRoyaltyType}
              onChange={(e) => setSelectedRoyaltyType(e.target.value as RoyaltyType | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Tüm Tipler</option>
              <option value="employee">İç Telif (Personel)</option>
              <option value="external">Dış Telif</option>
              <option value="remote">Uzaktan Çalışan</option>
              <option value="customer">Müşteri</option>
            </select>
          </div>
        </div>

        {/* Authors List */}
        <div ref={employeeRef} className="scroll-mt-24 bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Yazar Listesi</h3>
            <span className="text-sm text-gray-500">{filteredAuthors.length} yazar</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Yazar</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Tip</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Sözleşme</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">İçerik</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Toplam Kazanç</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Bekleyen</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Puan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Durum</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAuthors.map((author) => (
                  <tr key={author.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{author.name}</p>
                        <p className="text-xs text-gray-500">{author.email}</p>
                        {author.department && (
                          <p className="text-xs text-gray-400">{author.department} - {author.position}</p>
                        )}
                        {author.location && (
                          <p className="text-xs text-gray-400">📍 {author.location}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoyaltyTypeColor(author.type)}`}>
                        {getRoyaltyTypeIcon(author.type)}
                        {author.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-700 capitalize">{author.contractType.replace('_', ' ')}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900">{author.totalWorks}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-gray-900">{author.totalEarnings.toLocaleString()} ₺</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-orange-600">{author.pendingPayments.toLocaleString()} ₺</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-medium text-gray-900">{author.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(author.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedAuthor(author);
                            setShowAuthorModal(true);
                          }}
                          className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Detaylar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => alert(`${author.name} düzenleniyor...`)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Düzenle"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payments Section */}
        <div ref={paymentsRef} className="scroll-mt-24 bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              Ödeme Yönetimi
            </h3>
            <button
              onClick={() => handleOpenPaymentModal()}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
            >
              Toplu Ödeme Yap
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Bekleyen Ödemeler</p>
              <p className="text-2xl font-bold text-orange-600">
                {demoRoyaltyPayments.filter(p => p.status === 'pending').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {demoRoyaltyPayments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0).toLocaleString()} ₺
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">İşlemdeki Ödemeler</p>
              <p className="text-2xl font-bold text-blue-600">
                {demoRoyaltyPayments.filter(p => p.status === 'processing').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {demoRoyaltyPayments.filter(p => p.status === 'processing').reduce((s, p) => s + p.amount, 0).toLocaleString()} ₺
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Tamamlanan</p>
              <p className="text-2xl font-bold text-green-600">
                {demoRoyaltyPayments.filter(p => p.status === 'completed').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {demoRoyaltyPayments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0).toLocaleString()} ₺
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Yazar</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Tip</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Tutar</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Vergi</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Net</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Yöntem</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Durum</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Tarih</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {demoRoyaltyPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{payment.authorName}</p>
                      <p className="text-xs text-gray-500">{payment.workIds.length} içerik</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getRoyaltyTypeColor(payment.royaltyType)}`}>
                        {payment.royaltyType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-gray-900">{payment.amount.toLocaleString()} {payment.currency}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-red-600">-{payment.taxDeducted.toLocaleString()} ₺</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-emerald-600">{payment.netAmount.toLocaleString()} ₺</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-700 capitalize">{payment.paymentMethod.replace('_', ' ')}</span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-600">{new Date(payment.requestedDate).toLocaleDateString('tr-TR')}</p>
                      {payment.paidDate && (
                        <p className="text-xs text-green-600">✓ {new Date(payment.paidDate).toLocaleDateString('tr-TR')}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {payment.status === 'pending' && (
                        <button
                          onClick={() => alert(`Ödeme ${payment.id} onaylanıyor...`)}
                          className="px-3 py-1 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-700"
                        >
                          Onayla
                        </button>
                      )}
                      {payment.status === 'completed' && payment.transactionId && (
                        <span className="text-xs text-gray-500">{payment.transactionId}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audits Section */}
        <div ref={auditsRef} className="scroll-mt-24 bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Denetim & Uyumluluk Yönetimi
            </h3>
            <button
              onClick={() => alert('Yeni denetim planlanıyor...')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              Yeni Denetim Planla
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Toplam Denetim</p>
              <p className="text-2xl font-bold text-gray-900">{auditSummary.total}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Tamamlanan</p>
              <p className="text-2xl font-bold text-green-600">{auditSummary.completed}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Devam Eden</p>
              <p className="text-2xl font-bold text-blue-600">{auditSummary.inProgress}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Uyumluluk Oranı</p>
              <p className="text-2xl font-bold text-emerald-600">%{auditSummary.complianceRate}</p>
            </div>
          </div>

          <div className="space-y-4">
            {demoRoyaltyAudits.map((audit) => {
              const riskColors = {
                low: 'bg-green-100 text-green-700',
                medium: 'bg-yellow-100 text-yellow-700',
                high: 'bg-orange-100 text-orange-700',
                critical: 'bg-red-100 text-red-700',
              };

              return (
                <div key={audit.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${riskColors[audit.riskLevel]}`}>
                          {audit.riskLevel.toUpperCase()} RISK
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                          {audit.auditType}
                        </span>
                        {getStatusBadge(audit.status)}
                      </div>
                      <h4 className="font-semibold text-gray-900">{audit.targetName || `${audit.targetType} Denetimi`}</h4>
                      <p className="text-sm text-gray-600">Denetçi: {audit.auditorName}</p>
                      <p className="text-xs text-gray-500">
                        Planlanan: {new Date(audit.scheduledDate).toLocaleDateString('tr-TR')}
                        {audit.completedDate && ` • Tamamlanan: ${new Date(audit.completedDate).toLocaleDateString('tr-TR')}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {audit.issuesResolved}/{audit.issuesFound} Sorun Çözüldü
                      </p>
                    </div>
                  </div>

                  {audit.findings.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-gray-700 mb-1">Bulgular:</p>
                      <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                        {audit.findings.map((finding, idx) => (
                          <li key={idx}>{finding}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {audit.recommendations.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Öneriler:</p>
                      <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                        {audit.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Disputes Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              İtirazlar & Uyuşmazlıklar
            </h3>
            <button
              onClick={() => setShowDisputeModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
            >
              Yeni İtiraz
            </button>
          </div>

          <div className="space-y-4">
            {demoRoyaltyDisputes.map((dispute) => {
              const priorityColors = {
                low: 'bg-gray-100 text-gray-700',
                medium: 'bg-yellow-100 text-yellow-700',
                high: 'bg-red-100 text-red-700',
              };

              return (
                <div key={dispute.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[dispute.priority]}`}>
                          {dispute.priority.toUpperCase()}
                        </span>
                        {getStatusBadge(dispute.status)}
                      </div>
                      <h4 className="font-semibold text-gray-900">{dispute.workTitle}</h4>
                      <p className="text-sm text-gray-600">{dispute.authorName} - {dispute.disputeType}</p>
                      <p className="text-sm text-gray-700 mt-2">{dispute.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Başvuru: {new Date(dispute.filedDate).toLocaleDateString('tr-TR')}
                        {dispute.assignedTo && ` • Atanan: ${dispute.assignedTo}`}
                      </p>
                      {dispute.resolution && (
                        <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                          <p className="text-xs font-medium text-green-700 mb-1">Çözüm:</p>
                          <p className="text-xs text-green-600">{dispute.resolution}</p>
                        </div>
                      )}
                    </div>
                    {dispute.status === 'open' && (
                      <button
                        onClick={() => alert(`İtiraz ${dispute.id} işleme alınıyor...`)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        İşleme Al
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Author Modal */}
      {showAuthorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedAuthor ? 'Yazar Detayları' : 'Yeni Yazar Ekle'}
              </h3>
              <button
                onClick={() => {
                  setShowAuthorModal(false);
                  setSelectedAuthor(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <XCircle className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {selectedAuthor ? (
                // View Mode - Author Details
                <div className="space-y-6">
                  {/* Author Info */}
                  <div className="border-b pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {selectedAuthor.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{selectedAuthor.name}</h4>
                        <p className="text-gray-600">{selectedAuthor.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getRoyaltyTypeColor(selectedAuthor.type)}`}>
                            {selectedAuthor.type}
                          </span>
                          {getStatusBadge(selectedAuthor.status)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statistics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Toplam İçerik</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedAuthor.totalWorks}</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Toplam Kazanç</p>
                      <p className="text-xl font-bold text-emerald-600">{selectedAuthor.totalEarnings.toLocaleString()} ₺</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Bekleyen</p>
                      <p className="text-xl font-bold text-orange-600">{selectedAuthor.pendingPayments.toLocaleString()} ₺</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Puan</p>
                      <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold text-gray-900">{selectedAuthor.rating}</span>
                        <span className="text-yellow-500 text-xl">⭐</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Sözleşme Tipi</p>
                        <p className="text-gray-900 capitalize">{selectedAuthor.contractType.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Katılım Tarihi</p>
                        <p className="text-gray-900">{new Date(selectedAuthor.joinedDate).toLocaleDateString('tr-TR')}</p>
                      </div>
                    </div>

                    {selectedAuthor.department && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Departman</p>
                          <p className="text-gray-900">{selectedAuthor.department}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Pozisyon</p>
                          <p className="text-gray-900">{selectedAuthor.position}</p>
                        </div>
                      </div>
                    )}

                    {selectedAuthor.location && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Lokasyon</p>
                        <p className="text-gray-900">📍 {selectedAuthor.location}</p>
                      </div>
                    )}

                    {selectedAuthor.taxId && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Vergi Kimlik No</p>
                        <p className="text-gray-900">{selectedAuthor.taxId}</p>
                      </div>
                    )}

                    {selectedAuthor.bankAccount && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Banka Hesabı</p>
                        <p className="text-gray-900 font-mono text-sm">{selectedAuthor.bankAccount}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        setSuccessMessage(`✏️ ${selectedAuthor.name} profili düzenleniyor...`);
                        setShowSuccessMessage(true);
                        setTimeout(() => setShowSuccessMessage(false), 3000);
                      }}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => {
                        setShowAuthorModal(false);
                        handleOpenPaymentModal(selectedAuthor);
                      }}
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                    >
                      Ödeme Yap
                    </button>
                  </div>
                </div>
              ) : (
                // Create Mode - New Author Form
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const authorName = formData.get('name') as string;
                    setSuccessMessage(`✅ ${authorName} başarıyla sisteme eklendi!`);
                    setShowSuccessMessage(true);
                    setShowAuthorModal(false);
                    setTimeout(() => setShowSuccessMessage(false), 5000);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ad Soyad *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Ahmet Yılmaz"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        E-posta *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="ahmet@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telif Tipi *
                      </label>
                      <select
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Seçiniz</option>
                        <option value="employee">İç Telif (Personel)</option>
                        <option value="external">Dış Telif</option>
                        <option value="remote">Uzaktan Çalışan</option>
                        <option value="customer">Müşteri</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sözleşme Tipi *
                      </label>
                      <select
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Seçiniz</option>
                        <option value="work_for_hire">Work for Hire</option>
                        <option value="revenue_share">Revenue Share</option>
                        <option value="non_exclusive">Non-Exclusive</option>
                        <option value="exclusive">Exclusive</option>
                        <option value="flat_fee">Flat Fee</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vergi Kimlik No
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="TR123456789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Banka Hesabı (IBAN)
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="TR33 0006 1005 1978 6457 8413 26"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departman
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="İçerik Geliştirme"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pozisyon
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Kıdemli Soru Yazarı"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lokasyon
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="İstanbul, Turkey"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notlar
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ek notlar..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowAuthorModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Yazar Ekle
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Toplu Ödeme İşlemi</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <XCircle className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmitPayment} className="space-y-6">
                {/* Pending Payments Summary */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Seçili Ödemeler</h4>
                    <span className="text-2xl font-bold text-emerald-600">
                      {selectedPaymentTotal.toLocaleString()} ₺
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      {selectedPayments.length} / {demoRoyaltyPayments.filter(p => p.status === 'pending').length} ödeme seçildi
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAllPayments}
                        className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition"
                      >
                        Tümünü Seç
                      </button>
                      <button
                        type="button"
                        onClick={handleDeselectAllPayments}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                      >
                        Temizle
                      </button>
                    </div>
                  </div>
                </div>

                {/* Payment List */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ödenecek Yazarlar
                  </label>
                  <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
                    {demoRoyaltyPayments
                      .filter(p => p.status === 'pending')
                      .map((payment) => (
                        <label key={payment.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPayments.includes(payment.id)}
                            onChange={() => handleTogglePayment(payment.id)}
                            className="w-4 h-4 text-indigo-600"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{payment.authorName}</p>
                            <p className="text-xs text-gray-500">{payment.workIds.length} içerik</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{payment.amount.toLocaleString()} ₺</p>
                            <p className="text-xs text-emerald-600">Net: {payment.netAmount.toLocaleString()} ₺</p>
                          </div>
                        </label>
                      ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ödeme Yöntemi *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'bank_transfer', label: 'Banka Transferi', icon: '🏦' },
                      { value: 'paypal', label: 'PayPal', icon: '💳' },
                      { value: 'stripe', label: 'Stripe', icon: '💰' },
                      { value: 'check', label: 'Çek', icon: '📝' },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition ${
                          selectedPaymentMethod === method.value
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={selectedPaymentMethod === method.value}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value as any)}
                          className="text-indigo-600"
                        />
                        <span className="text-xl">{method.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Payment Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ödeme Tarihi *
                  </label>
                  <input
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ödeme Notu
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ödeme ile ilgili notlar..."
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedPayments([]);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={selectedPayments.length === 0}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {selectedPayments.length === 0 
                      ? 'Ödeme Seçiniz' 
                      : `${selectedPayments.length} Ödemeyi Onayla`
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Yeni İtiraz Oluştur</h3>
              <button
                onClick={() => setShowDisputeModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <XCircle className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const disputeType = formData.get('disputeType') as string;
                  const authorSelect = formData.get('author') as string;
                  const author = demoAuthors.find(a => a.id === authorSelect);
                  
                  setSuccessMessage(
                    `⚖️ İtiraz kaydedildi! ${author?.name} için ${disputeType} itirazı sistem tarafından incelenecektir.`
                  );
                  setShowSuccessMessage(true);
                  setShowDisputeModal(false);
                  setTimeout(() => setShowSuccessMessage(false), 5000);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İtiraz Türü *
                  </label>
                  <select
                    name="disputeType"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Seçiniz</option>
                    <option value="Ödeme İtirazı">Ödeme İtirazı</option>
                    <option value="Kullanım İtirazı">Kullanım İtirazı</option>
                    <option value="Kalite İtirazı">Kalite İtirazı</option>
                    <option value="Telif Hakları İtirazı">Telif Hakları İtirazı</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yazar *
                  </label>
                  <select
                    name="author"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Seçiniz</option>
                    {demoAuthors.map((author) => (
                      <option key={author.id} value={author.id}>
                        {author.name} - {author.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İlgili İçerik *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Seçiniz</option>
                    {demoRoyaltyWorks.map((work) => (
                      <option key={work.id} value={work.id}>
                        {work.title} ({work.authorName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Öncelik *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'low', label: 'Düşük', color: 'border-gray-300 hover:border-gray-400' },
                      { value: 'medium', label: 'Orta', color: 'border-yellow-300 hover:border-yellow-400' },
                      { value: 'high', label: 'Yüksek', color: 'border-red-300 hover:border-red-400' },
                    ].map((priority) => (
                      <label
                        key={priority.value}
                        className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition ${priority.color}`}
                      >
                        <input type="radio" name="priority" value={priority.value} required className="sr-only" />
                        <span className="text-sm font-medium text-gray-700">{priority.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İtiraz Açıklaması *
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="İtirazınızı detaylı olarak açıklayın..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ek Belgeler
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition cursor-pointer">
                    <input type="file" multiple className="hidden" id="dispute-files" />
                    <label htmlFor="dispute-files" className="cursor-pointer">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Dosya seçmek için tıklayın</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, DOC, XLS, JPG, PNG (Max 10MB)</p>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowDisputeModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    İtiraz Gönder
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

