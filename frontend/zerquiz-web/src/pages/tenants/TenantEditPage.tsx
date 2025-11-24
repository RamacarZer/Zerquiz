import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  tenantService,
  UpdateTenantRequest,
} from "../../services/api/tenantService";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import Tabs from "../../components/common/Tabs";

const TenantEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateTenantRequest>({
    name: "",
    isActive: true,
    companyName: "",
    taxNumber: "",
    address: "",
    city: "",
    country: "Türkiye",
    phone: "",
    email: "",
    website: "",
    representativeFirstName: "",
    representativeLastName: "",
    representativeTitle: "",
    representativeEmail: "",
    representativePhone: "",
    itContactFirstName: "",
    itContactLastName: "",
    itContactTitle: "",
    itContactEmail: "",
    itContactPhone: "",
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
        isActive: data.isActive,
        companyName: data.companyName || "",
        taxNumber: data.taxNumber || "",
        address: data.address || "",
        city: data.city || "",
        country: data.country || "Türkiye",
        phone: data.phone || "",
        email: data.email || "",
        website: data.website || "",
        representativeFirstName: data.representativeFirstName || "",
        representativeLastName: data.representativeLastName || "",
        representativeTitle: data.representativeTitle || "",
        representativeEmail: data.representativeEmail || "",
        representativePhone: data.representativePhone || "",
        itContactFirstName: data.itContactFirstName || "",
        itContactLastName: data.itContactLastName || "",
        itContactTitle: data.itContactTitle || "",
        itContactEmail: data.itContactEmail || "",
        itContactPhone: data.itContactPhone || "",
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

  if (error && !formData.name) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "basic",
      label: "Temel Bilgiler",
      icon: "📋",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Kurum Adı"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Demo Eğitim Kurumu"
            />
          </div>
        </div>
      ),
    },
    {
      id: "company",
      label: "Şirket Bilgileri",
      icon: "🏢",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Şirket Adı"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="ABC Eğitim Kurumları A.Ş."
            />

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
      ),
    },
    {
      id: "contact",
      label: "İletişim Bilgileri",
      icon: "📞",
      content: (
        <div className="space-y-6">
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
      ),
    },
    {
      id: "representative",
      label: "Şirket Temsilcisi",
      icon: "👤",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Ad"
              name="representativeFirstName"
              value={formData.representativeFirstName}
              onChange={handleInputChange}
              placeholder="Ahmet"
            />

            <Input
              label="Soyad"
              name="representativeLastName"
              value={formData.representativeLastName}
              onChange={handleInputChange}
              placeholder="Yılmaz"
            />

            <Input
              label="Ünvan"
              name="representativeTitle"
              value={formData.representativeTitle}
              onChange={handleInputChange}
              placeholder="Genel Müdür"
            />

            <Input
              label="E-posta"
              name="representativeEmail"
              type="email"
              value={formData.representativeEmail}
              onChange={handleInputChange}
              placeholder="ahmet.yilmaz@example.com"
            />

            <Input
              label="Telefon"
              name="representativePhone"
              value={formData.representativePhone}
              onChange={handleInputChange}
              placeholder="+90 555 111 2233"
            />
          </div>
        </div>
      ),
    },
    {
      id: "technical",
      label: "Bilgi İşlem Sorumlusu",
      icon: "💻",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Ad"
              name="itContactFirstName"
              value={formData.itContactFirstName}
              onChange={handleInputChange}
              placeholder="Mehmet"
            />

            <Input
              label="Soyad"
              name="itContactLastName"
              value={formData.itContactLastName}
              onChange={handleInputChange}
              placeholder="Kaya"
            />

            <Input
              label="Ünvan"
              name="itContactTitle"
              value={formData.itContactTitle}
              onChange={handleInputChange}
              placeholder="Bilgi İşlem Müdürü"
            />

            <Input
              label="E-posta"
              name="itContactEmail"
              type="email"
              value={formData.itContactEmail}
              onChange={handleInputChange}
              placeholder="mehmet.kaya@example.com"
            />

            <Input
              label="Telefon"
              name="itContactPhone"
              value={formData.itContactPhone}
              onChange={handleInputChange}
              placeholder="+90 555 444 5566"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Kurum Düzenle</h1>
        <p className="text-gray-600 mt-2">Kurum bilgilerini güncelleyin</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Form Actions - Sticky Bottom */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(`/tenants/${id}`)}
            >
              İptal
            </Button>
            
            <div className="flex gap-3">
              {activeTab !== "basic" && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    const currentIndex = tabs.findIndex(t => t.id === activeTab);
                    if (currentIndex > 0) {
                      setActiveTab(tabs[currentIndex - 1].id);
                    }
                  }}
                >
                  ← Önceki
                </Button>
              )}
              
              {activeTab !== "technical" ? (
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
                <Button type="submit" isLoading={saving}>
                  Kaydet
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TenantEditPage;
