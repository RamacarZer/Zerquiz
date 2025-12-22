import { Trash2 } from 'lucide-react';
import AIGenerationPanel from './AIGenerationPanel';

interface ContentFile {
  id: string;
  title: string;
  contentType?: string;
  fileSize: number;
  processingStatus: string;
  metadata?: {
    pageCount?: number;
    wordCount?: number;
  };
}

interface ContentGridProps {
  files: ContentFile[];
  onDelete: (id: string) => void;
  onGenerateQuiz: (id: string) => void;
  onGenerateFlashcards: (id: string) => void;
  onGenerateSummary: (id: string) => void;
  onGenerateWorksheet: (id: string) => void;
  aiJobId: string | null;
  jobStatus: any;
}

export default function ContentGrid({ 
  files, 
  onDelete, 
  onGenerateQuiz,
  onGenerateFlashcards,
  onGenerateSummary,
  onGenerateWorksheet,
  aiJobId,
  jobStatus
}: ContentGridProps) {
  const getFileIcon = (type: string = 'pdf') => {
    switch (type) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'pptx': return '📊';
      default: return '📁';
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      ready: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', label: 'Ready' },
      processing: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', label: 'Processing' },
      failed: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', label: 'Failed' },
    };
    const badge = badges[status as keyof typeof badges] || badges.ready;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {files.map((file) => (
        <div
          key={file.id}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="text-4xl">{getFileIcon(file.contentType)}</div>
            <button 
              onClick={() => onDelete(file.id)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
          
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
            {file.title}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Size:</span>
              <span className="text-gray-800 dark:text-white">
                {(file.fileSize / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            {file.metadata?.pageCount && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Pages:</span>
                <span className="text-gray-800 dark:text-white">{file.metadata.pageCount}</span>
              </div>
            )}
            {file.metadata?.wordCount && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Words:</span>
                <span className="text-gray-800 dark:text-white">{file.metadata.wordCount}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              {getStatusBadge(file.processingStatus)}
            </div>
          </div>
          
          {file.processingStatus === 'ready' && (
            <AIGenerationPanel
              fileId={file.id}
              onGenerateQuiz={onGenerateQuiz}
              onGenerateFlashcards={onGenerateFlashcards}
              onGenerateSummary={onGenerateSummary}
              onGenerateWorksheet={onGenerateWorksheet}
              aiJobId={aiJobId}
              jobStatus={jobStatus}
            />
          )}
        </div>
      ))}
    </div>
  );
}

