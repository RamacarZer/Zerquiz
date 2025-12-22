import React, { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import { toast } from 'react-toastify';
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  type RoleDto,
} from "../../services/api/userService";

// Permission kategorileri
const PERMISSION_CATEGORIES = {
  users: {
    label: "👥 Kullanıcı Yönetimi",
    permissions: ["users.create", "users.read", "users.update", "users.delete", "users.activate"],
  },
  tenants: {
    label: "🏢 Tenant Yönetimi",
    permissions: ["tenants.create", "tenants.read", "tenants.update", "tenants.delete"],
  },
  licenses: {
    label: "📜 Lisans Yönetimi",
    permissions: ["licenses.create", "licenses.read", "licenses.update", "licenses.delete"],
  },
  questions: {
    label: "❓ Soru Bankası",
    permissions: ["questions.create", "questions.read", "questions.update", "questions.delete", "questions.review"],
  },
  exams: {
    label: "📝 Sınav Yönetimi",
    permissions: ["exams.create", "exams.read", "exams.update", "exams.delete", "exams.publish"],
  },
  reports: {
    label: "📊 Raporlar",
    permissions: ["reports.read", "reports.export", "reports.analytics"],
  },
  settings: {
    label: "⚙️ Sistem Ayarları",
    permissions: ["settings.read", "settings.update", "settings.system"],
  },
};

const RolesManagementPage: React.FC = () => {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleDto | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await getRoles();
      setRoles(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Failed to load roles:", error);
      toast.error(error?.response?.data?.message || "Roller yüklenirken hata oluştu!");
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRole(null);
    setFormData({ name: "", description: "", permissions: [] });
    setShowModal(true);
  };

  const handleEdit = (role: RoleDto) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description || "",
      permissions: role.permissions || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu rolü silmek istediğinize emin misiniz?")) return;

    try {
      await deleteRole(id);
      toast.success("✅ Rol başarıyla silindi!");
      loadRoles();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error?.response?.data?.message || "❌ Rol silinirken hata oluştu!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.warning("⚠️ Rol adı zorunludur!");
      return;
    }

    try {
      setSubmitting(true);
      if (editingRole) {
        await updateRole(editingRole.id, formData);
        toast.success("✅ Rol başarıyla güncellendi!");
      } else {
        await createRole(formData);
        toast.success("✅ Rol başarıyla oluşturuldu!");
      }
      setShowModal(false);
      loadRoles();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error?.response?.data?.message || "❌ İşlem sırasında hata oluştu!");
    } finally {
      setSubmitting(false);
    }
  };

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const toggleCategoryPermissions = (category: keyof typeof PERMISSION_CATEGORIES) => {
    const categoryPerms = PERMISSION_CATEGORIES[category].permissions;
    const allSelected = categoryPerms.every(p => formData.permissions.includes(p));

    setFormData(prev => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter(p => !categoryPerms.includes(p))
        : [...new Set([...prev.permissions, ...categoryPerms])],
    }));
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">🎭 Rol Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Toplam {roles.length} rol</p>
        </div>
        <Button onClick={handleCreate}>+ Yeni Rol</Button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <Input
          placeholder="🔍 Rol ara..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoles.map(role => (
          <div key={role.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{role.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{role.description || "Açıklama yok"}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                role.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {role.isActive ? '✓ Aktif' : '✗ Pasif'}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">İzinler:</p>
              <div className="flex flex-wrap gap-1">
                {(role.permissions || []).slice(0, 6).map((perm, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                    {perm}
                  </span>
                ))}
                {(role.permissions || []).length > 6 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded">
                    +{role.permissions.length - 6}
                  </span>
                )}
                {(role.permissions || []).length === 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">İzin yok</span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => handleEdit(role)} className="flex-1">
                ✏️ Düzenle
              </Button>
              <Button variant="secondary" onClick={() => handleDelete(role.id)} className="flex-1">
                🗑️ Sil
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg">
          {searchTerm ? "🔍 Arama sonucu bulunamadı" : "🎭 Henüz rol eklenmemiş"}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {editingRole ? "✏️ Rol Düzenle" : "➕ Yeni Rol Oluştur"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200 text-2xl font-bold transition"
                disabled={submitting}
              >
                ×
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 180px)" }}>
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <Input
                      label="Rol Adı *"
                      value={formData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Örn: Öğretmen, Admin, Koordinatör"
                      disabled={submitting}
                      required
                    />

                    <Textarea
                      label="Açıklama"
                      value={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Bu rolün açıklaması..."
                      rows={2}
                      disabled={submitting}
                    />
                  </div>

                  {/* Permissions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">🔐 İzinler</h3>
                    <div className="space-y-4">
                      {Object.entries(PERMISSION_CATEGORIES).map(([categoryKey, category]) => {
                        const allSelected = category.permissions.every(p =>
                          formData.permissions.includes(p)
                        );

                        return (
                          <div key={categoryKey} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{category.label}</h4>
                              <button
                                type="button"
                                onClick={() => toggleCategoryPermissions(categoryKey as keyof typeof PERMISSION_CATEGORIES)}
                                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                                disabled={submitting}
                              >
                                {allSelected ? "❌ Tümünü Kaldır" : "✅ Tümünü Seç"}
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {category.permissions.map(permission => (
                                <label
                                  key={permission}
                                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded transition"
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.permissions.includes(permission)}
                                    onChange={() => togglePermission(permission)}
                                    className="rounded"
                                    disabled={submitting}
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{permission}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Count */}
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>Seçili İzin Sayısı:</strong> {formData.permissions.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex items-center justify-end gap-2 border-t dark:border-gray-600">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  İptal
                </Button>
                <Button 
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>⏳ İşleniyor...</>
                  ) : editingRole ? (
                    "💾 Güncelle"
                  ) : (
                    "✅ Oluştur"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesManagementPage;
