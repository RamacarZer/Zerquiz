import { useRef, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
  label?: string;
  required?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "İçerik yazın...",
  height = 300,
  label,
  required = false,
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showLatexHelp, setShowLatexHelp] = useState(false);

  const insertLatex = () => {
    const latex = prompt("LaTeX formülünü girin (örn: x^2 + y^2 = z^2):");
    if (latex && textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newValue =
        value.substring(0, start) + `\\(${latex}\\)` + value.substring(end);
      onChange(newValue);

      // Set cursor position after inserted text
      setTimeout(() => {
        if (textareaRef.current) {
          const newPos = start + latex.length + 4;
          textareaRef.current.selectionStart = newPos;
          textareaRef.current.selectionEnd = newPos;
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  const formatText = (prefix: string, suffix: string = prefix) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selectedText = value.substring(start, end);
      const newValue =
        value.substring(0, start) +
        prefix +
        selectedText +
        suffix +
        value.substring(end);
      onChange(newValue);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Toolbar */}
      <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => formatText("**")}
          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold"
          title="Bold (Kalın)"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => formatText("*")}
          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 italic"
          title="Italic (İtalik)"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => formatText("__")}
          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 underline"
          title="Underline (Altı çizili)"
        >
          U
        </button>
        <div className="w-px bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={insertLatex}
          className="px-3 py-1 bg-blue-600 text-white border border-blue-700 rounded hover:bg-blue-700 font-mono"
          title="LaTeX formülü ekle"
        >
          ƒx
        </button>
        <button
          type="button"
          onClick={() => setShowLatexHelp(!showLatexHelp)}
          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
          title="LaTeX yardım"
        >
          ?
        </button>
      </div>

      {/* LaTeX Help */}
      {showLatexHelp && (
        <div className="border-x border-gray-300 bg-blue-50 p-3 text-xs">
          <p className="font-semibold mb-1">LaTeX Örnekleri:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <code>x^2 + y^2 = z^2</code> → x² + y² = z²
            </li>
            <li>
              <code>\frac{"{a}{b}"}</code> → a/b (kesir)
            </li>
            <li>
              <code>\sqrt{"{x}"}</code> → √x (karekök)
            </li>
            <li>
              <code>
                \sum_{"{i=1}"}^{"{n}"} i
              </code>{" "}
              → Σ (toplam)
            </li>
          </ul>
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={{ height: `${height}px` }}
        className="w-full px-3 py-2 border-x border-b border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
      />

      <p className="text-xs text-gray-500 mt-1">
        💡 Metni seçip biçimlendirme butonlarını kullanın. LaTeX için "ƒx"
        butonuna tıklayın.
      </p>
    </div>
  );
}
