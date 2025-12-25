import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, Plus, Edit, Trash2, CheckCircle, XCircle, Crown,
  Users, BookOpen, FileQuestion, ClipboardList, DollarSign,
  TrendingUp, Award, Zap, Shield, Star, Eye, Settings
} from 'lucide-react';
import Tabs from '../../components/common/Tabs';
import Button from '../../components/common/Button';
import {
  getLicensePackages,
  createLicensePackage,
  updateLicensePackage,
  deleteLicensePackage,
  type LicensePackageDto,
  type CreateLicensePackageRequest
} from '../../services/api/licenseService';
import { BasicInfoForm, QuotasForm, FeaturesForm, PricingForm } from './PackageFormSections';

const LicensePackagesPage: React.FC = () => {
  // Mock data for demo
  const mockPackages: LicensePackageDto[] = [
    {
      id: '1',
      name: 'Starter',
      description: 'Küçük okullar ve bireysel eğitmenler için ideal başlangıç paketi',
      code: 'STARTER',
      durationDays: 365,
      maxUsers: 10,
      maxStudents: 100,
      maxCourses: 10,
      maxQuestions: 500,
      maxExams: 20,
      features: ['Temel Özellikler', 'E-posta Desteği', '10 Kullanıcı', 'Temel Raporlama'],
      price: 99,
      currency: 'USD',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Professional',
      description: 'Orta ölçekli eğitim kurumları ve okullar için',
      code: 'PRO',
      durationDays: 365,
      maxUsers: 50,
      maxStudents: 500,
      maxCourses: 50,
      maxQuestions: 5000,
      maxExams: 100,
      features: ['Tüm Özellikler', 'Öncelikli Destek', '50 Kullanıcı', 'API Erişimi', 'Gelişmiş Raporlama', 'AI Asistan'],
      price: 299,
      currency: 'USD',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Enterprise',
      description: 'Büyük kurumlar, üniversiteler ve holding grupları için',
      code: 'ENTERPRISE',
      durationDays: 365,
      maxUsers: -1,
      maxStudents: -1,
      maxCourses: -1,
      maxQuestions: -1,
      maxExams: -1,
      features: ['Sınırsız Kullanım', '7/24 Premium Destek', 'Özel Entegrasyon', 'White Label', 'SLA Garantisi', 'Özel Eğitim'],
      price: 999,
      currency: 'USD',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const [packages, setPackages] = useState<LicensePackageDto[]>(mockPackages);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<LicensePackageDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const [formData, setFormData] = useState<Partial<CreateLicensePackageRequest>>({
    name: '',
    description: '',
    code: '',
    durationDays: 365,
    maxUsers: 10,
    maxStudents: 100,
    maxCourses: 10,
    maxQuestions: 500,
    maxExams: 20,
    features: [],
    price: 0,
    currency: 'USD',
    isActive: true,
  });

  const getPackageIcon = (name: string) => {
    if (name.toLowerCase().includes('starter')) return <Users className="w-8 h-8" />;
    if (name.toLowerCase().includes('pro')) return <Crown className="w-8 h-8" />;
    if (name.toLowerCase().includes('enterprise')) return <Shield className="w-8 h-8" />;
    return <Package className="w-8 h-8" />;
  };

  const getPackageGradient = (name: string) => {
    if (name.toLowerCase().includes('starter')) return 'from-blue-500 to-cyan-500';
    if (name.toLowerCase().includes('pro')) return 'from-purple-500 to-pink-500';
    if (name.toLowerCase().includes('enterprise')) return 'from-orange-500 to-red-500';
    return 'from-gray-500 to-gray-600';
  };

  const handleCreatePackage = () => {
    setSelectedPackage(null);
    setFormData({
      name: '',
      description: '',
      code: '',
      durationDays: 365,
      maxUsers: 10,
      maxStudents: 100,
      maxCourses: 10,
      maxQuestions: 500,
      maxExams: 20,
      features: [],
      price: 0,
      currency: 'USD',
      isActive: true,
    });
    setCurrentStep(0);
    setIsModalOpen(true);
  };

  const handleEditPackage = (pkg: LicensePackageDto) => {
    setSelectedPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      code: pkg.code,
      durationDays: pkg.durationDays,
      maxUsers: pkg.maxUsers,
      maxStudents: pkg.maxStudents,
      maxCourses: pkg.maxCourses,
      maxQuestions: pkg.maxQuestions,
      maxExams: pkg.maxExams,
      features: pkg.features,
      price: pkg.price,
      currency: pkg.currency,
      isActive: pkg.isActive,
    });
    setCurrentStep(0);
    setIsModalOpen(true);
  };

  const handleDeletePackage = async (id: string) => {
    if (window.confirm('Bu paketi silmek istediğinize emin misiniz?')) {
      setPackages(packages.filter(p => p.id !== id));
      alert('Paket başarıyla silindi!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Lisans Paketleri</h1>
              <p className="text-gray-600">Abonelik paketlerini yönetin ve özelleştirin</p>
            </div>
            <button
              onClick={handleCreatePackage}
              className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Yeni Paket Oluştur
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Package className="w-7 h-7 text-white" />
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{packages.length}</div>
            <div className="text-sm text-gray-600">Toplam Paket</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <Star className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{packages.filter(p => p.isActive).length}</div>
            <div className="text-sm text-gray-600">Aktif Paket</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <Award className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {packages.reduce((sum, p) => sum + (p.maxUsers === -1 ? 0 : p.maxUsers), 0)}
            </div>
            <div className="text-sm text-gray-600">Toplam Kullanıcı Kotası</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${packages.reduce((sum, p) => sum + p.price, 0)}
            </div>
            <div className="text-sm text-gray-600">Toplam Değer</div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-2xl shadow-xl border-2 transition-all hover:shadow-2xl hover:-translate-y-2 ${
                pkg.name.toLowerCase().includes('pro') ? 'border-purple-500 ring-4 ring-purple-100' : 'border-transparent'
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards',
              }}
            >
              {pkg.name.toLowerCase().includes('pro') && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  <Star className="w-4 h-4 fill-current" />
                  En Popüler
                </div>
              )}

              <div className="p-8">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${getPackageGradient(pkg.name)} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                  {getPackageIcon(pkg.name)}
                </div>

                {/* Package Name & Status */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>
                  </div>
                  {pkg.isActive ? (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      <CheckCircle className="w-4 h-4" />
                      Aktif
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
                      <XCircle className="w-4 h-4" />
                      Pasif
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-5xl font-extrabold text-gray-900">${pkg.price}</span>
                    <span className="text-lg text-gray-600">/yıl</span>
                  </div>
                  <div className="text-sm text-gray-500">Kod: {pkg.code}</div>
                </div>

                {/* Quotas */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <Users className="w-5 h-5 text-blue-600 mb-1" />
                    <div className="text-xl font-bold text-gray-900">{pkg.maxUsers === -1 ? '∞' : pkg.maxUsers}</div>
                    <div className="text-xs text-gray-600">Kullanıcı</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3">
                    <Users className="w-5 h-5 text-green-600 mb-1" />
                    <div className="text-xl font-bold text-gray-900">{pkg.maxStudents === -1 ? '∞' : pkg.maxStudents}</div>
                    <div className="text-xs text-gray-600">Öğrenci</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3">
                    <BookOpen className="w-5 h-5 text-purple-600 mb-1" />
                    <div className="text-xl font-bold text-gray-900">{pkg.maxCourses === -1 ? '∞' : pkg.maxCourses}</div>
                    <div className="text-xs text-gray-600">Ders</div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3">
                    <ClipboardList className="w-5 h-5 text-orange-600 mb-1" />
                    <div className="text-xl font-bold text-gray-900">{pkg.maxExams === -1 ? '∞' : pkg.maxExams}</div>
                    <div className="text-xs text-gray-600">Sınav</div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <p className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Özellikler:</p>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditPackage(pkg)}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      pkg.name.toLowerCase().includes('pro')
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <Edit className="w-5 h-5" />
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="py-3 px-4 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Create/Edit (Simplified - just alert for now) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedPackage ? 'Paketi Düzenle' : 'Yeni Paket Oluştur'}
              </h2>
              <p className="text-gray-600 mb-6">
                Bu özellik yapım aşamasında. Paket formu eklenecek.
              </p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
              >
                Kapat
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LicensePackagesPage;
