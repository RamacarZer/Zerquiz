import { useState, useEffect } from "react";
import {
  curriculumService,
  SubjectDto,
  CreateSubjectRequest,
} from "../../services/api/curriculumService";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";

const SubjectManagementPage = () => {
  const [subjects, setSubjects] = useState<SubjectDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectDto | null>(null);
  const [formData, setFormData] = useState<CreateSubjectRequest>({
    code: "",
    name: "",
    displayOrder: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await curriculumService.getSubjects();
      setSubjects(data);
    } catch (err: any) {
      setError(err.message || "Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingSubject(null);
    const maxOrder = Math.max(...subjects.map((s) => s.displayOrder), 0);
    setFormData({ code: "", name: "", displayOrder: maxOrder + 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (subject: SubjectDto) => {
    setEditingSubject(subject);
    setFormData({
      code: subject.code,
      name: subject.name,
      displayOrder: subject.displayOrder,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingSubject) {
        await curriculumService.updateSubject(editingSubject.id, formData);
      } else {
        await curriculumService.createSubject(formData);
      }
      setIsModalOpen(false);
      await loadSubjects();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save subject");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu branşı silmek istediğinizden emin misiniz?")) return;

    try {
      await curriculumService.deleteSubject(id);
      await loadSubjects();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete subject");
    }
  };

  if (loading) {
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
          <h1 className="text-3xl font-bold text-gray-800">Branşlar</h1>
          <p className="text-gray-600 mt-1">
            Matematik, Fizik, Türkçe gibi ders branşlarını yönetin
          </p>
        </div>
        <Button onClick={openCreateModal}>+ Yeni Branş</Button>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Sıra
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Kod
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Branş Adı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Durum
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subjects.map((subject) => (
              <tr key={subject.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subject.displayOrder}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {subject.code}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {subject.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {subject.isActive ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Aktif
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Pasif
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditModal(subject)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {subjects.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Henüz branş eklenmemiş.
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? "Branş Düzenle" : "Yeni Branş"}
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
            placeholder="MATH"
            disabled={!!editingSubject}
          />

          <Input
            label="Branş Adı"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
            placeholder="Matematik"
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
              {editingSubject ? "Güncelle" : "Oluştur"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubjectManagementPage;

