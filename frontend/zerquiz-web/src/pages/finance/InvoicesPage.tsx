import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import {
  FileText,
  Download,
  Send,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  DollarSign,
  Filter,
  Search,
  Calendar,
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  tenantName: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

export default function InvoicesPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const mockInvoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      tenantName: 'Acme School',
      amount: 1250.00,
      currency: 'TRY',
      status: 'paid',
      issueDate: '2024-01-01',
      dueDate: '2024-01-31',
      paidDate: '2024-01-15',
      items: [
        { description: 'Premium Paket - Aylık Abonelik', quantity: 1, unitPrice: 1000, total: 1000 },
        { description: 'Ek Kullanıcı (x5)', quantity: 5, unitPrice: 50, total: 250 },
      ],
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      tenantName: 'Tech University',
      amount: 2500.00,
      currency: 'TRY',
      status: 'pending',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      items: [
        { description: 'Enterprise Paket - Aylık Abonelik', quantity: 1, unitPrice: 2500, total: 2500 },
      ],
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      tenantName: 'Global Academy',
      amount: 800.00,
      currency: 'TRY',
      status: 'overdue',
      issueDate: '2023-12-15',
      dueDate: '2024-01-15',
      items: [
        { description: 'Basic Paket - Aylık Abonelik', quantity: 1, unitPrice: 800, total: 800 },
      ],
    },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          icon: CheckCircle,
          label: 'Ödendi',
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
        };
      case 'pending':
        return {
          icon: Clock,
          label: 'Beklemede',
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
        };
      case 'overdue':
        return {
          icon: AlertCircle,
          label: 'Gecikmiş',
          color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
        };
      case 'cancelled':
        return {
          icon: XCircle,
          label: 'İptal',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
        };
      default:
        return {
          icon: FileText,
          label: 'Bilinmiyor',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
        };
    }
  };

  const stats = {
    totalInvoices: mockInvoices.length,
    totalAmount: mockInvoices.reduce((sum, inv) => sum + inv.amount, 0),
    paidCount: mockInvoices.filter((inv) => inv.status === 'paid').length,
    pendingCount: mockInvoices.filter((inv) => inv.status === 'pending').length,
    overdueCount: mockInvoices.filter((inv) => inv.status === 'overdue').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            {t('invoices') || 'Faturalar'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Fatura yönetimi ve takibi
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
          <FileText className="w-5 h-5" />
          Yeni Fatura Oluştur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm">Toplam Fatura</p>
              <p className="text-3xl font-bold">{stats.totalInvoices}</p>
            </div>
            <FileText className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-100 text-sm">Ödenen</p>
              <p className="text-3xl font-bold">{stats.paidCount}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-yellow-100 text-sm">Bekleyen</p>
              <p className="text-3xl font-bold">{stats.pendingCount}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-red-100 text-sm">Gecikmiş</p>
              <p className="text-3xl font-bold">{stats.overdueCount}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-purple-100 text-sm">Toplam Tutar</p>
              <p className="text-2xl font-bold">{stats.totalAmount.toFixed(2)} ₺</p>
            </div>
            <DollarSign className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Fatura ara..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="paid">Ödendi</option>
              <option value="pending">Beklemede</option>
              <option value="overdue">Gecikmiş</option>
              <option value="cancelled">İptal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {mockInvoices.map((invoice) => {
          const statusConfig = getStatusConfig(invoice.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={invoice.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${statusConfig.borderColor} p-6 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg ${statusConfig.bgColor} flex items-center justify-center`}>
                    <StatusIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {invoice.invoiceNumber}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.tenantName}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Düzenleme: {new Date(invoice.issueDate).toLocaleDateString('tr-TR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Vade: {new Date(invoice.dueDate).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {invoice.amount.toFixed(2)} {invoice.currency}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Kalemler:</h4>
                <div className="space-y-2">
                  {invoice.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.description} (x{item.quantity})
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {item.total.toFixed(2)} {invoice.currency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" />
                  PDF İndir
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Send className="w-4 h-4" />
                  E-posta Gönder
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

