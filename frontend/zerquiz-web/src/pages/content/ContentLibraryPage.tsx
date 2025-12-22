import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  useContentList, 
  useContentDelete,
  useGenerateQuiz,
  useGenerateFlashcards,
  useGenerateSummary,
  useGenerateWorksheet,
  useGenerationJobStatus
} from '@/hooks/useContentQueries';
import { FileText, File, Calendar, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  ContentHeader,
  ContentStats,
  ContentFilters,
  ContentGrid,
  ContentList,
  ContentUploadModal
} from './components';

export default function ContentLibraryPage() {
  const { t } = useLanguage();
  const tenantId = localStorage.getItem('tenantId') || '';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [aiJobId, setAiJobId] = useState<string | null>(null);

  // React Query hooks
  const { data: contentData, isLoading } = useContentList(tenantId, undefined, 1, 50);
  const { mutate: deleteFile } = useContentDelete();
  const { mutate: generateQuiz } = useGenerateQuiz();
  const { mutate: generateFlashcards } = useGenerateFlashcards();
  const { mutate: generateSummary } = useGenerateSummary();
  const { mutate: generateWorksheet } = useGenerateWorksheet();
  const { data: jobStatus } = useGenerationJobStatus(aiJobId || '', !!aiJobId);

  const files = contentData?.items || [];

  // Handle AI job completion
  if (jobStatus?.status === 'completed') {
    toast.success('✨ AI üretimi tamamlandı!');
    setAiJobId(null);
  } else if (jobStatus?.status === 'failed') {
    toast.error('❌ AI üretimi başarısız: ' + jobStatus.errorMessage);
    setAiJobId(null);
  }

  const handleGenerateQuiz = (contentId: string) => {
    generateQuiz({
      contentItemId: contentId,
      questionTypes: ['MULTIPLE_CHOICE'],
      difficulty: 'medium',
      count: 10,
      language: 'tr'
    }, {
      onSuccess: (response) => {
        setAiJobId(response.jobId);
        toast.info('🚀 Quiz üretimi başlatıldı...');
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Quiz üretilemedi');
      }
    });
  };

  const handleGenerateFlashcards = (contentId: string) => {
    generateFlashcards({
      contentItemId: contentId,
      count: 20,
      language: 'tr'
    }, {
      onSuccess: (response) => {
        setAiJobId(response.jobId);
        toast.info('🚀 Flashcard üretimi başlatıldı...');
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Flashcard üretilemedi');
      }
    });
  };

  const handleGenerateSummary = (contentId: string) => {
    generateSummary({ 
      contentItemId: contentId, 
      length: 'medium', 
      language: 'tr' 
    }, {
      onSuccess: (res) => { 
        setAiJobId(res.jobId); 
        toast.info('📄 Summary başlatıldı'); 
      }
    });
  };

  const handleGenerateWorksheet = (contentId: string) => {
    generateWorksheet({ 
      contentItemId: contentId, 
      questionTypes: ['FILL_BLANK'], 
      count: 15, 
      difficulty: 'medium', 
      language: 'tr', 
      includeAnswerKey: true 
    }, {
      onSuccess: (res) => { 
        setAiJobId(res.jobId); 
        toast.info('📋 Worksheet başlatıldı'); 
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) return;
    deleteFile(id, {
      onSuccess: () => toast.success('Dosya silindi'),
      onError: () => toast.error('Dosya silinemedi')
    });
  };

  const stats = [
    { label: 'Total Files', value: '45', icon: FileText, color: 'bg-blue-500' },
    { label: 'Total Size', value: '156 MB', icon: File, color: 'bg-green-500' },
    { label: 'This Month', value: '12', icon: Calendar, color: 'bg-purple-500' },
    { label: 'Ready', value: '42', icon: Eye, color: 'bg-teal-500' },
  ];

  return (
    <div className="space-y-6">
      <ContentHeader
        title={t('content_library') || 'Content Library'}
        description="Upload and manage your educational content"
        onUploadClick={() => setUploadModalOpen(true)}
        uploadLabel={t('upload_content') || 'Upload Content'}
      />

      <ContentStats stats={stats} />

      <ContentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchPlaceholder={t('search') || 'Search'}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <p className="text-gray-500">Henüz içerik yüklenmemiş</p>
        </div>
      ) : viewMode === 'grid' ? (
        <ContentGrid
          files={files}
          onDelete={handleDelete}
          onGenerateQuiz={handleGenerateQuiz}
          onGenerateFlashcards={handleGenerateFlashcards}
          onGenerateSummary={handleGenerateSummary}
          onGenerateWorksheet={handleGenerateWorksheet}
          aiJobId={aiJobId}
          jobStatus={jobStatus}
        />
      ) : (
        <ContentList files={files} />
      )}

      <ContentUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </div>
  );
}
