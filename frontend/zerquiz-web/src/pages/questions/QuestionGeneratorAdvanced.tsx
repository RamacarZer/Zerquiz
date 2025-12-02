import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { DynamicDropdown } from '../../components/ui/DynamicDropdown';

export default function QuestionGeneratorAdvanced() {
  const { t } = useLanguage();
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>('');

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{t('advancedQuestionGenerator')}</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {/* Question Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('selectQuestionTypes')}
            </label>
            <DynamicDropdown
              groupCode="question_types"
              value={selectedQuestionTypes}
              onChange={(val) => setSelectedQuestionTypes(val as string[])}
              multiple={true}
              placeholder={t('selectMultipleQuestionTypes')}
              className="w-full p-2 border rounded"
              showIcons={true}
            />
            {selectedQuestionTypes.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {t('selected')}: {selectedQuestionTypes.length} {t('questionTypes')}
              </p>
            )}
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('difficultyLevel')}
            </label>
            <DynamicDropdown
              groupCode="difficulty_levels"
              value={difficulty}
              onChange={(val) => setDifficulty(val as string)}
              placeholder={t('selectDifficulty')}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Generate Button */}
          <div className="flex gap-4">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={selectedQuestionTypes.length === 0}
            >
              {t('generateQuestions')}
            </button>
            <button
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={() => {
                setSelectedQuestionTypes([]);
                setDifficulty('');
              }}
            >
              {t('reset')}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {selectedQuestionTypes.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t('preview')}</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              {t('selectedQuestionTypes')}: {selectedQuestionTypes.join(', ')}
            </p>
            <p className="text-sm text-gray-600">
              {t('difficulty')}: {difficulty || t('notSelected')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
