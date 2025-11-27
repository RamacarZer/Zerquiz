import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import AdvancedRichTextEditor from '../common/AdvancedRichTextEditor';
import { contentPresentationStyleService, ContentPresentationStyle } from '../../mocks/contentPresentationStyles';

interface ContentEntryStepProps {
  presentationStyleId: string;
  setPresentationStyleId: (id: string) => void;
  headerText: string;
  setHeaderText: (text: string) => void;
  questionText: string;
  setQuestionText: (text: string) => void;
  options: Array<{ key: string; text: string; isCorrect: boolean; feedback: string }>;
  setOptions: (options: Array<{ key: string; text: string; isCorrect: boolean; feedback: string }>) => void;
  explanation: string;
  setExplanation: (text: string) => void;
}

export default function ContentEntryStep({
  presentationStyleId,
  setPresentationStyleId,
  headerText,
  setHeaderText,
  questionText,
  setQuestionText,
  options,
  setOptions,
  explanation,
  setExplanation,
}: ContentEntryStepProps) {
  const [presentationStyles, setPresentationStyles] = useState<ContentPresentationStyle[]>([]);

  // Load presentation styles
  useEffect(() => {
    const loadStyles = async () => {
      const data = await contentPresentationStyleService.getAll();
      setPresentationStyles(data);
      if (data.length > 0 && !presentationStyleId) {
        setPresentationStyleId(data[0].id);
      }
    };
    loadStyles();
  }, [presentationStyleId, setPresentationStyleId]);

  const selectedStyle = presentationStyles.find(s => s.id === presentationStyleId);

  const addOption = () => {
    const newKey = String.fromCharCode(65 + options.length);
    setOptions([...options, { key: newKey, text: '', isCorrect: false, feedback: '' }]);
  };

  const updateOption = (index: number, updates: Partial<typeof options[0]>) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], ...updates };
    setOptions(newOptions);
  };

  const deleteOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  // Determine option display type based on selected presentation style
  const getOptionInputType = () => {
    if (!selectedStyle) return 'text';
    
    switch (selectedStyle.optionDisplayType) {
      case 'image':
        return 'image';
      case 'mixed':
        return 'mixed';
      case 'none':
        return 'none';
      default:
        return 'text';
    }
  };

  const optionInputType = getOptionInputType();

  // Group presentation styles by category for better UX
  const groupedStyles = presentationStyles.reduce((acc, style) => {
    if (!acc[style.category]) {
      acc[style.category] = [];
    }
    acc[style.category].push(style);
    return acc;
  }, {} as Record<string, ContentPresentationStyle[]>);

  const categoryLabels: Record<string, string> = {
    classic: '📝 1) Klasik Sınav / Test Soru Tipleri',
    interactive: '🎯 2) İleri Seviye Etkileşimli Soru Tipleri',
    multimedia: '🎬 3) Medya / Çoklu Ortam Tabanlı Sorular',
    language: '🗣️ 4) Yabancı Dil & Akademik Soru Tipleri',
    stem: '🔬 5) Kodlama / Teknik / STEM Soru Tipleri',
    performance: '📊 6) Performans & Görev Bazlı Soru Tipleri',
    survey: '📋 7) Anket & Ölçme-Değerlendirme Soru Tipleri',
    ai: '🤖 8) Özel – Gelişmiş / AI Destekli Soru Tipleri',
  };

  return (
    <div className="space-y-4">
      {/* Soru Tipi (İçerik Sunum Şekli) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Soru Tipi * <span className="text-xs text-gray-500">(İçerik sunum şekli)</span>
        </label>
        <select
          value={presentationStyleId}
          onChange={(e) => setPresentationStyleId(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(groupedStyles).map(([category, styles]) => (
            <optgroup key={category} label={categoryLabels[category] || category}>
              {styles.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {selectedStyle?.description && (
          <p className="mt-1 text-xs text-gray-500">{selectedStyle.description}</p>
        )}
      </div>

      {/* Üst Bilgi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Üst Bilgi <span className="text-xs text-gray-500">(Birden çok soru ile paylaşılabilir)</span>
        </label>
        <textarea
          value={headerText}
          onChange={(e) => setHeaderText(e.target.value)}
          placeholder="Ortak üst bilgi metni..."
          rows={2}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Soru Gövdesi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Soru Gövdesi *
        </label>
        <AdvancedRichTextEditor
          value={questionText}
          onChange={setQuestionText}
          placeholder="Sorunuzu yazın..."
          height={200}
          enableKatex
          enableMedia
        />
      </div>

      {/* Şıklar */}
      {selectedStyle?.supportsOptions && optionInputType !== 'none' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Şıklar * 
              {optionInputType === 'image' && <span className="text-xs text-blue-600 ml-2">(Görsel şıklar)</span>}
              {optionInputType === 'mixed' && <span className="text-xs text-purple-600 ml-2">(Metin + Görsel)</span>}
            </label>
            <button
              onClick={addOption}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              + Şık Ekle
            </button>
          </div>

          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                <input
                  type="checkbox"
                  checked={option.isCorrect}
                  onChange={(e) => {
                    updateOption(index, { isCorrect: e.target.checked });
                  }}
                  className="mt-2"
                />
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700 bg-white px-2 py-1 rounded border">
                      {option.key}
                    </span>
                    
                    {optionInputType === 'text' && (
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => updateOption(index, { text: e.target.value })}
                        placeholder={`Şık ${option.key}`}
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                    
                    {optionInputType === 'image' && (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => updateOption(index, { text: e.target.value })}
                          placeholder="Görsel URL"
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100">
                          📁 Yükle
                        </button>
                      </div>
                    )}
                    
                    {optionInputType === 'mixed' && (
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => updateOption(index, { text: e.target.value })}
                          placeholder={`Şık ${option.key} metni`}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Görsel URL (opsiyonel)"
                            className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <button className="px-2 py-1 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100">
                            📁
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {options.length > 2 && (
                      <button
                        onClick={() => deleteOption(index)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={option.feedback || ''}
                    onChange={(e) => updateOption(index, { feedback: e.target.value })}
                    placeholder="Geri bildirim (opsiyonel)"
                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Açıklama */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Açıklama / Çözüm
        </label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Sorunun açıklamasını veya çözümünü yazın..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

