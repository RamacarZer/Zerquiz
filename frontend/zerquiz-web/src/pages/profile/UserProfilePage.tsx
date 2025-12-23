import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  User, Mail, Phone, MapPin, Calendar, Building, Shield, Key, 
  Edit2, Save, X, Upload, Camera, Award, Clock, Activity,
  CreditCard, Users, Lock, Bell, Globe, Eye, EyeOff, Download,
  CheckCircle, AlertCircle, XCircle, TrendingUp, Package, FileText,
  RefreshCw, Trash2, Plus, Laptop, Smartphone, Briefcase,
  CreditCard as CardIcon, Car, Home, Tag, Search, Filter
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'nda' | 'policy' | 'certificate' | 'id' | 'other';
  category: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'pending' | 'archived';
  fileSize: string;
  fileUrl: string;
  signedBy?: string;
  signedDate?: string;
}

interface AssetAssignment {
  id: string;
  assetType: 'laptop' | 'phone' | 'tablet' | 'access_card' | 'meal_card' | 'vehicle' | 'parking' | 'office_key' | 'other';
  assetName: string;
  brand?: string;
  model?: string;
  serialNumber: string;
  assetTag: string;
  assignedDate: string;
  returnDate?: string;
  status: 'assigned' | 'returned' | 'damaged' | 'lost';
  condition: 'new' | 'good' | 'fair' | 'poor';
  value: number;
  currency: string;
  notes?: string;
  assignedBy: string;
}

interface SubscriptionPackage {
  id: string;
  name: string;
  type: 'free' | 'basic' | 'professional' | 'enterprise';
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  limits: {
    users: number;
    exams: number;
    questions: number;
    storage: string;
  };
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  packageName: string;
  billingPeriod: string;
  paymentMethod: string;
  downloadUrl?: string;
}

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'bank_transfer' | 'paypal';
  last4?: string;
  brand?: string;
  expiryDate?: string;
  isDefault: boolean;
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  tenant: string;
  license: string;
  permissions: string[];
  createdAt: string;
  lastLogin: string;
  status: 'active' | 'inactive' | 'suspended';
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  preferences: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    theme: 'light' | 'dark' | 'auto';
  };
  twoFactorEnabled: boolean;
  sessionHistory: Array<{
    id: string;
    device: string;
    location: string;
    timestamp: string;
    ip: string;
  }>;
  subscription: {
    currentPackage: SubscriptionPackage;
    startDate: string;
    renewalDate: string;
    autoRenew: boolean;
    usage: {
      users: number;
      exams: number;
      questions: number;
      storage: number;
    };
  };
  invoices: Invoice[];
  paymentMethods: PaymentMethod[];
  documents: Document[];
  assetAssignments: AssetAssignment[];
}

