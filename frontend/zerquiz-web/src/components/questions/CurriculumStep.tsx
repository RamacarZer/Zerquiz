import React, { useState, useEffect } from 'react';
import Alert from '../common/Alert';
import { subjectService, topicService, learningOutcomeService, Subject, Topic, LearningOutcome } from '../../mocks/curriculumMocks';

interface CurriculumStepProps {
  subjectId: string;
  setSubjectId: (id: string) => void;
  topicId: string;
  setTopicId: (id: string) => void;
  learningOutcomeId: string;
  setLearningOutcomeId: (id: string) => void;
}

export default function CurriculumStep({
  subjectId,
  setSubjectId,
  topicId,
  setTopicId,
  learningOutcomeId,
  setLearningOutcomeId,
}: CurriculumStepProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [learningOutcomes, setLearningOutcomes] = useState<LearningOutcome[]>([]);

  // Load subjects on mount
  useEffect(() => {
    const loadSubjects = async () => {
      const data = await subjectService.getAll();
      setSubjects(data);
    };
    loadSubjects();
  }, []);

  // Load topics when subject changes
  useEffect(() => {
    if (subjectId) {
      const filteredTopics = topicService.getBySubjectId(subjectId);
      setTopics(filteredTopics);
      setTopicId('');
      setLearningOutcomeId('');
    } else {
      setTopics([]);
      setTopicId('');
      setLearningOutcomeId('');
    }
  }, [subjectId, setTopicId, setLearningOutcomeId]);

  // Load learning outcomes when topic changes
  useEffect(() => {
    if (topicId) {
      const filteredOutcomes = learningOutcomeService.getByTopicId(topicId);
      setLearningOutcomes(filteredOutcomes);
      setLearningOutcomeId('');
    } else {
      setLearningOutcomes([]);
      setLearningOutcomeId('');
    }
  }, [topicId, setLearningOutcomeId]);

  return (
    <div className="space-y-4">
      <Alert type="info" message="Soruyu müfredata bağlayabilirsiniz. Bu adım opsiyoneldir." />

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Branş</label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seçiniz...</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Konu</label>
          <select
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            disabled={!subjectId}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Seçiniz...</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Kazanım</label>
          <select
            value={learningOutcomeId}
            onChange={(e) => setLearningOutcomeId(e.target.value)}
            disabled={!topicId}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Seçiniz...</option>
            {learningOutcomes.map((outcome) => (
              <option key={outcome.id} value={outcome.id}>
                {outcome.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

