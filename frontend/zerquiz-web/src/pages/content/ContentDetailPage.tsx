import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  FileText,
  Download,
  Trash2,
  Sparkles,
  Clock,
  Tag,
  Eye,
  Edit,
  Share2,
} from 'lucide-react';

const ContentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Mock data
  const content = {
    id,
    title: 'Matematik Ders Notları.pdf',
    contentType: 'pdf',
    fileSize: 2450000,
    uploadedAt: '2024-01-15T10:30:00Z',
    tags: ['matematik', '10. sınıf', 'geometri'],
    pageCount: 45,
    wordCount: 12500,
    status: 'ready',
    extractedText: 'Geometri dersi notları... (özet metin)',
    metadata: {
      language: 'tr',
      author: 'Ahmet Öğretmen',
      subject: 'Matematik',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/content/library')}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
        >
          ← {language === 'tr' ? 'Geri Dön' : 'Back'}
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h1>
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Edit className="w-5 h-5" />
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{language === 'tr' ? 'Sayfa' : 'Pages'}</p>
              <p className="text-xl font-bold text-gray-900">{content.pageCount}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{language === 'tr' ? 'Kelime' : 'Words'}</p>
              <p className="text-xl font-bold text-gray-900">{content.wordCount}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{language === 'tr' ? 'Boyut' : 'Size'}</p>
              <p className="text-xl font-bold text-gray-900">2.5 MB</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{language === 'tr' ? 'Dil' : 'Language'}</p>
              <p className="text-xl font-bold text-gray-900">TR</p>
            </div>
          </div>

          {/* AI Generation CTA */}
          <button
            onClick={() => navigate(`/content/ai-generate?source=${id}`)}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-lg font-semibold">
              {language === 'tr' ? 'AI ile İçerik Üret' : 'Generate Content with AI'}
            </span>
          </button>
        </div>

        {/* Extracted Text Preview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            {language === 'tr' ? 'Çıkarılan Metin' : 'Extracted Text'}
          </h3>
          <div className="p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
            <p className="text-gray-700 whitespace-pre-wrap">{content.extractedText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailPage;