export default function UserProfilePage() {
  const { user, loading } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'permissions' | 'activity' | 'preferences' | 'billing' | 'documents' | 'assets'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [documentFilter, setDocumentFilter] = useState<string>('all');
  const [assetFilter, setAssetFilter] = useState<string>('all');
  
  // Initialize profile state
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Update profile when user data is available
  useEffect(() => {
    if (user) {
      setProfile({
        id: user.id || 'user-001',
        firstName: user.name?.split(' ')[0] || 'Admin',
        lastName: user.name?.split(' ').slice(1).join(' ') || 'ZerQuiz',
        email: user.email || 'superadmin@zerquiz.com',
        phone: '+90 555 123 4567',
        avatar: 'https://i.pravatar.cc/150?img=12',
        role: user.roles?.[0] || 'Super Admin',
        tenant: user.tenantId || 'Zerquiz Headquarters',
        license: 'Enterprise Pro',
        permissions: user.permissions || ['*'],
        createdAt: '2023-01-15T10:30:00Z',
        lastLogin: new Date().toISOString(),
        status: 'active',
    address: {
      street: 'Atatürk Cad. No: 123/5',
      city: 'İstanbul',
      state: 'Kadıköy',
      country: 'Türkiye',
      postalCode: '34710'
    },
    preferences: {
      language: 'tr',
      timezone: 'Europe/Istanbul',
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      theme: 'light'
    },
    twoFactorEnabled: true,
    sessionHistory: [
      { id: 's1', device: 'Chrome - Windows 11', location: 'İstanbul, TR', timestamp: '2025-01-28T14:22:00Z', ip: '192.168.1.100' },
      { id: 's2', device: 'Safari - iPhone 14', location: 'Ankara, TR', timestamp: '2025-01-27T09:15:00Z', ip: '192.168.1.101' },
      { id: 's3', device: 'Firefox - Ubuntu 22', location: 'İzmir, TR', timestamp: '2025-01-25T16:40:00Z', ip: '192.168.1.102' }
    ],
    subscription: {
      currentPackage: {
        id: 'pkg-enterprise',
        name: 'Enterprise Pro',
        type: 'enterprise',
        price: 4999,
        currency: 'TRY',
        billingPeriod: 'yearly',
        features: [
          'Sınırsız kullanıcı',
          'Sınırsız sınav',
          'Sınırsız soru',
          '1 TB depolama',
          '7/24 öncelikli destek',
          'Özel eğitim',
          'API erişimi',
          'Beyaz etiket',
          'Gelişmiş raporlama',
          'SSO entegrasyonu'
        ],
        limits: {
          users: -1, // unlimited
          exams: -1,
          questions: -1,
          storage: '1 TB'
        }
      },
      startDate: '2024-01-01T00:00:00Z',
      renewalDate: '2026-01-01T00:00:00Z',
      autoRenew: true,
      usage: {
        users: 247,
        exams: 1523,
        questions: 15847,
        storage: 456 // GB
      }
    },
    invoices: [
      {
        id: 'inv-001',
        invoiceNumber: 'INV-2025-001',
        date: '2025-01-01T00:00:00Z',
        dueDate: '2025-01-15T00:00:00Z',
        amount: 4999,
        currency: 'TRY',
        status: 'paid',
        packageName: 'Enterprise Pro',
        billingPeriod: 'Yıllık (2025-2026)',
        paymentMethod: 'Kredi Kartı (**** 1234)',
        downloadUrl: '#'
      },
      {
        id: 'inv-002',
        invoiceNumber: 'INV-2024-012',
        date: '2024-12-01T00:00:00Z',
        dueDate: '2024-12-15T00:00:00Z',
        amount: 499,
        currency: 'TRY',
        status: 'paid',
        packageName: 'Professional',
        billingPeriod: 'Aylık (Aralık 2024)',
        paymentMethod: 'Banka Transferi',
        downloadUrl: '#'
      },
      {
        id: 'inv-003',
        invoiceNumber: 'INV-2024-011',
        date: '2024-11-01T00:00:00Z',
        dueDate: '2024-11-15T00:00:00Z',
        amount: 499,
        currency: 'TRY',
        status: 'paid',
        packageName: 'Professional',
        billingPeriod: 'Aylık (Kasım 2024)',
        paymentMethod: 'Kredi Kartı (**** 1234)',
        downloadUrl: '#'
      },
      {
        id: 'inv-004',
        invoiceNumber: 'INV-2024-010',
        date: '2024-10-01T00:00:00Z',
        dueDate: '2024-10-15T00:00:00Z',
        amount: 499,
        currency: 'TRY',
        status: 'paid',
        packageName: 'Professional',
        billingPeriod: 'Aylık (Ekim 2024)',
        paymentMethod: 'Kredi Kartı (**** 1234)',
        downloadUrl: '#'
      }
    ],
    paymentMethods: [
      {
        id: 'pm-1',
        type: 'credit_card',
        last4: '1234',
        brand: 'Visa',
        expiryDate: '12/26',
        isDefault: true
      },
      {
        id: 'pm-2',
        type: 'credit_card',
        last4: '5678',
        brand: 'Mastercard',
        expiryDate: '08/25',
        isDefault: false
      }
    ],
    documents: [
      {
        id: 'doc-001',
        name: 'İş Sözleşmesi',
        type: 'contract',
        category: 'Çalışan Sözleşmeleri',
        uploadDate: '2023-01-15T00:00:00Z',
        expiryDate: '2025-01-15T00:00:00Z',
        status: 'active',
        fileSize: '2.3 MB',
        fileUrl: '#',
        signedBy: 'Ahmet Yılmaz & İK Müdürü',
        signedDate: '2023-01-15T00:00:00Z'
      },
      {
        id: 'doc-002',
        name: 'Gizlilik Sözleşmesi (NDA)',
        type: 'nda',
        category: 'Gizlilik ve Uyum',
        uploadDate: '2023-01-15T00:00:00Z',
        status: 'active',
        fileSize: '1.1 MB',
        fileUrl: '#',
        signedBy: 'Ahmet Yılmaz',
        signedDate: '2023-01-15T00:00:00Z'
      },
      {
        id: 'doc-003',
        name: 'Telif Hakları Sözleşmesi',
        type: 'contract',
        category: 'Telif ve Yayın',
        uploadDate: '2023-02-01T00:00:00Z',
        expiryDate: '2026-02-01T00:00:00Z',
        status: 'active',
        fileSize: '1.8 MB',
        fileUrl: '#',
        signedBy: 'Ahmet Yılmaz & Hukuk Departmanı',
        signedDate: '2023-02-01T00:00:00Z'
      },
      {
        id: 'doc-004',
        name: 'KVKK Aydınlatma Metni',
        type: 'policy',
        category: 'Veri Koruma',
        uploadDate: '2023-01-15T00:00:00Z',
        status: 'active',
        fileSize: '856 KB',
        fileUrl: '#',
        signedBy: 'Ahmet Yılmaz',
        signedDate: '2023-01-15T00:00:00Z'
      },
      {
        id: 'doc-005',
        name: 'Sağlık Raporu',
        type: 'certificate',
        category: 'Sağlık Belgeleri',
        uploadDate: '2024-01-10T00:00:00Z',
        expiryDate: '2025-01-10T00:00:00Z',
        status: 'active',
        fileSize: '654 KB',
        fileUrl: '#'
      },
      {
        id: 'doc-006',
        name: 'İmza Sirküleri',
        type: 'other',
        category: 'Yetki Belgeleri',
        uploadDate: '2023-03-01T00:00:00Z',
        status: 'active',
        fileSize: '1.2 MB',
        fileUrl: '#'
      },
      {
        id: 'doc-007',
        name: 'Eski İş Sözleşmesi',
        type: 'contract',
        category: 'Çalışan Sözleşmeleri',
        uploadDate: '2021-01-01T00:00:00Z',
        expiryDate: '2023-01-01T00:00:00Z',
        status: 'archived',
        fileSize: '2.1 MB',
        fileUrl: '#',
        signedBy: 'Ahmet Yılmaz & Eski İşveren',
        signedDate: '2021-01-01T00:00:00Z'
      }
    ],
    assetAssignments: [
      {
        id: 'asset-001',
        assetType: 'laptop',
        assetName: 'Dell Latitude 7420',
        brand: 'Dell',
        model: 'Latitude 7420',
        serialNumber: 'DL7420-2023-1234',
        assetTag: 'IT-LP-001',
        assignedDate: '2023-01-20T00:00:00Z',
        status: 'assigned',
        condition: 'good',
        value: 35000,
        currency: 'TRY',
        notes: 'i7-11850H, 16GB RAM, 512GB SSD',
        assignedBy: 'IT Departmanı'
      },
      {
        id: 'asset-002',
        assetType: 'phone',
        assetName: 'iPhone 13 Pro',
        brand: 'Apple',
        model: 'iPhone 13 Pro',
        serialNumber: 'APPLE-IP13P-5678',
        assetTag: 'IT-PH-042',
        assignedDate: '2023-02-01T00:00:00Z',
        status: 'assigned',
        condition: 'good',
        value: 25000,
        currency: 'TRY',
        notes: '256GB, Gri',
        assignedBy: 'IT Departmanı'
      },
      {
        id: 'asset-003',
        assetType: 'access_card',
        assetName: 'Bina Giriş Kartı',
        serialNumber: 'ACC-2023-001',
        assetTag: 'SEC-AC-001',
        assignedDate: '2023-01-15T00:00:00Z',
        status: 'assigned',
        condition: 'new',
        value: 150,
        currency: 'TRY',
        notes: 'Tüm katlara erişim yetkisi',
        assignedBy: 'Güvenlik'
      },
      {
        id: 'asset-004',
        assetType: 'meal_card',
        assetName: 'Yemek Kartı - Multinet',
        brand: 'Multinet',
        serialNumber: 'MN-2023-9876',
        assetTag: 'HR-MC-023',
        assignedDate: '2023-01-15T00:00:00Z',
        status: 'assigned',
        condition: 'new',
        value: 0,
        currency: 'TRY',
        notes: 'Aylık 1.500 TL yükleme',
        assignedBy: 'İnsan Kaynakları'
      },
      {
        id: 'asset-005',
        assetType: 'parking',
        assetName: 'Otopark Kartı - B Blok',
        serialNumber: 'PRK-B-045',
        assetTag: 'FAC-PK-045',
        assignedDate: '2023-01-15T00:00:00Z',
        status: 'assigned',
        condition: 'good',
        value: 0,
        currency: 'TRY',
        notes: 'B Blok Kapalı Otopark, Slot #45',
        assignedBy: 'İdari İşler'
      },
      {
        id: 'asset-006',
        assetType: 'tablet',
        assetName: 'iPad Pro 11"',
        brand: 'Apple',
        model: 'iPad Pro 11" (2021)',
        serialNumber: 'APPLE-IPAD-3344',
        assetTag: 'IT-TB-012',
        assignedDate: '2023-06-01T00:00:00Z',
        status: 'assigned',
        condition: 'new',
        value: 18000,
        currency: 'TRY',
        notes: '128GB, WiFi + Cellular, Apple Pencil dahil',
        assignedBy: 'IT Departmanı'
      },
      {
        id: 'asset-007',
        assetType: 'phone',
        assetName: 'Samsung Galaxy S21',
        brand: 'Samsung',
        model: 'Galaxy S21',
        serialNumber: 'SAM-S21-9999',
        assetTag: 'IT-PH-028',
        assignedDate: '2022-03-01T00:00:00Z',
        returnDate: '2023-02-01T00:00:00Z',
        status: 'returned',
        condition: 'good',
        value: 18000,
        currency: 'TRY',
        notes: 'iPhone 13 Pro ile değiştirildi',
        assignedBy: 'IT Departmanı'
      }
    ]
      });
    }
  }, [user]); // Re-run when user changes

  const [formData, setFormData] = useState<UserProfile | null>(null);
  
  // Update formData when profile changes
  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Show loading state
  if (loading || !profile || !formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Profil yükleniyor...</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (formData) {
      setProfile(formData);
      setIsEditing(false);
      alert('✅ Profil başarıyla güncellendi!');
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData(profile);
      setIsEditing(false);
    }
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('❌ Yeni şifreler eşleşmiyor!');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('❌ Şifre en az 8 karakter olmalıdır!');
      return;
    }
    alert('✅ Şifre başarıyla değiştirildi!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleAvatarUpload = () => {
    alert('📸 Avatar yükleme özelliği yakında aktif olacak!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'profile', label: 'Profil Bilgileri', icon: User },
    { id: 'security', label: 'Güvenlik', icon: Lock },
    { id: 'permissions', label: 'Yetkiler & Roller', icon: Shield },
    { id: 'billing', label: 'Üyelik & Faturalar', icon: CreditCard },
    { id: 'documents', label: 'Dokümanlar', icon: FileText },
    { id: 'assets', label: 'Zimmetler', icon: Briefcase },
    { id: 'activity', label: 'Aktivite', icon: Activity },
    { id: 'preferences', label: 'Tercihler', icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                <button
                  onClick={handleAvatarUpload}
                  className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{profile.firstName} {profile.lastName}</h1>
                <p className="text-blue-100 mt-1">{profile.email}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                    {profile.role}
                  </span>
                  <span className="px-3 py-1 bg-green-500 bg-opacity-80 rounded-full text-sm font-medium">
                    {profile.status === 'active' ? '🟢 Aktif' : '🔴 Pasif'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100 mb-1">Son Giriş</div>
              <div className="text-lg font-medium">{formatDate(profile.lastLogin)}</div>
              <div className="text-sm text-blue-100 mt-2">Kayıt Tarihi</div>
              <div className="text-base font-medium">{formatDate(profile.createdAt)}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Profil Bilgileri</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  Düzenle
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    İptal
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    Kaydet
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ülke</label>
                <input
                  type="text"
                  value={formData.address.country}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <Building className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-xs text-gray-600">Kurum</div>
                  <div className="text-sm font-medium text-gray-900">{profile.tenant}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                <CreditCard className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-xs text-gray-600">Lisans</div>
                  <div className="text-sm font-medium text-gray-900">{profile.license}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-xs text-gray-600">Rol</div>
                  <div className="text-sm font-medium text-gray-900">{profile.role}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Güvenlik Ayarları</h2>

            {/* Password Change */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Şifre Değiştir</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Şifre</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre (Tekrar)</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handlePasswordChange}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Şifreyi Değiştir
                </button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">İki Faktörlü Doğrulama</h3>
                  <p className="text-sm text-gray-600">Hesabınızı ekstra koruma katmanı ile güvence altına alın</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.twoFactorEnabled}
                    onChange={() => {
                      setProfile({ ...profile, twoFactorEnabled: !profile.twoFactorEnabled });
                      alert(profile.twoFactorEnabled ? '🔓 2FA devre dışı bırakıldı' : '🔐 2FA aktif edildi');
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Active Sessions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktif Oturumlar</h3>
              <div className="space-y-3">
                {profile.sessionHistory.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{session.device}</div>
                        <div className="text-xs text-gray-600">{session.location} • {session.ip}</div>
                        <div className="text-xs text-gray-500">{formatDate(session.timestamp)}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`🚫 ${session.device} oturumu sonlandırıldı`)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Sonlandır
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Permissions Tab */}
        {activeTab === 'permissions' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Yetkiler ve Roller</h2>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Mevcut Rol</h3>
                    <p className="text-sm text-gray-600">Sistem rolünüz</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">{profile.role}</div>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <Key className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Toplam Yetki</h3>
                    <p className="text-sm text-gray-600">Sahip olduğunuz izinler</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600">{profile.permissions.length}</div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Yetki Detayları</h3>
            <div className="grid grid-cols-3 gap-3">
              {profile.permissions.map((permission) => (
                <div
                  key={permission}
                  className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-sm font-medium text-green-700 flex items-center gap-2"
                >
                  <Award className="h-4 w-4" />
                  {permission}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Billing & Subscription Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            
            {/* Current Subscription */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Mevcut Üyelik</h2>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Paketi Yükselt
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="col-span-2 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-6 w-6 text-blue-600" />
                        <h3 className="text-2xl font-bold text-gray-900">{profile.subscription.currentPackage.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Yenileme: {formatDate(profile.subscription.renewalDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        {profile.subscription.currentPackage.price.toLocaleString('tr-TR')} {profile.subscription.currentPackage.currency}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        / {profile.subscription.currentPackage.billingPeriod === 'monthly' ? 'Aylık' : 'Yıllık'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {profile.subscription.currentPackage.features.slice(0, 6).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-blue-200">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.subscription.autoRenew}
                        onChange={() => {
                          setProfile({ ...profile, subscription: { ...profile.subscription, autoRenew: !profile.subscription.autoRenew } });
                          alert(profile.subscription.autoRenew ? '🔴 Otomatik yenileme kapatıldı' : '🟢 Otomatik yenileme açıldı');
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <span className="text-sm font-medium text-gray-700">Otomatik Yenileme</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Başlangıç</div>
                    <div className="text-lg font-bold text-gray-900">{new Date(profile.subscription.startDate).toLocaleDateString('tr-TR')}</div>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Durum</div>
                    <div className="text-lg font-bold text-green-600 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Aktif
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Kalan Süre</div>
                    <div className="text-lg font-bold text-purple-600">
                      {Math.ceil((new Date(profile.subscription.renewalDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} Gün
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Statistics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kullanım İstatistikleri</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="text-xs text-gray-600">
                        {profile.subscription.currentPackage.limits.users === -1 ? 'Sınırsız' : 
                         `${profile.subscription.usage.users} / ${profile.subscription.currentPackage.limits.users}`}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{profile.subscription.usage.users.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Kullanıcı</div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <span className="text-xs text-gray-600">
                        {profile.subscription.currentPackage.limits.exams === -1 ? 'Sınırsız' : 
                         `${profile.subscription.usage.exams} / ${profile.subscription.currentPackage.limits.exams}`}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{profile.subscription.usage.exams.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Sınav</div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      <span className="text-xs text-gray-600">
                        {profile.subscription.currentPackage.limits.questions === -1 ? 'Sınırsız' : 
                         `${profile.subscription.usage.questions} / ${profile.subscription.currentPackage.limits.questions}`}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{profile.subscription.usage.questions.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Soru</div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Package className="h-5 w-5 text-yellow-600" />
                      <span className="text-xs text-gray-600">{profile.subscription.currentPackage.limits.storage}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{profile.subscription.usage.storage} GB</div>
                    <div className="text-xs text-gray-600">Depolama</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Ödeme Yöntemleri</h3>
                <button
                  onClick={() => alert('💳 Yeni ödeme yöntemi ekleme özelliği yakında!')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Yeni Ekle
                </button>
              </div>
              <div className="space-y-3">
                {profile.paymentMethods.map((method) => (
                  <div key={method.id} className={`p-4 border-2 rounded-lg flex items-center justify-between ${
                    method.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        method.type === 'credit_card' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        <CreditCard className={`h-6 w-6 ${
                          method.type === 'credit_card' ? 'text-blue-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {method.brand} •••• {method.last4}
                        </div>
                        <div className="text-xs text-gray-600">Son kullanma: {method.expiryDate}</div>
                        {method.isDefault && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                            Varsayılan
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!method.isDefault && (
                        <button
                          onClick={() => alert(`${method.brand} kartı varsayılan yapıldı`)}
                          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          Varsayılan Yap
                        </button>
                      )}
                      <button
                        onClick={() => confirm('Bu ödeme yöntemini silmek istediğinizden emin misiniz?') && alert('Ödeme yöntemi silindi')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoice History */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Fatura Geçmişi</h3>
                <button
                  onClick={() => alert('📄 Tüm faturalar Excel olarak indirilecek')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Tümünü İndir
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fatura No</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tarih</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Paket</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Dönem</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ödeme</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Tutar</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Durum</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{invoice.invoiceNumber}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{new Date(invoice.date).toLocaleDateString('tr-TR')}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{invoice.packageName}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{invoice.billingPeriod}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{invoice.paymentMethod}</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">
                          {invoice.amount.toLocaleString('tr-TR')} {invoice.currency}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                            invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            invoice.status === 'overdue' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {invoice.status === 'paid' ? <CheckCircle className="h-3 w-3" /> :
                             invoice.status === 'pending' ? <Clock className="h-3 w-3" /> :
                             invoice.status === 'overdue' ? <AlertCircle className="h-3 w-3" /> :
                             <XCircle className="h-3 w-3" />}
                            {invoice.status === 'paid' ? 'Ödendi' :
                             invoice.status === 'pending' ? 'Bekliyor' :
                             invoice.status === 'overdue' ? 'Gecikmiş' : 'İptal'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => alert(`${invoice.invoiceNumber} faturası indiriliyor...`)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            İndir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Toplam <strong>{profile.invoices.length}</strong> fatura gösteriliyor
                </div>
                <div className="text-sm text-gray-600">
                  Toplam Harcama: <strong className="text-gray-900">
                    {profile.invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString('tr-TR')} TRY
                  </strong>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Doküman Yönetimi</h2>
              <div className="flex gap-3">
                <select
                  value={documentFilter}
                  onChange={(e) => setDocumentFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tüm Dokümanlar</option>
                  <option value="contract">Sözleşmeler</option>
                  <option value="nda">Gizlilik Anlaşmaları</option>
                  <option value="policy">Politikalar</option>
                  <option value="certificate">Sertifikalar</option>
                  <option value="active">Aktif</option>
                  <option value="archived">Arşiv</option>
                </select>
                <button
                  onClick={() => alert('📤 Yeni doküman yükleme özelliği yakında!')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Yükle
                </button>
              </div>
            </div>

            {/* Document Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">
                    {profile.documents.filter(d => d.status === 'active').length}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Aktif Doküman</div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">
                    {profile.documents.filter(d => d.type === 'contract').length}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Sözleşme</div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-6 w-6 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-600">
                    {profile.documents.filter(d => d.expiryDate && new Date(d.expiryDate) < new Date(Date.now() + 30*24*60*60*1000)).length}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Yakında Sona Erecek</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <Package className="h-6 w-6 text-gray-600" />
                  <span className="text-2xl font-bold text-gray-600">
                    {profile.documents.filter(d => d.status === 'archived').length}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Arşivlenmiş</div>
              </div>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 gap-4">
              {profile.documents
                .filter(doc => documentFilter === 'all' || doc.type === documentFilter || doc.status === documentFilter)
                .map((doc) => (
                <div key={doc.id} className={`p-5 border-2 rounded-xl hover:shadow-lg transition-all ${
                  doc.status === 'active' ? 'border-blue-200 bg-blue-50' :
                  doc.status === 'expired' ? 'border-red-200 bg-red-50' :
                  doc.status === 'pending' ? 'border-yellow-200 bg-yellow-50' :
                  'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        doc.type === 'contract' ? 'bg-blue-100' :
                        doc.type === 'nda' ? 'bg-purple-100' :
                        doc.type === 'policy' ? 'bg-green-100' :
                        doc.type === 'certificate' ? 'bg-yellow-100' :
                        'bg-gray-100'
                      }`}>
                        <FileText className={`h-7 w-7 ${
                          doc.type === 'contract' ? 'text-blue-600' :
                          doc.type === 'nda' ? 'text-purple-600' :
                          doc.type === 'policy' ? 'text-green-600' :
                          doc.type === 'certificate' ? 'text-yellow-600' :
                          'text-gray-600'
                        }`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900">{doc.name}</h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            doc.status === 'active' ? 'bg-green-100 text-green-700' :
                            doc.status === 'expired' ? 'bg-red-100 text-red-700' :
                            doc.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {doc.status === 'active' ? 'Aktif' :
                             doc.status === 'expired' ? 'Süresi Doldu' :
                             doc.status === 'pending' ? 'Bekliyor' : 'Arşiv'}
                          </span>
                        </div>

                        <div className="text-sm text-gray-600 mb-2">{doc.category}</div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Yükleme: {new Date(doc.uploadDate).toLocaleDateString('tr-TR')}</span>
                          </div>
                          {doc.expiryDate && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">Bitiş: {new Date(doc.expiryDate).toLocaleDateString('tr-TR')}</span>
                            </div>
                          )}
                          {doc.signedBy && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">İmzalayan: {doc.signedBy}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Boyut: {doc.fileSize}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => alert(`${doc.name} görüntüleniyor...`)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Görüntüle"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => alert(`${doc.name} indiriliyor...`)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="İndir"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {profile.documents.filter(doc => documentFilter === 'all' || doc.type === documentFilter || doc.status === documentFilter).length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Seçili filtrede doküman bulunamadı</p>
              </div>
            )}
          </div>
        )}

        {/* Assets Tab */}
        {activeTab === 'assets' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Zimmetli Varlıklar</h2>
              <div className="flex gap-3">
                <select
                  value={assetFilter}
                  onChange={(e) => setAssetFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tümü</option>
                  <option value="laptop">Laptop</option>
                  <option value="phone">Telefon</option>
                  <option value="tablet">Tablet</option>
                  <option value="access_card">Giriş Kartı</option>
                  <option value="meal_card">Yemek Kartı</option>
                  <option value="parking">Otopark</option>
                  <option value="assigned">Zimmetli</option>
                  <option value="returned">İade Edilmiş</option>
                </select>
              </div>
            </div>

            {/* Asset Stats */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <Laptop className="h-6 w-6 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">
                    {profile.assetAssignments.filter(a => a.assetType === 'laptop' && a.status === 'assigned').length}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Laptop</div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <Smartphone className="h-6 w-6 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">
                    {profile.assetAssignments.filter(a => (a.assetType === 'phone' || a.assetType === 'tablet') && a.status === 'assigned').length}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Mobil Cihaz</div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <CardIcon className="h-6 w-6 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-600">
                    {profile.assetAssignments.filter(a => (a.assetType === 'access_card' || a.assetType === 'meal_card') && a.status === 'assigned').length}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Kart</div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <Tag className="h-6 w-6 text-yellow-600" />
                  <span className="text-2xl font-bold text-yellow-600">
                    {profile.assetAssignments.filter(a => a.status === 'assigned').length}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Aktif Zimmet</div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                  <span className="text-2xl font-bold text-red-600">
                    ₺{profile.assetAssignments.filter(a => a.status === 'assigned').reduce((sum, a) => sum + a.value, 0).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Toplam Değer</div>
              </div>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-2 gap-4">
              {profile.assetAssignments
                .filter(asset => 
                  assetFilter === 'all' || 
                  asset.assetType === assetFilter || 
                  asset.status === assetFilter
                )
                .map((asset) => {
                  const AssetIcon = 
                    asset.assetType === 'laptop' ? Laptop :
                    asset.assetType === 'phone' ? Smartphone :
                    asset.assetType === 'tablet' ? Smartphone :
                    asset.assetType === 'access_card' ? CardIcon :
                    asset.assetType === 'meal_card' ? CardIcon :
                    asset.assetType === 'parking' ? Car :
                    asset.assetType === 'office_key' ? Home :
                    Briefcase;

                  return (
                    <div key={asset.id} className={`p-5 border-2 rounded-xl hover:shadow-lg transition-all ${
                      asset.status === 'assigned' ? 'border-green-200 bg-green-50' :
                      asset.status === 'returned' ? 'border-gray-200 bg-gray-50' :
                      asset.status === 'damaged' ? 'border-orange-200 bg-orange-50' :
                      'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                          asset.assetType === 'laptop' ? 'bg-blue-100' :
                          asset.assetType === 'phone' ? 'bg-green-100' :
                          asset.assetType === 'tablet' ? 'bg-purple-100' :
                          asset.assetType === 'access_card' ? 'bg-yellow-100' :
                          asset.assetType === 'meal_card' ? 'bg-red-100' :
                          'bg-gray-100'
                        }`}>
                          <AssetIcon className={`h-7 w-7 ${
                            asset.assetType === 'laptop' ? 'text-blue-600' :
                            asset.assetType === 'phone' ? 'text-green-600' :
                            asset.assetType === 'tablet' ? 'text-purple-600' :
                            asset.assetType === 'access_card' ? 'text-yellow-600' :
                            asset.assetType === 'meal_card' ? 'text-red-600' :
                            'text-gray-600'
                          }`} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900">{asset.assetName}</h3>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              asset.status === 'assigned' ? 'bg-green-100 text-green-700' :
                              asset.status === 'returned' ? 'bg-gray-100 text-gray-700' :
                              asset.status === 'damaged' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {asset.status === 'assigned' ? 'Zimmetli' :
                               asset.status === 'returned' ? 'İade Edildi' :
                               asset.status === 'damaged' ? 'Hasarlı' : 'Kayıp'}
                            </span>
                          </div>

                          {(asset.brand || asset.model) && (
                            <div className="text-sm text-gray-600 mb-2">{asset.brand} {asset.model}</div>
                          )}

                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mb-2">
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">Etiket: {asset.assetTag}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">S/N: {asset.serialNumber}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{new Date(asset.assignedDate).toLocaleDateString('tr-TR')}</span>
                            </div>
                            {asset.value > 0 && (
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">₺{asset.value.toLocaleString()}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                              asset.condition === 'new' ? 'bg-green-100 text-green-700' :
                              asset.condition === 'good' ? 'bg-blue-100 text-blue-700' :
                              asset.condition === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              Durum: {
                                asset.condition === 'new' ? 'Yeni' :
                                asset.condition === 'good' ? 'İyi' :
                                asset.condition === 'fair' ? 'Orta' : 'Kötü'
                              }
                            </span>
                          </div>

                          {asset.notes && (
                            <div className="mt-2 p-2 bg-white bg-opacity-50 rounded-lg text-xs text-gray-600">
                              <strong>Not:</strong> {asset.notes}
                            </div>
                          )}

                          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                            Zimmetleyen: {asset.assignedBy}
                            {asset.returnDate && ` • İade: ${new Date(asset.returnDate).toLocaleDateString('tr-TR')}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {profile.assetAssignments.filter(asset => 
              assetFilter === 'all' || 
              asset.assetType === assetFilter || 
              asset.status === assetFilter
            ).length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Seçili filtrede zimmet bulunamadı</p>
              </div>
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Aktivite Geçmişi</h2>
            
            <div className="space-y-4">
              {[
                { action: 'Sınav oluşturuldu', detail: 'Matematik Final Sınavı', time: '2 saat önce', icon: '📄', color: 'blue' },
                { action: 'Kullanıcı eklendi', detail: 'mehmet.kaya@example.com', time: '5 saat önce', icon: '👤', color: 'green' },
                { action: 'Soru güncellendi', detail: 'Q-12345', time: '1 gün önce', icon: '✏️', color: 'yellow' },
                { action: 'Rapor indirildi', detail: 'Aylık Performans Raporu', time: '2 gün önce', icon: '📊', color: 'purple' },
                { action: 'Ayar değiştirildi', detail: 'Bildirim tercihleri', time: '3 gün önce', icon: '⚙️', color: 'gray' },
              ].map((item, index) => (
                <div key={index} className={`flex items-center gap-4 p-4 border-l-4 border-${item.color}-500 bg-${item.color}-50 rounded-lg`}>
                  <div className="text-2xl">{item.icon}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{item.action}</div>
                    <div className="text-xs text-gray-600">{item.detail}</div>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tercihler</h2>

            <div className="space-y-6">
              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dil</label>
                <select
                  value={formData.preferences.language}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, language: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="tr">🇹🇷 Türkçe</option>
                  <option value="en">🇬🇧 English</option>
                  <option value="de">🇩🇪 Deutsch</option>
                  <option value="fr">🇫🇷 Français</option>
                </select>
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Saat Dilimi</label>
                <select
                  value={formData.preferences.timezone}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, timezone: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Europe/Istanbul">İstanbul (GMT+3)</option>
                  <option value="Europe/London">London (GMT+0)</option>
                  <option value="America/New_York">New York (GMT-5)</option>
                </select>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                <div className="flex gap-4">
                  {(['light', 'dark', 'auto'] as const).map((theme) => (
                    <label key={theme} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value={theme}
                        checked={formData.preferences.theme === theme}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferences: { ...formData.preferences, theme: e.target.value as any }
                        })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{theme === 'light' ? 'Açık' : theme === 'dark' ? 'Koyu' : 'Otomatik'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Bildirimler</label>
                <div className="space-y-3">
                  {Object.entries(formData.preferences.notifications).map(([key, value]) => (
                    <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <span className="text-sm text-gray-700 capitalize">
                        {key === 'email' ? '📧 E-posta' : key === 'sms' ? '📱 SMS' : '🔔 Push Bildirim'}
                      </span>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferences: {
                            ...formData.preferences,
                            notifications: { ...formData.preferences.notifications, [key]: e.target.checked }
                          }
                        })}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Tercihleri Kaydet
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Upgrade Package Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Paketi Yükselt</h2>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-3 gap-6">
                {/* Basic Package */}
                <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-all">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-2">₺99</div>
                    <div className="text-sm text-gray-600">/ Aylık</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>10 Kullanıcı</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>50 Sınav/Ay</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>500 Soru</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>10 GB Depolama</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>E-posta Desteği</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => alert('Basic paketine geçiş yapılıyor...')}
                    className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Bu Paketi Seç
                  </button>
                </div>

                {/* Professional Package */}
                <div className="border-2 border-blue-500 rounded-xl p-6 relative shadow-lg transform scale-105">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-bold rounded-full">
                    POPÜLER
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
                    <div className="text-4xl font-bold text-blue-600 mb-2">₺499</div>
                    <div className="text-sm text-gray-600">/ Aylık</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>50 Kullanıcı</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>500 Sınav/Ay</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>5.000 Soru</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>100 GB Depolama</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Öncelikli Destek</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Gelişmiş Raporlar</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => alert('Professional paketine geçiş yapılıyor...')}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Bu Paketi Seç
                  </button>
                </div>

                {/* Enterprise Package */}
                <div className="border-2 border-purple-500 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-blue-50">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise Pro</h3>
                    <div className="text-4xl font-bold text-purple-600 mb-2">₺4.999</div>
                    <div className="text-sm text-gray-600">/ Yıllık</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Sınırsız Kullanıcı</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Sınırsız Sınav</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Sınırsız Soru</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>1 TB Depolama</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>7/24 Öncelikli Destek</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Özel Eğitim</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>API Erişimi</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Beyaz Etiket</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => alert('Mevcut paketiniz zaten Enterprise Pro!')}
                    disabled
                    className="w-full px-4 py-3 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed font-medium"
                  >
                    Mevcut Paket
                  </button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>💡 Bilgi:</strong> Paket yükseltmeleri anında aktif olur. Kalan süreniz yeni pakete orantılı olarak aktarılır.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

