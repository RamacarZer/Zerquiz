import { useState, useMemo } from 'react';
import { Plane, Check, X } from 'lucide-react';
import { useFinanceData } from '../hooks/useFinanceData';

export default function PerDiemTab() {
  const { perDiemRequests, setPerDiemRequests } = useFinanceData();
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');

  const filteredRequests = useMemo(() => {
    if (filter === 'all') return perDiemRequests;
    return perDiemRequests.filter(p => p.status === filter);
  }, [perDiemRequests, filter]);

  const handleApprove = (id: string) => {
    setPerDiemRequests(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' as const } : p));
  };

  const handleReject = (id: string) => {
    setPerDiemRequests(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' as const } : p));
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      approved: { label: 'Onaylandı', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      pending: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
      rejected: { label: 'Reddedildi', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    };
    const config = configs[status] || configs.pending;
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>{config.label}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Plane className="w-8 h-8 text-blue-600" />
          Harcırah Talepleri
        </h2>
        <div className="flex gap-3">
          {(['all', 'approved', 'pending', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {status === 'all' ? 'Tümü' : status === 'approved' ? 'Onaylı' : status === 'pending' ? 'Bekleyen' : 'Reddedildi'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex items-center justify-between hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{request.employee}</h3>
              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                <span>📍 {request.destination}</span>
                <span>• {request.purpose}</span>
                <span>• {new Date(request.submittedAt).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{request.amount.toLocaleString()} ₺</p>
                <div className="mt-2">{getStatusBadge(request.status)}</div>
              </div>
              {request.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

