import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Tabs from "../../components/common/Tabs";
import Button from "../../components/common/Button";
import {
  getUser,
  getUserRoles,
  type UserDto,
  type RoleDto,
} from "../../services/api/userService";

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserDto | null>(null);
  const [userRoles, setUserRoles] = useState<RoleDto[]>([]);

  useEffect(() => {
    if (id) {
      loadUserData();
    }
  }, [id]);

  const loadUserData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [userData, rolesData] = await Promise.all([
        getUser(id),
        getUserRoles(id).catch(() => []),
      ]);
      
      setUser(userData);
      setUserRoles(Array.isArray(rolesData) ? rolesData : []);
    } catch (error) {
      console.error("Failed to load user:", error);
      alert("❌ Kullanıcı bilgileri yüklenemedi!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Kullanıcı bulunamadı</p>
        <Button onClick={() => navigate("/users")} className="mt-4">
          Geri Dön
        </Button>
      </div>
    );
  }

  // TAB 1: Genel Bilgiler
  const InfoTab = (
    <div className="space-y-6">
      {/* Personal Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 Kişisel Bilgiler</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Ad Soyad</p>
            <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium text-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Telefon</p>
            <p className="font-medium text-gray-900">{user.phone || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">TC Kimlik No</p>
            <p className="font-medium text-gray-900">{user.identityNumber || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Doğum Tarihi</p>
            <p className="font-medium text-gray-900">
              {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('tr-TR') : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Cinsiyet</p>
            <p className="font-medium text-gray-900">
              {user.gender === 'male' ? 'Erkek' : user.gender === 'female' ? 'Kadın' : user.gender === 'other' ? 'Diğer' : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Organization */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🏢 Organizasyon</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Rol</p>
            <span className="inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
              {user.primaryRoleName || 'Rol Yok'}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Departman</p>
            <p className="font-medium text-gray-900">{user.departmentName || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pozisyon</p>
            <p className="font-medium text-gray-900">{user.positionName || '-'}</p>
          </div>
        </div>
      </div>

      {/* Contact & Address */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📍 İletişim & Adres</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Adres</p>
            <p className="font-medium text-gray-900">{user.address || '-'}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Şehir</p>
              <p className="font-medium text-gray-900">{user.city || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ülke</p>
              <p className="font-medium text-gray-900">{user.country || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Durum</h3>
        <div className="flex gap-3">
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {user.isActive ? '✓ Aktif' : '✗ Pasif'}
          </span>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
            user.emailConfirmed ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {user.emailConfirmed ? '📧 Email Onaylı' : '⏳ Email Onay Bekliyor'}
          </span>
        </div>
      </div>
    </div>
  );

  // TAB 2: Roller
  const RolesTab = (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">🎭 Atanmış Roller</h3>
          <Button variant="secondary">+ Rol Ekle</Button>
        </div>

        {userRoles.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Henüz rol atanmamış</p>
        ) : (
          <div className="space-y-3">
            {userRoles.map(role => (
              <div key={role.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{role.name}</h4>
                  <p className="text-sm text-gray-600">{role.description || 'Açıklama yok'}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {role.permissions?.slice(0, 5).map((perm, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {perm}
                      </span>
                    ))}
                    {role.permissions?.length > 5 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        +{role.permissions.length - 5} daha
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="secondary" onClick={() => alert('Rol kaldırma özelliği yakında!')}>
                  Kaldır
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Primary Role */}
      {user.primaryRoleName && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Ana Rol:</strong> {user.primaryRoleName}
          </p>
        </div>
      )}
    </div>
  );

  // TAB 3: Aktivite
  const ActivityTab = (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Son Aktiviteler</h3>
        <div className="space-y-3">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-sm text-gray-600">
              {user.createdAt ? new Date(user.createdAt).toLocaleString('tr-TR') : 'Bilinmiyor'}
            </p>
            <p className="font-medium text-gray-900">Kullanıcı oluşturuldu</p>
          </div>
          
          {user.updatedAt && (
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="text-sm text-gray-600">
                {new Date(user.updatedAt).toLocaleString('tr-TR')}
              </p>
              <p className="font-medium text-gray-900">Profil güncellendi</p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
            <p>Detaylı aktivite logları yakında eklenecek</p>
          </div>
        </div>
      </div>
    </div>
  );

  // TAB 4: Ayarlar
  const SettingsTab = (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🔐 Güvenlik</h3>
        <div className="space-y-4">
          <Button variant="secondary" onClick={() => alert('Şifre değiştirme özelliği yakında!')}>
            🔑 Şifre Değiştir
          </Button>
          <Button variant="secondary" onClick={() => alert('Email onaylama özelliği yakında!')}>
            📧 Email Onaylama Linki Gönder
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ Hesap Ayarları</h3>
        <div className="space-y-4">
          <Button variant="secondary" onClick={() => navigate(`/users?edit=${id}`)}>
            ✏️ Profil Düzenle
          </Button>
          <Button variant="secondary" onClick={() => alert('Hesap dondurma özelliği yakında!')}>
            ⏸️ Hesabı Dondur
          </Button>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Tehlikeli Bölge</h3>
        <p className="text-sm text-red-700 mb-4">
          Bu işlemler geri alınamaz. Dikkatli olun!
        </p>
        <Button variant="secondary" onClick={() => {
          if (confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
            alert('Silme özelliği yakında!');
          }
        }}>
          🗑️ Hesabı Sil
        </Button>
      </div>
    </div>
  );

  const tabs = [
    { id: "info", label: "📋 Genel Bilgiler", content: InfoTab },
    { id: "roles", label: "🎭 Roller", content: RolesTab },
    { id: "activity", label: "📊 Aktivite", content: ActivityTab },
    { id: "settings", label: "⚙️ Ayarlar", content: SettingsTab },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Avatar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              `${user.firstName[0]}${user.lastName[0]}`
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
            <p className="text-blue-100 mt-1">{user.email}</p>
            <div className="flex gap-2 mt-3">
              {user.primaryRoleName && (
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                  {user.primaryRoleName}
                </span>
              )}
              {user.departmentName && (
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                  {user.departmentName}
                </span>
              )}
            </div>
          </div>
          <Button variant="secondary" onClick={() => navigate("/users")}>
            ← Geri Dön
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow p-6">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default UserProfilePage;

