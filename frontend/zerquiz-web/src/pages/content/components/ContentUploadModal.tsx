import { Upload } from 'lucide-react';

interface ContentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContentUploadModal({ isOpen, onClose }: ContentUploadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Upload Content
        </h2>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center mb-6">
          <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Supported formats: PDF, DOCX, PPTX (Max 50MB)
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

