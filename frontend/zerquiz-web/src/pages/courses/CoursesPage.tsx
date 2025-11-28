import React, { useState } from 'react';
import {
  BookOpen,
  Play,
  FileText,
  Award,
  Clock,
  Users,
  Star,
  TrendingUp,
  Filter,
  Search,
  Download,
  Video,
  CheckCircle,
  Lock,
  PlayCircle,
  Calendar,
  DollarSign,
  Target,
  BarChart3,
} from 'lucide-react';
import {
  demoCoursePackages,
  demoInstructors,
  demoLessons,
  demoPresentations,
  demoPracticeExams,
  getPackagesByExamType,
  getFreePackages,
  getPaidPackages,
  getPopularPackages,
  getTopRatedPackages,
  getCourseStatistics,
  getExamTypeStats,
  type CoursePackage,
  type ExamType,
  type PricingType,
} from '../../mocks/coursesData';

type ViewMode = 'grid' | 'list';
type FilterTab = 'all' | 'free' | 'paid' | 'subscription';

export default function CoursesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [selectedExamType, setSelectedExamType] = useState<ExamType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<CoursePackage | null>(null);
  const [showPackageModal, setShowPackageModal] = useState(false);

  const stats = getCourseStatistics();
  const examStats = getExamTypeStats();

  // Filter packages
  const filteredPackages = demoCoursePackages.filter((pkg) => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExamType = selectedExamType === 'all' || pkg.examType === selectedExamType;
    const matchesPricing = 
      filterTab === 'all' ||
      (filterTab === 'free' && pkg.pricingType === 'free') ||
      (filterTab === 'paid' && pkg.pricingType === 'paid') ||
      (filterTab === 'subscription' && pkg.pricingType === 'subscription');
    
    return matchesSearch && matchesExamType && matchesPricing;
  });

  const popularPackages = getPopularPackages(3);
  const topRatedPackages = getTopRatedPackages(3);

  const getPackageTypeIcon = (packageType: CoursePackage['packageType']) => {
    switch (packageType) {
      case 'course_only': return <Video className="h-5 w-5" />;
      case 'course_presentation': return <BookOpen className="h-5 w-5" />;
      case 'course_presentation_exam': return <FileText className="h-5 w-5" />;
      case 'full_package': return <Award className="h-5 w-5" />;
    }
  };

  const getPackageTypeLabel = (packageType: CoursePackage['packageType']) => {
    switch (packageType) {
      case 'course_only': return 'Sadece Ders';
      case 'course_presentation': return 'Ders + Sunum';
      case 'course_presentation_exam': return 'Ders + Sunum + Deneme';
      case 'full_package': return 'Tam Paket';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-4">Kurslar & Eğitim Paketleri</h1>
          <p className="text-lg opacity-90 mb-8">
            TYT, AYT, LGS, KPSS ve daha fazlası için kapsamlı eğitim içerikleri
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold">{stats.totalPackages}</div>
              <div className="text-sm opacity-90">Toplam Paket</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold">{stats.totalEnrollments.toLocaleString()}</div>
              <div className="text-sm opacity-90">Kayıtlı Öğrenci</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold">{stats.avgRating}</div>
              <div className="text-sm opacity-90">Ortalama Puan</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold">{stats.freePackages}</div>
              <div className="text-sm opacity-90">Ücretsiz Paket</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Popular & Top Rated */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              En Popüler Kurslar
            </h3>
            <div className="space-y-3">
              {popularPackages.map((pkg) => (
                <div key={pkg.id} className="flex items-center gap-3 p-3 border rounded-lg hover:border-indigo-300 transition cursor-pointer">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {pkg.examType}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{pkg.name}</p>
                    <p className="text-xs text-gray-500">{pkg.enrolledCount.toLocaleString()} öğrenci</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              En Yüksek Puanlı
            </h3>
            <div className="space-y-3">
              {topRatedPackages.map((pkg) => (
                <div key={pkg.id} className="flex items-center gap-3 p-3 border rounded-lg hover:border-yellow-300 transition cursor-pointer">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {pkg.examType}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{pkg.name}</p>
                    <div className="flex items-center gap-1 text-xs text-yellow-600">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{pkg.rating}</span>
                      <span className="text-gray-400">({pkg.reviewCount})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Kurs ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Exam Type Filter */}
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value as ExamType | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Tüm Sınavlar</option>
              <option value="TYT">TYT</option>
              <option value="AYT">AYT</option>
              <option value="LGS">LGS</option>
              <option value="KPSS">KPSS</option>
              <option value="DGS">DGS</option>
              <option value="ALES">ALES</option>
              <option value="YDS">YDS</option>
            </select>

            {/* Pricing Filter Tabs */}
            <div className="flex gap-2">
              {(['all', 'free', 'paid', 'subscription'] as FilterTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filterTab === tab
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab === 'all' ? 'Tümü' : tab === 'free' ? 'Ücretsiz' : tab === 'paid' ? 'Ücretli' : 'Abonelik'}
                </button>
              ))}
            </div>
          </div>

          {/* Result Count */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredPackages.length} paket bulundu
          </div>
        </div>

        {/* Course Packages Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition cursor-pointer overflow-hidden"
              onClick={() => {
                setSelectedPackage(pkg);
                setShowPackageModal(true);
              }}
            >
              {/* Package Header */}
              <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl font-bold mb-2">{pkg.examType}</div>
                  <div className="text-lg">{pkg.subject}</div>
                </div>
                {pkg.pricingType === 'free' && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    ÜCRETSİZ
                  </div>
                )}
                {pkg.discountPrice && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    %{Math.round(((pkg.price - pkg.discountPrice) / pkg.price) * 100)} İNDİRİM
                  </div>
                )}
              </div>

              {/* Package Content */}
              <div className="p-6">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{pkg.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{pkg.description}</p>
                </div>

                {/* Package Type Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                    {getPackageTypeIcon(pkg.packageType)}
                    {getPackageTypeLabel(pkg.packageType)}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {pkg.difficulty === 'beginner' ? 'Başlangıç' : pkg.difficulty === 'intermediate' ? 'Orta' : pkg.difficulty === 'advanced' ? 'İleri' : 'Uzman'}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{pkg.duration}sa</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    <span>{pkg.lessonCount} ders</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <span>{pkg.examCount} deneme</span>
                  </div>
                </div>

                {/* Rating & Enrollment */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold text-gray-900">{pkg.rating}</span>
                    <span className="text-xs text-gray-500">({pkg.reviewCount})</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {pkg.enrolledCount.toLocaleString()} öğrenci
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {pkg.instructor.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">{pkg.instructor}</p>
                    <p className="text-xs text-gray-500">Eğitmen</p>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  {pkg.pricingType === 'free' ? (
                    <div className="text-2xl font-bold text-green-600">ÜCRETSİZ</div>
                  ) : (
                    <div>
                      {pkg.discountPrice && (
                        <div className="text-sm text-gray-400 line-through">{pkg.price} {pkg.currency}</div>
                      )}
                      <div className="text-2xl font-bold text-indigo-600">
                        {pkg.discountPrice || pkg.price} {pkg.currency}
                      </div>
                    </div>
                  )}
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium">
                    Detayları Gör
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Paket bulunamadı</h3>
            <p className="text-gray-600">Lütfen farklı filtreler deneyin</p>
          </div>
        )}
      </div>

      {/* Package Detail Modal */}
      {showPackageModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{selectedPackage.name}</h3>
              <button
                onClick={() => setShowPackageModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Açıklama</h4>
                    <p className="text-gray-700">{selectedPackage.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Öğrenme Çıktıları</h4>
                    <ul className="space-y-2">
                      {selectedPackage.learningOutcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Paket İçeriği</h4>
                    <div className="space-y-2">
                      {selectedPackage.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-700">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="text-center mb-4">
                      {selectedPackage.pricingType === 'free' ? (
                        <div className="text-3xl font-bold text-green-600">ÜCRETSİZ</div>
                      ) : (
                        <>
                          {selectedPackage.discountPrice && (
                            <div className="text-lg text-gray-400 line-through">
                              {selectedPackage.price} {selectedPackage.currency}
                            </div>
                          )}
                          <div className="text-3xl font-bold text-indigo-600">
                            {selectedPackage.discountPrice || selectedPackage.price} {selectedPackage.currency}
                          </div>
                        </>
                      )}
                    </div>
                    <button className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium mb-2">
                      Hemen Başla
                    </button>
                    <button className="w-full px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition text-sm">
                      Önizleme İzle
                    </button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">İçerik Detayları</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Toplam Süre</span>
                        <span className="font-medium">{selectedPackage.duration} saat</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ders Sayısı</span>
                        <span className="font-medium">{selectedPackage.lessonCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sunum</span>
                        <span className="font-medium">{selectedPackage.presentationCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deneme Sınavı</span>
                        <span className="font-medium">{selectedPackage.examCount}</span>
                      </div>
                      {selectedPackage.questionCount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Toplam Soru</span>
                          <span className="font-medium">{selectedPackage.questionCount}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="text-xl font-bold">{selectedPackage.rating}</span>
                      <span className="text-sm text-gray-500">({selectedPackage.reviewCount} değerlendirme)</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedPackage.enrolledCount.toLocaleString()} öğrenci kaydoldu
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

