import React, { useState } from 'react';
import { Award, Search, Download, CheckCircle, XCircle } from 'lucide-react';
import CertificateCard from '../../components/certificates/CertificateCard';
import {
  demoCertificates,
  certificateTemplates,
  getCertificateStats,
  verifyCertificate,
  type Certificate,
} from '../../mocks/certificateData';

export default function CertificatesPageEnhanced() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTemplate, setFilterTemplate] = useState<string>('all');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [verifyNumber, setVerifyNumber] = useState('');
  const [verifyResult, setVerifyResult] = useState<Certificate | null | 'not_found'>(null);

  const stats = getCertificateStats();

  const filteredCertificates = demoCertificates.filter(cert => {
    const matchesSearch = 
      cert.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.examTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.certificateNumber.includes(searchQuery);
    
    const matchesTemplate = filterTemplate === 'all' || cert.template === filterTemplate;

    return matchesSearch && matchesTemplate;
  });

  const handleVerify = () => {
    if (!verifyNumber.trim()) return;
    const result = verifyCertificate(verifyNumber);
    setVerifyResult(result || 'not_found');
  };

  const handleBulkDownload = () => {
    alert(`${filteredCertificates.length} sertifika toplu olarak indirilmeye hazırlanıyor...`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sertifikalar</h1>
                <p className="text-sm text-gray-600">Başarı sertifikalarını yönetin</p>
              </div>
            </div>

            <button
              onClick={handleBulkDownload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              <Download className="h-4 w-4" />
              Toplu İndir ({filteredCertificates.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-xs text-gray-600 mb-1">Toplam Sertifika</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-4">
            <div className="text-xs text-green-600 mb-1">Verildi</div>
            <div className="text-2xl font-bold text-green-900">{stats.issued}</div>
          </div>
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <div className="text-xs text-blue-600 mb-1">Ort. Başarı</div>
            <div className="text-2xl font-bold text-blue-900">{stats.avgScore}</div>
          </div>
          <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
            <div className="text-xs text-purple-600 mb-1">Şablonlar</div>
            <div className="text-2xl font-bold text-purple-900">{certificateTemplates.length}</div>
          </div>
        </div>

        {/* Verification */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Sertifika Doğrulama</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={verifyNumber}
              onChange={(e) => setVerifyNumber(e.target.value)}
              placeholder="Sertifika numarasını girin (örn: CERT-2025-1234)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleVerify}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Doğrula
            </button>
          </div>

          {verifyResult && (
            <div className={`mt-4 p-4 rounded-lg border-2 ${
              verifyResult === 'not_found' 
                ? 'bg-red-50 border-red-300' 
                : 'bg-green-50 border-green-300'
            }`}>
              {verifyResult === 'not_found' ? (
                <div className="flex items-center gap-3">
                  <XCircle className="h-6 w-6 text-red-600" />
                  <div>
                    <div className="font-semibold text-red-900">Sertifika Bulunamadı</div>
                    <div className="text-sm text-red-700">Bu numaraya ait geçerli bir sertifika bulunmuyor.</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-green-900">✓ Geçerli Sertifika</div>
                    <div className="text-sm text-green-700 mt-1">
                      <strong>{verifyResult.studentName}</strong> - {verifyResult.examTitle}
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      Tarih: {new Date(verifyResult.issueDate).toLocaleDateString('tr-TR')} | 
                      Not: {verifyResult.score} ({verifyResult.grade})
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                <Search className="h-4 w-4 inline mr-2" />
                Ara (İsim, Sınav, Sertifika No)
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Arama..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Şablon Türü</label>
              <select
                value={filterTemplate}
                onChange={(e) => setFilterTemplate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tümü</option>
                {certificateTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              onView={setSelectedCertificate}
            />
          ))}
        </div>

        {filteredCertificates.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <Award className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Sertifika bulunamadı</p>
            <p className="text-sm mt-2">Farklı filtreler deneyin</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedCertificate(null)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
              <button
                onClick={() => setSelectedCertificate(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              <div className="text-center mb-6">
                <Award className="h-20 w-20 mx-auto mb-4 text-yellow-600" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedCertificate.studentName}
                </h2>
                <p className="text-gray-600">{selectedCertificate.examTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded p-3">
                  <div className="text-sm text-gray-600">Sertifika No</div>
                  <div className="font-bold text-gray-900">{selectedCertificate.certificateNumber}</div>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <div className="text-sm text-gray-600">Tarih</div>
                  <div className="font-bold text-gray-900">
                    {new Date(selectedCertificate.issueDate).toLocaleDateString('tr-TR')}
                  </div>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <div className="text-sm text-gray-600">Not</div>
                  <div className="font-bold text-gray-900">{selectedCertificate.score}</div>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <div className="text-sm text-gray-600">Harf Notu</div>
                  <div className="font-bold text-gray-900">{selectedCertificate.grade}</div>
                </div>
              </div>

              <div className="text-center mb-6">
                <img 
                  src={selectedCertificate.qrCode} 
                  alt="QR Code"
                  className="w-32 h-32 mx-auto"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Doğrulama için QR kodu tarayın
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.open(selectedCertificate.verificationUrl, '_blank')}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Online Doğrula
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedCertificate.verificationUrl);
                    alert('Link kopyalandı!');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Linki Kopyala
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

