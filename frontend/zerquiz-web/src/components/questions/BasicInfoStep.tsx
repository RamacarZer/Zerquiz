import React from 'react';
import { BookOpen, FileQuestion, Presentation } from 'lucide-react';
import { QuestionDifficultyLevel, QuestionPedagogicalType } from '../../services/api/realQuestionService';

type ContentType = 'lesson' | 'question' | 'presentation';

interface BasicInfoStepProps {
  contentType: ContentType;
  setContentType: (type: ContentType) => void;
  difficultyLevelId: string;
  setDifficultyLevelId: (id: string) => void;
  pedagogicalTypeId: string;
  setPedagogicalTypeId: (id: string) => void;
  weight: number;
  setWeight: (weight: number) => void;
  difficultyLevels: QuestionDifficultyLevel[];
  pedagogicalTypes: QuestionPedagogicalType[];
}

export default function BasicInfoStep({
  contentType,
  setContentType,
  difficultyLevelId,
  setDifficultyLevelId,
  pedagogicalTypeId,
  setPedagogicalTypeId,
  weight,
  setWeight,
  difficultyLevels,
  pedagogicalTypes,
}: BasicInfoStepProps) {
  return (
    <div className="space-y-4">
      {/* İçerik Türü - Inline */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700 w-28">İçerik Türü:</span>
        <div className="flex gap-2">
          {[
            { type: 'lesson', icon: BookOpen, label: 'Ders' },
            { type: 'question', icon: FileQuestion, label: 'Soru' },
            { type: 'presentation', icon: Presentation, label: 'Sunum' }
          ].map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => setContentType(type as ContentType)}
              className={`px-3 py-1.5 border-2 rounded-lg flex items-center gap-1.5 transition text-sm ${
                contentType === type
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Soru Ayarları - Grid 1x3 */}
      <div className="grid grid-cols-3 gap-4">
        {/* Zorluk */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Zorluk Seviyesi *
          </label>
          <select
            value={difficultyLevelId}
            onChange={(e) => setDifficultyLevelId(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {difficultyLevels.map(level => (
              <option key={level.id} value={level.id}>{level.name}</option>
            ))}
          </select>
        </div>

        {/* Pedagojik Tip */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Pedagojik Tip
          </label>
          <select
            value={pedagogicalTypeId}
            onChange={(e) => setPedagogicalTypeId(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {pedagogicalTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ağırlık Katsayısı */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Ağırlık Katsayısı
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            min="0.1"
            max="10"
            step="0.1"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

