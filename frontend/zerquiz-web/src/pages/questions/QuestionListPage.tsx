import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuestions, useDeleteQuestion } from "../../hooks/useQuestionQueries";
import type { Question } from "../../types/question.types";
import { QuestionCreateModal } from "../../components/modals/QuestionCreateModal";
import { QuestionDetailModal } from "../../components/modals/QuestionDetailModal";
import { toast } from "react-toastify";

export default function QuestionListPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const pageSize = 20;

  // React Query - Auto fetch, cache, refetch
  const { data, isLoading, isError, error } = useQuestions({
    page,
    pageSize,
    status: statusFilter || undefined,
    difficulty: difficultyFilter || undefined,
    search: searchQuery || undefined
  });

  const { mutate: deleteQuestion, isPending: isDeleting } = useDeleteQuestion();

  const questions = data?.items || [];
  const totalPages = Math.ceil((data?.total || data?.totalCount || 0) / pageSize);

  const handleSearch = () => {
    setPage(1); // Reset to first page on new search
  };

  const handleViewDetail = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setShowDetailModal(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bu soruyu silmek istediğinizden emin misiniz?")) return;
    
    deleteQuestion(id, {
      onSuccess: () => {
        toast.success("Soru başarıyla silindi");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Soru silinemedi");
      }
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: string } = {
      draft: "bg-gray-100 text-gray-800",
      review: "bg-yellow-100 text-yellow-800",
      published: "bg-green-100 text-green-800",
      archived: "bg-red-100 text-red-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const getDifficultyBadge = (difficulty: string) => {
    const badges: { [key: string]: string } = {
      easy: "bg-blue-100 text-blue-800",
      medium: "bg-orange-100 text-orange-800",
      hard: "bg-red-100 text-red-800",
    };
    return badges[difficulty] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Soru Bankası</h1>
            <p className="text-gray-600 mt-1">Soru havuzunuzu yönetin</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Soru
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Soru kodu veya metin ara..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tüm Durumlar</option>
                <option value="draft">Taslak</option>
                <option value="review">İnceleme</option>
                <option value="published">Yayınlanmış</option>
                <option value="archived">Arşivlenmiş</option>
              </select>
            </div>

            <div>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tüm Zorluklar</option>
                <option value="easy">Kolay</option>
                <option value="medium">Orta</option>
                <option value="hard">Zor</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Ara
              </button>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("");
                  setDifficultyFilter("");
                  setPage(1);
                }}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                title="Filtreleri Temizle"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Yükleniyor...</p>
            </div>
          ) : isError ? (
            <div className="p-12 text-center">
              <p className="text-red-600">❌ {error?.message || "Sorular yüklenemedi"}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 text-blue-600 hover:underline"
              >
                Yeniden Dene
              </button>
            </div>
          ) : questions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>Henüz soru bulunmuyor</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Soru Kodu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Format
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zorluk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Oluşturma Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questions.map((question) => (
                  <tr key={question.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{question.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{question.formatType || "Çoktan Seçmeli"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyBadge(question.difficulty)}`}>
                        {question.difficulty === "easy" ? "Kolay" : question.difficulty === "medium" ? "Orta" : "Zor"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(question.status || question.questionStatus || "draft")}`}>
                        {(question.status || question.questionStatus) === "draft" ? "Taslak" : (question.status || question.questionStatus) === "review" ? "İnceleme" : (question.status || question.questionStatus) === "published" ? "Yayınlanmış" : "Arşivlenmiş"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(question.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Link
                          to={`/questions/${question.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Detay"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(question.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Sil"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && questions.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Soru bulunamadı</p>
              <Link
                to="/questions/create"
                className="mt-4 inline-block text-blue-600 hover:text-blue-700"
              >
                İlk soruyu oluştur
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {questions.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Sayfa {page} / {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Önceki
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <QuestionCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadQuestions}
      />
    </div>
  );
}

