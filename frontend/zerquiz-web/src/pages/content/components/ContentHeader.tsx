import { Upload } from 'lucide-react';

interface ContentHeaderProps {
  title: string;
  description: string;
  onUploadClick: () => void;
  uploadLabel: string;
}

export default function ContentHeader({ title, description, onUploadClick, uploadLabel }: ContentHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
      <button
        onClick={onUploadClick}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
      >
        <Upload className="w-5 h-5" />
        {uploadLabel}
      </button>
    </div>
  );
}

