import React, { useState, useEffect } from "react";
import Tabs from "../common/Tabs";
import Button from "../common/Button";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import {
  updateUser,
  getUser,
  getRoles,
  getDepartments,
  getPositions,
  type UpdateUserRequest,
  type UserDto,
  type RoleDto,
  type DepartmentDto,
  type PositionDto,
} from "../../services/api/userService";

interface UserEditModalProps {
  isOpen: boolean;
  userId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ isOpen, userId, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [positions, setPositions] = useState<PositionDto[]>([]);
  const [user, setUser] = useState<UserDto | null>(null);

  const [formData, setFormData] = useState<UpdateUserRequest>({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    dateOfBirth: "",
    gender: "",
    identityNumber: "",
    departmentId: "",
    positionId: "",
    primaryRoleId: "",
    isActive: true,
    avatarUrl: "",
    bio: "",
  });

  useEffect(() => {
    if (isOpen && userId) {
      loadData();
    }
  }, [isOpen, userId]);

  const loadData = async () => {
    if (!userId) return;
    
    try {
      setLoadingData(true);
      const [userData, rolesData, depsData, posData] = await Promise.all([
        getUser(userId),
        getRoles().catch(() => []),
        getDepartments().catch(() => []),
        getPositions().catch(() => []),
      ]);

      setUser(userData);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setDepartments(Array.isArray(depsData) ? depsData : []);
      setPositions(Array.isArray(posData) ? posData : []);

      // Pre-fill form
      setFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || "",
        address: userData.address || "",
        city: userData.city || "",
        country: userData.country || "",
        dateOfBirth: userData.dateOfBirth || "",
        gender: userData.gender || "",
        identityNumber: userData.identityNumber || "",
        departmentId: userData.departmentId || "",
        positionId: userData.positionId || "",
        primaryRoleId: userData.primaryRoleId || "",
        isActive: userData.isActive,
        avatarUrl: userData.avatarUrl || "",
        bio: userData.bio || "",
      });
    } catch (error) {
      console.error("Failed to load user data:", error);
      alert("❌ Kullanıcı bilgileri yüklenemedi!");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) return;

    if (!formData.firstName || !formData.lastName) {
      alert("⚠️ Ad ve soyad zorunludur!");
      return;
    }

    try {
      setLoading(true);
      await updateUser(userId, formData);
      alert("✅ Kullanıcı başarıyla güncellendi!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      alert("❌ Kullanıcı güncellenirken hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UpdateUserRequest, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  if (!isOpen || !userId) return null;

  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // TAB 1: Temel Bilgiler
  const BasicInfoTab = (
    <div className="space-y-4">
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          📧 <strong>Email:</strong> {user?.email} (Email değiştirilemez)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="firstName"
          label="Ad *"
          value={formData.firstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("firstName", e.target.value)}
        />
        <Input
          name="lastName"
          label="Soyad *"
          value={formData.lastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("lastName", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="phone"
          label="Telefon"
          value={formData.phone || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("phone", e.target.value)}
        />
        <Input
          name="identityNumber"
          label="TC Kimlik No"
          value={formData.identityNumber || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("identityNumber", e.target.value)}
          maxLength={11}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="dateOfBirth"
          label="Doğum Tarihi"
          type="date"
          value={formData.dateOfBirth || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("dateOfBirth", e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cinsiyet</label>
          <select
            name="gender"
            value={formData.gender || ""}
            onChange={(e) => handleChange("gender", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seçiniz...</option>
            <option value="male">Erkek</option>
            <option value="female">Kadın</option>
            <option value="other">Diğer</option>
          </select>
        </div>
      </div>
    </div>
  );

  // TAB 2: İletişim
  const ContactTab = (
    <div className="space-y-4">
      <Textarea
        name="address"
        label="Adres"
        value={formData.address || ""}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("address", e.target.value)}
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="city"
          label="Şehir"
          value={formData.city || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("city", e.target.value)}
        />
        <Input
          name="country"
          label="Ülke"
          value={formData.country || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("country", e.target.value)}
        />
      </div>
    </div>
  );

  // TAB 3: Organizasyon
  const OrganizationTab = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ana Rol</label>
        <select
          name="primaryRoleId"
          value={formData.primaryRoleId || ""}
          onChange={(e) => handleChange("primaryRoleId", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seçiniz...</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Departman</label>
        <select
          name="departmentId"
          value={formData.departmentId || ""}
          onChange={(e) => handleChange("departmentId", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seçiniz...</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Pozisyon</label>
        <select
          name="positionId"
          value={formData.positionId || ""}
          onChange={(e) => handleChange("positionId", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seçiniz...</option>
          {positions.map(pos => (
            <option key={pos.id} value={pos.id}>{pos.name}</option>
          ))}
        </select>
      </div>
    </div>
  );

  // TAB 4: Profil
  const ProfileTab = (
    <div className="space-y-4">
      <Input
        name="avatarUrl"
        label="Avatar URL"
        value={formData.avatarUrl || ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("avatarUrl", e.target.value)}
      />

      <Textarea
        name="bio"
        label="Biyografi"
        value={formData.bio || ""}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("bio", e.target.value)}
        rows={4}
      />

      {formData.avatarUrl && (
        <div>
          <p className="text-sm text-gray-600 mb-2">Avatar Önizleme:</p>
          <img
            src={formData.avatarUrl}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );

  // TAB 5: Ayarlar
  const SettingsTab = (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleChange("isActive", e.target.checked)}
          className="rounded"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          Kullanıcı aktif
        </label>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Dikkat:</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Şifre değiştirme işlemi ayrı bir endpoint'ten yapılmalıdır</li>
          <li>• Email değişikliği güvenlik nedeniyle devre dışıdır</li>
          <li>• Kullanıcıyı pasif yaptığınızda sisteme giriş yapamaz</li>
        </ul>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">📊 Kullanıcı İstatistikleri:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Oluşturulma: {user?.createdAt ? new Date(user.createdAt).toLocaleString('tr-TR') : 'Bilinmiyor'}</li>
          <li>• Son Güncelleme: {user?.updatedAt ? new Date(user.updatedAt).toLocaleString('tr-TR') : 'Bilinmiyor'}</li>
          <li>• Email Onay: {user?.emailConfirmed ? '✅ Onaylı' : '❌ Onaylı Değil'}</li>
        </ul>
      </div>
    </div>
  );

  const tabs = [
    { id: "basic", label: "📝 Temel Bilgiler", content: BasicInfoTab },
    { id: "contact", label: "📞 İletişim", content: ContactTab },
    { id: "organization", label: "🏢 Organizasyon", content: OrganizationTab },
    { id: "profile", label: "👤 Profil", content: ProfileTab },
    { id: "settings", label: "⚙️ Ayarlar", content: SettingsTab },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">✏️ Kullanıcı Düzenle</h2>
            <p className="text-indigo-100 text-sm mt-1">{user?.firstName} {user?.lastName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 180px)" }}>
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              İptal
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const currentIndex = tabs.findIndex(t => t.id === activeTab);
                  if (currentIndex > 0) {
                    setActiveTab(tabs[currentIndex - 1].id);
                  }
                }}
                disabled={activeTab === "basic"}
              >
                ← Önceki
              </Button>
              {activeTab !== "settings" ? (
                <Button
                  type="button"
                  onClick={() => {
                    const currentIndex = tabs.findIndex(t => t.id === activeTab);
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1].id);
                    }
                  }}
                >
                  Sonraki →
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? "⏳ Güncelleniyor..." : "💾 Değişiklikleri Kaydet"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
