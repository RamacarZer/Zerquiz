import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, Plus, Eye, Download } from 'lucide-react';
import {
  demoContracts,
  contractTemplates,
  getContractStats,
  getExpiringContracts,
  type Contract,
} from '../../mocks/contractData';

export default function ContractManagementPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | Contract['status']>('all');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  
  const stats = getContractStats();
  const expiringContracts = getExpiringContracts(30);
  
  const filteredContracts = filterStatus === 'all'
    ? demoContracts
    : demoContracts.filter(c => c.status === filterStatus);

  const getStatusBadge = (status: Contract['status']) => {
    switch (status) {
      case 'active':
        return <span className="text-xs px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">✓ Aktif</span>;
      case 'pending_review':
        return <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">⏳ İncelemede</span>;
      case 'draft':
        return <span className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-medium">📝 Taslak</span>;
      case 'expired':
        return <span className="text-xs px-3 py-1 bg-red-100 text-red-800 rounded-full font-medium">✗ Süresi Doldu</span>;
      case 'terminated':
        return <span className="text-xs px-3 py-1 bg-red-100 text-red-800 rounded-full font-medium">⚠ Sonlandırıldı</span>;
    }
  };

  const getTypeLabel = (type: Contract['type']) => {
    switch (type) {
      case 'subscription': return '📋 Abonelik';
      case 'license': return '🔑 Lisans';
      case 'partnership': return '🤝 Ortaklık';
      case 'nda': return '🔒 Gizlilik';
      case 'employment': return '👤 İstihdam';
    }
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sözleşme Yönetimi</h1>
                <p className="text-sm text-gray-600">Tüm sözleşmelerinizi tek yerden yönetin</p>
              </div>
            </div>

            <button
              onClick={() => alert('Yeni sözleşme oluşturuluyor...')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              <Plus className="h-4 w-4" />
              Yeni Sözleşme
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-xs text-gray-600 mb-1">Toplam</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-4">
            <div className="text-xs text-green-600 mb-1">Aktif</div>
            <div className="text-2xl font-bold text-green-900">{stats.active}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
            <div className="text-xs text-yellow-600 mb-1">İncelemede</div>
            <div className="text-2xl font-bold text-yellow-900">{stats.pendingReview}</div>
          </div>
          <div className="bg-red-50 rounded-lg border border-red-200 p-4">
            <div className="text-xs text-red-600 mb-1">Yakında Sona Erecek</div>
            <div className="text-2xl font-bold text-red-900">{stats.expiringSoon}</div>
          </div>
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <div className="text-xs text-blue-600 mb-1">Toplam Değer</div>
            <div className="text-lg font-bold text-blue-900">{stats.totalValue.toLocaleString()} ₺</div>
          </div>
        </div>

        {/* Expiring Soon Alert */}
        {expiringContracts.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="font-semibold text-yellow-900">Dikkat!</div>
                <div className="text-sm text-yellow-800">
                  {expiringContracts.length} sözleşmenin süresi 30 gün içinde dolacak.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Tümü ({demoContracts.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'active' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Aktif ({stats.active})
            </button>
            <button
              onClick={() => setFilterStatus('pending_review')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'pending_review' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              İncelemede ({stats.pendingReview})
            </button>
          </div>
        </div>

        {/* Contracts List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredContracts.map((contract) => {
            const daysLeft = getDaysUntilExpiry(contract.endDate);
            const isExpiringSoon = daysLeft <= 30 && daysLeft > 0;
            
            return (
              <div key={contract.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{contract.title}</h3>
                      {getStatusBadge(contract.status)}
                      {isExpiringSoon && (
                        <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                          ⏰ {daysLeft} gün kaldı
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{getTypeLabel(contract.type)}</span>
                      <span>•</span>
                      <span>{contract.value.toLocaleString()} {contract.currency}</span>
                      <span>•</span>
                      <span>{contract.parties.length} taraf</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Başlangıç</div>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(contract.startDate).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Bitiş</div>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(contract.endDate).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">İmza Durumu</div>
                    <div className="text-sm font-medium text-gray-900">
                      {contract.signatures.filter(s => s.status === 'signed').length} / {contract.signatures.length} imzalandı
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Ekler</div>
                    <div className="text-sm font-medium text-gray-900">
                      {contract.attachments.length} dosya
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedContract(contract)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                  >
                    <Eye className="h-4 w-4" />
                    Detayları Gör
                  </button>
                  <button
                    onClick={() => alert(`${contract.title} indiriliyor...`)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    title="İndir"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedContract(null)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full p-6">
              <button
                onClick={() => setSelectedContract(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedContract.title}</h2>

              <div className="space-y-6">
                {/* Taraflar */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Taraflar</h3>
                  <div className="space-y-2">
                    {selectedContract.parties.map((party) => (
                      <div key={party.id} className="bg-gray-50 rounded p-3">
                        <div className="font-medium text-gray-900">{party.name}</div>
                        <div className="text-sm text-gray-600">{party.role} • {party.email}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* İmzalar */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">İmza Durumu</h3>
                  <div className="space-y-2">
                    {selectedContract.signatures.map((sig) => (
                      <div key={sig.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium text-gray-900">{sig.partyName}</div>
                          {sig.signedAt && (
                            <div className="text-xs text-gray-600">
                              {new Date(sig.signedAt).toLocaleString('tr-TR')}
                            </div>
                          )}
                        </div>
                        {sig.status === 'signed' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Şartlar */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Sözleşme Şartları</h3>
                  <div className="bg-gray-50 rounded p-4 text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedContract.terms}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => alert('Sözleşme indiriliyor...')}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Sözleşmeyi İndir
                </button>
                <button
                  onClick={() => setSelectedContract(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

