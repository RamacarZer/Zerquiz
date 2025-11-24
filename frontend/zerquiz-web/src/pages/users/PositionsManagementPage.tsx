import React, { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import {
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
  type PositionDto,
} from "../../services/api/userService";

const PositionsManagementPage: React.FC = () => {
  const [positions, setPositions] = useState<PositionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState<PositionDto | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    level: 1,
    displayOrder: 0,
  });

  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    try {
      setLoading(true);
      const data = await getPositions();
      setPositions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load positions:", error);
      setPositions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPosition(null);
    setFormData({ code: "", name: "", description: "", level: 1, displayOrder: 0 });
    setShowModal(true);
  };

  const handleEdit = (pos: PositionDto) => {
    setEditingPosition(pos);
    setFormData({
      code: pos.code,
      name: pos.name,
      description: pos.description || "",
      level: pos.level,
      displayOrder: pos.displayOrder,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu pozisyonu silmek istediğinize emin misiniz?")) return;

    try {
      await deletePosition(id);
      alert("✅ Pozisyon başarıyla silindi!");
      loadPositions();
    } catch (error) {
      alert("❌ Pozisyon silinirken hata oluştu!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.name) {
      alert("⚠️ Kod ve ad zorunludur!");
      return;
    }

    try {
      if (editingPosition) {
        await updatePosition(editingPosition.id, formData);
        alert("✅ Pozisyon başarıyla güncellendi!");
      } else {
        await createPosition(formData);
        alert("✅ Pozisyon başarıyla oluşturuldu!");
      }
      setShowModal(false);
      loadPositions();
    } catch (error) {
      alert("❌ İşlem sırasında hata oluştu!");
    }
  };

  const getLevelLabel = (level: number): { emoji: string; text: string; color: string } => {
    const labels: Record<number, { emoji: string; text: string; color: string }> = {
      1: { emoji: "👑", text: "Yönetim", color: "bg-purple-100 text-purple-800 border-purple-300" },
      2: { emoji: "💼", text: "Üst Yönetim", color: "bg-blue-100 text-blue-800 border-blue-300" },
      3: { emoji: "📊", text: "Orta Yönetim", color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
      4: { emoji: "🎯", text: "Koordinatör", color: "bg-green-100 text-green-800 border-green-300" },
      5: { emoji: "👨‍🏫", text: "Uzman", color: "bg-teal-100 text-teal-800 border-teal-300" },
      6: { emoji: "👤", text: "Personel", color: "bg-gray-100 text-gray-800 border-gray-300" },
      7: { emoji: "🎓", text: "Stajyer", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
    };
    return labels[level] || { emoji: "📌", text: `Seviye ${level}`, color: "bg-gray-100 text-gray-800 border-gray-300" };
  };

  const groupedByLevel = positions
    .sort((a, b) => a.level - b.level || a.displayOrder - b.displayOrder)
    .reduce((acc, pos) => {
      if (!acc[pos.level]) acc[pos.level] = [];
      acc[pos.level].push(pos);
      return acc;
    }, {} as Record<number, PositionDto[]>);

  const filteredPositions = positions.filter(pos =>
    pos.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pos.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-800">💼 Pozisyon Yönetimi</h1>
          <p className="text-gray-600 mt-1">Toplam {positions.length} pozisyon</p>
        </div>
        <Button onClick={handleCreate}>+ Yeni Pozisyon</Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <Input
          placeholder="🔍 Pozisyon ara..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Level-based Groups */}
      <div className="space-y-6">
        {searchTerm ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Arama Sonuçları</h3>
            {filteredPositions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">🔍 Sonuç bulunamadı</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredPositions.map(pos => {
                  const levelInfo = getLevelLabel(pos.level);
                  return (
                    <div key={pos.id} className={`border-2 rounded-lg p-4 ${levelInfo.color}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{levelInfo.emoji}</span>
                          <div>
                            <h4 className="font-bold">{pos.name}</h4>
                            <p className="text-xs opacity-75">{pos.code}</p>
                          </div>
                        </div>
                      </div>
                      {pos.description && (
                        <p className="text-sm opacity-75 mb-2">{pos.description}</p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <Button variant="secondary" onClick={() => handleEdit(pos)}>✏️</Button>
                        <Button variant="secondary" onClick={() => handleDelete(pos.id)}>🗑️</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          Object.entries(groupedByLevel).map(([level, positionsInLevel]) => {
            const levelInfo = getLevelLabel(parseInt(level));
            return (
              <div key={level} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{levelInfo.emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{levelInfo.text}</h3>
                    <p className="text-sm text-gray-600">Level {level} • {positionsInLevel.length} pozisyon</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {positionsInLevel.map(pos => (
                    <div key={pos.id} className={`border-2 rounded-lg p-4 ${levelInfo.color}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold">{pos.name}</h4>
                          <p className="text-xs opacity-75">Kod: {pos.code}</p>
                          <p className="text-xs opacity-75">Sıra: {pos.displayOrder}</p>
                        </div>
                      </div>
                      {pos.description && (
                        <p className="text-sm opacity-75 mb-2">{pos.description}</p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <Button variant="secondary" onClick={() => handleEdit(pos)}>✏️</Button>
                        <Button variant="secondary" onClick={() => handleDelete(pos.id)}>🗑️</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}

        {Object.keys(groupedByLevel).length === 0 && !searchTerm && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
            💼 Henüz pozisyon eklenmemiş
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {editingPosition ? "✏️ Pozisyon Düzenle" : "➕ Yeni Pozisyon Oluştur"}
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
                    label="Pozisyon Kodu *"
                    value={formData.code}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="Örn: MGR, COORD, TCHR"
                  />

                  <Input
                    label="Pozisyon Adı *"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Örn: Müdür, Koordinatör"
                  />
                </div>

                <Textarea
                  label="Açıklama"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Pozisyon açıklaması..."
                  rows={3}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seviye (Level) *
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map(level => {
                      const info = getLevelLabel(level);
                      return (
                        <option key={level} value={level}>
                          {info.emoji} Level {level} - {info.text}
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    1: En yüksek yönetim, 7: En alt seviye
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
                    💡 <strong>İpucu:</strong> Seviye (Level) hiyerarşiyi belirler. Küçük sayılar daha yüksek pozisyondur.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-2 border-t">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                  İptal
                </Button>
                <Button type="submit">
                  {editingPosition ? "💾 Güncelle" : "✅ Oluştur"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionsManagementPage;

