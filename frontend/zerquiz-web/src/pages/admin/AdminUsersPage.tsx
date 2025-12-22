import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  Eye,
  Power,
  PowerOff,
} from 'lucide-react';
import { 
  getUsers, 
  toggleUserStatus, 
  deleteUser,
  type UserDto 
} from '../../services/api/userService';
import UserCreateModal from '../../components/modals/UserCreateModal';
import UserEditModal from '../../components/modals/UserEditModal';
import UserViewModal from '../../components/modals/UserViewModal';

export default function AdminUsersPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers(1, 100); // Get all users
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteUser(id);
      await loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Kullanıcı silinemedi');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleUserStatus(id);
      await loadUsers();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      alert('Kullanıcı durumu değiştirilemedi');
    }
  };

  const handleEdit = (id: string) => {
    setSelectedUserId(id);
    setShowEditModal(true);
  };

  const handleView = (id: string) => {
    setSelectedUserId(id);
    setShowViewModal(true);
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.primaryRole?.name === roleFilter;
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    inactiveUsers: users.filter(u => !u.isActive).length,
    newThisMonth: users.filter(u => {
      const createdDate = new Date(u.createdAt);
      const now = new Date();
      return createdDate.getMonth() === now.getMonth() && 
             createdDate.getFullYear() === now.getFullYear();
    }).length,
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      SuperAdmin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'Müdür': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'Müdür Yardımcısı': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      'Yayın Koordinatörü': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
      'Editör': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      'Yazar': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'Öğretmen': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'Öğrenci': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'Veli': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
    };
    return colors[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            {t('user_management') || 'Kullanıcı Yönetimi'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Kullanıcıları görüntüleyin, düzenleyin ve yönetin
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              // Export functionality
              const csvContent = users.map(u => 
                `${u.firstName} ${u.lastName},${u.email},${u.phone || ''},${u.primaryRoleName || ''},${u.isActive ? 'Aktif' : 'Pasif'}`
              ).join('\n');
              const blob = new Blob([`İsim,Email,Telefon,Rol,Durum\n${csvContent}`], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'kullanicilar.csv';
              a.click();
            }}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            <Download className="w-5 h-5" />
            Dışa Aktar
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            Yeni Kullanıcı
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm">Toplam Kullanıcı</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
          <p className="text-sm text-blue-100">Tüm platformda</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-100 text-sm">Aktif Kullanıcı</p>
              <p className="text-3xl font-bold">{stats.activeUsers}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-200" />
          </div>
          <p className="text-sm text-green-100">%{((stats.activeUsers / stats.totalUsers) * 100).toFixed(0)} oranında</p>
        </div>

        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-100 text-sm">Pasif Kullanıcı</p>
              <p className="text-3xl font-bold">{stats.inactiveUsers}</p>
            </div>
            <XCircle className="w-12 h-12 text-gray-200" />
          </div>
          <p className="text-sm text-gray-100">Son 30 günde giriş yapmamış</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-purple-100 text-sm">Yeni Kayıt</p>
              <p className="text-3xl font-bold">{stats.newThisMonth}</p>
            </div>
            <Plus className="w-12 h-12 text-purple-200" />
          </div>
          <p className="text-sm text-purple-100">Bu ay</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Kullanıcı ara (isim, email, telefon)..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Roller</option>
              <option value="SuperAdmin">SuperAdmin</option>
              <option value="Müdür">Müdür</option>
              <option value="Müdür Yardımcısı">Müdür Yardımcısı</option>
              <option value="Yayın Koordinatörü">Yayın Koordinatörü</option>
              <option value="Editör">Editör</option>
              <option value="Yazar">Yazar</option>
              <option value="Öğretmen">Öğretmen</option>
              <option value="Öğrenci">Öğrenci</option>
              <option value="Veli">Veli</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İletişim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Departman/Pozisyon
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      Yükleniyor...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                      ? '🔍 Filtre kriterlerine uygun kullanıcı bulunamadı'
                      : '👥 Henüz kullanıcı eklenmemiş'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.emailConfirmed && <span className="text-green-600">✓ </span>}
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="w-4 h-4" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900 dark:text-white font-medium">
                          {user.department?.name || '-'}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {user.position?.name || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.primaryRole?.name || '')}`}>
                        <Shield className="w-3 h-3" />
                        {user.primaryRole?.name || 'Rol Yok'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isActive ? 'active' : 'inactive')}`}>
                        {user.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleView(user.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(user.id)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(user.id)}
                          className={`p-2 ${user.isActive ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'} rounded-lg transition-colors`}
                          title={user.isActive ? 'Pasifleştir' : 'Aktifleştir'}
                        >
                          {user.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <UserCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadUsers}
      />

      <UserEditModal
        isOpen={showEditModal}
        userId={selectedUserId}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUserId(null);
        }}
        onSuccess={loadUsers}
      />

      <UserViewModal
        isOpen={showViewModal}
        userId={selectedUserId}
        onClose={() => {
          setShowViewModal(false);
          setSelectedUserId(null);
        }}
        onEdit={(userId) => {
          setSelectedUserId(userId);
          setShowViewModal(false);
          setShowEditModal(true);
        }}
      />
    </div>
  );
}

