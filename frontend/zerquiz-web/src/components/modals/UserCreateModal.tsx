import React, { useState, useEffect } from "react";
import Tabs from "../common/Tabs";
import Button from "../common/Button";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import {
  createUser,
  getRoles,
  getDepartments,
  getPositions,
  type CreateUserRequest,
  type RoleDto,
  type DepartmentDto,
  type PositionDto,
} from "../../services/api/userService";

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UserCreateModal: React.FC<UserCreateModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [positions, setPositions] = useState<PositionDto[]>([]);

  const [formData, setFormData] = useState<CreateUserRequest>({
    email: "",
    password: "",
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
    if (isOpen) {
      loadDropdownData();
    }
  }, [isOpen]);

  const loadDropdownData = async () => {
    try {
      const [rolesData, depsData, posData] = await Promise.all([
        getRoles().catch(() => []),
        getDepartments().catch(() => []),
        getPositions().catch(() => []),
      ]);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setDepartments(Array.isArray(depsData) ? depsData : []);
      setPositions(Array.isArray(posData) ? posData : []);
    } catch (error) {
      console.error("Dropdown data yüklenemedi:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Manual validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      alert("⚠️ Lütfen zorunlu alanları doldurun!");
      return;
    }

    if (formData.password.length < 6) {
      alert("⚠️ Şifre en az 6 karakter olmalıdır!");
      return;
    }

    try {
      setLoading(true);
      await createUser(formData);
      alert("✅ Kullanıcı başarıyla oluşturuldu!");
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Create error:", error);
      alert("❌ Kullanıcı oluşturulurken hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
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
    setActiveTab("basic");
  };

  const handleChange = (field: keyof CreateUserRequest, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  if (!isOpen) return null;

  // TAB 1: Temel Bilgiler
  const BasicInfoTab = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="firstName"
          label="Ad *"
          value={formData.firstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("firstName", e.target.value)}
          placeholder="Ahmet"
        />
        <Input
          name="lastName"
          label="Soyad *"
          value={formData.lastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("lastName", e.target.value)}
          placeholder="Yılmaz"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="email"
          label="Email *"
          type="email"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("email", e.target.value)}
          placeholder="ahmet.yilmaz@okul.com"
        />
        <Input
          name="phone"
          label="Telefon"
          value={formData.phone || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("phone", e.target.value)}
          placeholder="+90 555 123 4567"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="identityNumber"
          label="TC Kimlik No"
          value={formData.identityNumber || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("identityNumber", e.target.value)}
          placeholder="12345678901"
          maxLength={11}
        />
        <Input
          name="dateOfBirth"
          label="Doğum Tarihi"
          type="date"
          value={formData.dateOfBirth || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("dateOfBirth", e.target.value)}
        />
      </div>

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
  );

  // TAB 2: İletişim
  const ContactTab = (
    <div className="space-y-4">
      <Textarea
        name="address"
        label="Adres"
        value={formData.address || ""}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("address", e.target.value)}
        placeholder="Mahalle, Sokak, No"
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="city"
          label="Şehir"
          value={formData.city || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("city", e.target.value)}
          placeholder="İstanbul"
        />
        <Input
          name="country"
          label="Ülke"
          value={formData.country || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("country", e.target.value)}
          placeholder="Türkiye"
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
        placeholder="https://example.com/avatar.jpg"
      />

      <Textarea
        name="bio"
        label="Biyografi"
        value={formData.bio || ""}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("bio", e.target.value)}
        placeholder="Kısa tanıtım..."
        rows={4}
      />

      {formData.avatarUrl && (
        <div className="mt-2">
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

  // TAB 5: Güvenlik
  const SecurityTab = (
    <div className="space-y-4">
      <Input
        name="password"
        label="Şifre *"
        type="password"
        value={formData.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("password", e.target.value)}
        placeholder="En az 6 karakter"
        minLength={6}
      />

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Şifre Kuralları:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Minimum 6 karakter</li>
          <li>• Önerilir: Büyük harf, küçük harf, rakam ve özel karakter içermeli</li>
        </ul>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleChange("isActive", e.target.checked)}
          className="rounded"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          Kullanıcıyı aktif olarak oluştur
        </label>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-sm text-yellow-800">
          ⚠️ Kullanıcı oluşturulduktan sonra email onaylama linki gönderilecektir.
        </p>
      </div>
    </div>
  );

  const tabs = [
    { id: "basic", label: "📝 Temel Bilgiler", content: BasicInfoTab },
    { id: "contact", label: "📞 İletişim", content: ContactTab },
    { id: "organization", label: "🏢 Organizasyon", content: OrganizationTab },
    { id: "profile", label: "👤 Profil", content: ProfileTab },
    { id: "security", label: "🔐 Güvenlik", content: SecurityTab },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">👥 Yeni Kullanıcı Oluştur</h2>
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
              {activeTab !== "security" ? (
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
                  {loading ? "⏳ Kaydediliyor..." : "✅ Kullanıcı Oluştur"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserCreateModal;
