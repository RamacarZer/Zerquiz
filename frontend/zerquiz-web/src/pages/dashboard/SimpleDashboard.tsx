import React from "react";
import AdminDashboard from "./AdminDashboard";

// Mock user role - Gerçek uygulamada auth context'ten gelecek
const useUserRole = () => {
  // TODO: Get from authentication context / localStorage
  const role = localStorage.getItem("userRole") || "admin"; // 'admin', 'teacher', 'student'
  const userId = localStorage.getItem("userId") || "123";
  const tenantId = localStorage.getItem("tenantId") || "456";

  return { role, userId, tenantId };
};

export default function SimpleDashboard() {
  const { role } = useUserRole();

  // Admin ise AdminDashboard'u göster (Analytics & Reports)
  if (role === "admin" || role === "superadmin") {
    return <AdminDashboard />;
  }

  // Teacher Dashboard
  if (role === "teacher") {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">👨‍🏫 Öğretmen Paneli</h1>
          <p className="text-green-100 text-lg">
            Sorularınızı yönetin, sınavlar oluşturun ve öğrenci performansını
            takip edin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="text-3xl mb-2">❓</div>
            <div className="text-2xl font-bold">156</div>
            <div className="text-sm text-gray-600">Sorularım</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="text-3xl mb-2">📄</div>
            <div className="text-2xl font-bold">23</div>
            <div className="text-sm text-gray-600">Aktif Sınavlar</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold">342</div>
            <div className="text-sm text-gray-600">Öğrenciler</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">⚡ Hızlı İşlemler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/questions/create"
              className="p-4 border-2 rounded-lg hover:border-green-500 text-center"
            >
              <div className="text-3xl mb-2">➕</div>
              <div className="font-semibold">Yeni Soru</div>
            </a>
            <a
              href="/exams/create"
              className="p-4 border-2 rounded-lg hover:border-blue-500 text-center"
            >
              <div className="text-3xl mb-2">📝</div>
              <div className="font-semibold">Yeni Sınav</div>
            </a>
            <a
              href="/grading"
              className="p-4 border-2 rounded-lg hover:border-purple-500 text-center"
            >
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-semibold">Değerlendirme</div>
            </a>
            <a
              href="/royalty/author-dashboard"
              className="p-4 border-2 rounded-lg hover:border-yellow-500 text-center"
            >
              <div className="text-3xl mb-2">💰</div>
              <div className="font-semibold">Kazançlarım</div>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Student Dashboard
  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">👨‍🎓 Öğrenci Paneli</h1>
        <p className="text-blue-100 text-lg">
          Sınavlarınıza katılın, sonuçlarınızı görün ve gelişiminizi takip edin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="text-3xl mb-2">📄</div>
          <div className="text-2xl font-bold">12</div>
          <div className="text-sm text-gray-600">Tamamlanan Sınavlar</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold">87.5%</div>
          <div className="text-sm text-gray-600">Ortalama Başarı</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="text-3xl mb-2">🎖️</div>
          <div className="text-2xl font-bold">8</div>
          <div className="text-sm text-gray-600">Sertifikalar</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">📚 Aktif Sınavlarım</h2>
        <div className="space-y-3">
          <div className="p-4 border rounded-lg hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">Matematik Final Sınavı</div>
                <div className="text-sm text-gray-600">Bitiş: 2 gün sonra</div>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Başla
              </button>
            </div>
          </div>
          <div className="p-4 border rounded-lg hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">Fizik Kısa Sınavı</div>
                <div className="text-sm text-gray-600">Bitiş: 5 saat sonra</div>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Başla
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">🎖️ Son Sertifikalarım</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border-2 border-yellow-300 rounded-lg bg-yellow-50">
            <div className="text-2xl mb-2">🏆</div>
            <div className="font-semibold">Matematik Başarı Sertifikası</div>
            <div className="text-sm text-gray-600 mt-1">25 Kasım 2025</div>
            <a
              href="/certificates"
              className="text-blue-600 text-sm hover:underline mt-2 inline-block"
            >
              Görüntüle →
            </a>
          </div>
          <div className="p-4 border-2 border-green-300 rounded-lg bg-green-50">
            <div className="text-2xl mb-2">⭐</div>
            <div className="font-semibold">Fizik Mükemmellik Ödülü</div>
            <div className="text-sm text-gray-600 mt-1">20 Kasım 2025</div>
            <a
              href="/certificates"
              className="text-blue-600 text-sm hover:underline mt-2 inline-block"
            >
              Görüntüle →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
