import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'react-toastify';
import {
  Building,
  Plus,
  Edit,
  Trash2,
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  type DepartmentDto,
} from '../../services/api/userService';
import DepartmentFormModal from '../../components/modals/DepartmentFormModal';

export default function AdminDepartmentsPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartmentId, setEditingDepartmentId] = useState<string | null>(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await getDepartments();
      setDepartments(data);
    } catch (error: any) {
      console.error('Failed to load departments:', error);
      toast.error(error?.response?.data?.message || 'Departmanlar yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu departmanı silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDepartment(id);
      toast.success('✅ Departman başarıyla silindi!');
      await loadDepartments();
    } catch (error: any) {
      console.error('Failed to delete department:', error);
      toast.error(error?.response?.data?.message || '❌ Departman silinemedi!');
    }
  };

  const handleCreate = () => {
    setEditingDepartmentId(null);
    setShowModal(true);
  };

  const handleEdit = (id: string) => {
    setEditingDepartmentId(id);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingDepartmentId(null);
  };

  const handleSaveSuccess = () => {
    handleModalClose();
    loadDepartments();
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalDepartments: departments.length,
    activeDepartments: departments.length,
    parentDepartments: departments.filter(d => !d.parentDepartmentId).length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Building className="w-8 h-8 text-indigo-600" />
            {t('departments') || 'Departmanlar'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Departman ve bölüm yönetimi
          </p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Yeni Departman
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-indigo-100 text-sm">Toplam Departman</p>
              <p className="text-3xl font-bold">{stats.totalDepartments}</p>
            </div>
            <Building className="w-12 h-12 text-indigo-200" />
          </div>
          <p className="text-sm text-indigo-100">Aktif departmanlar</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm">Ana Departman</p>
              <p className="text-3xl font-bold">{stats.parentDepartments}</p>
            </div>
            <Building className="w-12 h-12 text-blue-200" />
          </div>
          <p className="text-sm text-blue-100">Üst seviye</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-purple-100 text-sm">Alt Departman</p>
              <p className="text-3xl font-bold">
                {stats.totalDepartments - stats.parentDepartments}
              </p>
            </div>
            <Building className="w-12 h-12 text-purple-200" />
          </div>
          <p className="text-sm text-purple-100">Alt birimler</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Departman ara..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Yükleniyor...</span>
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            🏢 {searchTerm ? 'Departman bulunamadı' : 'Henüz departman eklenmemiş'}
          </div>
        ) : (
          filteredDepartments.map((department) => (
            <div
              key={department.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Building className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {department.name}
                      </h3>
                      <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 text-xs rounded font-medium">
                        {department.code}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(department.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(department.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4 min-h-[3rem]">
                  {department.description || 'Açıklama yok'}
                </p>

                {department.parentDepartmentName && (
                  <div className="mb-3 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Bağlı olduğu:</span>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {department.parentDepartmentName}
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Sıra: {department.displayOrder}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <DepartmentFormModal
          isOpen={showModal}
          onClose={handleModalClose}
          departmentId={editingDepartmentId}
          departments={departments}
          onSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}

