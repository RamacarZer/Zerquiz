import { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useContentUpload } from '@/hooks/useContentQueries';

interface ContentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FileWithProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export default function ContentUploadModal({ isOpen, onClose }: ContentUploadModalProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadContent, isLoading: isUploading } = useContentUpload();

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    console.log('📁 Dosyalar ekleniyor:', newFiles.length);
    
    const validFiles = newFiles.filter(file => {
      console.log('🔍 Dosya kontrol ediliyor:', file.name, 'Tip:', file.type, 'Boyut:', file.size);
      
      const maxSize = 50 * 1024 * 1024; // 50MB
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/msword',
        'application/vnd.ms-powerpoint',
        'text/plain',
      ];

      if (file.size > maxSize) {
        console.warn('⚠️ Dosya çok büyük:', file.name);
        toast.error(`${file.name} çok büyük (Max 50MB)`);
        return false;
      }

      if (!validTypes.includes(file.type)) {
        console.warn('⚠️ Desteklenmeyen format:', file.name, file.type);
        toast.error(`${file.name} desteklenmeyen format`);
        return false;
      }

      console.log('✅ Dosya geçerli:', file.name);
      return true;
    });

    console.log('✅ Geçerli dosya sayısı:', validFiles.length);

    const filesWithProgress: FileWithProgress[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending',
    }));

    setFiles(prev => {
      const newList = [...prev, ...filesWithProgress];
      console.log('📋 Güncel dosya listesi:', newList.length);
      return newList;
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    console.log('🚀 Upload başlatıldı, dosya sayısı:', files.length);
    
    if (files.length === 0) {
      toast.warning('Lütfen yüklenecek dosya seçin');
      return;
    }

    const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'error');
    console.log('📋 Bekleyen dosya sayısı:', pendingFiles.length);
    
    if (pendingFiles.length === 0) {
      toast.info('Tüm dosyalar zaten yüklendi');
      return;
    }

    const tenantId = localStorage.getItem('tenantId') || '';
    const userId = localStorage.getItem('userId') || '';
    console.log('🔑 TenantId:', tenantId, 'UserId:', userId);

    // Upload each pending file
    for (let i = 0; i < files.length; i++) {
      const fileItem = files[i];
      
      // Skip if not pending or error
      if (fileItem.status !== 'pending' && fileItem.status !== 'error') {
        console.log(`⏭️ Dosya ${i} atlandı, status:`, fileItem.status);
        continue;
      }

      console.log(`📤 Dosya ${i} yükleniyor:`, fileItem.file.name);

      // Set status to uploading
      setFiles(prev => prev.map((f, idx) => 
        idx === i ? { ...f, status: 'uploading' as const, progress: 0 } : f
      ));

      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map((f, idx) => 
            idx === i && f.progress < 90 
              ? { ...f, progress: f.progress + 10 } 
              : f
          ));
        }, 200);

        await new Promise<void>((resolve, reject) => {
          console.log('📡 Upload API çağrısı yapılıyor...');
          uploadContent({
            file: fileItem.file,
            title: fileItem.file.name,
            tenantId,
            userId
          }, {
            onSuccess: (data) => {
              console.log('✅ Upload başarılı:', data);
              clearInterval(progressInterval);
              setFiles(prev => prev.map((f, idx) => 
                idx === i 
                  ? { ...f, status: 'success' as const, progress: 100 } 
                  : f
              ));
              toast.success(`${fileItem.file.name} başarıyla yüklendi!`);
              resolve();
            },
            onError: (error: any) => {
              console.error('❌ Upload hatası:', error);
              console.error('❌ Hata detayı:', error?.response?.data);
              clearInterval(progressInterval);
              const errorMsg = error?.response?.data?.message || error?.message || 'Yükleme başarısız';
              setFiles(prev => prev.map((f, idx) => 
                idx === i 
                  ? { ...f, status: 'error' as const, error: errorMsg } 
                  : f
              ));
              toast.error(`${fileItem.file.name}: ${errorMsg}`);
              reject(error);
            }
          });
        });
      } catch (error) {
        console.error('💥 Upload exception:', error);
      }
    }

    console.log('🏁 Tüm upload işlemleri tamamlandı');

    // Check if all uploads completed successfully
    setTimeout(() => {
      setFiles(prev => {
        const allSuccess = prev.every(f => f.status === 'success');
        if (allSuccess) {
          toast.success('Tüm dosyalar başarıyla yüklendi!');
          setTimeout(() => {
            handleClose();
          }, 2000);
        }
        return prev;
      });
    }, 500);
  };

  const handleClose = () => {
    setFiles([]);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusIcon = (status: FileWithProgress['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            İçerik Yükle
          </h2>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-xl p-12 text-center mb-6 cursor-pointer transition-all
            ${isDragging 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }
          `}
        >
          <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">
            {isDragging ? 'Dosyaları buraya bırakın' : 'Dosyaları sürükleyip bırakın veya tıklayın'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Desteklenen formatlar: PDF, DOCX, PPTX, TXT (Maks 50MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
            {files.map((fileItem, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-shrink-0">
                  {getStatusIcon(fileItem.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                    {fileItem.file.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatFileSize(fileItem.file.size)}</span>
                    {fileItem.status === 'uploading' && (
                      <>
                        <span>•</span>
                        <span>{fileItem.progress}%</span>
                      </>
                    )}
                    {fileItem.status === 'error' && fileItem.error && (
                      <>
                        <span>•</span>
                        <span className="text-red-500">{fileItem.error}</span>
                      </>
                    )}
                  </div>
                  
                  {fileItem.status === 'uploading' && (
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${fileItem.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {fileItem.status !== 'uploading' && (
                  <button
                    onClick={() => removeFile(index)}
                    className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            İptal
          </button>
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || isUploading || files.every(f => f.status === 'success')}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Yükleniyor...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Yükle ({files.filter(f => f.status === 'pending' || f.status === 'error').length})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
