import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  tenantService,
  UpdateTenantRequest,
} from "../../services/api/tenantService";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";

const TenantEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateTenantRequest>({
    name: "",
    companyName: "",
    taxNumber: "",
    address: "",
    city: "",
    country: "Türkiye",
    phone: "",
    email: "",
    website: "",
  });

  useEffect(() => {
    if (id) {
      loadTenant();
    }
  }, [id]);

  const loadTenant = async () => {
    try {
      setLoading(true);
      const data = await tenantService.getTenant(id!);
      setFormData({
        name: data.name,
        companyName: data.companyName,
        taxNumber: data.taxNumber || "",
        address: data.address || "",
        city: data.city || "",
        country: data.country || "Türkiye",
        phone: data.phone || "",
        email: data.email || "",
        website: data.website || "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to load tenant");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await tenantService.updateTenant(id!, formData);
      navigate(`/tenants/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update tenant");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tenant Düzenle</h1>
        <p className="text-gray-600 mt-1">
          Organizasyon bilgilerini güncelleyin
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          {/* Temel Bilgiler */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Temel Bilgiler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tenant Adı"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Örnek: Demo Okul"
              />

              <Input
                label="Şirket Adı"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                placeholder="ABC Eğitim Kurumları A.Ş."
              />
            </div>
          </div>

          {/* Şirket Bilgileri */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Şirket Bilgileri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Vergi Numarası"
                name="taxNumber"
                value={formData.taxNumber}
                onChange={handleInputChange}
                placeholder="1234567890"
              />

              <Input
                label="Şehir"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="İstanbul"
              />

              <Select
                label="Ülke"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                options={[
                  { value: "Türkiye", label: "Türkiye" },
                  { value: "ABD", label: "ABD" },
                  { value: "İngiltere", label: "İngiltere" },
                  { value: "Almanya", label: "Almanya" },
                ]}
              />

              <div className="md:col-span-2">
                <Input
                  label="Adres"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Tam adres"
                />
              </div>
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              İletişim Bilgileri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="E-posta"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="info@example.com"
              />

              <Input
                label="Telefon"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+90 555 123 4567"
              />

              <Input
                label="Web Sitesi"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://www.example.com"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(`/tenants/${id}`)}
          >
            İptal
          </Button>
          <Button type="submit" isLoading={saving}>
            Değişiklikleri Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TenantEditPage;

