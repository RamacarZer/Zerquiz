// Navigation configuration with role-based access control and multi-language support

export interface MenuItem {
  id: string;
  labelKey: string; // Translation key
  icon: string; // Lucide icon name
  path: string;
  roles: string[]; // Allowed roles
  badge?: string | number; // Optional badge
  section?: 'main' | 'ai' | 'reports' | 'admin' | 'settings'; // Menu section
  children?: MenuItem[];
}

export interface QuickAction {
  id: string;
  labelKey: string;
  icon: string;
  path: string;
  roles: string[];
  color: string; // bg-color class
}

// Main navigation menu items
export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    labelKey: 'dashboard',
    icon: 'LayoutDashboard',
    path: '/dashboard',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
    section: 'main',
  },
  {
    id: 'content',
    labelKey: 'content_library',
    icon: 'Library',
    path: '/content',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
    badge: 'NEW',
    section: 'main',
  },
  {
    id: 'classroom',
    labelKey: 'classroom',
    icon: 'BookOpen',
    path: '/classroom',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
  },
  {
    id: 'lessons',
    labelKey: 'lessons',
    icon: 'BookText',
    path: '/lessons/plans',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
    children: [
      {
        id: 'lesson-plans',
        labelKey: 'lesson_plans',
        icon: 'BookPlus',
        path: '/lessons/plans',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
      },
      {
        id: 'lesson-templates',
        labelKey: 'lesson_templates',
        icon: 'FileText',
        path: '/lessons/templates',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
      },
    ],
  },
  {
    id: 'assignments',
    labelKey: 'assignments',
    icon: 'ClipboardList',
    path: '/assignments',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
  },
  {
    id: 'analytics',
    labelKey: 'analytics',
    icon: 'BarChart3',
    path: '/analytics',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
  },
  {
    id: 'reports',
    labelKey: 'reports_dashboards',
    icon: 'BarChart2',
    path: '/reports/student',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student', 'Parent'],
    children: [
      {
        id: 'student-dashboard',
        labelKey: 'student_dashboard',
        icon: 'User',
        path: '/reports/student',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student', 'Parent'],
      },
      {
        id: 'parent-dashboard',
        labelKey: 'parent_dashboard',
        icon: 'Users',
        path: '/reports/parent',
        roles: ['SuperAdmin', 'TenantAdmin', 'Parent'],
      },
      {
        id: 'school-dashboard',
        labelKey: 'school_dashboard',
        icon: 'Building',
        path: '/reports/school',
        roles: ['SuperAdmin', 'TenantAdmin'],
      },
      {
        id: 'publisher-dashboard',
        labelKey: 'publisher_dashboard',
        icon: 'BookMarked',
        path: '/reports/publisher',
        roles: ['SuperAdmin', 'Publisher'],
      },
    ],
  },
  {
    id: 'ai-assistants',
    labelKey: 'ai_assistants',
    icon: 'Wand2',
    path: '/ai-assistants/writing',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
    badge: 'NEW',
    children: [
      {
        id: 'writing-assistant',
        labelKey: 'writing_assistant',
        icon: 'PenTool',
        path: '/ai-assistants/writing',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
      },
      {
        id: 'project-analysis',
        labelKey: 'project_analysis',
        icon: 'FileSearch',
        path: '/ai-assistants/project-analysis',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
      },
      {
        id: 'file-refactor',
        labelKey: 'file_refactor',
        icon: 'Code',
        path: '/ai-assistants/file-refactor',
        roles: ['SuperAdmin', 'TenantAdmin', 'Developer'],
      },
    ],
  },
  {
    id: 'auto-module',
    labelKey: 'auto_module_generator',
    icon: 'Zap',
    path: '/auto-generate-module',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
    badge: 'NEW',
  },
  {
    id: 'questions',
    labelKey: 'questions',
    icon: 'HelpCircle',
    path: '/questions',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
    badge: 'AI',
    children: [
      {
        id: 'question-review',
        labelKey: 'question_review',
        icon: 'ClipboardCheck',
        path: '/questions/review-queue',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
      },
      {
        id: 'question-pool',
        labelKey: 'question_pool',
        icon: 'Database',
        path: '/questions/pool',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
      },
    ],
  },
  {
    id: 'exams',
    labelKey: 'exams',
    icon: 'FileQuestion',
    path: '/exams',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
  },
  {
    id: 'student-exams',
    labelKey: 'student_exam_portal',
    icon: 'GraduationCap',
    path: '/student/exams',
    roles: ['Student'],
  },
  {
    id: 'grading',
    labelKey: 'grading',
    icon: 'Award',
    path: '/grading',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
  },
  {
    id: 'gamification',
    labelKey: 'gamification',
    icon: 'Trophy',
    path: '/gamification',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
  },
  // ============================================
  // CONTENT & PUBLISHING
  // ============================================
  {
    id: 'books',
    labelKey: 'books',
    icon: 'BookMarked',
    path: '/books',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
  },
  {
    id: 'presentations',
    labelKey: 'presentations',
    icon: 'Presentation',
    path: '/presentations',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
  },
  {
    id: 'courses',
    labelKey: 'courses',
    icon: 'GraduationCap',
    path: '/courses',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
  },
  {
    id: 'certificates',
    labelKey: 'certificates',
    icon: 'Award',
    path: '/certificates',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
  },
  // ============================================
  // TOOLS & EDITORS
  // ============================================
  {
    id: 'smartboard',
    labelKey: 'smartboard',
    icon: 'Monitor',
    path: '/smartboard',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
    badge: 'NEW',
  },
  {
    id: 'whiteboard',
    labelKey: 'whiteboard',
    icon: 'Palette',
    path: '/whiteboard',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
  },
  {
    id: 'dictionary',
    labelKey: 'dictionary',
    icon: 'BookText',
    path: '/dictionary',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
  },
  {
    id: 'editors',
    labelKey: 'editors',
    icon: 'Code',
    path: '/editors/code',
    roles: ['SuperAdmin', 'TenantAdmin', 'Developer'],
    children: [
      {
        id: 'code-editor',
        labelKey: 'code_editor',
        icon: 'Code',
        path: '/editors/code',
        roles: ['SuperAdmin', 'TenantAdmin', 'Developer'],
      },
      {
        id: 'math-editor',
        labelKey: 'math_editor',
        icon: 'Calculator',
        path: '/editors/math',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
      },
    ],
  },
  // ============================================
  // FINANCIAL & BUSINESS
  // ============================================
  {
    id: 'finance',
    labelKey: 'finance',
    icon: 'DollarSign',
    path: '/finance',
    roles: ['SuperAdmin', 'TenantAdmin'],
    section: 'main',
  },
  {
    id: 'licenses',
    labelKey: 'licenses',
    icon: 'Key',
    path: '/licenses/packages',
    roles: ['SuperAdmin', 'TenantAdmin'],
    children: [
      {
        id: 'license-packages',
        labelKey: 'license_packages',
        icon: 'Package',
        path: '/licenses/packages',
        roles: ['SuperAdmin', 'TenantAdmin'],
      },
      {
        id: 'licensing-plans',
        labelKey: 'licensing_plans',
        icon: 'CreditCard',
        path: '/licensing/plans',
        roles: ['SuperAdmin', 'TenantAdmin'],
      },
      {
        id: 'licensing-billing',
        labelKey: 'licensing_billing',
        icon: 'Receipt',
        path: '/licensing/billing',
        roles: ['SuperAdmin', 'TenantAdmin'],
      },
    ],
  },
  {
    id: 'royalty',
    labelKey: 'royalty_management',
    icon: 'Copyright',
    path: '/royalty',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
  },
  {
    id: 'contracts',
    labelKey: 'contracts',
    icon: 'FileSignature',
    path: '/contracts',
    roles: ['SuperAdmin', 'TenantAdmin'],
  },
  // ============================================
  // COMMUNICATION & COLLABORATION
  // ============================================
  {
    id: 'communication',
    labelKey: 'communication',
    icon: 'MessageSquare',
    path: '/communication',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
  },
  {
    id: 'notifications',
    labelKey: 'notifications',
    icon: 'Bell',
    path: '/notifications',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
  },
  {
    id: 'parent-portal',
    labelKey: 'parent_portal',
    icon: 'Users',
    path: '/parent-portal',
    roles: ['Parent', 'SuperAdmin', 'TenantAdmin'],
  },
  // ============================================
  // INTEGRATIONS & ADVANCED
  // ============================================
  {
    id: 'integrations',
    labelKey: 'integrations',
    icon: 'Plug',
    path: '/integrations',
    roles: ['SuperAdmin', 'TenantAdmin'],
  },
  {
    id: 'monitoring',
    labelKey: 'monitoring',
    icon: 'Activity',
    path: '/monitoring',
    roles: ['SuperAdmin'],
  },
  {
    id: 'locations',
    labelKey: 'locations',
    icon: 'MapPin',
    path: '/locations',
    roles: ['SuperAdmin', 'TenantAdmin'],
  },
  // ============================================
  // ADMIN & SYSTEM MANAGEMENT
  // ============================================
  {
    id: 'tenants',
    labelKey: 'tenant_management',
    icon: 'Building',
    path: '/admin/tenants',
    roles: ['SuperAdmin'],
    children: [
      {
        id: 'tenant-list',
        labelKey: 'tenants',
        icon: 'List',
        path: '/admin/tenants',
        roles: ['SuperAdmin'],
      },
      {
        id: 'tenant-settings',
        labelKey: 'tenant_settings',
        icon: 'Settings',
        path: '/admin/tenant-settings',
        roles: ['SuperAdmin', 'TenantAdmin'],
      },
    ],
  },
  {
    id: 'users',
    labelKey: 'user_management',
    icon: 'Users',
    path: '/admin/users',
    roles: ['SuperAdmin', 'TenantAdmin'],
    children: [
      {
        id: 'users-list',
        labelKey: 'users',
        icon: 'List',
        path: '/admin/users',
        roles: ['SuperAdmin', 'TenantAdmin'],
      },
      {
        id: 'roles',
        labelKey: 'roles_permissions',
        icon: 'Shield',
        path: '/admin/roles',
        roles: ['SuperAdmin', 'TenantAdmin'],
      },
      {
        id: 'departments',
        labelKey: 'departments',
        icon: 'Building',
        path: '/admin/departments',
        roles: ['SuperAdmin', 'TenantAdmin'],
      },
    ],
  },
  {
    id: 'curriculum',
    labelKey: 'curriculum_management',
    icon: 'BookOpen',
    path: '/admin/curriculum',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
    children: [
      {
        id: 'subjects',
        labelKey: 'subjects',
        icon: 'Book',
        path: '/admin/curriculum/subjects',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
      },
      {
        id: 'topics',
        labelKey: 'topics',
        icon: 'List',
        path: '/admin/curriculum/topics',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
      },
      {
        id: 'grades',
        labelKey: 'grades',
        icon: 'Award',
        path: '/admin/curriculum/grades',
        roles: ['SuperAdmin', 'TenantAdmin'],
      },
    ],
  },
  {
    id: 'admin-books',
    labelKey: 'book_management',
    icon: 'BookCheck',
    path: '/admin/books/approval',
    roles: ['SuperAdmin', 'TenantAdmin'],
    children: [
      {
        id: 'book-approval',
        labelKey: 'book_approval',
        icon: 'CheckCircle',
        path: '/admin/books/approval',
        roles: ['SuperAdmin', 'TenantAdmin'],
      },
    ],
  },
  {
    id: 'admin-licenses',
    labelKey: 'license_administration',
    icon: 'KeyRound',
    path: '/admin/licenses',
    roles: ['SuperAdmin'],
  },
  {
    id: 'evaluation',
    labelKey: 'evaluation',
    icon: 'ClipboardCheck',
    path: '/evaluation/rubric',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
  },
  {
    id: 'system',
    labelKey: 'system_management',
    icon: 'Settings',
    path: '/admin/system',
    roles: ['SuperAdmin'],
    children: [
      {
        id: 'definitions',
        labelKey: 'system_definitions',
        icon: 'Database',
        path: '/admin/system/definitions',
        roles: ['SuperAdmin'],
      },
      {
        id: 'ai-config',
        labelKey: 'ai_configuration',
        icon: 'Bot',
        path: '/admin/system/ai-config',
        roles: ['SuperAdmin'],
      },
      {
        id: 'audit-logs',
        labelKey: 'audit_logs',
        icon: 'FileText',
        path: '/admin/system/audit-logs',
        roles: ['SuperAdmin'],
      },
    ],
  },
  {
    id: 'settings',
    labelKey: 'settings',
    icon: 'Settings',
    path: '/settings/profile',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
  },
];

