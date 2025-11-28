import React, { useState, useRef, useEffect } from 'react';
import {
  Play, Square, RotateCcw, Save, Download, Upload, Copy, Settings,
  CheckCircle, XCircle, AlertTriangle, Code, Terminal, FileCode,
} from 'lucide-react';

interface CodeEditorProps {
  initialCode?: string;
  language?: 'python' | 'javascript' | 'java' | 'cpp' | 'c' | 'typescript';
  theme?: 'light' | 'dark' | 'vs-dark' | 'hc-black';
  readOnly?: boolean;
  height?: string;
  showLineNumbers?: boolean;
  showMinimap?: boolean;
  fontSize?: number;
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => void;
  testCases?: TestCase[];
}

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description?: string;
}

interface TestResult {
  testCaseId: string;
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  executionTime: number;
  error?: string;
}

/**
 * Code Editor Component
 * Monaco Editor benzeri programlama editörü
 * NOT: Production'da Monaco Editor veya CodeMirror kullanılmalı
 */
export default function CodeEditor({
  initialCode = '',
  language = 'python',
  theme = 'vs-dark',
  readOnly = false,
  height = '400px',
  showLineNumbers = true,
  showMinimap = false,
  fontSize = 14,
  onCodeChange,
  onRun,
  testCases = [],
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [activeTab, setActiveTab] = useState<'editor' | 'output' | 'tests'>('editor');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (onCodeChange) {
      onCodeChange(code);
    }
  }, [code, onCodeChange]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!readOnly) {
      setCode(e.target.value);
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    setOutput('');
    setTestResults([]);

    // Simüle: Kod çalıştırma (Production'da backend'e gönderilecek)
    setTimeout(() => {
      const result = simulateCodeExecution(code, language);
      setOutput(result.output);
      setIsRunning(false);

      if (onRun) {
        onRun(code);
      }

      // Test cases varsa çalıştır
      if (testCases.length > 0) {
        const results = testCases.map(tc => simulateTestCase(code, tc, language));
        setTestResults(results);
        setActiveTab('tests');
      } else {
        setActiveTab('output');
      }
    }, 1500);
  };

  const handleClear = () => {
    if (confirm('Tüm kodu temizlemek istediğinizden emin misiniz?')) {
      setCode('');
      setOutput('');
      setTestResults([]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('Kod kopyalandı!');
  };

  const handleDownload = () => {
    const ext = languageExtensions[language];
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const languageExtensions: Record<string, string> = {
    python: '.py',
    javascript: '.js',
    java: '.java',
    cpp: '.cpp',
    c: '.c',
    typescript: '.ts',
  };

  const languageLabels: Record<string, string> = {
    python: 'Python',
    javascript: 'JavaScript',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    typescript: 'TypeScript',
  };

  const themeClasses = {
    light: 'bg-white text-gray-900',
    dark: 'bg-gray-900 text-gray-100',
    'vs-dark': 'bg-gray-800 text-gray-100',
    'hc-black': 'bg-black text-white',
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Code className="h-6 w-6" />
          <div>
            <h3 className="font-semibold">Code Editor</h3>
            <p className="text-xs opacity-80">{languageLabels[language]}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning || !code.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 rounded-lg transition"
          >
            {isRunning ? (
              <>
                <Square className="h-4 w-4 animate-pulse" />
                Çalıştırılıyor...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Çalıştır
              </>
            )}
          </button>
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-white/20 rounded-lg transition"
            title="Kopyala"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-white/20 rounded-lg transition"
            title="İndir"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={handleClear}
            className="p-2 hover:bg-white/20 rounded-lg transition"
            title="Temizle"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 bg-gray-50">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'editor'
              ? 'bg-white border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <FileCode className="h-4 w-4" /> Editör
        </button>
        <button
          onClick={() => setActiveTab('output')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'output'
              ? 'bg-white border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Terminal className="h-4 w-4" /> Çıktı
        </button>
        {testCases.length > 0 && (
          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
              activeTab === 'tests'
                ? 'bg-white border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <CheckCircle className="h-4 w-4" /> Test Cases ({testCases.length})
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-0">
        {activeTab === 'editor' && (
          <div className={`${themeClasses[theme]} relative`}>
            {showLineNumbers && (
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-700 text-gray-400 text-right pr-2 pt-3 select-none font-mono text-sm">
                {code.split('\n').map((_, i) => (
                  <div key={i} className="leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleCodeChange}
              readOnly={readOnly}
              className={`w-full ${themeClasses[theme]} p-3 font-mono resize-none focus:outline-none ${
                showLineNumbers ? 'pl-14' : 'pl-3'
              }`}
              style={{ height: height, fontSize: `${fontSize}px`, lineHeight: '1.5' }}
              placeholder={`Kodunuzu buraya yazın (${languageLabels[language]})...`}
              spellCheck={false}
            />
          </div>
        )}

        {activeTab === 'output' && (
          <div className="p-4 bg-gray-900 text-green-400 font-mono text-sm" style={{ minHeight: height }}>
            {output ? (
              <pre className="whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="text-gray-500 text-center py-12">
                <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Henüz çıktı yok. Kodu çalıştırın.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="p-4" style={{ minHeight: height, maxHeight: height, overflowY: 'auto' }}>
            {testResults.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Kodu çalıştırın, test sonuçları burada görünecek</p>
              </div>
            ) : (
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div
                    key={result.testCaseId}
                    className={`border-l-4 p-4 rounded-r-lg ${
                      result.passed
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {result.passed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className="font-semibold">Test Case {index + 1}</span>
                      </div>
                      <span className="text-xs text-gray-600">{result.executionTime}ms</span>
                    </div>
                    
                    {testCases[index].description && (
                      <p className="text-sm text-gray-700 mb-2">{testCases[index].description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-700 mb-1">Beklenen:</div>
                        <pre className="bg-white p-2 rounded border border-gray-300 text-xs">
                          {result.expectedOutput}
                        </pre>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700 mb-1">Gerçek:</div>
                        <pre className={`p-2 rounded border text-xs ${
                          result.passed ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
                        }`}>
                          {result.actualOutput}
                        </pre>
                      </div>
                    </div>

                    {result.error && (
                      <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-800">
                        <strong>Hata:</strong> {result.error}
                      </div>
                    )}
                  </div>
                ))}

                {/* Summary */}
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Özet:</span>
                    <div className="flex gap-4 text-sm">
                      <span className="text-green-600">
                        ✓ {testResults.filter(r => r.passed).length} Başarılı
                      </span>
                      <span className="text-red-600">
                        ✗ {testResults.filter(r => !r.passed).length} Başarısız
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <span>Satır: {code.split('\n').length}</span>
          <span>Karakter: {code.length}</span>
          <span>Dil: {languageLabels[language]}</span>
        </div>
        <div className="flex items-center gap-2">
          {readOnly && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
              Sadece Okunur
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Simülasyon Fonksiyonları (Production'da backend'e taşınacak)
const simulateCodeExecution = (code: string, language: string): { output: string; error?: string } => {
  // Demo: Basit simülasyon
  if (!code.trim()) {
    return { output: 'Hata: Kod boş!' };
  }

  // Python simülasyonu
  if (language === 'python' && code.includes('print')) {
    const matches = code.match(/print\((.*?)\)/g);
    if (matches) {
      const output = matches.map(m => {
        const content = m.match(/print\((.*?)\)/)?.[1] || '';
        return eval(content.replace(/'/g, '"'));
      }).join('\n');
      return { output: `Program Çıktısı:\n${output}\n\nProgram başarıyla tamamlandı.` };
    }
  }

  // JavaScript simülasyonu
  if (language === 'javascript' && code.includes('console.log')) {
    const matches = code.match(/console\.log\((.*?)\)/g);
    if (matches) {
      const output = matches.map(m => {
        const content = m.match(/console\.log\((.*?)\)/)?.[1] || '';
        try {
          return eval(content);
        } catch {
          return content;
        }
      }).join('\n');
      return { output: `Program Çıktısı:\n${output}\n\nProgram başarıyla tamamlandı.` };
    }
  }

  return {
    output: `Kod çalıştırıldı (${language})\n\nNOT: Bu bir simülasyon. Production'da gerçek compiler/interpreter kullanılacak.\n\nKod:\n${code}`,
  };
};

const simulateTestCase = (code: string, testCase: TestCase, language: string): TestResult => {
  // Demo: Basit test case simülasyonu
  const executionTime = Math.floor(Math.random() * 100) + 10;
  
  // Basit örnek: Python'da sayı toplama
  if (language === 'python' && code.includes('def sum')) {
    const input = testCase.input;
    const expected = testCase.expectedOutput;
    const actual = expected; // Demo için her zaman geçiyor
    
    return {
      testCaseId: testCase.id,
      passed: actual === expected,
      actualOutput: actual,
      expectedOutput: expected,
      executionTime: executionTime,
    };
  }

  // Random pass/fail for demo
  const passed = Math.random() > 0.3;
  return {
    testCaseId: testCase.id,
    passed: passed,
    actualOutput: passed ? testCase.expectedOutput : 'Farklı çıktı',
    expectedOutput: testCase.expectedOutput,
    executionTime: executionTime,
  };
};

