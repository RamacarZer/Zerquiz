import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { presentationService, Presentation } from "../../services/api/presentationService";
import Button from "../../components/common/Button";

export default function PresentationListPage() {
  const navigate = useNavigate();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPresentations();
  }, []);

  const loadPresentations = async () => {
    try {
      setLoading(true);
      const data = await presentationService.getAll();
      setPresentations(data);
    } catch (error) {
      console.error("Failed to load presentations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu sunumu silmek istediğinizden emin misiniz?")) return;
    
    try {
      await presentationService.delete(id);
      setPresentations(presentations.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete presentation:", error);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await presentationService.duplicate(id);
      loadPresentations();
    } catch (error) {
      console.error("Failed to duplicate presentation:", error);
    }
  };

  const handleGoLive = async (id: string) => {
    try {
      const result = await presentationService.goLive(id);
      alert(`Canlı Yayın Başladı!\n\nKatılım Kodu: ${result.liveCode}\n\nÖğrenciler bu kodu kullanarak katılabilir.`);
      loadPresentations();
    } catch (error) {
      console.error("Failed to go live:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">🎤 Sunumlar</h1>
        <Button onClick={() => navigate("/presentations/create")}>
          ➕ Yeni Sunum
        </Button>
      </div>

      {presentations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">Henüz sunum yok</p>
          <Button onClick={() => navigate("/presentations/create")}>
            İlk Sunumunuzu Oluşturun
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presentations.map((presentation) => (
            <div
              key={presentation.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {presentation.title}
                  </h3>
                  {presentation.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {presentation.description}
                    </p>
                  )}
                </div>
                {presentation.isLive && (
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                    🔴 CANLI
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>📊 {presentation.slideCount} slayt</span>
                <span>🎨 {presentation.theme}</span>
              </div>

              {presentation.isLive && presentation.liveCode && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                  <p className="text-sm font-semibold text-yellow-900">
                    Katılım Kodu: <span className="text-lg">{presentation.liveCode}</span>
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate(`/presentations/${presentation.id}/edit`)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  ✏️ Düzenle
                </button>
                <button
                  onClick={() => navigate(`/presentations/${presentation.id}/play`)}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  ▶️ Oynat
                </button>
                {!presentation.isLive && (
                  <button
                    onClick={() => handleGoLive(presentation.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    🔴 Canlı
                  </button>
                )}
                <button
                  onClick={() => handleDuplicate(presentation.id)}
                  className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                >
                  📋
                </button>
                <button
                  onClick={() => handleDelete(presentation.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

