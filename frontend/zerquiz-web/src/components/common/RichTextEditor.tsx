import { useRef, useState, useEffect } from "react";
import "katex/dist/katex.min.css";

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
  const previewRef = useRef<HTMLDivElement>(null);
  const [showLatexHelp, setShowLatexHelp] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Render LaTeX in preview
  useEffect(() => {
    if (showPreview && previewRef.current && typeof window !== 'undefined') {
      const katex = require('katex');
      const content = value || placeholder;
      
      // Replace LaTeX with rendered version
      const renderedContent = content.replace(/\\\((.*?)\\\)/g, (match: string, latex: string) => {
        try {
          return katex.renderToString(latex, { throwOnError: false, displayMode: false });
        } catch {
          return match;
        }
      }).replace(/\\\[(.*?)\\\]/g, (match: string, latex: string) => {
        try {
          return katex.renderToString(latex, { throwOnError: false, displayMode: true });
        } catch {
          return match;
        }
      });
      
      previewRef.current.innerHTML = renderedContent
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/__(.*?)__/g, '<u>$1</u>')
        .replace(/\n/g, '<br>');
    }
  }, [value, showPreview, placeholder]);

  const insertLatex = (displayMode: boolean = false) => {
    const examples = displayMode 
      ? "Örnekler:\n• x^2 + y^2 = z^2\n• \\frac{a}{b}\n• \\sum_{i=1}^{n} i\n• \\int_{0}^{\\infty} x dx"
      : "Örnekler: x^2, \\frac{a}{b}, \\sqrt{x}";
    const latex = prompt(`${displayMode ? 'Blok' : 'Satır içi'} LaTeX formülü:\n\n${examples}`);
    
    if (latex && textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const wrapper = displayMode ? [`\\[`, `\\]`] : [`\\(`, `\\)`];
      const newValue =
        value.substring(0, start) + wrapper[0] + latex + wrapper[1] + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        if (textareaRef.current) {
          const newPos = start + latex.length + wrapper[0].length + wrapper[1].length;
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
      <div className="border border-gray-300 rounded-t-lg bg-gradient-to-r from-gray-50 to-gray-100 p-2 flex flex-wrap gap-1 items-center">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => formatText("**")}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:border-gray-400 font-bold transition-colors"
            title="Kalın (Bold)"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => formatText("*")}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:border-gray-400 italic transition-colors"
            title="İtalik (Italic)"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => formatText("__")}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:border-gray-400 underline transition-colors"
            title="Altı Çizili (Underline)"
          >
            U
          </button>
        </div>
        
        <div className="w-px h-6 bg-gray-400"></div>
        
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => insertLatex(false)}
            className="px-3 py-1.5 bg-blue-600 text-white border border-blue-700 rounded hover:bg-blue-700 font-mono transition-colors shadow-sm"
            title="Satır içi LaTeX (inline)"
          >
            ƒx
          </button>
          <button
            type="button"
            onClick={() => insertLatex(true)}
            className="px-3 py-1.5 bg-purple-600 text-white border border-purple-700 rounded hover:bg-purple-700 font-mono transition-colors shadow-sm"
            title="Blok LaTeX (display)"
          >
            ƒ(x)
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`px-3 py-1.5 border rounded transition-colors ${
              showPreview 
                ? 'bg-green-600 text-white border-green-700 hover:bg-green-700' 
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            title="Önizleme"
          >
            👁️
          </button>
          <button
            type="button"
            onClick={() => setShowLatexHelp(!showLatexHelp)}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:border-gray-400 transition-colors"
            title="Yardım"
          >
            ?
          </button>
        </div>
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

      {/* Editor / Preview Toggle */}
      {!showPreview ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          style={{ height: `${height}px` }}
          className="w-full px-4 py-3 border-x border-b border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm leading-relaxed"
        />
      ) : (
        <div
          ref={previewRef}
          style={{ height: `${height}px` }}
          className="w-full px-4 py-3 border-x border-b border-gray-300 rounded-b-lg overflow-y-auto bg-white prose prose-sm max-w-none"
        />
      )}

      <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
        Metni seçip <strong>B/I/U</strong> ile biçimlendirin | <strong>ƒx</strong> satır içi LaTeX | <strong>ƒ(x)</strong> blok LaTeX | <strong>👁️</strong> önizleme
      </p>
    </div>
  );
}
