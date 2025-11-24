import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { curriculumService, SubjectDto } from "../../services/api/curriculumService";

export default function SubjectListPage() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    displayOrder: 0,
  });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await curriculumService.getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error("Failed to load subjects:", error);
      alert("Branşlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await curriculumService.createSubject(formData);
      alert("Branş başarıyla oluşturuldu!");
      setShowCreateModal(false);
      setFormData({ code: "", name: "", displayOrder: 0 });
      loadSubjects();
    } catch (error) {
      console.error("Failed to create subject:", error);
      alert("Branş oluşturulamadı");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu branşı silmek istediğinizden emin misiniz?")) return;
    
    try {
      await curriculumService.deleteSubject(id);
      loadSubjects();
    } catch (error) {
      console.error("Failed to delete subject:", error);
      alert("Branş silinemedi");
    }
  };

  const subjectIcons: { [key: string]: string } = {
    MAT: "📐",
    FEN: "🔬",
    FIZ: "⚛️",
    KIM: "🧪",
    BIO: "🧬",
    TUR: "📚",
    ING: "🇬🇧",
    TAR: "🏛️",
    COG: "🌍",
    default: "📖"
  };

  const getIcon = (code: string) => {
    for (const [key, icon] of Object.entries(subjectIcons)) {
      if (code.includes(key)) return icon;
    }
    return subjectIcons.default;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate("/curriculum")}
              className="text-blue-600 hover:text-blue-700 mb-2 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Eğitim Modellerine Dön
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Branşlar</h1>
            <p className="text-gray-600 mt-1">Müfredat branşlarını yönetin</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Branş
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Yükleniyor...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjects.map((subject) => (
              <div key={subject.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="text-4xl mb-3">{getIcon(subject.code)}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{subject.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{subject.code}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/curriculum/topics?subjectId=${subject.id}`)}
                    className="flex-1 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-100 transition text-sm font-medium"
                  >
                    Konular
                  </button>
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition"
                    title="Sil"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && subjects.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            <p>Henüz branş eklenmemiş</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              İlk branşı oluştur
            </button>
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Yeni Branş</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kod *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="MAT"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İsim *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Matematik"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sıra
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Oluştur
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

