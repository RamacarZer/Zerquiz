import React, { useRef, useState, useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image,
  Code,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Eye,
  Type,
} from 'lucide-react';

interface AdvancedRichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
  label?: string;
  required?: boolean;
  showToolbar?: boolean;
  enableKatex?: boolean;
  enableMedia?: boolean;
  onImageUpload?: (file: File) => Promise<string>;
}

export const AdvancedRichTextEditor: React.FC<AdvancedRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'İçerik yazın...',
  height = 400,
  label,
  required = false,
  showToolbar = true,
  enableKatex = true,
  enableMedia = true,
  onImageUpload,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showKatexHelp, setShowKatexHelp] = useState(false);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Sync value to editor
  useEffect(() => {
    if (editorRef.current && !showPreview) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value, showPreview]);

  const updateHistory = (newValue: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newValue);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
      updateHistory(newContent);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertKatex = (displayMode: boolean = false) => {
    const latex = prompt(
      `${displayMode ? 'Blok' : 'Satır içi'} LaTeX formülü:\n\nÖrnekler: x^2, \\frac{a}{b}, \\sqrt{x}, \\sum_{i=1}^{n}`
    );

    if (latex) {
      try {
        const html = katex.renderToString(latex, {
          throwOnError: false,
          displayMode,
        });
        execCommand('insertHTML', `<span class="katex-formula" data-latex="${latex}">${html}</span>`);
      } catch (error) {
        alert('LaTeX formülü hatalı!');
      }
    }
  };

  const insertLink = () => {
    const url = prompt('Link URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (onImageUpload) {
      try {
        const imageUrl = await onImageUpload(file);
        execCommand('insertHTML', `<img src="${imageUrl}" alt="${file.name}" class="max-w-full h-auto rounded" />`);
      } catch (error) {
        alert('Resim yüklenemedi!');
      }
    } else {
      // Mock local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        execCommand('insertHTML', `<img src="${imageUrl}" alt="${file.name}" class="max-w-full h-auto rounded" />`);
      };
      reader.readAsDataURL(file);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const renderPreview = () => {
    if (!value) return placeholder;

    let rendered = value;

    // Render KaTeX formulas
    if (enableKatex) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = value;
      
      const katexElements = tempDiv.querySelectorAll('.katex-formula');
      katexElements.forEach((el) => {
        const latex = el.getAttribute('data-latex');
        if (latex) {
          try {
            const html = katex.renderToString(latex, {
              throwOnError: false,
              displayMode: el.classList.contains('display'),
            });
            el.innerHTML = html;
          } catch (error) {
            console.error('KaTeX render error:', error);
          }
        }
      });
      
      rendered = tempDiv.innerHTML;
    }

    return rendered;
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
      {showToolbar && (
        <div className="border border-gray-300 rounded-t-lg bg-gradient-to-r from-gray-50 to-gray-100 p-2">
          <div className="flex flex-wrap gap-1 items-center">
            {/* History */}
            <div className="flex gap-1 pr-2 border-r border-gray-300">
              <button
                type="button"
                onClick={undo}
                disabled={historyIndex === 0}
                className="p-2 hover:bg-gray-200 rounded disabled:opacity-30 transition"
                title="Geri Al (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={redo}
                disabled={historyIndex === history.length - 1}
                className="p-2 hover:bg-gray-200 rounded disabled:opacity-30 transition"
                title="İleri Al (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>

            {/* Text Formatting */}
            <div className="flex gap-1 pr-2 border-r border-gray-300">
              <button
                type="button"
                onClick={() => execCommand('bold')}
                className="p-2 hover:bg-gray-200 rounded transition"
                title="Kalın (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('italic')}
                className="p-2 hover:bg-gray-200 rounded transition"
                title="İtalik (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('underline')}
                className="p-2 hover:bg-gray-200 rounded transition"
                title="Altı Çizili (Ctrl+U)"
              >
                <Underline className="w-4 h-4" />
              </button>
            </div>

            {/* Lists */}
            <div className="flex gap-1 pr-2 border-r border-gray-300">
              <button
                type="button"
                onClick={() => execCommand('insertUnorderedList')}
                className="p-2 hover:bg-gray-200 rounded transition"
                title="Madde İşareti"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('insertOrderedList')}
                className="p-2 hover:bg-gray-200 rounded transition"
                title="Numaralı Liste"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
            </div>

            {/* Alignment */}
            <div className="flex gap-1 pr-2 border-r border-gray-300">
              <button
                type="button"
                onClick={() => execCommand('justifyLeft')}
                className="p-2 hover:bg-gray-200 rounded transition"
                title="Sola Hizala"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('justifyCenter')}
                className="p-2 hover:bg-gray-200 rounded transition"
                title="Ortala"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('justifyRight')}
                className="p-2 hover:bg-gray-200 rounded transition"
                title="Sağa Hizala"
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>

            {/* Insert */}
            <div className="flex gap-1 pr-2 border-r border-gray-300">
              <button
                type="button"
                onClick={insertLink}
                className="p-2 hover:bg-gray-200 rounded transition"
                title="Link Ekle"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
              {enableMedia && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-gray-200 rounded transition"
                    title="Resim Ekle"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </>
              )}
              <button
                type="button"
                onClick={() => execCommand('formatBlock', '<pre>')}
                className="p-2 hover:bg-gray-200 rounded transition"
                title="Kod Bloğu"
              >
                <Code className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('formatBlock', '<blockquote>')}
                className="p-2 hover:bg-gray-200 rounded transition"
                title="Alıntı"
              >
                <Quote className="w-4 h-4" />
              </button>
            </div>

            {/* KaTeX */}
            {enableKatex && (
              <div className="flex gap-1 pr-2 border-r border-gray-300">
                <button
                  type="button"
                  onClick={() => insertKatex(false)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-mono"
                  title="Satır içi LaTeX"
                >
                  ƒx
                </button>
                <button
                  type="button"
                  onClick={() => insertKatex(true)}
                  className="px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm font-mono"
                  title="Blok LaTeX"
                >
                  ƒ(x)
                </button>
                <button
                  type="button"
                  onClick={() => setShowKatexHelp(!showKatexHelp)}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="LaTeX Yardım"
                >
                  ?
                </button>
              </div>
            )}

            {/* Preview */}
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded transition ${
                showPreview ? 'bg-green-600 text-white' : 'hover:bg-gray-200'
              }`}
              title="Önizleme"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* KaTeX Help */}
          {showKatexHelp && (
            <div className="mt-2 p-3 bg-blue-50 rounded text-xs">
              <p className="font-semibold mb-2">LaTeX Örnekleri:</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <code>x^2</code> → x²
                </div>
                <div>
                  <code>\frac{"{a}{b}"}</code> → a/b
                </div>
                <div>
                  <code>\sqrt{"{x}"}</code> → √x
                </div>
                <div>
                  <code>\sum_{"{i=1}"}^{"{n}"}</code> → Σ
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Editor / Preview */}
      {!showPreview ? (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          data-placeholder={placeholder}
          style={{ minHeight: `${height}px` }}
          className="w-full px-4 py-3 border-x border-b border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto prose prose-sm max-w-none
            [&:empty:before]:content-[attr(data-placeholder)] [&:empty:before]:text-gray-400 [&:empty:before]:pointer-events-none"
        />
      ) : (
        <div
          style={{ minHeight: `${height}px` }}
          className="w-full px-4 py-3 border-x border-b border-gray-300 rounded-b-lg overflow-y-auto bg-white prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: renderPreview() }}
        />
      )}
    </div>
  );
};

export default AdvancedRichTextEditor;

