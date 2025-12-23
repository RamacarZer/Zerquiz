import { useState } from 'react';
import { X, Download, FileText, BookOpen, Globe, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export type ExportFormat = 'epub' | 'pdf' | 'html' | 'kindle';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  bookTitle: string;
}

interface ExportStatus {
  status: 'idle' | 'requesting' | 'processing' | 'completed' | 'failed';
  exportId?: string;
  progress?: number;
  downloadUrl?: string;
  error?: string;
}

export default function ExportDialog({ isOpen, onClose, bookId, bookTitle }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('epub');
  const [exportStatus, setExportStatus] = useState<ExportStatus>({ status: 'idle' });

  const exportFormats: { value: ExportFormat; label: string; icon: any; description: string }[] = [
    { value: 'epub', label: 'ePub 3', icon: BookOpen, description: 'E-okuyucular için standart format' },
    { value: 'pdf', label: 'PDF', icon: FileText, description: 'Yazdırılabilir doküman' },
    { value: 'html', label: 'HTML', icon: Globe, description: 'Web tarayıcılar için' },
    { value: 'kindle', label: 'Kindle', icon: Download, description: 'Amazon Kindle uyumlu' },
  ];

  const handleExport = async () => {
    setExportStatus({ status: 'requesting' });

    try {
      // Request export
      const response = await fetch(`http://localhost:5010/api/books/${bookId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exportType: selectedFormat,
          requestedByUserId: 'current-user-id', // TODO: Get from auth context
          tenantId: 'current-tenant-id',
        }),
      });

      if (!response.ok) {
        throw new Error('Export request failed');
      }

      const exportData = await response.json();
      setExportStatus({ 
        status: 'processing', 
        exportId: exportData.id,
        progress: 0 
      });

      // Poll for status
      pollExportStatus(exportData.id);
    } catch (error) {
      setExportStatus({ 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  const pollExportStatus = async (exportId: string) => {
    const maxAttempts = 60; // 60 attempts = 5 minutes (5s interval)
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(
          `http://localhost:5010/api/books/${bookId}/export/${exportId}/status`
        );
        const data = await response.json();

        if (data.status === 'completed') {
          setExportStatus({
            status: 'completed',
            exportId: exportId,
            downloadUrl: data.url,
          });
          return;
        }

        if (data.status === 'failed') {
          setExportStatus({
            status: 'failed',
            error: data.errorMessage || 'Export failed',
          });
          return;
        }

        // Still processing
        attempts++;
        const progress = Math.min(95, (attempts / maxAttempts) * 100);
        setExportStatus((prev) => ({ ...prev, progress }));

        if (attempts < maxAttempts) {
          setTimeout(poll, 5000); // Poll every 5 seconds
        } else {
          setExportStatus({
            status: 'failed',
            error: 'Export timeout - please try again',
          });
        }
      } catch (error) {
        setExportStatus({
          status: 'failed',
          error: 'Failed to check export status',
        });
      }
    };

    poll();
  };

  const handleDownload = () => {
    if (exportStatus.downloadUrl) {
      window.open(exportStatus.downloadUrl, '_blank');
    }
  };

  const handleClose = () => {
    setExportStatus({ status: 'idle' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kitap Dışa Aktar</h2>
            <p className="text-sm text-gray-600 mt-1">{bookTitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={exportStatus.status === 'requesting' || exportStatus.status === 'processing'}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {exportStatus.status === 'idle' || exportStatus.status === 'requesting' ? (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Dışa Aktarma Formatı Seçin
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exportFormats.map((format) => {
                    const Icon = format.icon;
                    return (
                      <button
                        key={format.value}
                        onClick={() => setSelectedFormat(format.value)}
                        disabled={exportStatus.status === 'requesting'}
                        className={`p-4 rounded-lg border-2 transition text-left ${
                          selectedFormat === format.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${exportStatus.status === 'requesting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <Icon
                            size={24}
                            className={selectedFormat === format.value ? 'text-blue-600' : 'text-gray-400'}
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{format.label}</div>
                            <div className="text-sm text-gray-600 mt-1">{format.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Dışa Aktarma Notları:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Kitap boyutuna göre işlem 1-5 dakika sürebilir</li>
                      <li>Kindle formatı Amazon KDP standartlarına uygundur</li>
                      <li>PDF formatı en iyi yazdırma sonuçları verir</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {/* Progress State */}
          {exportStatus.status === 'processing' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="animate-spin text-blue-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">Kitap hazırlanıyor...</p>
                  <p className="text-sm text-gray-600">
                    {selectedFormat.toUpperCase()} formatına dönüştürülüyor
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${exportStatus.progress || 0}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                {exportStatus.progress ? `${Math.round(exportStatus.progress)}%` : 'Başlatılıyor...'}
              </p>
            </div>
          )}

          {/* Success State */}
          {exportStatus.status === 'completed' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle size={64} className="text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Dışa Aktarma Tamamlandı!</h3>
                <p className="text-gray-600 mt-2">
                  {bookTitle} başarıyla {selectedFormat.toUpperCase()} formatına dönüştürüldü.
                </p>
              </div>
              <button
                onClick={handleDownload}
                className="btn btn-primary btn-lg gap-2"
              >
                <Download size={20} />
                Dosyayı İndir
              </button>
            </div>
          )}

          {/* Error State */}
          {exportStatus.status === 'failed' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <AlertCircle size={64} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Dışa Aktarma Başarısız</h3>
                <p className="text-gray-600 mt-2">{exportStatus.error}</p>
              </div>
              <button
                onClick={() => setExportStatus({ status: 'idle' })}
                className="btn btn-outline"
              >
                Tekrar Dene
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {(exportStatus.status === 'idle' || exportStatus.status === 'requesting') && (
          <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              onClick={handleClose}
              className="btn btn-ghost"
              disabled={exportStatus.status === 'requesting'}
            >
              İptal
            </button>
            <button
              onClick={handleExport}
              disabled={exportStatus.status === 'requesting'}
              className="btn btn-primary gap-2"
            >
              {exportStatus.status === 'requesting' ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  İstək Gönderiliyor...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Dışa Aktar
                </>
              )}
            </button>
          </div>
        )}

        {exportStatus.status === 'completed' && (
          <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
            <button onClick={handleClose} className="btn btn-primary">
              Kapat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

