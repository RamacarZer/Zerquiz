import React, { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import UserCreateModal from "../../components/modals/UserCreateModal";
import UserEditModal from "../../components/modals/UserEditModal";
import UserViewModal from "../../components/modals/UserViewModal";
import {
  getUsers,
  getRoles,
  getDepartments,
  deleteUser,
  activateUser,
  deactivateUser,
  bulkActivateUsers,
  bulkDeactivateUsers,
  bulkDeleteUsers,
  type UserDto,
  type RoleDto,
  type DepartmentDto,
} from "../../services/api/userService";

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData, deptsData] = await Promise.all([
        getUsers(),
        getRoles().catch(() => []),
        getDepartments().catch(() => []),
      ]);
      
      setUsers(Array.isArray(usersData) ? usersData : []);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setDepartments(Array.isArray(deptsData) ? deptsData : []);
    } catch (error) {
      console.error('Veri yüklenemedi:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    
    try {
      await deleteUser(id);
      alert('✅ Kullanıcı silindi!');
      loadData();
    } catch (error) {
      alert('❌ Silme hatası!');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await deactivateUser(id);
      } else {
        await activateUser(id);
      }
      alert('✅ Durum güncellendi!');
      loadData();
    } catch (error) {
      alert('❌ Güncelleme hatası!');
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedUsers.length === 0) {
      alert('⚠️ Lütfen en az bir kullanıcı seçin!');
      return;
    }

    if (action === 'delete' && !confirm(`${selectedUsers.length} kullanıcıyı silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      switch (action) {
        case 'activate':
          await bulkActivateUsers(selectedUsers);
          break;
        case 'deactivate':
          await bulkDeactivateUsers(selectedUsers);
          break;
        case 'delete':
          await bulkDeleteUsers(selectedUsers);
          break;
      }
      alert('✅ Toplu işlem başarılı!');
      setSelectedUsers([]);
      loadData();
    } catch (error) {
      alert('❌ Toplu işlem hatası!');
    }
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  // Filtering
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !filterRole || user.primaryRoleId === filterRole;
    const matchesDept = !filterDepartment || user.departmentId === filterDepartment;
    const matchesStatus = !filterStatus || 
      (filterStatus === 'active' && user.isActive) ||
      (filterStatus === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesDept && matchesStatus;
  });

  // Stats
  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    emailConfirmed: users.filter(u => u.emailConfirmed).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">👥 Kullanıcı Yönetimi</h1>
          <p className="text-gray-600 mt-1">Toplam {users?.length || 0} kullanıcı</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          + Yeni Kullanıcı
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-t-4 border-blue-500">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Toplam Kullanıcı</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-t-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-600">Aktif</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-t-4 border-red-500">
          <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
          <div className="text-sm text-gray-600">Pasif</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-t-4 border-purple-500">
          <div className="text-2xl font-bold text-purple-600">{stats.emailConfirmed}</div>
          <div className="text-sm text-gray-600">Email Onaylı</div>
        </div>
      </div>

      {/* Filters & Bulk Actions */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-4 gap-4">
          <Input
            placeholder="🔍 Ad, soyad veya email ara..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tüm Roller</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>

          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tüm Departmanlar</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="flex items-center gap-3 pt-4 border-t">
            <span className="text-sm font-medium text-gray-700">
              {selectedUsers.length} kullanıcı seçildi:
            </span>
            <Button variant="secondary" onClick={() => handleBulkAction('activate')}>
              ✓ Aktifleştir
            </Button>
            <Button variant="secondary" onClick={() => handleBulkAction('deactivate')}>
              ✗ Pasifleştir
            </Button>
            <Button variant="secondary" onClick={() => handleBulkAction('delete')}>
              🗑️ Sil
            </Button>
            <button
              onClick={() => setSelectedUsers([])}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              İptali
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Kullanıcı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Departman
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Pozisyon
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
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleSelectUser(user.id)}
                    className="rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.primaryRoleName || 'Rol yok'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.departmentName || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.positionName || '-'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? '✓ Aktif' : '✗ Pasif'}
                    </span>
                    {user.emailConfirmed && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        📧 Onaylı
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm space-x-2">
                  <button
                    onClick={() => {
                      setViewingUserId(user.id);
                      setShowViewModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    👁️ Görüntüle
                  </button>
                  <button
                    onClick={() => {
                      setEditingUserId(user.id);
                      setShowEditModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    ✏️ Düzenle
                  </button>
                  <button
                    onClick={() => handleToggleStatus(user.id, user.isActive)}
                    className="text-yellow-600 hover:text-yellow-900"
                  >
                    {user.isActive ? '⏸️ Pasifleştir' : '▶️ Aktifleştir'}
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    🗑️ Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {searchTerm || filterRole || filterDepartment || filterStatus
              ? '🔍 Filtre kriterlerine uygun kullanıcı bulunamadı'
              : '👥 Henüz kullanıcı eklenmemiş'}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <UserCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadData}
      />

      {/* Edit Modal */}
      <UserEditModal
        isOpen={showEditModal}
        userId={editingUserId}
        onClose={() => {
          setShowEditModal(false);
          setEditingUserId(null);
        }}
        onSuccess={loadData}
      />

      {/* View Modal */}
      <UserViewModal
        isOpen={showViewModal}
        userId={viewingUserId}
        onClose={() => {
          setShowViewModal(false);
          setViewingUserId(null);
        }}
        onEdit={(userId) => {
          setEditingUserId(userId);
          setShowEditModal(true);
        }}
      />
    </div>
  );
};

export default UserManagementPage;

