import React, { useState, useEffect } from 'react';
import { questionService } from '../../services/api/questionService';
import { curriculumService } from '../../services/api/curriculumService';
import RichTextEditor from '../common/RichTextEditor';
import type {
  QuestionFormatType,
  QuestionPedagogicalType,
  CreateQuestionRequest,
  QuestionContent
} from '../../types/question.types';
import type { Subject, Topic, LearningOutcome } from '../../types/curriculum.types';

interface QuestionCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type TabType = 'basic' | 'curriculum' | 'content' | 'preview';

export const QuestionCreateModal: React.FC<QuestionCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data sources
  const [formatTypes, setFormatTypes] = useState<QuestionFormatType[]>([]);
  const [pedagogicalTypes, setPedagogicalTypes] = useState<QuestionPedagogicalType[]>([]);
  const [presentationTypes, setPresentationTypes] = useState<any[]>([]);
  const [difficultyLevels, setDifficultyLevels] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [outcomes, setOutcomes] = useState<LearningOutcome[]>([]);

  // Form data
  const [formData, setFormData] = useState<Partial<CreateQuestionRequest>>({
    difficulty: 'medium',
    weight: 1.0,
    content: {
      stem: { text: '' },
      options: [
        { key: 'A', text: '' },
        { key: 'B', text: '' },
        { key: 'C', text: '' },
        { key: 'D', text: '' }
      ],
      correctAnswers: []
    }
  });

  // Load initial data
  useEffect(() => {
    if (isOpen) {
      loadFormatTypes();
      loadPedagogicalTypes();
      loadPresentationTypes();
      loadDifficultyLevels();
      loadSubjects();
    }
  }, [isOpen]);

  // Load topics when subject changes
  useEffect(() => {
    if (formData.subjectId) {
      loadTopics(formData.subjectId);
    }
  }, [formData.subjectId]);

  // Load outcomes when topic changes
  useEffect(() => {
    if (formData.topicId) {
      loadOutcomes(formData.topicId);
    }
  }, [formData.topicId]);

  const loadFormatTypes = async () => {
    try {
      const data = await questionService.getFormatTypes();
      setFormatTypes(data);
      if (data.length > 0 && !formData.formatTypeId) {
        setFormData(prev => ({ ...prev, formatTypeId: data[0].id }));
      }
    } catch (err) {
      console.error('Failed to load format types:', err);
    }
  };

  const loadPedagogicalTypes = async () => {
    try {
      const data = await questionService.getPedagogicalTypes();
      setPedagogicalTypes(data);
    } catch (err) {
      console.error('Failed to load pedagogical types:', err);
    }
  };

  const loadPresentationTypes = async () => {
    try {
      const data = await questionService.getPresentationTypes();
      setPresentationTypes(data);
    } catch (err) {
      console.error('Failed to load presentation types:', err);
    }
  };

  const loadDifficultyLevels = async () => {
    try {
      const data = await questionService.getDifficultyLevels();
      setDifficultyLevels(data);
    } catch (err) {
      console.error('Failed to load difficulty levels:', err);
    }
  };

  const loadSubjects = async () => {
    try {
      const data = await curriculumService.getSubjects();
      setSubjects(data);
    } catch (err) {
      console.error('Failed to load subjects:', err);
    }
  };

  const loadTopics = async (subjectId: string) => {
    try {
      const data = await curriculumService.getTopics({ subjectId });
      setTopics(data);
    } catch (err) {
      console.error('Failed to load topics:', err);
    }
  };

  const loadOutcomes = async (topicId: string) => {
    try {
      const data = await curriculumService.getLearningOutcomes({ topicId });
      setOutcomes(data);
    } catch (err) {
      console.error('Failed to load outcomes:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.formatTypeId || !formData.subjectId) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await questionService.createQuestion(formData as CreateQuestionRequest);
      onSuccess();
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      difficulty: 'medium',
      weight: 1.0,
      content: {
        stem: { text: '' },
        options: [
          { key: 'A', text: '' },
          { key: 'B', text: '' },
          { key: 'C', text: '' },
          { key: 'D', text: '' }
        ],
        correctAnswers: []
      }
    });
    setActiveTab('basic');
    setError(null);
  };

  const updateContent = (updates: Partial<QuestionContent>) => {
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, ...updates } as QuestionContent
    }));
  };

  const updateOption = (index: number, text: string) => {
    const options = [...(formData.content?.options || [])];
    options[index] = { ...options[index], text };
    updateContent({ options });
  };

  const toggleCorrectAnswer = (key: string) => {
    const correctAnswers = formData.content?.correctAnswers || [];
    const newAnswers = correctAnswers.includes(key)
      ? correctAnswers.filter(a => a !== key)
      : [...correctAnswers, key];
    updateContent({ correctAnswers: newAnswers });
  };

  if (!isOpen) return null;

  const tabs: { id: TabType; label: string }[] = [
    { id: 'basic', label: '1. Temel Bilgiler' },
    { id: 'curriculum', label: '2. Müfredat' },
    { id: 'content', label: '3. İçerik' },
    { id: 'preview', label: '4. Önizleme' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Yeni Soru Oluştur</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-gray-200">
          <div className="flex space-x-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Tab: Basic Info */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soru Formatı <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.formatTypeId || ''}
                    onChange={(e) => setFormData({ ...formData, formatTypeId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seçiniz...</option>
                    {formatTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pedagojik Tip
                  </label>
                  <select
                    value={formData.pedagogicalTypeId || ''}
                    onChange={(e) => setFormData({ ...formData, pedagogicalTypeId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seçiniz...</option>
                    {pedagogicalTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zorluk <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.difficulty || ''}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seçiniz</option>
                      {difficultyLevels.map((level) => (
                        <option key={level.id} value={level.code}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ağırlık
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.weight || 1.0}
                      onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Curriculum */}
            {activeTab === 'curriculum' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branş <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.subjectId || ''}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value, topicId: undefined, learningOutcomeId: undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seçiniz...</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                </div>

                {formData.subjectId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Konu
                    </label>
                    <select
                      value={formData.topicId || ''}
                      onChange={(e) => setFormData({ ...formData, topicId: e.target.value, learningOutcomeId: undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seçiniz...</option>
                      {topics.map(topic => (
                        <option key={topic.id} value={topic.id}>{topic.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.topicId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kazanım
                    </label>
                    <select
                      value={formData.learningOutcomeId || ''}
                      onChange={(e) => setFormData({ ...formData, learningOutcomeId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seçiniz...</option>
                      {outcomes.map(outcome => (
                        <option key={outcome.id} value={outcome.id}>
                          {outcome.code}: {outcome.description}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Content */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                {/* Soru Sunum Şekli */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soru Sunum Şekli
                  </label>
                  <select
                    value=""
                    onChange={(e) => {
                      // Handle presentation type change
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seçiniz</option>
                    {presentationTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <RichTextEditor
                  label="Soru Metni"
                  value={formData.content?.stem?.text || ''}
                  onChange={(content) => updateContent({ stem: { text: content } })}
                  placeholder="Soru metnini buraya yazın..."
                  height={200}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seçenekler <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {formData.content?.options?.map((option, index) => (
                      <div key={option.key} className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.content?.correctAnswers?.includes(option.key)}
                          onChange={() => toggleCorrectAnswer(option.key)}
                          className="mt-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          title="Doğru cevap olarak işaretle"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-700 w-6">{option.key})</span>
                            <input
                              type="text"
                              value={option.text || ''}
                              onChange={(e) => updateOption(index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder={`${option.key} şıkkı...`}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    💡 Doğru cevap(lar)ı işaretlemek için sol taraftaki kutucukları işaretleyin
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Preview */}
            {activeTab === 'preview' && (
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <h3 className="font-bold text-lg mb-4">Soru Önizleme</h3>
                  
                  <div className="bg-white p-4 rounded border border-gray-300">
                    <div className="mb-4">
                      <p className="text-gray-900 whitespace-pre-wrap">{formData.content?.stem?.text || '(Soru metni girilmedi)'}</p>
                    </div>

                    <div className="space-y-2">
                      {formData.content?.options?.map(option => (
                        <div
                          key={option.key}
                          className={`p-3 rounded border ${
                            formData.content?.correctAnswers?.includes(option.key)
                              ? 'bg-green-50 border-green-300'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <span className="font-medium mr-2">{option.key})</span>
                          {option.text || '(Boş)'}
                          {formData.content?.correctAnswers?.includes(option.key) && (
                            <span className="ml-2 text-green-600 font-medium">✓ Doğru</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Format:</span>{' '}
                      {formatTypes.find(f => f.id === formData.formatTypeId)?.name || '-'}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Zorluk:</span>{' '}
                      {formData.difficulty === 'easy' ? 'Kolay' : formData.difficulty === 'medium' ? 'Orta' : 'Zor'}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Branş:</span>{' '}
                      {subjects.find(s => s.id === formData.subjectId)?.name || '-'}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Konu:</span>{' '}
                      {topics.find(t => t.id === formData.topicId)?.name || '-'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
            <div>
              {activeTab !== 'basic' && (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = tabs.findIndex(t => t.id === activeTab);
                    if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ← Geri
                </button>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>

              {activeTab !== 'preview' ? (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = tabs.findIndex(t => t.id === activeTab);
                    if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  İleri →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Kaydediliyor...' : '✓ Kaydet'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

