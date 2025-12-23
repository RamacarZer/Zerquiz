import { Highlighter, Volume2, Palette } from 'lucide-react';

interface HighlightToolbarProps {
  onHighlight: () => void;
  onReadAloud: () => void;
  highlightColor: string;
  onColorChange: (color: string) => void;
}

const HIGHLIGHT_COLORS = [
  { name: 'Sarı', value: '#FFEB3B' },
  { name: 'Yeşil', value: '#4CAF50' },
  { name: 'Mavi', value: '#2196F3' },
  { name: 'Turuncu', value: '#FF9800' },
  { name: 'Pembe', value: '#E91E63' },
  { name: 'Mor', value: '#9C27B0' },
];

export default function HighlightToolbar({
  onHighlight,
  onReadAloud,
  highlightColor,
  onColorChange,
}: HighlightToolbarProps) {
  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 px-4 py-2 flex items-center gap-3">
        {/* Highlight Button */}
        <button
          onClick={onHighlight}
          className="btn btn-sm btn-ghost gap-2 hover:bg-yellow-50"
          title="İşaretle"
        >
          <Highlighter size={18} className="text-yellow-600" />
          İşaretle
        </button>

        {/* Color Picker */}
        <div className="dropdown dropdown-top">
          <label tabIndex={0} className="btn btn-sm btn-ghost gap-2">
            <Palette size={18} />
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: highlightColor }}
            />
          </label>
          <div
            tabIndex={0}
            className="dropdown-content z-[1] menu p-3 shadow-lg bg-base-100 rounded-box w-48"
          >
            <p className="text-xs font-semibold text-gray-600 mb-2">Renk Seçin</p>
            <div className="grid grid-cols-3 gap-2">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => onColorChange(color.value)}
                  className={`w-full h-10 rounded-md border-2 transition ${
                    highlightColor === color.value ? 'border-gray-800 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="divider divider-horizontal mx-0"></div>

        {/* Read Aloud Button */}
        <button
          onClick={onReadAloud}
          className="btn btn-sm btn-ghost gap-2 hover:bg-blue-50"
          title="Sesli Oku"
        >
          <Volume2 size={18} className="text-blue-600" />
          Sesli Oku
        </button>
      </div>
    </div>
  );
}

