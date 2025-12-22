// =====================================================
// RESTRUCTURED NAVIGATION - Hierarchical & Categorized
// Date: 2025-12-01
// =====================================================

export interface MenuItem {
  id: string;
  labelKey: string;
  icon: string;
  path?: string;
  roles: string[];
  badge?: string;
  section: 'main' | 'content' | 'teaching' | 'assessment' | 'analytics' | 'ai' | 'admin' | 'system';
  children?: MenuItem[];
  divider?: boolean; // Add divider after this item
}

export const menuItems: MenuItem[] = [
  // ============================================
  // SECTION 1: MAIN (Dashboard & Quick Access)
  // ============================================
  {
    id: 'dashboard',
    labelKey: 'dashboard',
    icon: 'LayoutDashboard',
    path: '/dashboard',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
    section: 'main',
    divider: true,
  },

  // ============================================
  // SECTION 2: CONTENT MANAGEMENT
  // ============================================
  {
    id: 'content',
    labelKey: 'contentManagement',
    icon: 'FolderOpen',
    path: '/content',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
    section: 'content',
    children: [
      {
        id: 'content-library',
        labelKey: 'content_library',
        icon: 'FileText',
        path: '/content-library',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
        section: 'content',
      },
      {
        id: 'content-upload',
        labelKey: 'uploadContent',
        icon: 'Upload',
        path: '/content/upload',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
        section: 'content',
      },
      {
        id: 'media-library',
        labelKey: 'mediaLibrary',
        icon: 'Image',
        path: '/content/media',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
        section: 'content',
      },
    ],
  },

  // ============================================
  // SECTION 3: QUESTIONS & EXAMS
  // ============================================
  {
    id: 'questions',
    labelKey: 'questionsAndExams',
    icon: 'HelpCircle',
    path: '/questions',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
    section: 'assessment',
    children: [
      {
        id: 'question-mode-select',
        labelKey: 'createQuestion',
        icon: 'Plus',
        path: '/questions/mode-select',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
        section: 'assessment',
        badge: 'NEW',
      },
      {
        id: 'question-bank',
        labelKey: 'questionBank',
        icon: 'Database',
        path: '/questions',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
        section: 'assessment',
      },
      {
        id: 'exams',
        labelKey: 'exams',
        icon: 'FileCheck',
        path: '/exams',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
        section: 'assessment',
      },
      {
        id: 'grading',
        labelKey: 'grading',
        icon: 'GraduationCap',
        path: '/grading',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
        section: 'assessment',
      },
    ],
  },

  // ============================================
  // SECTION 4: TEACHING & LEARNING
  // ============================================
  {
    id: 'teaching',
    labelKey: 'teachingAndLearning',
    icon: 'BookOpen',
    path: '/teaching',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
    section: 'teaching',
    children: [
      {
        id: 'lesson-plans',
        labelKey: 'lesson_plans',
        icon: 'Calendar',
        path: '/lesson-plans',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
        section: 'teaching',
      },
      {
        id: 'lesson-templates',
        labelKey: 'lesson_templates',
        icon: 'Library',
        path: '/lesson-templates',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
        section: 'teaching',
      },
      {
        id: 'assignments',
        labelKey: 'assignments',
        icon: 'ClipboardList',
        path: '/assignments',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
        section: 'teaching',
      },
      {
        id: 'courses',
        labelKey: 'courses',
        icon: 'BookMarked',
        path: '/courses',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
        section: 'teaching',
      },
      {
        id: 'presentations',
        labelKey: 'presentations',
        icon: 'Presentation',
        path: '/presentations',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
        section: 'teaching',
      },
    ],
    divider: true,
  },

  // ============================================
  // SECTION 5: ANALYTICS & REPORTS
  // ============================================
  {
    id: 'analytics',
    labelKey: 'analyticsAndReports',
    icon: 'BarChart3',
    path: '/analytics',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
    section: 'analytics',
    children: [
      {
        id: 'student-progress',
        labelKey: 'student_progress',
        icon: 'TrendingUp',
        path: '/analytics/student-progress',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
        section: 'analytics',
      },
      {
        id: 'learning-style',
        labelKey: 'learning_style',
        icon: 'Brain',
        path: '/analytics/learning-style',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher', 'Student'],
        section: 'analytics',
      },
      {
        id: 'classroom-dashboard',
        labelKey: 'classroom_dashboard',
        icon: 'Users',
        path: '/analytics/classroom-dashboard',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
        section: 'analytics',
      },
      {
        id: 'performance-reports',
        labelKey: 'performanceReports',
        icon: 'FileBarChart',
        path: '/analytics/reports',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
        section: 'analytics',
      },
    ],
    divider: true,
  },

  // ============================================
  // SECTION 6: AI TOOLS
  // ============================================
  {
    id: 'ai-tools',
    labelKey: 'aiTools',
    icon: 'Sparkles',
    path: '/ai',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
    section: 'ai',
    badge: 'AI',
    children: [
      {
        id: 'ai-question-generator',
        labelKey: 'aiQuestionGenerator',
        icon: 'Wand2',
        path: '/questions/generator',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
        section: 'ai',
      },
      {
        id: 'ai-content-generator',
        labelKey: 'aiContentGenerator',
        icon: 'FileEdit',
        path: '/ai/content-generator',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
        section: 'ai',
      },
      {
        id: 'writing-assistant',
        labelKey: 'writing_assistant',
        icon: 'PenTool',
        path: '/ai/writing-assistant',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
        section: 'ai',
      },
      {
        id: 'project-analysis',
        labelKey: 'project_analysis',
        icon: 'Search',
        path: '/ai/project-analysis',
        roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
        section: 'ai',
      },
    ],
    divider: true,
  },

  // ============================================
  // SECTION 7: ADMINISTRATION (Tenant & Users)
  // ============================================
  {
    id: 'administration',
    labelKey: 'administration',
    icon: 'Shield',
    path: '/admin',
    roles: ['SuperAdmin', 'TenantAdmin'],
    section: 'admin',
    children: [
      {
        id: 'tenant-management',
        labelKey: 'tenant_management',
        icon: 'Building',
        path: '/admin/tenants',
        roles: ['SuperAdmin'],
        section: 'admin',
      },
      {
        id: 'user-management',
        labelKey: 'user_management',
        icon: 'Users',
        path: '/admin/users',
        roles: ['SuperAdmin', 'TenantAdmin'],
        section: 'admin',
      },
      {
        id: 'roles-permissions',
        labelKey: 'roles_permissions',
        icon: 'Key',
        path: '/admin/roles',
        roles: ['SuperAdmin', 'TenantAdmin'],
        section: 'admin',
      },
      {
        id: 'departments',
        labelKey: 'departments',
        icon: 'Sitemap',
        path: '/admin/departments',
        roles: ['SuperAdmin', 'TenantAdmin'],
        section: 'admin',
      },
    ],
  },

  // ============================================
  // SECTION 8: CURRICULUM & SYSTEM
  // ============================================
  {
    id: 'curriculum',
    labelKey: 'curriculumManagement',
    icon: 'Book',
    path: '/curriculum',
    roles: ['SuperAdmin', 'TenantAdmin'],
    section: 'admin',
    children: [
      {
        id: 'curriculum-settings',
        labelKey: 'curriculumSettings',
        icon: 'Settings',
        path: '/curriculum/settings',
        roles: ['SuperAdmin', 'TenantAdmin'],
        section: 'admin',
      },
      {
        id: 'subjects',
        labelKey: 'subjects',
        icon: 'BookOpen',
        path: '/curriculum/subjects',
        roles: ['SuperAdmin', 'TenantAdmin'],
        section: 'admin',
      },
      {
        id: 'topics',
        labelKey: 'topics',
        icon: 'List',
        path: '/curriculum/topics',
        roles: ['SuperAdmin', 'TenantAdmin'],
        section: 'admin',
      },
    ],
  },

  // ============================================
  // SECTION 9: FINANCE & LICENSES (SuperAdmin)
  // ============================================
  {
    id: 'finance',
    labelKey: 'financeAndLicenses',
    icon: 'DollarSign',
    path: '/finance',
    roles: ['SuperAdmin'],
    section: 'admin',
    children: [
      {
        id: 'invoices',
        labelKey: 'invoices',
        icon: 'FileText',
        path: '/finance/invoices',
        roles: ['SuperAdmin'],
        section: 'admin',
      },
      {
        id: 'subscriptions',
        labelKey: 'subscriptions',
        icon: 'CreditCard',
        path: '/finance/subscriptions',
        roles: ['SuperAdmin'],
        section: 'admin',
      },
      {
        id: 'license-packages',
        labelKey: 'license_packages',
        icon: 'Package',
        path: '/finance/licenses',
        roles: ['SuperAdmin'],
        section: 'admin',
      },
      {
        id: 'royalty-management',
        labelKey: 'royaltyManagement',
        icon: 'Coins',
        path: '/finance/royalty',
        roles: ['SuperAdmin'],
        section: 'admin',
      },
    ],
    divider: true,
  },

  // ============================================
  // SECTION 10: SYSTEM SETTINGS (SuperAdmin)
  // ============================================
  {
    id: 'system',
    labelKey: 'systemSettings',
    icon: 'Settings',
    path: '/system',
    roles: ['SuperAdmin'],
    section: 'system',
    children: [
      {
        id: 'system-definitions',
        labelKey: 'system_definitions',
        icon: 'Database',
        path: '/system/definitions',
        roles: ['SuperAdmin'],
        section: 'system',
      },
      {
        id: 'ai-configuration',
        labelKey: 'ai_configuration',
        icon: 'Cpu',
        path: '/system/ai-config',
        roles: ['SuperAdmin'],
        section: 'system',
      },
      {
        id: 'integrations',
        labelKey: 'integrations',
        icon: 'Plug',
        path: '/system/integrations',
        roles: ['SuperAdmin'],
        section: 'system',
      },
      {
        id: 'audit-logs',
        labelKey: 'audit_logs',
        icon: 'FileSearch',
        path: '/system/audit-logs',
        roles: ['SuperAdmin'],
        section: 'system',
      },
      {
        id: 'monitoring',
        labelKey: 'monitoring',
        icon: 'Activity',
        path: '/system/monitoring',
        roles: ['SuperAdmin'],
        section: 'system',
      },
    ],
  },
];

