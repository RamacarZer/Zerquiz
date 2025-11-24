import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  tenantService,
  CreateTenantRequest,
} from "../../services/api/tenantService";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import Tabs from "../../components/common/Tabs";

const TenantCreatePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateTenantRequest>({
    name: "",
    slug: "",
    companyName: "",
    taxNumber: "",
    address: "",
    city: "",
    country: "Türkiye",
    phone: "",
    email: "",
    website: "",
    // Representative
    representativeFirstName: "",
    representativeLastName: "",
    representativeTitle: "",
    representativeEmail: "",
    representativePhone: "",
    // Technical Contact
    itContactFirstName: "",
    itContactLastName: "",
    itContactTitle: "",
    itContactEmail: "",
    itContactPhone: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug from name
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await tenantService.createTenant(formData);
      navigate("/tenants");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create tenant");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: "basic",
      label: "Temel Bilgiler",
      icon: "📋",
      content: (
        <div className="space-y-6">
          {/* Temel Bilgiler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Kurum Adı"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Demo Eğitim Kurumu"
            />

            <Input
              label="Slug (URL Adı)"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              required
              placeholder="demo-egitim"
              helperText="URL'de kullanılacak benzersiz isim"
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
        <h1 className="text-3xl font-bold text-gray-800">Yeni Kurum Ekle</h1>
        <p className="text-gray-600 mt-2">
          Yeni bir kurum oluşturun ve detaylarını girin
        </p>
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
              onClick={() => navigate("/tenants")}
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
                <Button type="submit" isLoading={loading}>
                  Oluştur
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TenantCreatePage;