// Quick actions - role-based shortcuts at the top of sidebar
export const quickActions: QuickAction[] = [
  // Teacher Quick Actions
  {
    id: 'new-quiz',
    labelKey: 'new_quiz',
    icon: 'Plus',
    path: '/questions',
    roles: ['Teacher', 'TenantAdmin', 'SuperAdmin'],
    color: 'bg-blue-500',
  },
  {
    id: 'new-lesson',
    labelKey: 'new_lesson_plan',
    icon: 'BookPlus',
    path: '/classroom',
    roles: ['Teacher', 'TenantAdmin', 'SuperAdmin'],
    color: 'bg-green-500',
  },
  {
    id: 'upload-content',
    labelKey: 'upload_content',
    icon: 'Upload',
    path: '/content',
    roles: ['Teacher', 'TenantAdmin', 'SuperAdmin'],
    color: 'bg-purple-500',
  },
  // Student Quick Actions
  {
    id: 'my-assignments',
    labelKey: 'my_assignments',
    icon: 'CheckSquare',
    path: '/classroom',
    roles: ['Student'],
    color: 'bg-orange-500',
  },
  {
    id: 'my-progress',
    labelKey: 'my_progress',
    icon: 'TrendingUp',
    path: '/analytics',
    roles: ['Student'],
    color: 'bg-teal-500',
  },
  // Admin Quick Actions
  {
    id: 'user-management',
    labelKey: 'user_management',
    icon: 'UserPlus',
    path: '/admin/users',
    roles: ['SuperAdmin', 'TenantAdmin'],
    color: 'bg-red-500',
  },
  {
    id: 'reports',
    labelKey: 'reports',
    icon: 'FileBarChart',
    path: '/analytics',
    roles: ['SuperAdmin', 'TenantAdmin'],
    color: 'bg-indigo-500',
  },
];