// Quick Actions
export const quickActions = [
  {
    id: 'new-question',
    labelKey: 'createQuestion',
    icon: 'Plus',
    path: '/questions/mode-select',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
    color: 'bg-blue-600',
  },
  {
    id: 'new-exam',
    labelKey: 'new_exam',
    icon: 'FileCheck',
    path: '/exams/create',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
    color: 'bg-green-600',
  },
  {
    id: 'new-lesson',
    labelKey: 'new_lesson_plan',
    icon: 'Calendar',
    path: '/lesson-plans/create',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
    color: 'bg-purple-600',
  },
  {
    id: 'upload-content',
    labelKey: 'upload_content',
    icon: 'Upload',
    path: '/content/upload',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
    color: 'bg-orange-600',
  },
  {
    id: 'ai-generate',
    labelKey: 'aiQuickGenerate',
    icon: 'Sparkles',
    path: '/questions/generator',
    roles: ['SuperAdmin', 'TenantAdmin', 'Teacher'],
    color: 'bg-indigo-600',
  },
];

// Helper function to filter menu by role
export function getFilteredMenu(userRoles: string[]): MenuItem[] {
  return menuItems
    .filter(item => item.roles.some(role => userRoles.includes(role)))
    .map(item => ({
      ...item,
      children: item.children?.filter(child => 
        child.roles.some(role => userRoles.includes(role))
      ),
    }))
    .filter(item => !item.children || item.children.length > 0);
}




