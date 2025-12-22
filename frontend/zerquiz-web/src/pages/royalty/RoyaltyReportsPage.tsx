import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import {
  FileText,
  Download,
  DollarSign,
  TrendingUp,
  Award,
  Calendar,
  Users,
  BookOpen,
  BarChart3,
  Filter,
} from 'lucide-react';

interface RoyaltyReport {
  id: string;
  authorName: string;
  period: string;
  totalRevenue: number;
  royaltyRate: number;
  royaltyAmount: number;
  questionsSold: number;
  examsSold: number;
  status: 'paid' | 'pending' | 'processing';
}

export default function RoyaltyReportsPage() {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');

  // Mock data
  const mockReports: RoyaltyReport[] = [
    {
      id: '1',
      authorName: 'Ahmet Yılmaz',
      period: '2024-01',
      totalRevenue: 15000,
      royaltyRate: 30,
      royaltyAmount: 4500,
      questionsSold: 250,
      examsSold: 45,
      status: 'paid',
    },
    {
      id: '2',
      authorName: 'Ayşe Demir',
      period: '2024-01',
      totalRevenue: 12000,
      royaltyRate: 35,
      royaltyAmount: 4200,
      questionsSold: 180,
      examsSold: 38,
      status: 'pending',
    },
    {
      id: '3',
      authorName: 'Mehmet Kaya',
      period: '2024-01',
      totalRevenue: 8500,
      royaltyRate: 25,
      royaltyAmount: 2125,
      questionsSold: 120,
      examsSold: 22,
      status: 'processing',
    },
  ];

  const totalStats = {
    totalRevenue: mockReports.reduce((sum, r) => sum + r.totalRevenue, 0),
    totalRoyalty: mockReports.reduce((sum, r) => sum + r.royaltyAmount, 0),
    totalAuthors: mockReports.length,
    avgRoyaltyRate: mockReports.reduce((sum, r) => sum + r.royaltyRate, 0) / mockReports.length,
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          label: 'Ödendi',
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        };
      case 'pending':
        return {
          label: 'Beklemede',
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        };
      case 'processing':
        return {
          label: 'İşleniyor',
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        };
      default:
        return {
          label: 'Bilinmiyor',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
        };
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-purple-600" />
            {t('royalty_reports') || 'Telif Raporları'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Yazar telif ödemeleri ve raporları
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="2024-01">Ocak 2024</option>
            <option value="2023-12">Aralık 2023</option>
            <option value="2023-11">Kasım 2023</option>
          </select>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
            <Download className="w-5 h-5" />
            Rapor İndir
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm">Toplam Gelir</p>
              <p className="text-3xl font-bold">{totalStats.totalRevenue.toLocaleString()} ₺</p>
            </div>
            <DollarSign className="w-12 h-12 text-blue-200" />
          </div>
          <p className="text-sm text-blue-100">Bu dönem</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-purple-100 text-sm">Toplam Telif</p>
              <p className="text-3xl font-bold">{totalStats.totalRoyalty.toLocaleString()} ₺</p>
            </div>
            <Award className="w-12 h-12 text-purple-200" />
          </div>
          <p className="text-sm text-purple-100">Ödenecek tutar</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-100 text-sm">Aktif Yazar</p>
              <p className="text-3xl font-bold">{totalStats.totalAuthors}</p>
            </div>
            <Users className="w-12 h-12 text-green-200" />
          </div>
          <p className="text-sm text-green-100">Bu dönem gelir elde eden</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-orange-100 text-sm">Ort. Telif Oranı</p>
              <p className="text-3xl font-bold">%{totalStats.avgRoyaltyRate.toFixed(0)}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-orange-200" />
          </div>
          <p className="text-sm text-orange-100">Genel ortalama</p>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Yazar Bazlı Telif Raporları
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Yazar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Dönem
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Toplam Gelir
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Telif Oranı
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Telif Tutarı
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Satış
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockReports.map((report) => {
                const statusConfig = getStatusConfig(report.status);
                return (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {report.authorName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {report.authorName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {report.period}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-900 dark:text-white">
                      {report.totalRevenue.toLocaleString()} ₺
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded font-medium">
                        %{report.royaltyRate}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-purple-600 dark:text-purple-400">
                      {report.royaltyAmount.toLocaleString()} ₺
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                          <BookOpen className="w-4 h-4" />
                          {report.questionsSold} soru
                        </div>
                        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                          <FileText className="w-4 h-4" />
                          {report.examsSold} sınav
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                        Detaylar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Aylık Telif Trendi
        </h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">Grafik burada görünecek (Chart.js veya Recharts kullanılabilir)</p>
        </div>
      </div>
    </div>
  );
}

