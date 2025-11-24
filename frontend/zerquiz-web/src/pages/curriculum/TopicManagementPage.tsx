import { useState, useEffect } from "react";
import {
  curriculumService,
  TopicDto,
  SubjectDto,
  CreateTopicRequest,
} from "../../services/api/curriculumService";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";

interface TopicTreeItemProps {
  topic: TopicDto;
  onEdit: (topic: TopicDto) => void;
  onDelete: (id: string) => void;
  onAddSubTopic: (parentId: string) => void;
}

const TopicTreeItem = ({
  topic,
  onEdit,
  onDelete,
  onAddSubTopic,
}: TopicTreeItemProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="ml-4 border-l-2 border-gray-200 pl-4">
      <div className="flex items-center justify-between py-2 hover:bg-gray-50 rounded px-2">
        <div className="flex items-center gap-2">
          {topic.subTopics && topic.subTopics.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? "▼" : "▶"}
            </button>
          )}
          <span className="font-medium text-gray-900">
            {topic.code} - {topic.name}
          </span>
          <span className="text-xs text-gray-500 ml-2">Level {topic.level}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onAddSubTopic(topic.id)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            + Alt Konu
          </button>
          <button
            onClick={() => onEdit(topic)}
            className="text-xs text-indigo-600 hover:text-indigo-800"
          >
            Düzenle
          </button>
          <button
            onClick={() => onDelete(topic.id)}
            className="text-xs text-red-600 hover:text-red-800"
          >
            Sil
          </button>
        </div>
      </div>
      {isExpanded && topic.subTopics && topic.subTopics.length > 0 && (
        <div className="mt-1">
          {topic.subTopics.map((subTopic) => (
            <TopicTreeItem
              key={subTopic.id}
              topic={subTopic}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddSubTopic={onAddSubTopic}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TopicManagementPage = () => {
  const [subjects, setSubjects] = useState<SubjectDto[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [topics, setTopics] = useState<TopicDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<TopicDto | null>(null);
  const [parentTopicId, setParentTopicId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateTopicRequest>({
    subjectId: "",
    parentTopicId: undefined,
    code: "",
    name: "",
    level: 1,
    displayOrder: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubjectId) {
      loadTopics();
    }
  }, [selectedSubjectId]);

  const loadSubjects = async () => {
    try {
      const data = await curriculumService.getSubjects();
      setSubjects(data);
      if (data.length > 0) {
        setSelectedSubjectId(data[0].id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load subjects");
    }
  };

  const loadTopics = async () => {
    if (!selectedSubjectId) return;

    try {
      setLoading(true);
      const data = await curriculumService.getTopicsBySubject(
        selectedSubjectId
      );
      setTopics(data);
    } catch (err: any) {
      setError(err.message || "Failed to load topics");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = (parentId?: string) => {
    setEditingTopic(null);
    setParentTopicId(parentId || null);
    setFormData({
      subjectId: selectedSubjectId,
      parentTopicId: parentId,
      code: "",
      name: "",
      level: parentId ? 2 : 1,
      displayOrder: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (topic: TopicDto) => {
    setEditingTopic(topic);
    setParentTopicId(null);
    setFormData({
      subjectId: topic.subjectId,
      parentTopicId: topic.parentTopicId,
      code: topic.code,
      name: topic.name,
      level: topic.level,
      displayOrder: 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingTopic) {
        await curriculumService.updateTopic(editingTopic.id, {
          name: formData.name,
          displayOrder: formData.displayOrder,
        });
      } else {
        await curriculumService.createTopic(formData);
      }
      setIsModalOpen(false);
      await loadTopics();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save topic");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu konuyu ve alt konularını silmek istediğinizden emin misiniz?"))
      return;

    try {
      await curriculumService.deleteTopic(id);
      await loadTopics();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete topic");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Konu Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            Müfredat konularını hiyerarşik olarak düzenleyin
          </p>
        </div>
        <Button onClick={() => openCreateModal()}>+ Ana Konu Ekle</Button>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Subject Selector */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Branş Seçin
        </label>
        <select
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          className="block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {/* Topic Tree */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          {topics.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Bu branş için henüz konu eklenmemiş.
            </div>
          ) : (
            <div className="space-y-2">
              {topics.map((topic) => (
                <TopicTreeItem
                  key={topic.id}
                  topic={topic}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onAddSubTopic={openCreateModal}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTopic ? "Konu Düzenle" : "Yeni Konu Ekle"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Kod"
            value={formData.code}
            onChange={(e) =>
              setFormData({ ...formData, code: e.target.value })
            }
            required
            placeholder="01"
            disabled={!!editingTopic}
          />

          <Input
            label="Konu Adı"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
            placeholder="Sayılar ve İşlemler"
          />

          <Input
            label="Seviye"
            type="number"
            value={formData.level}
            onChange={(e) =>
              setFormData({ ...formData, level: parseInt(e.target.value) })
            }
            required
            min={1}
            max={3}
            disabled={!!parentTopicId || !!editingTopic}
          />

          <Input
            label="Görüntüleme Sırası"
            type="number"
            value={formData.displayOrder}
            onChange={(e) =>
              setFormData({
                ...formData,
                displayOrder: parseInt(e.target.value),
              })
            }
            required
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
              {editingTopic ? "Güncelle" : "Oluştur"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TopicManagementPage;

