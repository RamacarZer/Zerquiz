import React, { useState, useEffect, useRef } from 'react';
import {
  Type, Grid3x3, Sigma, PlusCircle, MinusCircle, X as XIcon, Divide,
  Superscript, Subscript, Pi, Infinity, Triangle, Circle,
  Square, Eye, Copy, Trash2, Save, Download, Upload, Book, Sparkles,
  CheckSquare,
} from 'lucide-react';

interface MathEditorProps {
  initialValue?: string;
  onChange?: (latex: string) => void;
  onSave?: (latex: string) => void;
  height?: string;
  showPreview?: boolean;
  readOnly?: boolean;
}

/**
 * Math Editor Component
 * LaTeX matematik formül editörü - KaTeX ile render
 * NOT: Production'da KaTeX kütüphanesi eklenmelidir
 */
export default function MathEditor({
  initialValue = '',
  onChange,
  onSave,
  height = '300px',
  showPreview = true,
  readOnly = false,
}: MathEditorProps) {
  const [latex, setLatex] = useState(initialValue);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (onChange) {
      onChange(latex);
    }
  }, [latex, onChange]);

  const insertSymbol = (symbol: string) => {
    if (readOnly) return;
    
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = latex.substring(0, start) + symbol + latex.substring(end);
    
    setLatex(newText);
    
    // Cursor pozisyonunu güncelle
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + symbol.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const insertFunction = (func: string, placeholder: string = '') => {
    if (readOnly) return;
    
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = latex.substring(start, end);
    const insertion = selectedText || placeholder;
    const newText = latex.substring(0, start) + func.replace('{}', `{${insertion}}`) + latex.substring(end);
    
    setLatex(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + func.indexOf('{') + 1;
      textarea.setSelectionRange(newPosition, newPosition + insertion.length);
    }, 0);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(latex);
    }
    alert('Formül kaydedildi! (Demo)');
  };

  const clearEditor = () => {
    if (confirm('Tüm içeriği temizlemek istediğinizden emin misiniz?')) {
      setLatex('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(latex);
    alert('LaTeX kodu kopyalandı!');
  };

  // Symbol categories
  const basicSymbols = [
    { symbol: '+', label: 'Toplama' },
    { symbol: '-', label: 'Çıkarma' },
    { symbol: '\\times', label: 'Çarpma' },
    { symbol: '\\div', label: 'Bölme' },
    { symbol: '=', label: 'Eşit' },
    { symbol: '\\neq', label: 'Eşit Değil' },
    { symbol: '<', label: 'Küçüktür' },
    { symbol: '>', label: 'Büyüktür' },
    { symbol: '\\leq', label: 'Küçük Eşit' },
    { symbol: '\\geq', label: 'Büyük Eşit' },
  ];

  const greekLetters = [
    { symbol: '\\alpha', label: 'Alpha' },
    { symbol: '\\beta', label: 'Beta' },
    { symbol: '\\gamma', label: 'Gamma' },
    { symbol: '\\delta', label: 'Delta' },
    { symbol: '\\epsilon', label: 'Epsilon' },
    { symbol: '\\theta', label: 'Theta' },
    { symbol: '\\lambda', label: 'Lambda' },
    { symbol: '\\pi', label: 'Pi' },
    { symbol: '\\sigma', label: 'Sigma' },
    { symbol: '\\omega', label: 'Omega' },
  ];

  const functions = [
    { func: '\\frac{}{}', label: 'Kesir', icon: Divide },
    { func: '\\sqrt{}', label: 'Karekök', icon: CheckSquare },
    { func: '^{}', label: 'Üs', icon: Superscript },
    { func: '_{}', label: 'Alt İndis', icon: Subscript },
    { func: '\\sum_{}^{}', label: 'Toplam' },
    { func: '\\int_{}^{}', label: 'İntegral' },
    { func: '\\lim_{}', label: 'Limit' },
    { func: '\\prod_{}^{}', label: 'Çarpım' },
  ];

  const templates = [
    { name: 'Köklü Denklem', latex: '\\sqrt{a^2 + b^2} = c' },
    { name: 'İkinci Dereceden', latex: 'ax^2 + bx + c = 0' },
    { name: 'Çözüm Formülü', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
    { name: 'Pisagor', latex: 'a^2 + b^2 = c^2' },
    { name: 'Matris', latex: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}' },
    { name: 'Integral', latex: '\\int_{a}^{b} f(x) dx' },
    { name: 'Limit', latex: '\\lim_{x \\to \\infty} f(x)' },
    { name: 'Türev', latex: '\\frac{d}{dx}f(x) = f\'(x)' },
  ];

  // Simüle: KaTeX render (Production'da gerçek KaTeX kullanılmalı)
  const renderLatex = (latexString: string): string => {
    // Bu demo için basit bir dönüştürme
    // Production'da: katex.renderToString(latexString) kullanılmalı
    return latexString
      .replace(/\\frac{([^}]*)}{([^}]*)}/g, '($1)/($2)')
      .replace(/\\sqrt{([^}]*)}/g, '√($1)')
      .replace(/\^{([^}]*)}/g, '↑$1')
      .replace(/_{([^}]*)}/g, '↓$1')
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\gamma/g, 'γ')
      .replace(/\\delta/g, 'δ')
      .replace(/\\pi/g, 'π')
      .replace(/\\times/g, '×')
      .replace(/\\div/g, '÷')
      .replace(/\\leq/g, '≤')
      .replace(/\\geq/g, '≥')
      .replace(/\\neq/g, '≠')
      .replace(/\\sum/g, '∑')
      .replace(/\\int/g, '∫')
      .replace(/\\lim/g, 'lim');
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sigma className="h-6 w-6" />
          <h3 className="font-semibold">Math Editor (LaTeX)</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="p-2 hover:bg-white/20 rounded-lg transition"
            title="Kopyala"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={handleSave}
            className="p-2 hover:bg-white/20 rounded-lg transition"
            title="Kaydet"
          >
            <Save className="h-4 w-4" />
          </button>
          <button
            onClick={clearEditor}
            className="p-2 hover:bg-white/20 rounded-lg transition"
            title="Temizle"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      {!readOnly && (
        <div className="bg-gray-50 border-b border-gray-300 p-3 space-y-3">
          {/* Basic Symbols */}
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2">Temel Semboller</div>
            <div className="flex flex-wrap gap-2">
              {basicSymbols.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => insertSymbol(item.symbol)}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-500 transition text-sm font-mono"
                  title={item.label}
                >
                  {renderLatex(item.symbol)}
                </button>
              ))}
            </div>
          </div>

          {/* Functions */}
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2">Fonksiyonlar</div>
            <div className="flex flex-wrap gap-2">
              {functions.map((item) => (
                <button
                  key={item.func}
                  onClick={() => insertFunction(item.func, 'x')}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-green-50 hover:border-green-500 transition text-sm flex items-center gap-1"
                  title={item.label}
                >
                  {item.icon && <item.icon className="h-3 w-3" />}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Greek Letters */}
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2">Yunan Harfleri</div>
            <div className="flex flex-wrap gap-2">
              {greekLetters.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => insertSymbol(item.symbol)}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-purple-50 hover:border-purple-500 transition text-sm"
                  title={item.label}
                >
                  {renderLatex(item.symbol)}
                </button>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2">Hazır Şablonlar</div>
            <div className="flex flex-wrap gap-2">
              {templates.map((template) => (
                <button
                  key={template.name}
                  onClick={() => setLatex(template.latex)}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-yellow-50 hover:border-yellow-500 transition text-xs flex items-center gap-1"
                  title={template.latex}
                >
                  <Sparkles className="h-3 w-3" />
                  {template.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      {showPreview && (
        <div className="flex border-b border-gray-300 bg-gray-100">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium ${
              activeTab === 'editor'
                ? 'bg-white border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Type className="h-4 w-4" /> LaTeX Kodu
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium ${
              activeTab === 'preview'
                ? 'bg-white border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Eye className="h-4 w-4" /> Önizleme
          </button>
        </div>
      )}

      {/* Editor / Preview */}
      <div className="p-4">
        {activeTab === 'editor' || !showPreview ? (
          <div>
            <textarea
              ref={textareaRef}
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              onSelect={(e) => setCursorPosition((e.target as HTMLTextAreaElement).selectionStart)}
              readOnly={readOnly}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              style={{ height: height, resize: 'vertical' }}
              placeholder="LaTeX formülü yazın... Örn: \frac{a}{b} + \sqrt{x^2 + y^2}"
            />
            <div className="mt-2 text-xs text-gray-500">
              💡 İpucu: Yukarıdaki butonları kullanarak sembol ve fonksiyon ekleyebilirsiniz.
            </div>
          </div>
        ) : (
          <div
            className="w-full px-4 py-6 border border-gray-300 rounded-lg bg-gray-50 overflow-auto"
            style={{ minHeight: height }}
          >
            {latex ? (
              <div className="text-center">
                {/* Gerçek KaTeX render buraya gelecek */}
                <div className="text-2xl font-semibold text-gray-900 mb-4">
                  Önizleme (Simülasyon)
                </div>
                <div className="text-xl text-gray-700 font-mono bg-white p-6 rounded-lg shadow-inner">
                  {renderLatex(latex)}
                </div>
                <div className="mt-4 text-sm text-gray-500 italic">
                  Production'da KaTeX ile profesyonel render edilecek
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <Sigma className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Formül yazın, önizleme burada görünecek</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 rounded-b-lg flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <span>LaTeX Karakter Sayısı: {latex.length}</span>
          <span>Cursor: {cursorPosition}</span>
        </div>
        <a
          href="https://katex.org/docs/supported.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-600 hover:underline"
        >
          <Book className="h-3 w-3" /> LaTeX Referansı
        </a>
      </div>
    </div>
  );
}

