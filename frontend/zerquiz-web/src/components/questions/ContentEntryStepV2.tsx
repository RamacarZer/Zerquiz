import React, { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import AdvancedRichTextEditor from '../common/AdvancedRichTextEditor';
import { questionTypeService, QuestionType } from '../../mocks/questionTypesMocks';
import { questionPresentationStyleService, QuestionPresentationStyle } from '../../mocks/presentationTypesMocks';
import DynamicAnswerFields from './DynamicAnswerFields';

interface ContentEntryStepV2Props {
  questionTypeId: string;
  setQuestionTypeId: (id: string) => void;
  questionPresentationStyleId: string;
  setQuestionPresentationStyleId: (id: string) => void;
  headerText: string;
  setHeaderText: (text: string) => void;
  questionText: string;
  setQuestionText: (text: string) => void;
  options: Array<{ key: string; text: string; isCorrect: boolean; feedback: string }>;
  setOptions: (options: Array<{ key: string; text: string; isCorrect: boolean; feedback: string }>) => void;
  textAnswer: string;
  setTextAnswer: (text: string) => void;
  numericAnswer: number;
  setNumericAnswer: (num: number) => void;
  explanation: string;
  setExplanation: (text: string) => void;
}

export default function ContentEntryStepV2({
  questionTypeId,
  setQuestionTypeId,
  questionPresentationStyleId,
  setQuestionPresentationStyleId,
  headerText,
  setHeaderText,
  questionText,
  setQuestionText,
  options,
  setOptions,
  textAnswer,
  setTextAnswer,
  numericAnswer,
  setNumericAnswer,
  explanation,
  setExplanation,
}: ContentEntryStepV2Props) {
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
  const [questionPresentationStyles, setQuestionPresentationStyles] = useState<QuestionPresentationStyle[]>([]);

  // Load question types and presentation styles
  useEffect(() => {
    const loadData = async () => {
      const [types, presentationStyles] = await Promise.all([
        questionTypeService.getAll(),
        questionPresentationStyleService.getAll(),
      ]);
      setQuestionTypes(types);
      setQuestionPresentationStyles(presentationStyles);
      
      if (types.length > 0 && !questionTypeId) {
        setQuestionTypeId(types[0].id);
      }
      if (presentationStyles.length > 0 && !questionPresentationStyleId) {
        setQuestionPresentationStyleId(presentationStyles[0].id);
      }
    };
    loadData();
  }, [questionTypeId, setQuestionTypeId, questionPresentationStyleId, setQuestionPresentationStyleId]);

  const selectedType = questionTypes.find(t => t.id === questionTypeId);

  // Group question types by category
  const groupedTypes = questionTypes.reduce((acc, type) => {
    if (!acc[type.category]) {
      acc[type.category] = [];
    }
    acc[type.category].push(type);
    return acc;
  }, {} as Record<string, QuestionType[]>);

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

  // Convert QuestionType to QuestionPresentationType for DynamicAnswerFields
  const convertedPresentationType = selectedType ? {
    id: selectedType.id,
    code: selectedType.code,
    name: selectedType.name,
    description: selectedType.description,
    answerType: selectedType.answerType,
    minOptions: selectedType.minOptions || 2,
    maxOptions: selectedType.maxOptions || 10,
    hideOptionLabelsInPreview: false,
    requiresAnswer: selectedType.requiresAnswer !== false,
    displayOrder: selectedType.displayOrder,
  } : null;

  return (
    <div className="space-y-6">
      {/* İki Dropdown Yan Yana */}
      <div className="grid grid-cols-2 gap-4">
        {/* Soru Sunum Şekli (Sol taraf) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Soru Sunum Şekli <span className="text-xs text-gray-500">(Görsel stil)</span>
          </label>
          <select
            value={questionPresentationStyleId}
            onChange={(e) => setQuestionPresentationStyleId(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {questionPresentationStyles.map((style) => (
              <option key={style.id} value={style.id}>
                {style.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Sorunun ekranda nasıl görüneceği (standart, slayt, kart, vb.)
          </p>
        </div>

        {/* Soru Tipi (Sağ taraf) - 65 tip */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Soru Tipi * <span className="text-xs text-gray-500">(Cevap türü)</span>
          </label>
          <select
            value={questionTypeId}
            onChange={(e) => setQuestionTypeId(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(groupedTypes).map(([category, types]) => (
              <optgroup key={category} label={categoryLabels[category] || category}>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {selectedType?.description && (
            <p className="mt-1 text-xs text-gray-500">{selectedType.description}</p>
          )}
        </div>
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

      {/* Dinamik Cevap Alanları - Soru Tipine Göre */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          Cevap Alanları
          {selectedType && (
            <span className="ml-auto text-sm font-normal text-gray-600">
              Tip: {selectedType.answerType}
            </span>
          )}
        </h3>
        
        <DynamicAnswerFields
          presentationType={convertedPresentationType}
          options={options}
          onOptionsChange={setOptions}
          textAnswer={textAnswer}
          onTextAnswerChange={setTextAnswer}
          numericAnswer={numericAnswer}
          onNumericAnswerChange={setNumericAnswer}
        />
      </div>

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

