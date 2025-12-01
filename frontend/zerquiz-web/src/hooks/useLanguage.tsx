import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'tr' | 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  tr: {
    'dashboard': 'Ana Sayfa',
    'content': 'İçerik',
    'content_library': 'İçerik Kütüphanesi',
    'ai_generation': 'AI Üretim',
    'lesson_plans': 'Ders Planları',
    'lesson_templates': 'Ders Şablonları',
    'lessons': 'Ders Planları',
    'assignments': 'Ödevler',
    'questions': 'Sorular',
    'question_generator': 'Soru Üreteci',
    'question_bank': 'Soru Bankası',
    'exams': 'Sınavlar',
    'exam_list': 'Sınav Listesi',
    'exam_management': 'Sınav Yönetimi',
    'grading': 'Notlandırma',
    'analytics': 'Analitik',
    'student_progress': 'Öğrenci İlerlemesi',
    'learning_style': 'Öğrenme Stili',
    'classroom_dashboard': 'Sınıf Paneli',
    'ai_assistants': 'AI Asistanları',
    'writing_assistant': 'Yazma Asistanı',
    'project_analysis': 'Proje Analizi',
    'file_refactor': 'Kod Düzenleme',
    'auto_module_generator': 'Otomatik Modül Üretici',
    'gamification': 'Oyunlaştırma',
    'admin': 'Yönetim',
    'settings': 'Ayarlar',
    'logout': 'Çıkış Yap',
    'profile': 'Profil',
    'my_profile': 'Profilim',
    'welcome': 'Hoş Geldiniz',
    'login': 'Giriş Yap',
    'quick_actions': 'Hızlı Erişim',
    'new_quiz': 'Yeni Quiz',
    'new_lesson_plan': 'Yeni Ders Planı',
    'upload_content': 'İçerik Yükle',
    'my_assignments': 'Ödevlerim',
    'my_progress': 'İlerlemem',
    'user_management': 'Kullanıcı Yönetimi',
    'tenant_management': 'Tenant Yönetimi',
    'tenants': 'Tenantlar',
    'tenant_settings': 'Tenant Ayarları',
    'users': 'Kullanıcılar',
    'roles_permissions': 'Rol & Yetkiler',
    'departments': 'Departmanlar',
    'curriculum_management': 'Müfredat Yönetimi',
    'subjects': 'Dersler',
    'topics': 'Konular',
    'grades': 'Sınıflar',
    'system_management': 'Sistem Yönetimi',
    'system_definitions': 'Sistem Tanımları',
    'ai_configuration': 'AI Yapılandırma',
    'audit_logs': 'İşlem Logları',
    'presentations': 'Sunumlar',
    'presentation_list': 'Sunum Listesi',
    'presentation_builder': 'Sunum Oluşturucu',
    'courses': 'Kurslar',
    'certificates': 'Sertifikalar',
    'finance': 'Finans',
    'payments': 'Ödemeler',
    'subscriptions': 'Abonelikler',
    'invoices': 'Faturalar',
    'licenses': 'Lisanslar',
    'license_packages': 'Lisans Paketleri',
    'royalty_management': 'Telif Yönetimi',
    'author_dashboard': 'Yazar Paneli',
    'royalty_reports': 'Telif Raporları',
    'contracts': 'Sözleşmeler',
    'communication': 'İletişim',
    'parent_portal': 'Veli Portalı',
    'integrations': 'Entegrasyonlar',
    'lti_integration': 'LTI Entegrasyonu',
    'monitoring': 'İzleme',
    'locations': 'Lokasyonlar',
    'reports': 'Raporlar',
    'loading': 'Yükleniyor...',
    'save': 'Kaydet',
    'cancel': 'İptal',
    'delete': 'Sil',
    'edit': 'Düzenle',
    'search': 'Ara...',
    'filter': 'Filtrele',
    'all': 'Tümü',
    'active': 'Aktif',
    'inactive': 'İnaktif',
    'draft': 'Taslak',
    'published': 'Yayında',
    'archived': 'Arşiv',
  },
  en: {
    'dashboard': 'Dashboard',
    'content': 'Content',
    'content_library': 'Content Library',
    'ai_generation': 'AI Generation',
    'lesson_plans': 'Lesson Plans',
    'lesson_templates': 'Lesson Templates',
    'lessons': 'Lesson Plans',
    'assignments': 'Assignments',
    'questions': 'Questions',
    'exams': 'Exams',
    'analytics': 'Analytics',
    'student_progress': 'Student Progress',
    'learning_style': 'Learning Style',
    'classroom_dashboard': 'Classroom Dashboard',
    'ai_assistants': 'AI Assistants',
    'writing_assistant': 'Writing Assistant',
    'project_analysis': 'Project Analysis',
    'file_refactor': 'Code Refactoring',
    'auto_module_generator': 'Auto Module Generator',
    'gamification': 'Gamification',
    'admin': 'Administration',
    'settings': 'Settings',
    'logout': 'Logout',
    'profile': 'Profile',
    'my_profile': 'My Profile',
    'welcome': 'Welcome',
    'login': 'Login',
    'quick_actions': 'Quick Actions',
    'new_quiz': 'New Quiz',
    'new_lesson_plan': 'New Lesson Plan',
    'upload_content': 'Upload Content',
    'my_assignments': 'My Assignments',
    'my_progress': 'My Progress',
    'user_management': 'User Management',
    'tenant_management': 'Tenant Management',
    'tenants': 'Tenants',
    'tenant_settings': 'Tenant Settings',
    'users': 'Users',
    'roles_permissions': 'Roles & Permissions',
    'departments': 'Departments',
    'curriculum_management': 'Curriculum Management',
    'subjects': 'Subjects',
    'topics': 'Topics',
    'grades': 'Grades',
    'system_management': 'System Management',
    'system_definitions': 'System Definitions',
    'ai_configuration': 'AI Configuration',
    'audit_logs': 'Audit Logs',
    'presentations': 'Presentations',
    'presentation_list': 'Presentation List',
    'presentation_builder': 'Presentation Builder',
    'courses': 'Courses',
    'certificates': 'Certificates',
    'finance': 'Finance',
    'payments': 'Payments',
    'subscriptions': 'Subscriptions',
    'invoices': 'Invoices',
    'licenses': 'Licenses',
    'license_packages': 'License Packages',
    'royalty_management': 'Royalty Management',
    'author_dashboard': 'Author Dashboard',
    'royalty_reports': 'Royalty Reports',
    'contracts': 'Contracts',
    'communication': 'Communication',
    'parent_portal': 'Parent Portal',
    'integrations': 'Integrations',
    'lti_integration': 'LTI Integration',
    'monitoring': 'Monitoring',
    'locations': 'Locations',
    'reports': 'Reports',
    'loading': 'Loading...',
    'save': 'Save',
    'cancel': 'Cancel',
    'delete': 'Delete',
    'edit': 'Edit',
    'search': 'Search...',
    'filter': 'Filter',
    'all': 'All',
    'active': 'Active',
    'inactive': 'Inactive',
    'draft': 'Draft',
    'published': 'Published',
    'archived': 'Archived',
  },
  ar: {
    'dashboard': 'لوحة القيادة',
    'content': 'المحتوى',
    'content_library': 'مكتبة المحتوى',
    'ai_generation': 'إنشاء بالذكاء الاصطناعي',
    'lesson_plans': 'خطط الدروس',
    'lesson_templates': 'قوالب الدروس',
    'lessons': 'خطط الدروس',
    'assignments': 'الواجبات',
    'questions': 'الأسئلة',
    'exams': 'الامتحانات',
    'analytics': 'التحليلات',
    'student_progress': 'تقدم الطالب',
    'learning_style': 'نمط التعلم',
    'classroom_dashboard': 'لوحة تحكم الفصل',
    'ai_assistants': 'مساعدو الذكاء الاصطناعي',
    'writing_assistant': 'مساعد الكتابة',
    'project_analysis': 'تحليل المشروع',
    'file_refactor': 'إعادة هيكلة الكود',
    'auto_module_generator': 'مولد الوحدات التلقائي',
    'gamification': 'اللعب',
    'admin': 'الإدارة',
    'settings': 'الإعدادات',
    'logout': 'تسجيل خروج',
    'profile': 'الملف الشخصي',
    'my_profile': 'ملفي الشخصي',
    'welcome': 'مرحباً',
    'login': 'تسجيل الدخول',
    'quick_actions': 'الإجراءات السريعة',
    'new_quiz': 'اختبار جديد',
    'new_lesson_plan': 'خطة درس جديدة',
    'upload_content': 'تحميل محتوى',
    'my_assignments': 'واجباتي',
    'my_progress': 'تقدمي',
    'user_management': 'إدارة المستخدمين',
    'tenant_management': 'إدارة المستأجرين',
    'tenants': 'المستأجرون',
    'tenant_settings': 'إعدادات المستأجر',
    'users': 'المستخدمون',
    'roles_permissions': 'الأدوار والصلاحيات',
    'departments': 'الأقسام',
    'curriculum_management': 'إدارة المناهج',
    'subjects': 'المواد',
    'topics': 'المواضيع',
    'grades': 'الصفوف',
    'system_management': 'إدارة النظام',
    'system_definitions': 'تعريفات النظام',
    'ai_configuration': 'تكوين الذكاء الاصطناعي',
    'audit_logs': 'سجلات التدقيق',
    'presentations': 'العروض التقديمية',
    'presentation_list': 'قائمة العروض',
    'presentation_builder': 'منشئ العروض',
    'courses': 'الدورات',
    'certificates': 'الشهادات',
    'finance': 'المالية',
    'payments': 'المدفوعات',
    'subscriptions': 'الاشتراكات',
    'invoices': 'الفواتير',
    'licenses': 'التراخيص',
    'license_packages': 'حزم التراخيص',
    'royalty_management': 'إدارة حقوق الملكية',
    'author_dashboard': 'لوحة المؤلف',
    'royalty_reports': 'تقارير حقوق الملكية',
    'contracts': 'العقود',
    'communication': 'التواصل',
    'parent_portal': 'بوابة أولياء الأمور',
    'integrations': 'التكاملات',
    'lti_integration': 'تكامل LTI',
    'monitoring': 'المراقبة',
    'locations': 'المواقع',
    'reports': 'التقارير',
    'loading': 'جار التحميل...',
    'save': 'حفظ',
    'cancel': 'إلغاء',
    'delete': 'حذف',
    'edit': 'تعديل',
    'search': 'بحث...',
    'filter': 'تصفية',
    'all': 'الكل',
    'active': 'نشط',
    'inactive': 'غير نشط',
    'draft': 'مسودة',
    'published': 'منشور',
    'archived': 'مؤرشف',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('tr');

  // Load language from localStorage on mount
  useEffect(() => {
    const storedLang = localStorage.getItem('language') as Language;
    if (storedLang && ['tr', 'en', 'ar'].includes(storedLang)) {
      setLanguageState(storedLang);
      document.documentElement.lang = storedLang;
      if (storedLang === 'ar') {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

