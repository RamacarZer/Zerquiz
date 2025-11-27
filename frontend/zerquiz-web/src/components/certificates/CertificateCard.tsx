import React from 'react';
import { Download, Eye, Share2, Award } from 'lucide-react';
import { Certificate, certificateTemplates, generateCertificatePDF } from '../../mocks/certificateData';

interface CertificateCardProps {
  certificate: Certificate;
  onView?: (certificate: Certificate) => void;
}

export default function CertificateCard({ certificate, onView }: CertificateCardProps) {
  const template = certificateTemplates.find(t => t.id === certificate.template);

  const handleDownload = () => {
    generateCertificatePDF(certificate);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${certificate.studentName} - Sertifika`,
        text: `${certificate.examTitle} sınavı sertifikası`,
        url: certificate.verificationUrl,
      });
    } else {
      navigator.clipboard.writeText(certificate.verificationUrl);
      alert('Doğrulama linki kopyalandı!');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div 
      className="bg-white rounded-lg border-2 hover:shadow-xl transition cursor-pointer"
      style={{ borderColor: template?.design.borderColor || '#ccc' }}
    >
      {/* Preview Area */}
      <div 
        className="p-8 text-center relative overflow-hidden"
        style={{ backgroundColor: template?.design.backgroundColor || '#fff' }}
      >
        {/* Decorative Pattern */}
        <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: template?.design.accentColor }} />
        <div className="absolute bottom-0 left-0 right-0 h-2" style={{ backgroundColor: template?.design.accentColor }} />

        <Award className="h-16 w-16 mx-auto mb-4" style={{ color: template?.design.accentColor }} />
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: template?.design.font }}>
          Sertifika
        </h3>
        
        <div className="text-sm text-gray-600 mb-4">
          Bu sertifika şunlara verilir:
        </div>
        
        <div className="text-3xl font-bold mb-4" style={{ color: template?.design.accentColor, fontFamily: template?.design.font }}>
          {certificate.studentName}
        </div>
        
        <div className="text-sm text-gray-700 mb-4">
          <strong>{certificate.examTitle}</strong> sınavını başarıyla tamamladığı için
        </div>
        
        <div className="flex justify-center gap-6 mb-4">
          <div className="text-center">
            <div className="text-xs text-gray-600">Not</div>
            <div className="text-2xl font-bold" style={{ color: template?.design.accentColor }}>
              {certificate.score}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600">Harf Notu</div>
            <div className="text-2xl font-bold" style={{ color: template?.design.accentColor }}>
              {certificate.grade}
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-600 mb-2">
          Tarih: {formatDate(certificate.issueDate)}
        </div>
        
        <div className="text-xs text-gray-500">
          Sertifika No: {certificate.certificateNumber}
        </div>

        {/* QR Code Corner */}
        <div className="absolute bottom-4 right-4">
          <img 
            src={certificate.qrCode} 
            alt="QR Code"
            className="w-16 h-16 opacity-70"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
        <button
          onClick={() => onView && onView(certificate)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          <Eye className="h-4 w-4" />
          Görüntüle
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
        >
          <Download className="h-4 w-4" />
          İndir
        </button>
        <button
          onClick={handleShare}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          title="Paylaş"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

