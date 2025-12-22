interface AIGenerationPanelProps {
  fileId: string;
  onGenerateQuiz: (id: string) => void;
  onGenerateFlashcards: (id: string) => void;
  onGenerateSummary: (id: string) => void;
  onGenerateWorksheet: (id: string) => void;
  aiJobId: string | null;
  jobStatus: any;
}

export default function AIGenerationPanel({
  fileId,
  onGenerateQuiz,
  onGenerateFlashcards,
  onGenerateSummary,
  onGenerateWorksheet,
  aiJobId,
  jobStatus
}: AIGenerationPanelProps) {
  const isDisabled = !!aiJobId;

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
        ✨ AI Generation
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onGenerateQuiz(fileId)}
          disabled={isDisabled}
          className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📝 Quiz
        </button>
        <button
          onClick={() => onGenerateFlashcards(fileId)}
          disabled={isDisabled}
          className="px-3 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white text-xs rounded-lg hover:from-green-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🎴 Flashcards
        </button>
        <button
          onClick={() => onGenerateSummary(fileId)}
          disabled={isDisabled}
          className="px-3 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs rounded-lg hover:from-orange-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📄 Summary
        </button>
        <button
          onClick={() => onGenerateWorksheet(fileId)}
          disabled={isDisabled}
          className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📋 Worksheet
        </button>
      </div>
      
      {aiJobId && jobStatus && (
        <div className="mt-2 text-xs text-center">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all" 
              style={{ width: `${jobStatus.progress || 0}%` }}
            />
          </div>
          <span className="text-gray-600 dark:text-gray-400">
            {jobStatus.status === 'processing' ? 'Üretiliyor...' : jobStatus.status}
          </span>
        </div>
      )}
    </div>
  );
}

