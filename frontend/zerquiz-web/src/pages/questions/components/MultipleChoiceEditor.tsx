import { Plus, X } from 'lucide-react';

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface MultipleChoiceEditorProps {
  options: Option[];
  onChange: (options: Option[]) => void;
}

export default function MultipleChoiceEditor({
  options,
  onChange,
}: MultipleChoiceEditorProps) {
  const handleAddOption = () => {
    const newOption: Option = {
      id: `opt_${Date.now()}`,
      text: '',
      isCorrect: false,
    };
    onChange([...options, newOption]);
  };

  const handleRemoveOption = (id: string) => {
    onChange(options.filter((opt) => opt.id !== id));
  };

  const handleOptionTextChange = (id: string, text: string) => {
    onChange(options.map((opt) => (opt.id === id ? { ...opt, text } : opt)));
  };

  const handleCorrectChange = (id: string) => {
    onChange(options.map((opt) => (opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="label">
          <span className="label-text font-semibold">Seçenekler</span>
        </label>
        <button onClick={handleAddOption} className="btn btn-sm btn-outline gap-2">
          <Plus size={16} />
          Seçenek Ekle
        </button>
      </div>

      <div className="space-y-3">
        {options.map((option, index) => (
          <div key={option.id} className="flex items-center gap-3">
            <div className="badge badge-neutral">{String.fromCharCode(65 + index)}</div>
            <input
              type="text"
              className="input input-bordered flex-1"
              value={option.text}
              onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
              placeholder="Seçenek metni"
            />
            <label className="label cursor-pointer gap-2">
              <span className="label-text">Doğru</span>
              <input
                type="checkbox"
                className="checkbox checkbox-success"
                checked={option.isCorrect}
                onChange={() => handleCorrectChange(option.id)}
              />
            </label>
            {options.length > 2 && (
              <button
                onClick={() => handleRemoveOption(option.id)}
                className="btn btn-sm btn-ghost btn-circle text-error"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

