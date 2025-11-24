import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { tenantService, TenantDto } from "../../services/api/tenantService";
import Button from "../../components/common/Button";

const TenantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<TenantDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadTenant();
    }
  }, [id]);

  const loadTenant = async () => {
    try {
      setLoading(true);
      const data = await tenantService.getTenant(id!);
      setTenant(data);
    } catch (err: any) {
      setError(err.message || "Failed to load tenant");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || "Tenant not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {tenant.companyName}
          </h1>
          <p className="text-gray-600 mt-1">{tenant.name}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/tenants/${tenant.id}/edit`}>
            <Button>Düzenle</Button>
          </Link>
          <Button variant="ghost" onClick={() => navigate("/tenants")}>
            Geri
          </Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Status Bar */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 text-sm font-semibold rounded ${
                tenant.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {tenant.isActive ? "Aktif" : "Pasif"}
            </span>
            <span className="px-3 py-1 text-sm font-semibold rounded bg-blue-100 text-blue-800">
              {tenant.subscriptionStatus}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            Oluşturulma: {new Date(tenant.createdAt).toLocaleDateString("tr-TR")}
          </span>
        </div>

        {/* Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Temel Bilgiler */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Temel Bilgiler
              </h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Slug</dt>
                  <dd className="mt-1 text-sm text-gray-900">{tenant.slug}</dd>
                </div>
                {tenant.customDomain && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Özel Domain
                    </dt>
                    <dd className="mt-1 text-sm text-blue-600">
                      {tenant.customDomain}
                    </dd>
                  </div>
                )}
                {tenant.taxNumber && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Vergi Numarası
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {tenant.taxNumber}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* İletişim Bilgileri */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                İletişim Bilgileri
              </h2>
              <dl className="space-y-3">
                {tenant.email && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      E-posta
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <a
                        href={`mailto:${tenant.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {tenant.email}
                      </a>
                    </dd>
                  </div>
                )}
                {tenant.phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Telefon
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {tenant.phone}
                    </dd>
                  </div>
                )}
                {tenant.website && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Web Sitesi
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <a
                        href={tenant.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {tenant.website}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Adres Bilgileri */}
            {(tenant.address || tenant.city || tenant.country) && (
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Adres Bilgileri
                </h2>
                <dl className="space-y-3">
                  {tenant.address && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Adres
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {tenant.address}
                      </dd>
                    </div>
                  )}
                  <div className="flex gap-6">
                    {tenant.city && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Şehir
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {tenant.city}
                        </dd>
                      </div>
                    )}
                    {tenant.country && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Ülke
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {tenant.country}
                        </dd>
                      </div>
                    )}
                  </div>
                </dl>
              </div>
            )}

            {/* Şirket Temsilcisi */}
            {(tenant.representativeFirstName || tenant.representativeLastName || 
              tenant.representativeEmail || tenant.representativePhone) && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>👤</span>
                  Şirket Temsilcisi
                </h2>
                <dl className="space-y-3">
                  {(tenant.representativeFirstName || tenant.representativeLastName) && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Ad Soyad
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {tenant.representativeFirstName} {tenant.representativeLastName}
                      </dd>
                    </div>
                  )}
                  {tenant.representativeTitle && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Ünvan
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {tenant.representativeTitle}
                      </dd>
                    </div>
                  )}
                  {tenant.representativeEmail && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        E-posta
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <a
                          href={`mailto:${tenant.representativeEmail}`}
                          className="text-blue-600 hover:underline"
                        >
                          {tenant.representativeEmail}
                        </a>
                      </dd>
                    </div>
                  )}
                  {tenant.representativePhone && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Telefon
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {tenant.representativePhone}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Bilgi İşlem Sorumlusu */}
            {(tenant.itContactFirstName || tenant.itContactLastName || 
              tenant.itContactEmail || tenant.itContactPhone) && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>💻</span>
                  Bilgi İşlem Sorumlusu
                </h2>
                <dl className="space-y-3">
                  {(tenant.itContactFirstName || tenant.itContactLastName) && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Ad Soyad
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {tenant.itContactFirstName} {tenant.itContactLastName}
                      </dd>
                    </div>
                  )}
                  {tenant.itContactTitle && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Ünvan
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {tenant.itContactTitle}
                      </dd>
                    </div>
                  )}
                  {tenant.itContactEmail && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        E-posta
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <a
                          href={`mailto:${tenant.itContactEmail}`}
                          className="text-blue-600 hover:underline"
                        >
                          {tenant.itContactEmail}
                        </a>
                      </dd>
                    </div>
                  )}
                  {tenant.itContactPhone && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Telefon
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {tenant.itContactPhone}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* License Info */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Lisans Durumu
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {tenant.subscriptionStartDate && (
                  <>Başlangıç: {new Date(tenant.subscriptionStartDate).toLocaleDateString("tr-TR")}</>
                )}
                {tenant.subscriptionEndDate && (
                  <> · Bitiş: {new Date(tenant.subscriptionEndDate).toLocaleDateString("tr-TR")}</>
                )}
              </p>
            </div>
            <Button size="sm" variant="secondary">
              Lisans Yönetimi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDetailPage;

