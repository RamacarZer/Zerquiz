import React, { useState, useEffect, useMemo } from 'react';
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
      description: 'Küçük okullar ve bireysel eğitmenler için',
      code: 'STARTER',
      durationDays: 365,
      maxUsers: 10,
      maxStudents: 100,
      maxCourses: 10,
      maxQuestions: 500,
      maxExams: 20,
      features: ['Temel Özellikler', 'E-posta Desteği', '10 Kullanıcı'],
      price: 99,
      currency: 'USD',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Professional',
      description: 'Orta ölçekli eğitim kurumları için',
      code: 'PRO',
      durationDays: 365,
      maxUsers: 50,
      maxStudents: 500,
      maxCourses: 50,
      maxQuestions: 5000,
      maxExams: 100,
      features: ['Tüm Özellikler', 'Öncelikli Destek', '50 Kullanıcı', 'API Erişimi'],
      price: 299,
      currency: 'USD',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Enterprise',
      description: 'Büyük kurumlar ve üniversiteler için',
      code: 'ENTERPRISE',
      durationDays: 365,
      maxUsers: -1,
      maxStudents: -1,
      maxCourses: -1,
      maxQuestions: -1,
      maxExams: -1,
      features: ['Sınırsız Kullanım', '7/24 Destek', 'Özel Entegrasyon', 'White Label'],
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
    maxUsers: 100,
    maxStudents: 1000,
    maxCourses: 50,
    maxQuestions: 5000,
    maxExams: 100,
    features: [],
    price: 0,
    currency: 'USD',
    isActive: true,
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      // Using mock data instead of API for demo
      // const data = await getLicensePackages();
      // setPackages(data);
      setPackages(mockPackages);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedPackage(null);
    setFormData({
      name: '',
      description: '',
      code: '',
      durationDays: 365,
      maxUsers: 100,
      maxStudents: 1000,
      maxCourses: 50,
      maxQuestions: 5000,
      maxExams: 100,
      features: [],
      price: 0,
      currency: 'USD',
      isActive: true,
    });
    setCurrentStep(0);
    setIsModalOpen(true);
  };

  const handleEdit = (pkg: LicensePackageDto) => {
    setSelectedPackage(pkg);
    setFormData(pkg);
    setCurrentStep(0);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu paketi silmek istediğinizden emin misiniz?')) return;
    
    try {
      // Mock deletion
      setPackages(packages.filter(p => p.id !== id));
      // await deleteLicensePackage(id);
      // await loadPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedPackage) {
        // Mock update
        setPackages(packages.map(p => p.id === selectedPackage.id ? { ...p, ...formData } : p));
        // await updateLicensePackage(selectedPackage.id, formData as CreateLicensePackageRequest);
      } else {
        // Mock create
        const newPackage = {
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as LicensePackageDto;
        setPackages([...packages, newPackage]);
        // await createLicensePackage(formData as CreateLicensePackageRequest);
      }
      setIsModalOpen(false);
      // await loadPackages();
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  const steps = [
    { label: 'Basic Info', component: <BasicInfoForm data={formData} onChange={setFormData} /> },
    { label: 'Quotas', component: <QuotasForm data={formData} onChange={setFormData} /> },
    { label: 'Features', component: <FeaturesForm data={formData} onChange={setFormData} /> },
    { label: 'Pricing', component: <PricingForm data={formData} onChange={setFormData} /> },
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lisans Paketleri</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Kurum için lisans paketlerini yönetin</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Paket
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div 
                key={pkg.id} 
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{pkg.name}</h3>
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded">
                      {pkg.code}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${pkg.price}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">/{pkg.durationDays} gün</div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{pkg.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Kullanıcı:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {pkg.maxUsers === -1 ? 'Sınırsız' : pkg.maxUsers}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Öğrenci:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {pkg.maxStudents === -1 ? 'Sınırsız' : pkg.maxStudents}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Kurs:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {pkg.maxCourses === -1 ? 'Sınırsız' : pkg.maxCourses}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Sınav:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {pkg.maxExams === -1 ? 'Sınırsız' : pkg.maxExams}
                    </span>
                  </div>
                </div>

                {pkg.features && pkg.features.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Özellikler:</p>
                    <div className="flex flex-wrap gap-1">
                      {pkg.features.map((feature, idx) => (
                        <span 
                          key={idx} 
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="flex-1 px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {selectedPackage ? 'Edit Package' : 'Create Package'}
            </h2>
            
            <Tabs
              tabs={steps.map(s => s.label)}
              activeTab={currentStep}
              onChange={setCurrentStep}
            />

            <div className="mt-4">
              {steps[currentStep].component}
            </div>

            <div className="mt-6 flex justify-between">
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="secondary"
              >
                Cancel
              </Button>
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    variant="secondary"
                  >
                    Previous
                  </Button>
                )}
                {currentStep < steps.length - 1 ? (
                  <Button onClick={() => setCurrentStep(currentStep + 1)}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleSubmit}>
                    {selectedPackage ? 'Update' : 'Create'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default LicensePackagesPage;
