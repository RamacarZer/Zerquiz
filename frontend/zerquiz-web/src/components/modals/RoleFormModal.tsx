import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import {
  getRole,
  createRole,
  updateRole,
  type RoleDto,
} from '../../services/api/userService';
import Button from '../common/Button';
import Input from '../common/Input';
import Textarea from '../common/Textarea';

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleId?: string | null;
  onSuccess: () => void;
}

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

export default function RoleFormModal({ isOpen, onClose, roleId, onSuccess }: RoleFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  useEffect(() => {
    if (isOpen && roleId) {
      loadRole();
    } else if (isOpen) {
      // Reset form for new role
      setFormData({ name: '', description: '', permissions: [] });
    }
  }, [isOpen, roleId]);

  const loadRole = async () => {
    if (!roleId) return;

    try {
      setLoading(true);
      const role = await getRole(roleId);
      setFormData({
        name: role.name,
        description: role.description || '',
        permissions: role.permissions || [],
      });
    } catch (error: any) {
      console.error('Failed to load role:', error);
      toast.error('Rol yüklenemedi!');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.warning('⚠️ Rol adı zorunludur!');
      return;
    }

    try {
      setSubmitting(true);
      if (roleId) {
        await updateRole(roleId, formData);
        toast.success('✅ Rol başarıyla güncellendi!');
      } else {
        await createRole(formData);
        toast.success('✅ Rol başarıyla oluşturuldu!');
      }
      onSuccess();
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error?.response?.data?.message || '❌ İşlem başarısız!');
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {roleId ? '✏️ Rol Düzenle' : '➕ Yeni Rol Oluştur'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
            disabled={submitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
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
                              {allSelected ? '❌ Tümünü Kaldır' : '✅ Tümünü Seç'}
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
                onClick={onClose}
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
                ) : roleId ? (
                  '💾 Güncelle'
                ) : (
                  '✅ Oluştur'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

