import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Upload,
  FileText,
  X,
  Check,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  contentId?: string;
}

const ContentUploadPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [autoGenerateAI, setAutoGenerateAI] = useState(false);

  const acceptedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'image/png',
    'image/jpeg',
  ];

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      acceptedTypes.includes(file.type)
    );

    uploadFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      uploadFiles(selectedFiles);
    }
  };

  const uploadFiles = (filesToUpload: File[]) => {
    const newFiles: UploadedFile[] = filesToUpload.map((file) => ({
      file,
      id: Math.random().toString(36).substring(7),
      progress: 0,
      status: 'uploading' as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload
    newFiles.forEach((uploadFile) => {
      simulateUpload(uploadFile.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                progress,
                status: progress === 100 ? 'success' : 'uploading',
                contentId: progress === 100 ? `content-${fileId}` : undefined,
              }
            : f
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    if (type.includes('presentation')) return '📊';
    if (type.includes('image')) return '🖼️';
    return '📁';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const allUploadsComplete = files.length > 0 && files.every((f) => f.status === 'success');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/content/library')}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
          >
            ← {language === 'tr' ? 'İçerik Kütüphanesine Dön' : 'Back to Content Library'}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'tr' ? '📤 İçerik Yükle' : '📤 Upload Content'}
          </h1>
          <p className="text-gray-600 mt-2">
            {language === 'tr'
              ? 'PDF, Word, PowerPoint veya resim dosyalarınızı yükleyin'
              : 'Upload your PDF, Word, PowerPoint or image files'}
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white hover:border-blue-400'
          }`}
        >
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {language === 'tr' ? 'Dosyaları Sürükle ve Bırak' : 'Drag and Drop Files'}
          </h3>
          <p className="text-gray-600 mb-4">
            {language === 'tr' ? 'veya' : 'or'}
          </p>
          <label className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
            {language === 'tr' ? 'Dosya Seç' : 'Browse Files'}
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.pptx,.txt,.png,.jpg,.jpeg"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-500 mt-4">
            {language === 'tr'
              ? 'Desteklenen formatlar: PDF, DOCX, PPTX, TXT, PNG, JPG (Max 50MB)'
              : 'Supported formats: PDF, DOCX, PPTX, TXT, PNG, JPG (Max 50MB)'}
          </p>
        </div>

        {/* AI Auto-Generate Option */}
        {files.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoGenerateAI}
                onChange={(e) => setAutoGenerateAI(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-gray-900">
                    {language === 'tr'
                      ? 'AI ile Otomatik İçerik Üret'
                      : 'Auto-Generate Content with AI'}
                  </span>
                  <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                    {language === 'tr' ? 'YENİ' : 'NEW'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {language === 'tr'
                    ? 'Yükleme tamamlandıktan sonra otomatik olarak soru, flashcard ve özet üret'
                    : 'Automatically generate questions, flashcards and summaries after upload'}
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Upload Progress */}
        {files.length > 0 && (
          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              {language === 'tr' ? 'Yüklenen Dosyalar' : 'Uploaded Files'} ({files.length})
            </h3>
            <div className="space-y-3">
              {files.map((uploadFile) => (
                <div
                  key={uploadFile.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-3xl">{getFileIcon(uploadFile.file.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 truncate">
                        {uploadFile.file.name}
                      </p>
                      <span className="text-sm text-gray-500 ml-2">
                        {formatFileSize(uploadFile.file.size)}
                      </span>
                    </div>
                    {uploadFile.status === 'uploading' && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadFile.progress}%` }}
                        />
                      </div>
                    )}
                    {uploadFile.status === 'success' && (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <Check className="w-4 h-4" />
                        {language === 'tr' ? 'Yükleme tamamlandı' : 'Upload complete'}
                      </div>
                    )}
                    {uploadFile.status === 'error' && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {language === 'tr' ? 'Yükleme başarısız' : 'Upload failed'}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeFile(uploadFile.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            {allUploadsComplete && (
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => navigate('/content/library')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {language === 'tr' ? 'Kütüphaneye Dön' : 'Back to Library'}
                </button>
                {autoGenerateAI ? (
                  <button
                    onClick={() => navigate(`/content/ai-generate?source=${files[0].contentId}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
                  >
                    <Sparkles className="w-5 h-5" />
                    {language === 'tr' ? 'AI İçerik Üretmeye Başla' : 'Start AI Generation'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/content/${files[0].contentId}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {language === 'tr' ? 'Detayları Görüntüle' : 'View Details'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            💡 {language === 'tr' ? 'İpuçları' : 'Tips'}
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • {language === 'tr'
                ? 'PDF dosyalarından otomatik metin çıkarımı yapılır'
                : 'Text is automatically extracted from PDF files'}
            </li>
            <li>
              • {language === 'tr'
                ? 'AI ile soru, flashcard ve özet üretimi için PDF veya DOCX önerilir'
                : 'PDF or DOCX recommended for AI question, flashcard and summary generation'}
            </li>
            <li>
              • {language === 'tr'
                ? 'Birden fazla dosya aynı anda yüklenebilir'
                : 'Multiple files can be uploaded at once'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContentUploadPage;

