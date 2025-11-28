import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, FileText, Eye, Download, Upload, Trash2,
  Sigma, Calculator, TrendingUp, PieChart,
} from 'lucide-react';
import MathEditor from '../../components/editors/MathEditor';

export default function MathEditorDemoPage() {
  const navigate = useNavigate();
  const [savedFormulas, setSavedFormulas] = useState<{ id: string; title: string; latex: string; date: Date }[]>([
    {
      id: '1',
      title: 'İkinci Dereceden Denklem Çözümü',
      latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
      date: new Date('2024-11-20'),
    },
    {
      id: '2',
      title: 'Pisagor Teoremi',
      latex: 'a^2 + b^2 = c^2',
      date: new Date('2024-11-21'),
    },
    {
      id: '3',
      title: 'İntegral Hesabı',
      latex: '\\int_{a}^{b} f(x) dx = F(b) - F(a)',
      date: new Date('2024-11-22'),
    },
  ]);

  const [currentFormula, setCurrentFormula] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleSave = (latex: string) => {
    setCurrentFormula(latex);
    setShowSaveModal(true);
  };

  const handleConfirmSave = () => {
    if (!currentTitle.trim()) {
      alert('Lütfen bir başlık girin!');
      return;
    }

    const newFormula = {
      id: Date.now().toString(),
      title: currentTitle,
      latex: currentFormula,
      date: new Date(),
    };

    setSavedFormulas(prev => [newFormula, ...prev]);
    setShowSaveModal(false);
    setCurrentTitle('');
    setCurrentFormula('');
    alert('Formül başarıyla kaydedildi!');
  };

  const handleLoadFormula = (latex: string) => {
    setCurrentFormula(latex);
  };

  const handleDeleteFormula = (id: string) => {
    if (confirm('Bu formülü silmek istediğinizden emin misiniz?')) {
      setSavedFormulas(prev => prev.filter(f => f.id !== id));
    }
  };

  const exampleCategories = [
    {
      name: 'Cebirsel Denklemler',
      icon: Calculator,
      examples: [
        { title: 'Doğrusal', latex: 'y = mx + b' },
        { title: 'Karesel', latex: 'ax^2 + bx + c = 0' },
        { title: 'Üstel', latex: 'y = a \\cdot e^{bx}' },
      ],
    },
    {
      name: 'Geometri',
      icon: PieChart,
      examples: [
        { title: 'Daire Alanı', latex: 'A = \\pi r^2' },
        { title: 'Üçgen Alanı', latex: 'A = \\frac{1}{2}bh' },
        { title: 'Küre Hacmi', latex: 'V = \\frac{4}{3}\\pi r^3' },
      ],
    },
    {
      name: 'Kalkülüs',
      icon: TrendingUp,
      examples: [
        { title: 'Türev', latex: '\\frac{d}{dx}x^n = nx^{n-1}' },
        { title: 'Zincir Kuralı', latex: '\\frac{d}{dx}f(g(x)) = f\'(g(x)) \\cdot g\'(x)' },
        { title: 'Kısmi Türev', latex: '\\frac{\\partial f}{\\partial x}' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Sigma className="h-7 w-7 text-purple-600" />
                  Math Editor (LaTeX)
                </h1>
                <p className="text-sm text-gray-600">Matematiksel formül editörü ve önizleme</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <Upload className="h-4 w-4" /> İçe Aktar
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                <Download className="h-4 w-4" /> Dışa Aktar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            <MathEditor
              initialValue={currentFormula}
              onChange={(latex) => setCurrentFormula(latex)}
              onSave={handleSave}
              height="400px"
              showPreview={true}
            />

            {/* Info Card */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <h3 className="font-semibold text-blue-900 mb-2">📚 Kullanım İpuçları</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Sembol butonlarını kullanarak hızlıca formül oluşturabilirsiniz</li>
                <li>• Hazır şablonlardan istediğinizi seçip düzenleyebilirsiniz</li>
                <li>• "Önizleme" sekmesinde formülün görünümünü kontrol edebilirsiniz</li>
                <li>• Production'da KaTeX ile profesyonel render yapılacaktır</li>
              </ul>
            </div>

            {/* Example Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Örnek Formüller</h2>
              <div className="space-y-6">
                {exampleCategories.map(category => (
                  <div key={category.name}>
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                      <category.icon className="h-5 w-5 text-blue-600" />
                      {category.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {category.examples.map(example => (
                        <button
                          key={example.title}
                          onClick={() => handleLoadFormula(example.latex)}
                          className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition text-left"
                        >
                          <div className="text-sm font-semibold text-gray-900 mb-1">{example.title}</div>
                          <div className="text-xs font-mono text-gray-600 truncate">{example.latex}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Saved Formulas */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Kayıtlı Formüller
              </h2>
              <div className="space-y-3">
                {savedFormulas.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Sigma className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Henüz kayıtlı formül yok</p>
                  </div>
                ) : (
                  savedFormulas.map(formula => (
                    <div
                      key={formula.id}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">{formula.title}</h3>
                        <button
                          onClick={() => handleDeleteFormula(formula.id)}
                          className="p-1 hover:bg-red-100 rounded transition"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                      <div className="text-xs font-mono text-gray-600 bg-white p-2 rounded mb-2 overflow-x-auto">
                        {formula.latex}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formula.date.toLocaleDateString('tr-TR')}</span>
                        <button
                          onClick={() => handleLoadFormula(formula.latex)}
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <Eye className="h-3 w-3" /> Yükle
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">İstatistikler</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-700">Toplam Formül</span>
                  <span className="text-xl font-bold text-blue-600">{savedFormulas.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">Karakter Sayısı</span>
                  <span className="text-xl font-bold text-green-600">{currentFormula.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-gray-700">Sembol Sayısı</span>
                  <span className="text-xl font-bold text-purple-600">
                    {(currentFormula.match(/\\/g) || []).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Formülü Kaydet</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Formül Başlığı</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                placeholder="Örn: Pisagor Teoremi"
                autoFocus
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">LaTeX Kodu</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-300 font-mono text-sm text-gray-700 overflow-x-auto">
                {currentFormula}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                İptal
              </button>
              <button
                onClick={handleConfirmSave}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