// Helper function: Get filtered menu items based on user roles
export function getFilteredMenu(userRoles: string[]): MenuItem[] {
  // If no roles or SuperAdmin, show all menus
  const isSuperAdmin = userRoles.includes('SuperAdmin') || userRoles.includes('superadmin');
  
  if (isSuperAdmin || userRoles.length === 0) {
    // SuperAdmin sees everything
    return menuItems;
  }
  
  return menuItems
    .filter((item) => item.roles.some((role) => userRoles.includes(role)))
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: item.children.filter((child) =>
            child.roles.some((role) => userRoles.includes(role))
          ),
        };
      }
      return item;
    });
}

// Helper function: Get quick actions based on user roles
export function getQuickActions(userRoles: string[]): QuickAction[] {
  return quickActions.filter((action) =>
    action.roles.some((role) => userRoles.includes(role))
  );
}

// Helper function: Get translated menu label
export function getMenuLabel(labelKey: string, t: (key: string) => string): string {
  return t(labelKey);
}

// Translation keys used in navigation (to be added to useLanguage hook)
export const navigationTranslations = {
  tr: {
    dashboard: 'Kontrol Paneli',
    content_library: 'İçerik Kütüphanesi',
    ai_generation: 'AI Üretim',
    classroom: 'Sınıf',
    lessons: 'Dersler',
    lesson_plans: 'Ders Planları',
    lesson_templates: 'Ders Şablonları',
    assignments: 'Ödevler',
    analytics: 'Analizler',
    reports_dashboards: 'Raporlar',
    student_dashboard: 'Öğrenci Dashboard',
    parent_dashboard: 'Veli Dashboard',
    school_dashboard: 'Okul Dashboard',
    publisher_dashboard: 'Yayınevi Dashboard',
    student_progress: 'Öğrenci İlerlemesi',
    learning_style: 'Öğrenme Stili',
    classroom_dashboard: 'Sınıf Paneli',
    ai_assistants: 'AI Asistanları',
    writing_assistant: 'Yazma Asistanı',
    project_analysis: 'Proje Analizi',
    file_refactor: 'Kod Düzenleme',
    auto_module_generator: 'Otomatik Modül Üretici',
    questions: 'Sorular',
    question_review: 'Soru Onay Kuyruğu',
    question_pool: 'Soru Havuzu',
    question_generator: 'Soru Üretici (AI)',
    question_bank: 'Soru Bankası',
    exams: 'Sınavlar',
    student_exam_portal: 'Öğrenci Sınav Portalı',
    grading: 'Notlandırma',
    gamification: 'Oyunlaştırma',
    books: 'Kitaplar',
    presentations: 'Sunumlar',
    courses: 'Kurslar',
    certificates: 'Sertifikalar',
    smartboard: 'Akıllı Tahta',
    whiteboard: 'Beyaz Tahta',
    dictionary: 'Kelime Defteri',
    editors: 'Editörler',
    code_editor: 'Kod Editörü',
    math_editor: 'Matematik Editörü',
    finance: 'Finans',
    licenses: 'Lisanslar',
    license_packages: 'Lisans Paketleri',
    licensing_plans: 'Lisans Planları',
    licensing_billing: 'Faturalama',
    royalty_management: 'Telif Yönetimi',
    contracts: 'Sözleşmeler',
    communication: 'İletişim',
    notifications: 'Bildirimler',
    parent_portal: 'Veli Portalı',
    integrations: 'Entegrasyonlar',
    monitoring: 'İzleme',
    locations: 'Lokasyonlar',
    tenant_management: 'Tenant Yönetimi',
    tenants: 'Tenantlar',
    tenant_settings: 'Tenant Ayarları',
    user_management: 'Kullanıcı Yönetimi',
    users: 'Kullanıcılar',
    roles_permissions: 'Roller ve Yetkiler',
    departments: 'Departmanlar',
    curriculum_management: 'Müfredat Yönetimi',
    subjects: 'Dersler',
    topics: 'Konular',
    grades: 'Sınıflar',
    book_management: 'Kitap Yönetimi',
    book_approval: 'Kitap Onayı',
    license_administration: 'Lisans Yönetimi',
    evaluation: 'Değerlendirme',
    system_management: 'Sistem Yönetimi',
    system_definitions: 'Sistem Tanımları',
    ai_configuration: 'AI Yapılandırma',
    audit_logs: 'Denetim Kayıtları',
    settings: 'Ayarlar',
    new_quiz: 'Yeni Quiz',
    new_lesson_plan: 'Yeni Ders Planı',
    upload_content: 'İçerik Yükle',
    my_assignments: 'Ödevlerim',
    my_progress: 'İlerlemem',
    reports: 'Raporlar',
  },
  en: {
    dashboard: 'Dashboard',
    content_library: 'Content Library',
    ai_generation: 'AI Generation',
    classroom: 'Classroom',
    lessons: 'Lessons',
    lesson_plans: 'Lesson Plans',
    lesson_templates: 'Lesson Templates',
    assignments: 'Assignments',
    analytics: 'Analytics',
    reports_dashboards: 'Reports',
    student_dashboard: 'Student Dashboard',
    parent_dashboard: 'Parent Dashboard',
    school_dashboard: 'School Dashboard',
    publisher_dashboard: 'Publisher Dashboard',
    student_progress: 'Student Progress',
    learning_style: 'Learning Style',
    classroom_dashboard: 'Classroom Dashboard',
    ai_assistants: 'AI Assistants',
    writing_assistant: 'Writing Assistant',
    project_analysis: 'Project Analysis',
    file_refactor: 'Code Refactoring',
    auto_module_generator: 'Auto Module Generator',
    questions: 'Questions',
    question_review: 'Question Review Queue',
    question_pool: 'Question Pool',
    question_generator: 'Question Generator (AI)',
    question_bank: 'Question Bank',
    exams: 'Exams',
    student_exam_portal: 'Student Exam Portal',
    grading: 'Grading',
    gamification: 'Gamification',
    books: 'Books',
    presentations: 'Presentations',
    courses: 'Courses',
    certificates: 'Certificates',
    smartboard: 'Smartboard',
    whiteboard: 'Whiteboard',
    dictionary: 'Dictionary',
    editors: 'Editors',
    code_editor: 'Code Editor',
    math_editor: 'Math Editor',
    finance: 'Finance',
    licenses: 'Licenses',
    license_packages: 'License Packages',
    licensing_plans: 'Licensing Plans',
    licensing_billing: 'Billing',
    royalty_management: 'Royalty Management',
    contracts: 'Contracts',
    communication: 'Communication',
    notifications: 'Notifications',
    parent_portal: 'Parent Portal',
    integrations: 'Integrations',
    monitoring: 'Monitoring',
    locations: 'Locations',
    tenant_management: 'Tenant Management',
    tenants: 'Tenants',
    tenant_settings: 'Tenant Settings',
    user_management: 'User Management',
    users: 'Users',
    roles_permissions: 'Roles & Permissions',
    departments: 'Departments',
    curriculum_management: 'Curriculum Management',
    subjects: 'Subjects',
    topics: 'Topics',
    grades: 'Grades',
    book_management: 'Book Management',
    book_approval: 'Book Approval',
    license_administration: 'License Administration',
    evaluation: 'Evaluation',
    system_management: 'System Management',
    system_definitions: 'System Definitions',
    ai_configuration: 'AI Configuration',
    audit_logs: 'Audit Logs',
    settings: 'Settings',
    new_quiz: 'New Quiz',
    new_lesson_plan: 'New Lesson Plan',
    upload_content: 'Upload Content',
    my_assignments: 'My Assignments',
    my_progress: 'My Progress',
    user_management: 'User Management',
    reports: 'Reports',
  },
  ar: {
    dashboard: 'لوحة القيادة',
    content_library: 'مكتبة المحتوى',
    ai_generation: 'إنشاء بالذكاء الاصطناعي',
    classroom: 'الفصل',
    lessons: 'الدروس',
    lesson_plans: 'خطط الدروس',
    lesson_templates: 'قوالب الدروس',
    assignments: 'الواجبات',
    analytics: 'التحليلات',
    reports_dashboards: 'التقارير',
    student_dashboard: 'لوحة الطالب',
    parent_dashboard: 'لوحة ولي الأمر',
    school_dashboard: 'لوحة المدرسة',
    publisher_dashboard: 'لوحة الناشر',
    student_progress: 'تقدم الطالب',
    learning_style: 'نمط التعلم',
    classroom_dashboard: 'لوحة تحكم الفصل',
    ai_assistants: 'مساعدو الذكاء الاصطناعي',
    writing_assistant: 'مساعد الكتابة',
    project_analysis: 'تحليل المشروع',
    file_refactor: 'إعادة هيكلة الكود',
    auto_module_generator: 'مولد الوحدات التلقائي',
    questions: 'الأسئلة',
    question_review: 'قائمة مراجعة الأسئلة',
    question_pool: 'بنك الأسئلة',
    exams: 'الامتحانات',
    student_exam_portal: 'بوابة امتحانات الطالب',
    grading: 'التقييم',
    gamification: 'التلعيب',
    books: 'الكتب',
    presentations: 'العروض',
    courses: 'الدورات',
    certificates: 'الشهادات',
    smartboard: 'السبورة الذكية',
    whiteboard: 'السبورة البيضاء',
    dictionary: 'القاموس',
    editors: 'المحررات',
    code_editor: 'محرر الأكواد',
    math_editor: 'محرر الرياضيات',
    finance: 'المالية',
    licenses: 'التراخيص',
    settings: 'الإعدادات',
    new_quiz: 'اختبار جديد',
    new_lesson_plan: 'خطة درس جديدة',
    upload_content: 'تحميل محتوى',
    my_assignments: 'واجباتي',
    my_progress: 'تقدمي',
    user_management: 'إدارة المستخدمين',
    reports: 'التقارير',
  },
};

