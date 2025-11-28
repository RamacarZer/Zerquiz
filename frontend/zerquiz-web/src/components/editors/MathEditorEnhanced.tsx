import React, { useState, useEffect } from 'react';
import { MathJax, MathJaxContext } from 'mathjax-react';
import { Type, Code, Eye } from 'lucide-react';

interface MathEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MathEditorEnhanced({ value, onChange, placeholder = 'LaTeX formülü girin...' }: MathEditorProps) {
  const [mode, setMode] = useState<'latex' | 'preview'>('latex');
  const [latex, setLatex] = useState(value || '');

  useEffect(() => {
    setLatex(value || '');
  }, [value]);

  const handleChange = (newValue: string) => {
    setLatex(newValue);
    onChange(newValue);
  };

  const mathJaxConfig = {
    loader: { load: ['input/tex', 'output/chtml'] },
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
      packages: { '[+]': ['ams', 'color', 'cancel', 'bbox'] }
    }
  };

  const commonSymbols = [
    { label: 'Kesir', latex: '\\frac{a}{b}' },
    { label: 'Kök', latex: '\\sqrt{x}' },
    { label: 'Üs', latex: 'x^{n}' },
    { label: 'Alt', latex: 'x_{n}' },
    { label: 'Toplam', latex: '\\sum_{i=1}^{n}' },
    { label: 'İntegral', latex: '\\int_{a}^{b}' },
    { label: 'Limit', latex: '\\lim_{x \\to \\infty}' },
    { label: 'Alpha', latex: '\\alpha' },
    { label: 'Beta', latex: '\\beta' },
    { label: 'Pi', latex: '\\pi' },
    { label: 'Sigma', latex: '\\sigma' },
    { label: 'Delta', latex: '\\Delta' },
    { label: 'Sonsuz', latex: '\\infty' },
    { label: 'Eşittir', latex: '=' },
    { label: 'Eşit Değil', latex: '\\neq' },
    { label: 'Yaklaşık', latex: '\\approx' },
    { label: 'Küçük Eşit', latex: '\\leq' },
    { label: 'Büyük Eşit', latex: '\\geq' },
    { label: 'Çarpı', latex: '\\times' },
    { label: 'Bölü', latex: '\\div' },
    { label: 'Plus Minus', latex: '\\pm' },
    { label: 'Vektör', latex: '\\vec{v}' },
    { label: 'Matris', latex: '\\begin{matrix}a & b\\\\c & d\\end{matrix}' },
    { label: 'Binom', latex: '\\binom{n}{k}' },
  ];

  const insertSymbol = (symbol: string) => {
    const textarea = document.getElementById('latex-input') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = latex.substring(0, start) + symbol + latex.substring(end);
    
    handleChange(newValue);
    
    // Set cursor position after inserted symbol
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + symbol.length, start + symbol.length);
    }, 0);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-100 border-b border-gray-300 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('latex')}
            className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
              mode === 'latex' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Code className="h-4 w-4" />
            LaTeX
          </button>
          <button
            onClick={() => setMode('preview')}
            className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
              mode === 'preview' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Eye className="h-4 w-4" />
            Önizleme
          </button>
        </div>
        <div className="text-xs text-gray-600">
          💡 Satır içi: $...$ | Blok: $$...$$
        </div>
      </div>

      {/* Symbol Palette */}
      <div className="bg-gray-50 border-b border-gray-300 p-2">
        <div className="text-xs font-medium text-gray-700 mb-2">Hızlı Semboller:</div>
        <div className="flex flex-wrap gap-1">
          {commonSymbols.map((symbol) => (
            <button
              key={symbol.label}
              onClick={() => insertSymbol(symbol.latex)}
              className="px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-blue-50 hover:border-blue-400 transition-colors"
              title={symbol.latex}
            >
              {symbol.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white">
        {mode === 'latex' ? (
          <div className="p-3">
            <textarea
              id="latex-input"
              value={latex}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-32 p-3 font-mono text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
        ) : (
          <div className="p-6 min-h-[8rem] bg-white">
            <MathJaxContext config={mathJaxConfig}>
              <MathJax dynamic>
                {latex || <span className="text-gray-400 italic">Önizleme görünecek...</span>}
              </MathJax>
            </MathJaxContext>
          </div>
        )}
      </div>

      {/* Examples */}
      <div className="bg-gray-50 border-t border-gray-300 p-3">
        <details className="text-xs">
          <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600">
            📚 LaTeX Örnekleri
          </summary>
          <div className="mt-2 space-y-1 text-gray-600">
            <div><code>$x^2 + y^2 = z^2$</code> → Pitagor teoremi</div>
            <div><code>$$\int_0^\infty e^{'{-x^2}'} dx = \frac{'{\\sqrt{\\pi}}'}{'{2}'}$$</code> → Gauss integrali</div>
            <div><code>$\frac{'{n!}'}{'{k!(n-k)!}'}$</code> → Binom katsayısı</div>
            <div><code>$\lim_{'{x \\to 0}'} \frac{'{\\sin x}'}{'{x}'} = 1$</code> → Limit</div>
            <div><code>$\sqrt[3]{'{8}'} = 2$</code> → Küp kök</div>
          </div>
        </details>
      </div>
    </div>
  );
}

