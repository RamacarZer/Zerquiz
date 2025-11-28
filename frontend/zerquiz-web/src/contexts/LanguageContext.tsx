import React, { useState, createContext, useContext, ReactNode } from 'react';
import { Globe, Check } from 'lucide-react';

type Language = 'tr' | 'en' | 'de' | 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  tr: {
    'app.title': 'Zerquiz Sınav Sistemi',
    'app.subtitle': 'Gelişmiş sınav ve değerlendirme platformu',
    'nav.dashboard': 'Ana Sayfa',
    'nav.exams': 'Sınavlar',
    'nav.questions': 'Soru Bankası',
    'nav.students': 'Öğrenciler',
    'nav.reports': 'Raporlar',
    'nav.settings': 'Ayarlar',
    'exam.start': 'Sınavı Başlat',
    'exam.submit': 'Teslim Et',
    'exam.timeRemaining': 'Kalan Süre',
    'exam.question': 'Soru',
    'exam.totalQuestions': 'Toplam Soru',
    'button.save': 'Kaydet',
    'button.cancel': 'İptal',
    'button.delete': 'Sil',
    'button.edit': 'Düzenle',
    'message.success': 'İşlem başarılı!',
    'message.error': 'Bir hata oluştu!',
  },
  en: {
    'app.title': 'Zerquiz Exam System',
    'app.subtitle': 'Advanced exam and assessment platform',
    'nav.dashboard': 'Dashboard',
    'nav.exams': 'Exams',
    'nav.questions': 'Question Bank',
    'nav.students': 'Students',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'exam.start': 'Start Exam',
    'exam.submit': 'Submit',
    'exam.timeRemaining': 'Time Remaining',
    'exam.question': 'Question',
    'exam.totalQuestions': 'Total Questions',
    'button.save': 'Save',
    'button.cancel': 'Cancel',
    'button.delete': 'Delete',
    'button.edit': 'Edit',
    'message.success': 'Operation successful!',
    'message.error': 'An error occurred!',
  },
  de: {
    'app.title': 'Zerquiz Prüfungssystem',
    'app.subtitle': 'Fortgeschrittene Prüfungs- und Bewertungsplattform',
    'nav.dashboard': 'Startseite',
    'nav.exams': 'Prüfungen',
    'nav.questions': 'Fragenbank',
    'nav.students': 'Schüler',
    'nav.reports': 'Berichte',
    'nav.settings': 'Einstellungen',
    'exam.start': 'Prüfung starten',
    'exam.submit': 'Einreichen',
    'exam.timeRemaining': 'Verbleibende Zeit',
    'exam.question': 'Frage',
    'exam.totalQuestions': 'Fragen insgesamt',
    'button.save': 'Speichern',
    'button.cancel': 'Abbrechen',
    'button.delete': 'Löschen',
    'button.edit': 'Bearbeiten',
    'message.success': 'Vorgang erfolgreich!',
    'message.error': 'Ein Fehler ist aufgetreten!',
  },
  fr: {
    'app.title': 'Système d\'examen Zerquiz',
    'app.subtitle': 'Plateforme avancée d\'examen et d\'évaluation',
    'nav.dashboard': 'Tableau de bord',
    'nav.exams': 'Examens',
    'nav.questions': 'Banque de questions',
    'nav.students': 'Étudiants',
    'nav.reports': 'Rapports',
    'nav.settings': 'Paramètres',
    'exam.start': 'Commencer l\'examen',
    'exam.submit': 'Soumettre',
    'exam.timeRemaining': 'Temps restant',
    'exam.question': 'Question',
    'exam.totalQuestions': 'Questions totales',
    'button.save': 'Sauvegarder',
    'button.cancel': 'Annuler',
    'button.delete': 'Supprimer',
    'button.edit': 'Modifier',
    'message.success': 'Opération réussie!',
    'message.error': 'Une erreur s\'est produite!',
  },
  ar: {
    'app.title': 'نظام اختبارات Zerquiz',
    'app.subtitle': 'منصة متقدمة للاختبارات والتقييم',
    'nav.dashboard': 'الصفحة الرئيسية',
    'nav.exams': 'الاختبارات',
    'nav.questions': 'بنك الأسئلة',
    'nav.students': 'الطلاب',
    'nav.reports': 'التقارير',
    'nav.settings': 'الإعدادات',
    'exam.start': 'بدء الاختبار',
    'exam.submit': 'إرسال',
    'exam.timeRemaining': 'الوقت المتبقي',
    'exam.question': 'سؤال',
    'exam.totalQuestions': 'إجمالي الأسئلة',
    'button.save': 'حفظ',
    'button.cancel': 'إلغاء',
    'button.delete': 'حذف',
    'button.edit': 'تحرير',
    'message.success': 'تمت العملية بنجاح!',
    'message.error': 'حدث خطأ!',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Export LanguageProvider
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('tr');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = lang;
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Export useLanguage hook
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

// Export LanguageSwitcher component
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'tr' as Language, name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
    { code: 'de' as Language, name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
    { code: 'ar' as Language, name: 'العربية', flag: '🇸🇦' },
  ];

  const currentLanguage = languages.find(l => l.code === language) || languages[0];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Globe className="h-5 w-5 text-gray-600" />
        <span className="text-2xl">{currentLanguage.flag}</span>
        <span className="text-sm font-medium text-gray-700">{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-4 py-2 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  language === lang.code ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-sm font-medium text-gray-700">{lang.name}</span>
                </div>
                {language === lang.code && <Check className="h-4 w-4 text-blue-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Export Demo Page
export function MultiLanguageDemoPage() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('app.title')}</h1>
              <p className="text-gray-600 mt-1">{t('app.subtitle')}</p>
            </div>
            <LanguageSwitcher />
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>💡 Çoklu Dil Desteği:</strong> Sistem şu anda <strong>{language.toUpperCase()}</strong> dilinde görüntüleniyor.
              {language === 'ar' && ' (RTL - Sağdan sola yazım aktif)'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Navigasyon</h2>
          <nav className="flex flex-wrap gap-2">
            {['dashboard', 'exams', 'questions', 'students', 'reports', 'settings'].map(key => (
              <button
                key={key}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {t(`nav.${key}`)}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-md p-6 text-white">
          <h2 className="text-xl font-bold mb-3">Dil Bilgileri</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="opacity-90">Aktif Dil:</p>
              <p className="text-lg font-bold">{language.toUpperCase()}</p>
            </div>
            <div>
              <p className="opacity-90">Yazım Yönü:</p>
              <p className="text-lg font-bold">{language === 'ar' ? 'RTL (→)' : 'LTR (←)'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
