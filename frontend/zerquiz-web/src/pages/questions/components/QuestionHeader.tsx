import { Upload } from 'lucide-react';

interface QuestionHeaderProps {
  title: string;
  description?: string;
  onSaveClick: () => void;
  onPreviewClick: () => void;
  saveDisabled?: boolean;
  saveLabel?: string;
}

export default function QuestionHeader({
  title,
  description,
  onSaveClick,
  onPreviewClick,
  saveDisabled = false,
  saveLabel = 'Kaydet',
}: QuestionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-gray-600 mt-1">{description}</p>}
      </div>
      <div className="flex gap-3">
        <button onClick={onPreviewClick} className="btn btn-outline gap-2">
          Önizle
        </button>
        <button
          onClick={onSaveClick}
          disabled={saveDisabled}
          className="btn btn-primary gap-2"
        >
          <Upload size={18} />
          {saveLabel}
        </button>
      </div>
    </div>
  );
}

