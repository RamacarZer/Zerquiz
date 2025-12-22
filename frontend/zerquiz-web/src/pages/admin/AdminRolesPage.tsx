import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'react-toastify';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Users,
  Lock,
  Unlock,
  CheckCircle,
  Settings,
  Eye,
} from 'lucide-react';
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  type RoleDto,
} from '../../services/api/userService';
import RoleFormModal from '../../components/modals/RoleFormModal';

export default function AdminRolesPage() {
  const { t } = useLanguage();
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await getRoles();
      setRoles(data);
    } catch (error: any) {
      console.error('Failed to load roles:', error);
      toast.error(error?.response?.data?.message || 'Roller yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu rolü silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteRole(id);
      toast.success('✅ Rol başarıyla silindi!');
      await loadRoles();
    } catch (error: any) {
      console.error('Failed to delete role:', error);
      toast.error(error?.response?.data?.message || '❌ Rol silinemedi!');
    }
  };

  const handleEdit = (id: string) => {
    setEditingRoleId(id);
    setShowEditModal(true);
  };

  const handleCreate = () => {
    setEditingRoleId(null);
    setShowCreateModal(true);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingRoleId(null);
  };

  const handleSaveSuccess = () => {
    handleModalClose();
    loadRoles();
  };

  const selectedRoleData = roles.find(r => r.id === selectedRole);

  // Calculate stats
  const stats = {
    totalRoles: roles.length,
    systemRoles: roles.filter(r => r.name === 'SuperAdmin' || r.name === 'Admin').length,
    customRoles: roles.filter(r => r.name !== 'SuperAdmin' && r.name !== 'Admin').length,
    totalPermissions: new Set(roles.flatMap(r => r.permissions || [])).size,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-600" />
            {t('roles_permissions') || 'Roller ve Yetkiler'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Kullanıcı rollerini ve yetkilerini yönetin
          </p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Yeni Rol Oluştur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-purple-100 text-sm">Toplam Rol</p>
              <p className="text-3xl font-bold">{stats.totalRoles}</p>
            </div>
            <Shield className="w-12 h-12 text-purple-200" />
          </div>
          <p className="text-sm text-purple-100">{stats.systemRoles} sistem rolü</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm">Aktif Roller</p>
              <p className="text-3xl font-bold">{roles.filter(r => r.isActive).length}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-blue-200" />
          </div>
          <p className="text-sm text-blue-100">Kullanımda</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-100 text-sm">Toplam Yetki</p>
              <p className="text-3xl font-bold">{stats.totalPermissions}</p>
            </div>
            <Lock className="w-12 h-12 text-green-200" />
          </div>
          <p className="text-sm text-green-100">Sistem yetkileri</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-orange-100 text-sm">Özel Rol</p>
              <p className="text-3xl font-bold">{stats.customRoles}</p>
            </div>
            <Settings className="w-12 h-12 text-orange-200" />
          </div>
          <p className="text-sm text-orange-100">Müşteri tanımlı</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Roller</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                  Yükleniyor...
                </div>
              </div>
            ) : roles.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                🔒 Henüz rol eklenmemiş
              </div>
            ) : (
              roles.map((role) => (
                <div
                  key={role.id}
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                    selectedRole === role.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600' : ''
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                          {role.name}
                          {(role.name === 'SuperAdmin' || role.name === 'Admin') && (
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded">
                              Sistem
                            </span>
                          )}
                          {role.isActive && (
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded">
                              Aktif
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{role.description || 'Açıklama yok'}</p>
                      </div>
                    </div>

                    {role.name !== 'SuperAdmin' && role.name !== 'Admin' && (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(role.id);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(role.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Lock className="w-4 h-4" />
                      <span>{role.permissions?.length || 0} yetki</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(role.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Permissions Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {selectedRoleData ? `${selectedRoleData.name} - Yetkileri` : 'Rol Seçin'}
            </h2>
          </div>
          <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
            {!selectedRoleData ? (
              <div className="text-center py-12 text-gray-500">
                <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Yetkileri görüntülemek için bir rol seçin</p>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">
                  Atanmış Yetkiler ({selectedRoleData.permissions?.length || 0})
                </h3>
                {selectedRoleData.permissions && selectedRoleData.permissions.length > 0 ? (
                  <div className="space-y-2">
                    {selectedRoleData.permissions.map((perm, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {perm}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Lock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Bu role henüz yetki atanmamış</p>
                  </div>
                )}
              </div>
            )}
          </div>
          {selectedRoleData && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => handleEdit(selectedRoleData.id)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Yetkileri Düzenle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {(showCreateModal || showEditModal) && (
        <RoleFormModal
          isOpen={showCreateModal || showEditModal}
          onClose={handleModalClose}
          roleId={editingRoleId}
          onSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}

