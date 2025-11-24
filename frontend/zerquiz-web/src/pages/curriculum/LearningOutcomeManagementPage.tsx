import { useState, useEffect } from "react";
import {
  curriculumService,
  LearningOutcomeDto,
  CurriculumDto,
  SubjectDto,
  TopicDto,
  CreateLearningOutcomeRequest,
} from "../../services/api/curriculumService";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Select from "../../components/common/Select";

const LearningOutcomeManagementPage = () => {
  const [outcomes, setOutcomes] = useState<LearningOutcomeDto[]>([]);
  const [curricula, setCurricula] = useState<CurriculumDto[]>([]);
  const [subjects, setSubjects] = useState<SubjectDto[]>([]);
  const [topics, setTopics] = useState<TopicDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOutcome, setEditingOutcome] =
    useState<LearningOutcomeDto | null>(null);
  const [formData, setFormData] = useState<CreateLearningOutcomeRequest>({
    curriculumId: "",
    subjectId: "",
    topicId: undefined,
    code: "",
    description: "",
    details: "",
  });
  const [saving, setSaving] = useState(false);

  // Filters
  const [filterCurriculumId, setFilterCurriculumId] = useState<string>("");
  const [filterSubjectId, setFilterSubjectId] = useState<string>("");
  const [filterTopicId, setFilterTopicId] = useState<string>("");

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadOutcomes();
  }, [filterCurriculumId, filterSubjectId, filterTopicId]);

  useEffect(() => {
    if (formData.subjectId) {
      loadTopicsForSubject(formData.subjectId);
    }
  }, [formData.subjectId]);

  useEffect(() => {
    if (filterSubjectId) {
      loadTopicsForSubject(filterSubjectId);
    }
  }, [filterSubjectId]);

  const loadInitialData = async () => {
    try {
      const [curriculaData, subjectsData] = await Promise.all([
        curriculumService.getCurricula(),
        curriculumService.getSubjects(),
      ]);
      setCurricula(curriculaData);
      setSubjects(subjectsData);

      if (curriculaData.length > 0) {
        setFilterCurriculumId(curriculaData[0].id);
        setFormData((prev) => ({
          ...prev,
          curriculumId: curriculaData[0].id,
        }));
      }
    } catch (err: any) {
      setError(err.message || "Failed to load initial data");
    }
  };

  const loadTopicsForSubject = async (subjectId: string) => {
    try {
      const data = await curriculumService.getTopicsBySubject(subjectId);
      setTopics(data);
    } catch (err: any) {
      console.error("Failed to load topics:", err);
    }
  };

  const loadOutcomes = async () => {
    try {
      setLoading(true);
      const data = await curriculumService.getLearningOutcomes(
        filterCurriculumId || undefined,
        filterSubjectId || undefined,
        filterTopicId || undefined
      );
      setOutcomes(data);
    } catch (err: any) {
      setError(err.message || "Failed to load learning outcomes");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingOutcome(null);
    setFormData({
      curriculumId: filterCurriculumId || "",
      subjectId: filterSubjectId || "",
      topicId: filterTopicId || undefined,
      code: "",
      description: "",
      details: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (outcome: LearningOutcomeDto) => {
    setEditingOutcome(outcome);
    setFormData({
      curriculumId: outcome.curriculumId || "",
      subjectId: outcome.subjectId || "",
      topicId: outcome.topicId || undefined,
      code: outcome.code,
      description: outcome.description,
      details: outcome.details || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingOutcome) {
        await curriculumService.updateLearningOutcome(editingOutcome.id, {
          description: formData.description,
          details: formData.details,
        });
      } else {
        await curriculumService.createLearningOutcome(formData);
      }
      setIsModalOpen(false);
      await loadOutcomes();
    } catch (err: any) {
      alert(
        err.response?.data?.message || "Failed to save learning outcome"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kazanımı silmek istediğinizden emin misiniz?")) return;

    try {
      await curriculumService.deleteLearningOutcome(id);
      await loadOutcomes();
    } catch (err: any) {
      alert(
        err.response?.data?.message || "Failed to delete learning outcome"
      );
    }
  };

  if (loading && outcomes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Kazanım Yönetimi
          </h1>
          <p className="text-gray-600 mt-1">
            Müfredat kazanımlarını tanımlayın ve yönetin
          </p>
        </div>
        <Button onClick={openCreateModal}>+ Yeni Kazanım</Button>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filtrele</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Müfredat
            </label>
            <select
              value={filterCurriculumId}
              onChange={(e) => setFilterCurriculumId(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tümü</option>
              {curricula.map((curr) => (
                <option key={curr.id} value={curr.id}>
                  {curr.name} ({curr.year})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branş
            </label>
            <select
              value={filterSubjectId}
              onChange={(e) => setFilterSubjectId(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tümü</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konu
            </label>
            <select
              value={filterTopicId}
              onChange={(e) => setFilterTopicId(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={!filterSubjectId}
            >
              <option value="">Tümü</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Outcomes Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Kod
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Kazanım
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Branş
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Konu
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {outcomes.map((outcome) => (
              <tr key={outcome.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {outcome.code}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {outcome.description}
                  </div>
                  {outcome.details && (
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {outcome.details}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {outcome.subjectName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {outcome.topicName || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditModal(outcome)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(outcome.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {outcomes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Henüz kazanım eklenmemiş.
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOutcome ? "Kazanım Düzenle" : "Yeni Kazanım"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Müfredat"
              value={formData.curriculumId}
              onChange={(e) =>
                setFormData({ ...formData, curriculumId: e.target.value })
              }
              required
              disabled={!!editingOutcome}
            >
              <option value="">Seçiniz</option>
              {curricula.map((curr) => (
                <option key={curr.id} value={curr.id}>
                  {curr.name} ({curr.year})
                </option>
              ))}
            </Select>

            <Select
              label="Branş"
              value={formData.subjectId}
              onChange={(e) =>
                setFormData({ ...formData, subjectId: e.target.value })
              }
              required
              disabled={!!editingOutcome}
            >
              <option value="">Seçiniz</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Konu (Opsiyonel)"
              value={formData.topicId || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  topicId: e.target.value || undefined,
                })
              }
              disabled={!formData.subjectId || !!editingOutcome}
            >
              <option value="">Seçiniz</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </Select>

            <Input
              label="Kod"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              required
              placeholder="MATH.09.EQ.01"
              disabled={!!editingOutcome}
            />
          </div>

          <Textarea
            label="Kazanım Açıklaması"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            placeholder="Öğrenci, birinci dereceden bir bilinmeyenli denklemleri çözebilir."
            rows={3}
          />

          <Textarea
            label="Detaylı Açıklama (Opsiyonel)"
            value={formData.details}
            onChange={(e) =>
              setFormData({ ...formData, details: e.target.value })
            }
            placeholder="Bu kazanım ile ilgili ek açıklamalar, örnek sorular, öğretmen notları..."
            rows={4}
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              İptal
            </Button>
            <Button type="submit" isLoading={saving}>
              {editingOutcome ? "Güncelle" : "Oluştur"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LearningOutcomeManagementPage;

