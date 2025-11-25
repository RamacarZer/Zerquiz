import React, { useState, useEffect } from "react";
import Tabs from "../common/Tabs";
import Button from "../common/Button";
import {
  getUser,
  getUserRoles,
  type UserDto,
  type RoleDto,
} from "../../services/api/userService";

interface UserViewModalProps {
  isOpen: boolean;
  userId: string | null;
  onClose: () => void;
  onEdit?: (userId: string) => void;
}

const UserViewModal: React.FC<UserViewModalProps> = ({ isOpen, userId, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserDto | null>(null);
  const [userRoles, setUserRoles] = useState<RoleDto[]>([]);

  useEffect(() => {
    if (isOpen && userId) {
      loadUserData();
    }
  }, [isOpen, userId]);

  const loadUserData = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const [userData, rolesData] = await Promise.all([
        getUser(userId),
        getUserRoles(userId).catch(() => []),
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

  if (!isOpen || !userId) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8">
          <p className="text-center text-gray-600">Kullanıcı bulunamadı</p>
          <Button onClick={onClose} className="mt-4 w-full">
            Kapat
          </Button>
        </div>
      </div>
    );
  }

  // TAB 1: Genel Bilgiler
  const InfoTab = (
    <div className="space-y-4">
      {/* Personal Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">📝 Kişisel Bilgiler</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-600">Ad Soyad</p>
            <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-medium text-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Telefon</p>
            <p className="font-medium text-gray-900">{user.phone || '-'}</p>
          </div>
          <div>
            <p className="text-gray-600">TC Kimlik No</p>
            <p className="font-medium text-gray-900">{user.identityNumber || '-'}</p>
          </div>
          <div>
            <p className="text-gray-600">Doğum Tarihi</p>
            <p className="font-medium text-gray-900">
              {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('tr-TR') : '-'}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Cinsiyet</p>
            <p className="font-medium text-gray-900">
              {user.gender === 'male' ? 'Erkek' : user.gender === 'female' ? 'Kadın' : user.gender === 'other' ? 'Diğer' : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Organization */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">🏢 Organizasyon</h3>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-gray-600">Rol</p>
            <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {user.primaryRoleName || 'Rol Yok'}
            </span>
          </div>
          <div>
            <p className="text-gray-600">Departman</p>
            <p className="font-medium text-gray-900">{user.departmentName || '-'}</p>
          </div>
          <div>
            <p className="text-gray-600">Pozisyon</p>
            <p className="font-medium text-gray-900">{user.positionName || '-'}</p>
          </div>
        </div>
      </div>

      {/* Contact & Address */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">📍 İletişim & Adres</h3>
        <div className="space-y-2 text-sm">
          <div>
            <p className="text-gray-600">Adres</p>
            <p className="font-medium text-gray-900">{user.address || '-'}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-gray-600">Şehir</p>
              <p className="font-medium text-gray-900">{user.city || '-'}</p>
            </div>
            <div>
              <p className="text-gray-600">Ülke</p>
              <p className="font-medium text-gray-900">{user.country || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">📊 Durum</h3>
        <div className="flex gap-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {user.isActive ? '✓ Aktif' : '✗ Pasif'}
          </span>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
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
      {user.primaryRoleName && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Ana Rol:</strong> {user.primaryRoleName}
          </p>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">🎭 Atanmış Roller</h3>
        {userRoles.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">Henüz rol atanmamış</p>
        ) : (
          <div className="space-y-2">
            {userRoles.map(role => (
              <div key={role.id} className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-gray-900 text-sm">{role.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{role.description || 'Açıklama yok'}</p>
                {role.permissions && role.permissions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {role.permissions.slice(0, 5).map((perm, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                        {perm}
                      </span>
                    ))}
                    {role.permissions.length > 5 && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                        +{role.permissions.length - 5}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // TAB 3: Aktivite
  const ActivityTab = (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">📈 Kullanıcı Geçmişi</h3>
        <div className="space-y-2 text-sm">
          <div className="border-l-4 border-blue-500 pl-3 py-1">
            <p className="text-xs text-gray-600">
              {user.createdAt ? new Date(user.createdAt).toLocaleString('tr-TR') : 'Bilinmiyor'}
            </p>
            <p className="font-medium text-gray-900">Kullanıcı oluşturuldu</p>
          </div>
          
          {user.updatedAt && (
            <div className="border-l-4 border-green-500 pl-3 py-1">
              <p className="text-xs text-gray-600">
                {new Date(user.updatedAt).toLocaleString('tr-TR')}
              </p>
              <p className="font-medium text-gray-900">Profil güncellendi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "info", label: "📋 Bilgiler", content: InfoTab },
    { id: "roles", label: "🎭 Roller", content: RolesTab },
    { id: "activity", label: "📊 Aktivite", content: ActivityTab },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                `${user.firstName[0]}${user.lastName[0]}`
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{user.firstName} {user.lastName}</h2>
              <p className="text-blue-100 text-sm mt-1">{user.email}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 180px)" }}>
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
          <Button variant="secondary" onClick={onClose}>
            Kapat
          </Button>
          {onEdit && (
            <Button onClick={() => {
              onEdit(userId);
              onClose();
            }}>
              ✏️ Düzenle
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserViewModal;

