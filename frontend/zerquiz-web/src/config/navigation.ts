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
    icon: 'FileText',
    path: '/content-library',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
    badge: 'NEW',
    section: 'main',
  },
  {
    id: 'ai-generate',
    labelKey: 'ai_generation',
    icon: 'Sparkles',
    path: '/ai-generate',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
    badge: 'NEW',
  },
  {
    id: 'lessons',
    labelKey: 'lesson_plans',
    icon: 'BookOpen',
    path: '/lesson-plans',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
  },
  {
    id: 'templates',
    labelKey: 'lesson_templates',
    icon: 'Library',
    path: '/lesson-templates',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
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
    path: '/analytics/student-progress',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
    children: [
      {
        id: 'student-progress',
        labelKey: 'student_progress',
        icon: 'TrendingUp',
        path: '/analytics/student-progress',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
      },
      {
        id: 'learning-style',
        labelKey: 'learning_style',
        icon: 'Brain',
        path: '/analytics/learning-style',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
      },
      {
        id: 'classroom-dashboard',
        labelKey: 'classroom_dashboard',
        icon: 'Users',
        path: '/analytics/classroom-dashboard',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
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
    path: '/questions/generator',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
    badge: 'AI',
    children: [
      {
        id: 'question-generator',
        labelKey: 'question_generator',
        icon: 'Sparkles',
        path: '/questions/generator',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
      },
      {
        id: 'question-bank',
        labelKey: 'question_bank',
        icon: 'Database',
        path: '/questions/bank',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
      },
    ],
  },
  {
    id: 'exams',
    labelKey: 'exams',
    icon: 'FileText',
    path: '/exams',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
    children: [
      {
        id: 'exam-list',
        labelKey: 'exam_list',
        icon: 'List',
        path: '/exams',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
      },
      {
        id: 'exam-management',
        labelKey: 'exam_management',
        icon: 'Settings',
        path: '/exams/manage',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
      },
    ],
  },
  {
    id: 'grading',
    labelKey: 'grading',
    icon: 'Award',
    path: '/grading',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
  },
  // ============================================
  // CONTENT & PUBLISHING
  // ============================================
  {
    id: 'presentations',
    labelKey: 'presentations',
    icon: 'Monitor',
    path: '/presentations',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
    children: [
      {
        id: 'presentation-list',
        labelKey: 'presentation_list',
        icon: 'List',
        path: '/presentations',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
      },
      {
        id: 'presentation-builder',
        labelKey: 'presentation_builder',
        icon: 'Plus',
        path: '/presentations/builder',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
      },
    ],
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
  // FINANCIAL & BUSINESS
  // ============================================
  {
    id: 'finance',
    labelKey: 'finance',
    icon: 'DollarSign',
    path: '/finance',
    roles: ['SuperAdmin', 'TenantAdmin'],
    children: [
      {
        id: 'payments',
        labelKey: 'payments',
        icon: 'CreditCard',
        path: '/finance/payments',
        roles: ['SuperAdmin', 'TenantAdmin'],
      },
      {
        id: 'subscriptions',
        labelKey: 'subscriptions',
        icon: 'Calendar',
        path: '/finance/subscriptions',
        roles: ['SuperAdmin', 'TenantAdmin'],
      },
      {
        id: 'invoices',
        labelKey: 'invoices',
        icon: 'FileText',
        path: '/finance/invoices',
        roles: ['SuperAdmin', 'TenantAdmin'],
      },
    ],
  },
  {
    id: 'licenses',
    labelKey: 'licenses',
    icon: 'Key',
    path: '/licenses',
    roles: ['SuperAdmin', 'TenantAdmin'],
    children: [
      {
        id: 'license-packages',
        labelKey: 'license_packages',
        icon: 'Package',
        path: '/licenses/packages',
        roles: ['SuperAdmin', 'TenantAdmin'],
      },
    ],
  },
  {
    id: 'royalty',
    labelKey: 'royalty_management',
    icon: 'Coins',
    path: '/royalty',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
    children: [
      {
        id: 'author-dashboard',
        labelKey: 'author_dashboard',
        icon: 'BarChart3',
        path: '/royalty/author-dashboard',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
      },
      {
        id: 'royalty-reports',
        labelKey: 'royalty_reports',
        icon: 'FileText',
        path: '/royalty/reports',
        roles: ['SuperAdmin', 'TenantAdmin'],
      },
    ],
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
    children: [
      {
        id: 'lti-integration',
        labelKey: 'lti_integration',
        icon: 'Link',
        path: '/integrations/lti',
        roles: ['SuperAdmin', 'TenantAdmin'],
      },
    ],
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
    path: '/settings',
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
    path: '/ai-generate?type=quiz',
    roles: ['Teacher', 'TenantAdmin', 'SuperAdmin'],
    color: 'bg-blue-500',
  },
  {
    id: 'new-lesson',
    labelKey: 'new_lesson_plan',
    icon: 'BookPlus',
    path: '/lesson-plans/create',
    roles: ['Teacher', 'TenantAdmin', 'SuperAdmin'],
    color: 'bg-green-500',
  },
  {
    id: 'upload-content',
    labelKey: 'upload_content',
    icon: 'Upload',
    path: '/content-library?upload=true',
    roles: ['Teacher', 'TenantAdmin', 'SuperAdmin'],
    color: 'bg-purple-500',
  },
  // Student Quick Actions
  {
    id: 'my-assignments',
    labelKey: 'my_assignments',
    icon: 'CheckSquare',
    path: '/assignments',
    roles: ['Student'],
    color: 'bg-orange-500',
  },
  {
    id: 'my-progress',
    labelKey: 'my_progress',
    icon: 'TrendingUp',
    path: '/analytics/student-progress',
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
    path: '/admin/reports',
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
    lesson_plans: 'Ders Planları',
    lesson_templates: 'Ders Şablonları',
    assignments: 'Ödevler',
    analytics: 'Analizler',
    student_progress: 'Öğrenci İlerlemesi',
    learning_style: 'Öğrenme Stili',
    classroom_dashboard: 'Sınıf Paneli',
    ai_assistants: 'AI Asistanları',
    writing_assistant: 'Yazma Asistanı',
    project_analysis: 'Proje Analizi',
    file_refactor: 'Kod Düzenleme',
    auto_module_generator: 'Otomatik Modül Üretici',
    questions: 'Sorular',
    question_generator: 'Soru Üretici (AI)',
    question_bank: 'Soru Bankası',
    settings: 'Ayarlar',
    new_quiz: 'Yeni Quiz',
    new_lesson_plan: 'Yeni Ders Planı',
    upload_content: 'İçerik Yükle',
    my_assignments: 'Ödevlerim',
    my_progress: 'İlerlemem',
    user_management: 'Kullanıcı Yönetimi',
    reports: 'Raporlar',
  },
  en: {
    dashboard: 'Dashboard',
    content_library: 'Content Library',
    ai_generation: 'AI Generation',
    lesson_plans: 'Lesson Plans',
    lesson_templates: 'Lesson Templates',
    assignments: 'Assignments',
    analytics: 'Analytics',
    student_progress: 'Student Progress',
    learning_style: 'Learning Style',
    classroom_dashboard: 'Classroom Dashboard',
    ai_assistants: 'AI Assistants',
    writing_assistant: 'Writing Assistant',
    project_analysis: 'Project Analysis',
    file_refactor: 'Code Refactoring',
    auto_module_generator: 'Auto Module Generator',
    questions: 'Questions',
    question_generator: 'Question Generator (AI)',
    question_bank: 'Question Bank',
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
    lesson_plans: 'خطط الدروس',
    lesson_templates: 'قوالب الدروس',
    assignments: 'الواجبات',
    analytics: 'التحليلات',
    student_progress: 'تقدم الطالب',
    learning_style: 'نمط التعلم',
    classroom_dashboard: 'لوحة تحكم الفصل',
    ai_assistants: 'مساعدو الذكاء الاصطناعي',
    writing_assistant: 'مساعد الكتابة',
    project_analysis: 'تحليل المشروع',
    file_refactor: 'إعادة هيكلة الكود',
    auto_module_generator: 'مولد الوحدات التلقائي',
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
