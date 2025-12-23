import { Link } from 'react-router-dom';
import {
  DollarSign,
  Presentation,
  FileQuestion,
  Link2,
  Copyright,
  Library,
  TrendingUp,
  BookOpen,
  HelpCircle,
  Trophy,
  Users,
  BookMarked,
  Lightbulb,
  Settings,
  Shield,
  BarChart3,
  MessageSquare,
  GraduationCap,
  FileText,
  Monitor,
  MapPin,
  Palette,
  Code,
  Calculator,
  FileCheck,
  Sparkles,
} from 'lucide-react';

interface ModuleCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  category: string;
  tabs?: number;
}

interface ModuleCategory {
  name: string;
  modules: ModuleCard[];
}

const moduleCategories: ModuleCategory[] = [
  {
    name: '🎯 Ana Modüller',
    modules: [
      {
        title: 'İçerik Yönetimi',
        description: 'Kitap Kütüphanesi • AI Üretim • Medya',
        icon: <Library size={32} />,
        path: '/content',
        color: 'bg-indigo-500',
        category: 'main',
        tabs: 3,
      },
      {
        title: 'Sınıf Yönetimi',
        description: 'Dersler • Ödevler • Planlar',
        icon: <BookOpen size={32} />,
        path: '/classroom',
        color: 'bg-teal-500',
        category: 'main',
        tabs: 2,
      },
      {
        title: 'Analitik & Raporlar',
        description: '6 Sekme • AI Analytics • Performans',
        icon: <TrendingUp size={32} />,
        path: '/analytics',
        color: 'bg-pink-500',
        category: 'main',
        tabs: 6,
      },
      {
        title: 'Soru Yönetimi',
        description: '65 Soru Tipi • AI Üretim • Profesyonel Editör',
        icon: <HelpCircle size={32} />,
        path: '/questions',
        color: 'bg-yellow-500',
        category: 'main',
        tabs: 4,
      },
      {
        title: 'Sınav Sistemi',
        description: 'Sınav Listesi • Yönetim • Canlı İzleme',
        icon: <FileQuestion size={32} />,
        path: '/exams',
        color: 'bg-purple-500',
        category: 'main',
        tabs: 3,
      },
      {
        title: 'Sunum Yönetimi',
        description: 'Sunum Listesi • Builder • Canlı Sunum',
        icon: <Presentation size={32} />,
        path: '/presentations',
        color: 'bg-blue-500',
        category: 'main',
        tabs: 2,
      },
      {
        title: 'Finans Yönetimi',
        description: '8 Sekme • Kasa • Bütçe • Faturalar',
        icon: <DollarSign size={32} />,
        path: '/finance',
        color: 'bg-green-500',
        category: 'main',
        tabs: 8,
      },
      {
        title: 'Telif Hakları',
        description: 'Yazar Paneli • Telif Raporları',
        icon: <Copyright size={32} />,
        path: '/royalty',
        color: 'bg-red-500',
        category: 'main',
        tabs: 2,
      },
      {
        title: 'Entegrasyonlar',
        description: 'LTI • API Yönetimi',
        icon: <Link2 size={32} />,
        path: '/integrations',
        color: 'bg-orange-500',
        category: 'main',
        tabs: 2,
      },
    ],
  },
  {
    name: '🤖 AI Araçları',
    modules: [
      {
        title: 'Yazma Asistanı',
        description: 'AI destekli metin oluşturma',
        icon: <Sparkles size={32} />,
        path: '/ai-assistants/writing',
        color: 'bg-cyan-500',
        category: 'ai',
      },
      {
        title: 'Proje Analizi',
        description: 'Ödev ve proje değerlendirme',
        icon: <FileCheck size={32} />,
        path: '/ai-assistants/project-analysis',
        color: 'bg-violet-500',
        category: 'ai',
      },
      {
        title: 'Kod Refactor',
        description: 'Kod analizi ve iyileştirme',
        icon: <Code size={32} />,
        path: '/ai-assistants/file-refactor',
        color: 'bg-slate-500',
        category: 'ai',
      },
      {
        title: 'Otomatik Modül Üretici',
        description: 'AI ile modül oluşturma',
        icon: <Lightbulb size={32} />,
        path: '/auto-generate-module',
        color: 'bg-amber-500',
        category: 'ai',
      },
    ],
  },
  {
    name: '📚 Okuma & Kütüphane',
    modules: [
      {
        title: 'Kitap Kütüphanesi',
        description: 'Dijital kitap listesi',
        icon: <BookMarked size={32} />,
        path: '/books',
        color: 'bg-emerald-500',
        category: 'library',
      },
      {
        title: 'E-Kitap Okuyucu',
        description: 'Not alma • Vurgulama • Kelime çevirisi',
        icon: <BookOpen size={32} />,
        path: '/reader/1',
        color: 'bg-lime-500',
        category: 'library',
      },
      {
        title: 'Kelime Defteri',
        description: 'Kişisel kelime hazinesi',
        icon: <FileText size={32} />,
        path: '/dictionary',
        color: 'bg-sky-500',
        category: 'library',
      },
    ],
  },
  {
    name: '🎨 Öğretmen Araçları',
    modules: [
      {
        title: 'Akıllı Tahta',
        description: 'Çizim • Matematik • Ekran kaydı',
        icon: <Monitor size={32} />,
        path: '/smartboard',
        color: 'bg-fuchsia-500',
        category: 'tools',
      },
      {
        title: 'Beyaz Tahta',
        description: 'Çizim • Webcam • Video kayıt',
        icon: <Palette size={32} />,
        path: '/whiteboard',
        color: 'bg-rose-500',
        category: 'tools',
      },
      {
        title: 'Kod Editörü',
        description: 'Syntax highlighting • Multi-language',
        icon: <Code size={32} />,
        path: '/editors/code',
        color: 'bg-gray-700',
        category: 'tools',
      },
      {
        title: 'Matematik Editörü',
        description: 'LaTeX • Görsel denklem • Grafik',
        icon: <Calculator size={32} />,
        path: '/editors/math',
        color: 'bg-blue-600',
        category: 'tools',
      },
    ],
  },
  {
    name: '🎮 Öğrenci Özellikleri',
    modules: [
      {
        title: 'Gamification',
        description: 'Rozetler • Puanlar • Lider tablosu',
        icon: <Trophy size={32} />,
        path: '/gamification',
        color: 'bg-yellow-600',
        category: 'student',
      },
      {
        title: 'Kurslar',
        description: 'Online kurs yönetimi',
        icon: <GraduationCap size={32} />,
        path: '/courses',
        color: 'bg-indigo-600',
        category: 'student',
      },
      {
        title: 'Sertifikalar',
        description: 'Otomatik sertifika • QR doğrulama',
        icon: <FileText size={32} />,
        path: '/certificates',
        color: 'bg-green-600',
        category: 'student',
      },
      {
        title: 'Öğrenci Sınav Portalı',
        description: 'Sınava giriş • Sonuçlar',
        icon: <FileQuestion size={32} />,
        path: '/student/exams',
        color: 'bg-purple-600',
        category: 'student',
      },
    ],
  },
  {
    name: '📊 Raporlama Dashboardları',
    modules: [
      {
        title: 'Öğrenci Dashboard',
        description: 'Notlar • İlerleme • Performans',
        icon: <BarChart3 size={32} />,
        path: '/reports/student',
        color: 'bg-blue-500',
        category: 'reports',
      },
      {
        title: 'Veli Dashboard',
        description: 'Çocuk takibi • Notlar • İletişim',
        icon: <Users size={32} />,
        path: '/reports/parent',
        color: 'bg-pink-600',
        category: 'reports',
      },
      {
        title: 'Okul Dashboard',
        description: 'Okul geneli raporlar',
        icon: <BookMarked size={32} />,
        path: '/reports/school',
        color: 'bg-teal-600',
        category: 'reports',
      },
      {
        title: 'Yayınevi Dashboard',
        description: 'Kitap satışları • İstatistikler',
        icon: <Library size={32} />,
        path: '/reports/publisher',
        color: 'bg-red-600',
        category: 'reports',
      },
    ],
  },
  {
    name: '💬 İletişim',
    modules: [
      {
        title: 'İletişim Merkezi',
        description: 'Mesajlaşma • Duyurular • E-posta',
        icon: <MessageSquare size={32} />,
        path: '/communication',
        color: 'bg-cyan-600',
        category: 'communication',
      },
      {
        title: 'Bildirimler',
        description: 'Gerçek zamanlı bildirimler',
        icon: <MessageSquare size={32} />,
        path: '/notifications',
        color: 'bg-orange-600',
        category: 'communication',
      },
      {
        title: 'Veli Portalı',
        description: 'Öğretmen iletişimi • Takip',
        icon: <Users size={32} />,
        path: '/parent-portal',
        color: 'bg-violet-600',
        category: 'communication',
      },
    ],
  },
  {
    name: '👑 Admin Paneli',
    modules: [
      {
        title: 'Kullanıcı Yönetimi',
        description: 'Kullanıcılar • Roller • Departmanlar',
        icon: <Users size={32} />,
        path: '/admin/users',
        color: 'bg-slate-600',
        category: 'admin',
      },
      {
        title: 'Tenant Yönetimi',
        description: 'Multi-tenant sistem',
        icon: <Shield size={32} />,
        path: '/admin/tenants',
        color: 'bg-gray-700',
        category: 'admin',
      },
      {
        title: 'Sistem Ayarları',
        description: 'Tanımlar • AI Config • Logs',
        icon: <Settings size={32} />,
        path: '/admin/system/definitions',
        color: 'bg-zinc-700',
        category: 'admin',
      },
      {
        title: 'Müfredat Yönetimi',
        description: 'Müfredat • Kazanımlar',
        icon: <BookMarked size={32} />,
        path: '/admin/curriculum',
        color: 'bg-emerald-700',
        category: 'admin',
      },
      {
        title: 'Kitap Onayı',
        description: 'Kitap onay süreci',
        icon: <FileCheck size={32} />,
        path: '/admin/books/approval',
        color: 'bg-indigo-700',
        category: 'admin',
      },
      {
        title: 'Gerçek Zamanlı İzleme',
        description: 'Sistem metrikleri • Performans',
        icon: <Monitor size={32} />,
        path: '/monitoring',
        color: 'bg-red-700',
        category: 'admin',
      },
      {
        title: 'Lokasyon Yönetimi',
        description: 'Kampüs • Şube yönetimi',
        icon: <MapPin size={32} />,
        path: '/locations',
        color: 'bg-green-700',
        category: 'admin',
      },
    ],
  },
];

