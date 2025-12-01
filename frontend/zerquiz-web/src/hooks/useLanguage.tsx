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
    'exams': 'Sınavlar',
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

