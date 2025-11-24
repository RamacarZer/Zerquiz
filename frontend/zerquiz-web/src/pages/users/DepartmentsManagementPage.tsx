import React, { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  type DepartmentDto,
} from "../../services/api/userService";

const DepartmentsManagementPage: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentDto | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    parentDepartmentId: "",
    displayOrder: 0,
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await getDepartments();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load departments:", error);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingDepartment(null);
    setFormData({ code: "", name: "", description: "", parentDepartmentId: "", displayOrder: 0 });
    setShowModal(true);
  };

  const handleEdit = (dept: DepartmentDto) => {
    setEditingDepartment(dept);
    setFormData({
      code: dept.code,
      name: dept.name,
      description: dept.description || "",
      parentDepartmentId: dept.parentDepartmentId || "",
      displayOrder: dept.displayOrder,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu departmanı silmek istediğinize emin misiniz?")) return;

    try {
      await deleteDepartment(id);
      alert("✅ Departman başarıyla silindi!");
      loadDepartments();
    } catch (error) {
      alert("❌ Departman silinirken hata oluştu!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.name) {
      alert("⚠️ Kod ve ad zorunludur!");
      return;
    }

    try {
      if (editingDepartment) {
        await updateDepartment(editingDepartment.id, formData);
        alert("✅ Departman başarıyla güncellendi!");
      } else {
        await createDepartment(formData);
        alert("✅ Departman başarıyla oluşturuldu!");
      }
      setShowModal(false);
      loadDepartments();
    } catch (error) {
      alert("❌ İşlem sırasında hata oluştu!");
    }
  };

  // Build hierarchical structure
  const buildHierarchy = (deps: DepartmentDto[], parentId: string | null = null): DepartmentDto[] => {
    return deps
      .filter(d => (parentId ? d.parentDepartmentId === parentId : !d.parentDepartmentId))
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(dept => ({
        ...dept,
        children: buildHierarchy(deps, dept.id),
      }));
  };

  const renderDepartmentTree = (dept: DepartmentDto & { children?: DepartmentDto[] }, level: number = 0) => {
    const indent = level * 24;
    const childCount = departments.filter(d => d.parentDepartmentId === dept.id).length;

    return (
      <div key={dept.id}>
        <div
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow mb-2"
          style={{ marginLeft: `${indent}px` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {level === 0 ? "📁" : "📂"}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{dept.name}</h3>
                  <p className="text-sm text-gray-600">
                    Kod: <span className="font-mono">{dept.code}</span>
                    {childCount > 0 && (
                      <span className="ml-3 text-blue-600">({childCount} alt departman)</span>
                    )}
                  </p>
                  {dept.description && (
                    <p className="text-sm text-gray-500 mt-1">{dept.description}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => handleEdit(dept)}>
                ✏️
              </Button>
              <Button variant="secondary" onClick={() => handleDelete(dept.id)}>
                🗑️
              </Button>
            </div>
          </div>
        </div>

        {dept.children && dept.children.length > 0 && (
          <div>
            {dept.children.map(child => renderDepartmentTree(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hierarchicalData = searchTerm ? filteredDepartments : buildHierarchy(departments);

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
          <h1 className="text-3xl font-bold text-gray-800">📁 Departman Yönetimi</h1>
          <p className="text-gray-600 mt-1">Toplam {departments.length} departman</p>
        </div>
        <Button onClick={handleCreate}>+ Yeni Departman</Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <Input
          placeholder="🔍 Departman ara..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Hierarchy Tree */}
      <div className="bg-white rounded-lg shadow p-6">
        {hierarchicalData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchTerm ? "🔍 Arama sonucu bulunamadı" : "📁 Henüz departman eklenmemiş"}
          </div>
        ) : (
          <div className="space-y-2">
            {searchTerm
              ? filteredDepartments.map(dept => renderDepartmentTree(dept as DepartmentDto & { children?: DepartmentDto[] }, 0))
              : hierarchicalData.map(dept => renderDepartmentTree(dept as DepartmentDto & { children?: DepartmentDto[] }, 0))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {editingDepartment ? "✏️ Departman Düzenle" : "➕ Yeni Departman Oluştur"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Departman Kodu *"
                    value={formData.code}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="Örn: ENG, MATH, IT"
                  />

                  <Input
                    label="Departman Adı *"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Örn: İngilizce Bölümü"
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
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Üst Departman (Hiyerarşi)
                  </label>
                  <select
                    value={formData.parentDepartmentId}
                    onChange={(e) => setFormData({ ...formData, parentDepartmentId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Ana Departman (Üst seviye)</option>
                    {departments
                      .filter(d => !editingDepartment || d.id !== editingDepartment.id)
                      .map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
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
                />

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>İpucu:</strong> Hiyerarşik yapı sayesinde departmanları alt departmanlarla organize edebilirsiniz.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-2 border-t">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                  İptal
                </Button>
                <Button type="submit">
                  {editingDepartment ? "💾 Güncelle" : "✅ Oluştur"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsManagementPage;

