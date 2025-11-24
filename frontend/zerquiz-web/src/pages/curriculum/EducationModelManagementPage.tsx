import { useState, useEffect } from "react";
import {
  curriculumService,
  EducationModelDto,
  CreateEducationModelRequest,
} from "../../services/api/curriculumService";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";

const EducationModelManagementPage = () => {
  const [models, setModels] = useState<EducationModelDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<EducationModelDto | null>(
    null
  );
  const [formData, setFormData] = useState<CreateEducationModelRequest>({
    code: "",
    name: "",
    country: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      const data = await curriculumService.getEducationModels();
      setModels(data);
    } catch (err: any) {
      setError(err.message || "Failed to load education models");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingModel(null);
    setFormData({ code: "", name: "", country: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (model: EducationModelDto) => {
    setEditingModel(model);
    setFormData({
      code: model.code,
      name: model.name,
      country: model.country,
      description: model.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingModel) {
        await curriculumService.updateEducationModel(editingModel.id, formData);
      } else {
        await curriculumService.createEducationModel(formData);
      }
      setIsModalOpen(false);
      await loadModels();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save education model");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu eğitim modelini silmek istediğinizden emin misiniz?"))
      return;

    try {
      await curriculumService.deleteEducationModel(id);
      await loadModels();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete education model");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await curriculumService.toggleEducationModelStatus(id);
      await loadModels();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to toggle status");
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
          <h1 className="text-3xl font-bold text-gray-800">
            Eğitim Modelleri
          </h1>
          <p className="text-gray-600 mt-1">
            MEB, Cambridge, IB gibi eğitim sistemlerini yönetin
          </p>
        </div>
        <Button onClick={openCreateModal}>+ Yeni Eğitim Modeli</Button>
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
                Kod
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Adı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ülke
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
            {models.map((model) => (
              <tr key={model.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {model.code}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {model.name}
                  </div>
                  {model.description && (
                    <div className="text-sm text-gray-500 line-clamp-1">
                      {model.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {model.country}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {model.isActive ? (
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
                    onClick={() => openEditModal(model)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleToggleStatus(model.id)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    {model.isActive ? "Pasif Yap" : "Aktif Yap"}
                  </button>
                  <button
                    onClick={() => handleDelete(model.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {models.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Henüz eğitim modeli eklenmemiş.
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingModel ? "Eğitim Modeli Düzenle" : "Yeni Eğitim Modeli"}
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
            placeholder="TR_MEB"
            disabled={!!editingModel}
          />

          <Input
            label="Adı"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
            placeholder="MEB Müfredatı"
          />

          <Input
            label="Ülke"
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            required
            placeholder="Türkiye"
          />

          <Textarea
            label="Açıklama"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Bu eğitim modeli hakkında detaylı açıklama..."
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
              {editingModel ? "Güncelle" : "Oluştur"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EducationModelManagementPage;

