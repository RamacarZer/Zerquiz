import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import {
  getDepartment,
  createDepartment,
  updateDepartment,
  type DepartmentDto,
} from '../../services/api/userService';
import Button from '../common/Button';
import Input from '../common/Input';
import Textarea from '../common/Textarea';

interface DepartmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId?: string | null;
  departments: DepartmentDto[];
  onSuccess: () => void;
}

export default function DepartmentFormModal({
  isOpen,
  onClose,
  departmentId,
  departments,
  onSuccess,
}: DepartmentFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    parentDepartmentId: '',
    displayOrder: 0,
  });

  useEffect(() => {
    if (isOpen && departmentId) {
      loadDepartment();
    } else if (isOpen) {
      // Reset form for new department
      setFormData({
        code: '',
        name: '',
        description: '',
        parentDepartmentId: '',
        displayOrder: 0,
      });
    }
  }, [isOpen, departmentId]);

  const loadDepartment = async () => {
    if (!departmentId) return;

    try {
      setLoading(true);
      const dept = await getDepartment(departmentId);
      setFormData({
        code: dept.code,
        name: dept.name,
        description: dept.description || '',
        parentDepartmentId: dept.parentDepartmentId || '',
        displayOrder: dept.displayOrder,
      });
    } catch (error: any) {
      console.error('Failed to load department:', error);
      toast.error('Departman yüklenemedi!');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim() || !formData.name.trim()) {
      toast.warning('⚠️ Kod ve ad zorunludur!');
      return;
    }

    try {
      setSubmitting(true);
      if (departmentId) {
        await updateDepartment(departmentId, formData);
        toast.success('✅ Departman başarıyla güncellendi!');
      } else {
        await createDepartment(formData);
        toast.success('✅ Departman başarıyla oluşturuldu!');
      }
      onSuccess();
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error?.response?.data?.message || '❌ İşlem başarısız!');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {departmentId ? '✏️ Departman Düzenle' : '➕ Yeni Departman Oluştur'}
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Departman Kodu *"
                    value={formData.code}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="Örn: ENG, MATH, IT"
                    disabled={submitting}
                    required
                  />

                  <Input
                    label="Departman Adı *"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Örn: İngilizce Bölümü"
                    disabled={submitting}
                    required
                  />
                </div>

                <Textarea
                  label="Açıklama"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Departman açıklaması..."
                  rows={3}
                  disabled={submitting}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Üst Departman (Hiyerarşi)
                  </label>
                  <select
                    value={formData.parentDepartmentId}
                    onChange={(e) =>
                      setFormData({ ...formData, parentDepartmentId: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={submitting}
                  >
                    <option value="">Ana Departman (Üst seviye)</option>
                    {departments
                      .filter((d) => !departmentId || d.id !== departmentId)
                      .map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Boş bırakırsanız ana departman olarak oluşturulur
                  </p>
                </div>

                <Input
                  label="Sıra"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                  }
                  disabled={submitting}
                />

                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    💡 <strong>İpucu:</strong> Hiyerarşik yapı sayesinde departmanları alt
                    departmanlarla organize edebilirsiniz.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex items-center justify-end gap-2 border-t dark:border-gray-600">
              <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
                İptal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>⏳ İşleniyor...</>
                ) : departmentId ? (
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

