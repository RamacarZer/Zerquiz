import React, { useMemo, useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Download,
  Globe2,
  Layers,
  UploadCloud,
  Shield,
  PenLine,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  demoContracts,
  contractTemplates,
  getContractStats,
  getExpiringContracts,
  type Contract,
  advancedContractTemplates,
  digitalSignatureProviders,
  type AdvancedContractTemplate,
  contractCustomerProfiles,
  type ContractCustomerProfile,
} from '../../mocks/contractData';

export default function ContractManagementPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | Contract['status']>('all');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [customTemplates, setCustomTemplates] = useState<AdvancedContractTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [selectedTemplateLanguage, setSelectedTemplateLanguage] = useState<'tr' | 'en'>('tr');
  const [selectedClientType, setSelectedClientType] = useState<'corporate' | 'individual' | 'author' | 'personnel' | 'platform' | 'institution'>('corporate');
  const [contractVariables, setContractVariables] = useState<Record<string, string>>({});
  const [customTemplateForm, setCustomTemplateForm] = useState({
    name: '',
    category: 'kvk_customer' as AdvancedContractTemplate['category'],
    language: 'tr' as 'tr' | 'en',
    variables: 'company_name, contact_name',
    content: '',
    description: '',
  });
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [signatureRecipients, setSignatureRecipients] = useState('yetkili@ornek.com');
  const [signatureProviderId, setSignatureProviderId] = useState(digitalSignatureProviders[0].id);
  const [signatureSummary, setSignatureSummary] = useState<string | null>(null);
  const [customerProfiles, setCustomerProfiles] = useState<ContractCustomerProfile[]>(contractCustomerProfiles);
  const [selectedCustomerProfileId, setSelectedCustomerProfileId] = useState<string>('');
  const [customCustomerForm, setCustomCustomerForm] = useState({
    label: '',
    type: 'corporate' as ContractCustomerProfile['type'],
    contactPerson: '',
    description: '',
    defaults: 'company_name=Yeni Şirket,contact_name=Yetkili',
  });
  const [customContractCategories, setCustomContractCategories] = useState<
    Array<{ id: string; name: string; icon: string }>
  >([]);
  const [newCategoryForm, setNewCategoryForm] = useState({ name: '', icon: '📃' });
  
  const stats = getContractStats();
  const expiringContracts = getExpiringContracts(30);
  const enrichedTemplates = useMemo(() => [...advancedContractTemplates, ...customTemplates], [customTemplates]);
  const categoryOptions = useMemo(() => {
    const base = new Map<string, { id: string; icon: string; name: string }>();
    advancedContractTemplates.forEach((template) => {
      base.set(template.category, { id: template.category, icon: template.icon, name: template.name });
    });
    customContractCategories.forEach((category) => {
      base.set(category.id, category);
    });
    return Array.from(base.values());
  }, [customContractCategories]);
  const selectedAdvancedTemplate = useMemo(
    () => enrichedTemplates.find((template) => template.id === selectedTemplateId),
    [enrichedTemplates, selectedTemplateId]
  );
  const selectedLanguagePack = selectedAdvancedTemplate
    ? selectedAdvancedTemplate.languages.find((lang) => lang.code === selectedTemplateLanguage) ??
      selectedAdvancedTemplate.languages[0]
    : undefined;
  const compiledSections =
    selectedLanguagePack?.sections.map((section) => ({
      ...section,
      content: section.content.replace(/{{(.*?)}}/g, (_, key) => {
        const trimmed = key.trim();
        return contractVariables[trimmed] && contractVariables[trimmed].length > 0
          ? contractVariables[trimmed]
          : `{{${trimmed}}}`;
      }),
    })) ?? [];
  const contractVariableList = selectedAdvancedTemplate?.variables ?? [];
  const contractHasMissingValues = contractVariableList.some(
    (variable) => !(contractVariables[variable] && contractVariables[variable].trim())
  );

  const openSignatureModal = (recipients?: string) => {
    setSignatureRecipients(recipients ?? 'yetkili@ornek.com');
    setSignatureSummary(null);
    setSignatureModalOpen(true);
  };

  const handleCustomTemplateUpload = () => {
    if (!customTemplateForm.name.trim() || !customTemplateForm.content.trim()) {
      setUploadMessage('Lütfen şablon adı ve içerik girin.');
      return;
    }
    const newTemplate: AdvancedContractTemplate = {
      id: `custom-${Date.now()}`,
      category: customTemplateForm.category,
      icon: '✨',
      name: customTemplateForm.name.trim(),
      description: customTemplateForm.description.trim() || 'Kullanıcı tarafından eklenen sözleşme şablonu.',
      clientTypes: ['platform'],
      variables: customTemplateForm.variables
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      languages: [
        {
          code: customTemplateForm.language,
          label: customTemplateForm.language === 'tr' ? 'Türkçe' : 'English',
          sections: [
            {
              title: customTemplateForm.name,
              content: customTemplateForm.content,
            },
          ],
        },
      ],
      recommendedAttachments: [],
      digitalSignatureSteps: ['Taraf 1', 'Taraf 2'],
    };
    setCustomTemplates((prev) => [...prev, newTemplate]);
    setUploadMessage('Şablon başarıyla eklendi!');
    setCustomTemplateForm({
      name: '',
      category: 'kvk_customer',
      language: 'tr',
      variables: 'company_name',
      content: '',
      description: '',
    });
  };

  const handleAddCustomerProfile = () => {
    if (!customCustomerForm.label.trim()) {
      alert('Profil adı girin.');
      return;
    }
    const defaults: Record<string, string> = {};
    customCustomerForm.defaults.split(',').forEach((pair) => {
      const [key, value] = pair.split('=').map((item) => item.trim());
      if (key) defaults[key] = value ?? '';
    });
    const newProfile: ContractCustomerProfile = {
      id: `profile-${Date.now()}`,
      label: customCustomerForm.label,
      type: customCustomerForm.type,
      description: customCustomerForm.description || 'Özel müşteri profili',
      contactPerson: customCustomerForm.contactPerson || 'Yetkili',
      defaults,
    };
    setCustomerProfiles((prev) => [...prev, newProfile]);
    setSelectedCustomerProfileId(newProfile.id);
    setCustomCustomerForm({
      label: '',
      type: 'corporate',
      contactPerson: '',
      description: '',
      defaults: 'company_name=Yeni Şirket',
    });
  };

  const handleAddCustomCategory = () => {
    if (!newCategoryForm.name.trim()) return;
    const id = newCategoryForm.name.toLowerCase().replace(/\s+/g, '-');
    setCustomContractCategories((prev) => [...prev, { id, name: newCategoryForm.name, icon: newCategoryForm.icon }]);
    setNewCategoryForm({ name: '', icon: '📃' });
  };

  const handleSignatureSend = () => {
    if (!selectedAdvancedTemplate) return;
    if (!signatureRecipients.trim()) {
      setSignatureSummary('Lütfen imza daveti için alıcı e-postalarını girin.');
      return;
    }
    setSignatureSummary(
      `${selectedAdvancedTemplate.name} sözleşmesi ${signatureRecipients} adreslerine ${digitalSignatureProviders.find(
        (p) => p.id === signatureProviderId
      )?.name} üzerinden gönderildi.`
    );
  };

  useEffect(() => {
    if (enrichedTemplates.length === 0) return;
    if (!selectedTemplateId || !enrichedTemplates.find((tpl) => tpl.id === selectedTemplateId)) {
      const first = enrichedTemplates[0];
      setSelectedTemplateId(first.id);
      setSelectedTemplateLanguage(first.languages[0].code as 'tr' | 'en');
      setSelectedClientType(first.clientTypes[0] ?? 'corporate');
      const defaults: Record<string, string> = {};
      first.variables.forEach((variable) => (defaults[variable] = ''));
      setContractVariables(defaults);
    }
  }, [enrichedTemplates, selectedTemplateId]);

  useEffect(() => {
    if (!selectedAdvancedTemplate) return;
    setSelectedTemplateLanguage(selectedAdvancedTemplate.languages[0].code as 'tr' | 'en');
    setSelectedClientType(selectedAdvancedTemplate.clientTypes[0] ?? 'corporate');
    const defaults: Record<string, string> = {};
    selectedAdvancedTemplate.variables.forEach((variable) => {
      defaults[variable] = contractVariables[variable] ?? '';
    });
    setContractVariables(defaults);
  }, [selectedAdvancedTemplate?.id]);

  useEffect(() => {
    if (!selectedAdvancedTemplate) return;
    const allowedProfiles = customerProfiles.filter((profile) =>
      selectedAdvancedTemplate.clientTypes.includes(profile.type)
    );
    if (allowedProfiles.length === 0) {
      setSelectedCustomerProfileId('');
      return;
    }
    if (!allowedProfiles.find((profile) => profile.id === selectedCustomerProfileId)) {
      setSelectedCustomerProfileId(allowedProfiles[0].id);
    }
  }, [selectedAdvancedTemplate, customerProfiles, selectedCustomerProfileId]);

  useEffect(() => {
    if (!selectedAdvancedTemplate) return;
    if (!selectedCustomerProfileId) return;
    const profile = customerProfiles.find((item) => item.id === selectedCustomerProfileId);
    if (!profile) return;
    setSelectedClientType(profile.type);
    setContractVariables((prev) => {
      const next = { ...prev };
      Object.entries(profile.defaults).forEach(([key, value]) => {
        if (next[key] !== undefined) next[key] = value;
      });
      return next;
    });
  }, [selectedCustomerProfileId, customerProfiles, selectedAdvancedTemplate?.id]);
  
  const filteredContracts = filterStatus === 'all'
    ? demoContracts
    : demoContracts.filter(c => c.status === filterStatus);

  const getStatusBadge = (status: Contract['status']) => {
    switch (status) {
      case 'active':
        return <span className="text-xs px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">✓ Aktif</span>;
      case 'pending_review':
        return <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">⏳ İncelemede</span>;
      case 'draft':
        return <span className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded-full font-medium">📝 Taslak</span>;
      case 'expired':
        return <span className="text-xs px-3 py-1 bg-red-100 text-red-800 rounded-full font-medium">✗ Süresi Doldu</span>;
      case 'terminated':
        return <span className="text-xs px-3 py-1 bg-red-100 text-red-800 rounded-full font-medium">⚠ Sonlandırıldı</span>;
    }
  };

  const getTypeLabel = (type: Contract['type']) => {
    switch (type) {
      case 'subscription': return '📋 Abonelik';
      case 'license': return '🔑 Lisans';
      case 'partnership': return '🤝 Ortaklık';
      case 'nda': return '🔒 Gizlilik';
      case 'employment': return '👤 İstihdam';
    }
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sözleşme Yönetimi</h1>
                <p className="text-sm text-gray-600">Tüm sözleşmelerinizi tek yerden yönetin</p>
              </div>
            </div>

            <button
              onClick={() => alert('Yeni sözleşme oluşturuluyor...')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              <Plus className="h-4 w-4" />
              Yeni Sözleşme
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-xs text-gray-600 mb-1">Toplam</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-4">
            <div className="text-xs text-green-600 mb-1">Aktif</div>
            <div className="text-2xl font-bold text-green-900">{stats.active}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
            <div className="text-xs text-yellow-600 mb-1">İncelemede</div>
            <div className="text-2xl font-bold text-yellow-900">{stats.pendingReview}</div>
          </div>
          <div className="bg-red-50 rounded-lg border border-red-200 p-4">
            <div className="text-xs text-red-600 mb-1">Yakında Sona Erecek</div>
            <div className="text-2xl font-bold text-red-900">{stats.expiringSoon}</div>
          </div>
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <div className="text-xs text-blue-600 mb-1">Toplam Değer</div>
            <div className="text-lg font-bold text-blue-900">{stats.totalValue.toLocaleString()} ₺</div>
          </div>
        </div>

        {/* Expiring Soon Alert */}
        {expiringContracts.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="font-semibold text-yellow-900">Dikkat!</div>
                <div className="text-sm text-yellow-800">
                  {expiringContracts.length} sözleşmenin süresi 30 gün içinde dolacak.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Tümü ({demoContracts.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'active' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Aktif ({stats.active})
            </button>
            <button
              onClick={() => setFilterStatus('pending_review')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === 'pending_review' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              İncelemede ({stats.pendingReview})
            </button>
          </div>
        </div>

        {/* Template Builder */}
        {selectedAdvancedTemplate && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold">
                <Layers className="h-4 w-4" />
                Sözleşme Tipleri
              </div>
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {enrichedTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={`w-full text-left border rounded-lg p-3 transition ${
                      template.id === selectedTemplateId
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl mr-2">{template.icon}</span>
                      <span className="text-xs text-gray-500">
                        {template.languages.map((lang) => lang.label).join(' / ')}
                      </span>
                    </div>
                    <div className="font-semibold text-gray-900 mt-1">{template.name}</div>
                    <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold mb-4">
                  <Globe2 className="h-4 w-4" />
                  Müşteri Profili Seç
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {customerProfiles
                    .filter((profile) =>
                      selectedAdvancedTemplate.clientTypes.includes(profile.type)
                    )
                    .map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => {
                          setSelectedCustomerProfileId(profile.id);
                          setSelectedClientType(profile.type);
                          setContractVariables((prev) => {
                            const next = { ...prev };
                            Object.entries(profile.defaults).forEach(([key, value]) => {
                              if (next[key] !== undefined) next[key] = value;
                            });
                            return next;
                          });
                        }}
                        className={`text-left border rounded-lg p-3 transition ${
                          selectedCustomerProfileId === profile.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900">{profile.label}</span>
                          <span className="text-xs capitalize text-gray-500">{profile.type}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{profile.description}</p>
                        <p className="text-[11px] text-gray-500 mt-1">Yetkili: {profile.contactPerson}</p>
                      </button>
                    ))}
                  {customerProfiles.filter((profile) =>
                    selectedAdvancedTemplate.clientTypes.includes(profile.type)
                  ).length === 0 && (
                    <div className="text-sm text-gray-500">
                      Bu sözleşme için uyumlu müşteri profili bulunamadı. Aşağıdan yeni profil ekleyebilirsiniz.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-600">Dil</span>
                    <div className="flex gap-2">
                      {selectedAdvancedTemplate.languages.map((language) => (
                        <button
                          key={language.code}
                          onClick={() => setSelectedTemplateLanguage(language.code)}
                          className={`px-3 py-1 text-xs rounded-full border ${
                            selectedTemplateLanguage === language.code
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {language.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-600">Müşteri Tipi</span>
                    <div className="flex gap-2 flex-wrap">
                      {selectedAdvancedTemplate.clientTypes.map((clientType) => (
                        <button
                          key={clientType}
                          onClick={() =>
                            setSelectedClientType(
                              clientType as typeof selectedClientType
                            )
                          }
                          className={`px-3 py-1 text-xs rounded-full border capitalize ${
                            selectedClientType === clientType
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {clientType}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contractVariableList.length === 0 && (
                    <div className="text-sm text-gray-500">
                      Bu şablon değişken gerektirmez.
                    </div>
                  )}
                  {contractVariableList.map((variable) => (
                    <div key={variable}>
                      <label className="text-xs text-gray-600 font-medium">
                        {variable}
                      </label>
                      <input
                        type="text"
                        value={contractVariables[variable] ?? ''}
                        onChange={(e) =>
                          setContractVariables((prev) => ({
                            ...prev,
                            [variable]: e.target.value,
                          }))
                        }
                        className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder={`{{${variable}}}`}
                      />
                    </div>
                  ))}
                </div>

                {selectedAdvancedTemplate.recommendedAttachments.length > 0 && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <div className="text-xs text-gray-500 uppercase font-semibold mb-2">
                      Önerilen Ekler
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedAdvancedTemplate.recommendedAttachments.map((attachment) => (
                        <span
                          key={attachment}
                          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                        >
                          {attachment}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold">
                    <PenLine className="h-4 w-4" />
                    Dinamik Ön İzleme
                  </div>
                  <div className="text-xs text-gray-500">
                    {contractHasMissingValues ? 'Tüm alanları doldurun' : 'Hazır'}
                  </div>
                </div>
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-4 max-h-72 overflow-y-auto space-y-4">
                  {compiledSections.map((section, index) => (
                    <div key={index}>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                        {section.title}
                      </div>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">
                        {section.content}
                      </p>
                    </div>
                  ))}
                  {compiledSections.length === 0 && (
                    <div className="text-sm text-gray-500">
                      Bu dil için içerik bulunamadı.
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => alert('PDF ön izlemesi hazırlanıyor...')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                  >
                    PDF Ön İzleme
                  </button>
                  <button
                    onClick={() => openSignatureModal()}
                    disabled={contractHasMissingValues}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium disabled:opacity-50"
                  >
                    Dijital İmza Akışını Başlat
                  </button>
                  <button
                    onClick={() => alert('Taslak sözleşme oluşturuldu.')}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
                  >
                    Taslak Kaydet
                  </button>
                </div>

                {selectedAdvancedTemplate.digitalSignatureSteps.length > 0 && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Dijital İmza Adımları
                    </div>
                    <ol className="space-y-2">
                      {selectedAdvancedTemplate.digitalSignatureSteps.map((step, index) => (
                        <li key={step} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                          {index + 1}. {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Signature Providers & Template Upload */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold mb-4">
              <Shield className="h-4 w-4" />
              Dijital İmza Sağlayıcıları
            </div>
            <div className="space-y-3">
              {digitalSignatureProviders.map((provider) => (
                <label
                  key={provider.id}
                  className={`flex items-center gap-4 border rounded-lg p-3 cursor-pointer transition ${
                    signatureProviderId === provider.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="signature-provider"
                    checked={signatureProviderId === provider.id}
                    onChange={() => setSignatureProviderId(provider.id)}
                    className="text-indigo-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{provider.logo}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{provider.name}</div>
                        <div className="text-xs text-gray-500">
                          {provider.country} • Başarı {provider.successRate}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full">{provider.avgTurnaround} ortalama</span>
                      {provider.compliance.map((item) => (
                        <span key={item} className="px-2 py-0.5 bg-gray-100 rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold">
              <UploadCloud className="h-4 w-4" />
              Kendi Şablonunu Ekle
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-600 font-medium">Şablon Adı</label>
                <input
                  type="text"
                  value={customTemplateForm.name}
                  onChange={(e) => setCustomTemplateForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 font-medium">Kategori</label>
                <select
                  value={customTemplateForm.category}
                  onChange={(e) =>
                    setCustomTemplateForm((prev) => ({
                      ...prev,
                      category: e.target.value as AdvancedContractTemplate['category'],
                    }))
                  }
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {categoryOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2 mt-2">
                  <input
                    placeholder="Yeni kategori adı"
                    value={newCategoryForm.name}
                    onChange={(e) => setNewCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    placeholder="İkon"
                    value={newCategoryForm.icon}
                    onChange={(e) => setNewCategoryForm((prev) => ({ ...prev, icon: e.target.value }))}
                    className="w-16 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                  />
                  <button
                    onClick={handleAddCustomCategory}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs"
                  >
                    Ekle
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-600 font-medium">Dil</label>
                <select
                  value={customTemplateForm.language}
                  onChange={(e) =>
                    setCustomTemplateForm((prev) => ({ ...prev, language: e.target.value as 'tr' | 'en' }))
                  }
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 font-medium">Değişkenler (virgülle)</label>
                <input
                  type="text"
                  value={customTemplateForm.variables}
                  onChange={(e) => setCustomTemplateForm((prev) => ({ ...prev, variables: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 font-medium">Açıklama</label>
              <input
                type="text"
                value={customTemplateForm.description}
                onChange={(e) => setCustomTemplateForm((prev) => ({ ...prev, description: e.target.value }))}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 font-medium">Şablon İçeriği</label>
              <textarea
                value={customTemplateForm.content}
                onChange={(e) => setCustomTemplateForm((prev) => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Sözleşme içeriğini girin. Değişkenleri {{variable}} formatında kullanabilirsiniz."
              />
            </div>
            {uploadMessage && (
              <div className="text-xs text-green-600">{uploadMessage}</div>
            )}
            <button
              onClick={handleCustomTemplateUpload}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
            >
              Şablonu Kaydet
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold">
              <Globe2 className="h-4 w-4" />
              Yeni Müşteri Tipi Ekle
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-600 font-medium">Profil Adı</label>
                <input
                  type="text"
                  value={customCustomerForm.label}
                  onChange={(e) => setCustomCustomerForm((prev) => ({ ...prev, label: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 font-medium">Tür</label>
                <select
                  value={customCustomerForm.type}
                  onChange={(e) =>
                    setCustomCustomerForm((prev) => ({
                      ...prev,
                      type: e.target.value as ContractCustomerProfile['type'],
                    }))
                  }
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
                >
                  {['corporate', 'individual', 'author', 'personnel', 'platform', 'institution'].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 font-medium">Yetkili</label>
                <input
                  type="text"
                  value={customCustomerForm.contactPerson}
                  onChange={(e) => setCustomCustomerForm((prev) => ({ ...prev, contactPerson: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 font-medium">Açıklama</label>
                <input
                  type="text"
                  value={customCustomerForm.description}
                  onChange={(e) => setCustomCustomerForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 font-medium">Varsayılan Değerler (key=value, ...)</label>
              <textarea
                value={customCustomerForm.defaults}
                onChange={(e) => setCustomCustomerForm((prev) => ({ ...prev, defaults: e.target.value }))}
                rows={3}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleAddCustomerProfile}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
            >
              Profil Ekle
            </button>
          </div>
        </div>

        {/* Contracts List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredContracts.map((contract) => {
            const daysLeft = getDaysUntilExpiry(contract.endDate);
            const isExpiringSoon = daysLeft <= 30 && daysLeft > 0;
            
            return (
              <div key={contract.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{contract.title}</h3>
                      {getStatusBadge(contract.status)}
                      {isExpiringSoon && (
                        <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                          ⏰ {daysLeft} gün kaldı
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{getTypeLabel(contract.type)}</span>
                      <span>•</span>
                      <span>{contract.value.toLocaleString()} {contract.currency}</span>
                      <span>•</span>
                      <span>{contract.parties.length} taraf</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Başlangıç</div>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(contract.startDate).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Bitiş</div>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(contract.endDate).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">İmza Durumu</div>
                    <div className="text-sm font-medium text-gray-900">
                      {contract.signatures.filter(s => s.status === 'signed').length} / {contract.signatures.length} imzalandı
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Ekler</div>
                    <div className="text-sm font-medium text-gray-900">
                      {contract.attachments.length} dosya
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedContract(contract)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                  >
                    <Eye className="h-4 w-4" />
                    Detayları Gör
                  </button>
                  <button
                    onClick={() => alert(`${contract.title} indiriliyor...`)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    title="İndir"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedContract(null)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full p-6">
              <button
                onClick={() => setSelectedContract(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedContract.title}</h2>

              <div className="space-y-6">
                {/* Taraflar */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Taraflar</h3>
                  <div className="space-y-2">
                    {selectedContract.parties.map((party) => (
                      <div key={party.id} className="bg-gray-50 rounded p-3">
                        <div className="font-medium text-gray-900">{party.name}</div>
                        <div className="text-sm text-gray-600">{party.role} • {party.email}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* İmzalar */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">İmza Durumu</h3>
                  <div className="space-y-2">
                    {selectedContract.signatures.map((sig) => (
                      <div key={sig.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium text-gray-900">{sig.partyName}</div>
                          {sig.signedAt && (
                            <div className="text-xs text-gray-600">
                              {new Date(sig.signedAt).toLocaleString('tr-TR')}
                            </div>
                          )}
                        </div>
                        {sig.status === 'signed' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      openSignatureModal(
                        selectedContract.parties.map((party) => party.email).join(', ')
                      )
                    }
                    className="mt-3 text-xs px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Dijital İmza İste
                  </button>
                </div>

                {/* Şartlar */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Sözleşme Şartları</h3>
                  <div className="bg-gray-50 rounded p-4 text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedContract.terms}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => alert('Sözleşme indiriliyor...')}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Sözleşmeyi İndir
                </button>
                <button
                  onClick={() => setSelectedContract(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      {signatureModalOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSignatureModalOpen(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
              <button
                onClick={() => setSignatureModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold mb-4">
                <PenLine className="h-5 w-5" />
                Dijital İmza Akışı
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-600 font-medium">Alıcı E-postaları</label>
                  <input
                    value={signatureRecipients}
                    onChange={(e) => setSignatureRecipients(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="yetkili@firma.com, ik@firma.com"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 font-medium">İmza Sağlayıcısı</label>
                  <div className="mt-2 flex flex-col gap-2">
                    {digitalSignatureProviders.map((provider) => (
                      <label key={provider.id} className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="radio"
                          name="modal-signature-provider"
                          checked={signatureProviderId === provider.id}
                          onChange={() => setSignatureProviderId(provider.id)}
                          className="text-indigo-600"
                        />
                        <span className="font-medium">{provider.logo} {provider.name}</span>
                        <span className="text-xs text-gray-500">{provider.avgTurnaround} • {provider.successRate}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleSignatureSend}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
                >
                  Daveti Gönder
                </button>
                {signatureSummary && (
                  <div className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg p-3">
                    {signatureSummary}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