export default function ModuleShowcasePage() {
  const totalModules = moduleCategories.reduce((sum, cat) => sum + cat.modules.length, 0);
  const totalTabs = moduleCategories
    .flatMap((cat) => cat.modules)
    .reduce((sum, mod) => sum + (mod.tabs || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🎯 Zerquiz Platform Modülleri
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Kapsamlı Eğitim Yönetim Sistemi
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full font-semibold">
              <span className="text-2xl">✅</span>
              <span>{totalModules} Modül Aktif</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-6 py-3 rounded-full font-semibold">
              <span className="text-2xl">📑</span>
              <span>{totalTabs} Sekme (Tab)</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-6 py-3 rounded-full font-semibold">
              <span className="text-2xl">🚀</span>
              <span>80+ Sayfa</span>
            </div>
          </div>
        </div>

        {/* Module Categories */}
        {moduleCategories.map((category) => (
          <div key={category.name} className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              {category.name}
              <span className="text-sm font-normal text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                {category.modules.length} modül
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.modules.map((module) => (
                <Link key={module.path} to={module.path} className="block group">
                  <div className="card bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                    <div className="card-body">
                      <div
                        className={`${module.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                      >
                        {module.icon}
                      </div>
                      <h3 className="card-title text-lg mb-2">{module.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                      {module.tabs && (
                        <div className="badge badge-secondary badge-sm mb-2">
                          {module.tabs} Tab
                        </div>
                      )}
                      <div className="card-actions justify-end mt-auto">
                        <button className="btn btn-primary btn-sm">Aç →</button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Features Section */}
        <div className="mt-16 card bg-gradient-to-r from-blue-50 to-purple-50 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-3xl mb-6 text-center justify-center">
              ✨ Platform Özellikleri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="badge badge-primary badge-lg mb-3">Modüler Yapı</div>
                <h3 className="font-semibold text-lg mb-2">🧩 Esnek Mimari</h3>
                <p className="text-gray-600">
                  Bağımsız modüller, yeni özellik ekleme çok kolay
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="badge badge-secondary badge-lg mb-3">RBAC</div>
                <h3 className="font-semibold text-lg mb-2">🔐 Yetki Kontrolü</h3>
                <p className="text-gray-600">
                  Rol bazlı erişim kontrolü, dinamik menü/tab gösterimi
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="badge badge-accent badge-lg mb-3">Responsive</div>
                <h3 className="font-semibold text-lg mb-2">📱 Tüm Cihazlar</h3>
                <p className="text-gray-600">
                  Mobil, tablet ve desktop'ta mükemmel görünüm
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="badge badge-info badge-lg mb-3">AI Powered</div>
                <h3 className="font-semibold text-lg mb-2">🤖 Yapay Zeka</h3>
                <p className="text-gray-600">
                  65 soru tipi, AI soru üretimi, AI asistanlar
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="badge badge-success badge-lg mb-3">Real-time</div>
                <h3 className="font-semibold text-lg mb-2">⚡ Canlı İzleme</h3>
                <p className="text-gray-600">
                  Sınav izleme, bildirimler, gerçek zamanlı güncellemeler
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="badge badge-warning badge-lg mb-3">Multi-tenant</div>
                <h3 className="font-semibold text-lg mb-2">🏢 Çok Kiracılı</h3>
                <p className="text-gray-600">
                  Birden fazla okul/kurum tek platformda
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
            <div className="card-body items-center text-center">
              <div className="text-4xl font-bold">{totalModules}</div>
              <div className="text-sm opacity-90">Aktif Modül</div>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl">
            <div className="card-body items-center text-center">
              <div className="text-4xl font-bold">{totalTabs}</div>
              <div className="text-sm opacity-90">Sekme (Tab)</div>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl">
            <div className="card-body items-center text-center">
              <div className="text-4xl font-bold">65</div>
              <div className="text-sm opacity-90">Soru Tipi</div>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl">
            <div className="card-body items-center text-center">
              <div className="text-4xl font-bold">80+</div>
              <div className="text-sm opacity-90">Toplam Sayfa</div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 card bg-white shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">🚀 Hızlı Erişim</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/questions" className="btn btn-outline">
                ❓ Soru Oluştur
              </Link>
              <Link to="/exams" className="btn btn-outline">
                📝 Sınav Oluştur
              </Link>
              <Link to="/analytics" className="btn btn-outline">
                📊 Analitik
              </Link>
              <Link to="/finance" className="btn btn-outline">
                💰 Finans
              </Link>
              <Link to="/smartboard" className="btn btn-outline">
                🖊️ Akıllı Tahta
              </Link>
              <Link to="/gamification" className="btn btn-outline">
                🎮 Gamification
              </Link>
              <Link to="/books" className="btn btn-outline">
                📚 Kitaplar
              </Link>
              <Link to="/admin/users" className="btn btn-outline">
                👑 Admin Panel
              </Link>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link to="/dashboard" className="btn btn-primary btn-lg gap-2">
            ← Dashboard'a Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
