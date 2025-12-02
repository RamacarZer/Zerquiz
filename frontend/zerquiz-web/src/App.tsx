import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LanguageProvider } from './hooks/useLanguage';
import Layout from './components/layout/Layout';

// Lazy load pages for better performance
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// Content pages
const ContentLibraryPage = lazy(() => import('./pages/content/ContentLibraryPage'));
const AIGenerationPage = lazy(() => import('./pages/content/AIGenerationPage'));

// Lesson pages
const LessonPlansListPage = lazy(() => import('./pages/lessons/LessonPlansListPage'));
const LessonTemplatesPage = lazy(() => import('./pages/lessons/LessonTemplatesPage'));

// Assignment pages
const AssignmentManagePage = lazy(() => import('./pages/assignments/AssignmentManagePage'));

// Analytics pages
const StudentProgressPage = lazy(() => import('./pages/analytics/StudentProgressPage'));

// AI Assistant pages
const WritingAssistantPage = lazy(() => import('./pages/ai/WritingAssistantPage'));
const AutoModuleGeneratorPage = lazy(() => import('./pages/ai/AutoModuleGeneratorPage'));

// Question pages
const QuestionGeneratorAdvanced = lazy(() => import('./pages/questions/QuestionGeneratorAdvanced'));
const QuestionCreationModeSelector = lazy(() => import('./pages/questions/QuestionCreationModeSelector'));

// Profile & Settings pages
const UserProfilePage = lazy(() => import('./pages/profile/UserProfilePage'));
const ProfileSettings = lazy(() => import('./pages/settings/ProfileSettings'));
const TenantSettings = lazy(() => import('./pages/settings/TenantSettings'));
const OrganizationSettings = lazy(() => import('./pages/settings/OrganizationSettings'));

// Admin pages
const TenantListPage = lazy(() => import('./pages/tenants/TenantListPage'));
const TenantManagementPage = lazy(() => import('./pages/tenants/TenantManagementPage'));

// User management pages (will be created)
// const UsersListPage = lazy(() => import('./pages/users/UsersListPage'));
// const RolesPage = lazy(() => import('./pages/users/RolesPage'));
// const DepartmentsPage = lazy(() => import('./pages/users/DepartmentsPage'));

// Curriculum pages
const CurriculumPage = lazy(() => import('./pages/curriculum/CurriculumPage'));

// Exams & Grading pages
const ExamsPage = lazy(() => import('./pages/exams/ExamsPage'));
const ExamManagementPage = lazy(() => import('./pages/exams/ExamManagementPage'));
const GradingPage = lazy(() => import('./pages/grading/GradingPage'));

// Gamification page
const GamificationPage = lazy(() => import('./pages/gamification/GamificationPage'));

// Presentations pages
const PresentationsPage = lazy(() => import('./pages/presentations/PresentationsPage'));
const PresentationBuilderPageEnhanced = lazy(() => import('./pages/presentations/PresentationBuilderPageEnhanced'));

// Courses & Certificates
const CoursesPage = lazy(() => import('./pages/courses/CoursesPage'));
const CertificatesPage = lazy(() => import('./pages/certificates/CertificatesPage'));

// Finance pages
const AdvancedFinancePage = lazy(() => import('./pages/finance/AdvancedFinancePage'));
const PaymentsPage = lazy(() => import('./pages/finance/PaymentsPage'));
const SubscriptionsPage = lazy(() => import('./pages/finance/SubscriptionsPage'));

// License & Royalty pages
const LicensePackagesPage = lazy(() => import('./pages/licenses/LicensePackagesPage'));
const RoyaltyManagementPage = lazy(() => import('./pages/royalty/RoyaltyManagementPage'));
const AuthorDashboard = lazy(() => import('./pages/royalty/AuthorDashboard'));
const ContractManagementPage = lazy(() => import('./pages/contracts/ContractManagementPage'));

// Communication pages
const CommunicationCenterPage = lazy(() => import('./pages/communication/CommunicationCenterPage'));
const NotificationCenter = lazy(() => import('./pages/notifications/NotificationCenter'));
const ParentPortalPage = lazy(() => import('./pages/parent/ParentPortalPage'));

// Integration & Monitoring pages
const LTIIntegrationPage = lazy(() => import('./pages/integrations/LTIIntegrationPage'));
const RealTimeMonitoringPage = lazy(() => import('./pages/monitoring/RealTimeMonitoringPage'));
const LocationManagementPage = lazy(() => import('./pages/locations/LocationManagementPage'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
    </div>
  </div>
);

// Protected Route wrapper
function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { isAuthenticated, hasAnyRole, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !hasAnyRole(roles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

// Layout with Sidebar
function AppLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

// Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<div className="flex items-center justify-center h-screen"><div className="text-center"><h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Unauthorized</h1><p className="text-gray-600 dark:text-gray-400">You don't have permission to access this page.</p></div></div>} />

                {/* Protected routes with layout */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Navigate to="/dashboard" replace />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <DashboardPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Content Management */}
                <Route
                  path="/content-library"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <ContentLibraryPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ai-generate"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <AIGenerationPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Lesson Planning */}
                <Route
                  path="/lesson-plans"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <LessonPlansListPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lesson-templates"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <LessonTemplatesPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Assignments */}
                <Route
                  path="/assignments"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <AssignmentManagePage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Analytics */}
                <Route
                  path="/analytics/student-progress"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <StudentProgressPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* AI Assistants */}
                <Route
                  path="/ai-assistants/writing"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <WritingAssistantPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/auto-generate-module"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <AutoModuleGeneratorPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Question Generator */}
                <Route
                  path="/questions/mode-select"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <QuestionCreationModeSelector />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/questions/generator"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <QuestionGeneratorAdvanced />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Profile & Settings */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <UserProfilePage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings/profile"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ProfileSettings />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings/tenant"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin']}>
                      <AppLayout>
                        <TenantSettings />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings/organization"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin']}>
                      <AppLayout>
                        <OrganizationSettings />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Admin - Tenant Management */}
                <Route
                  path="/admin/tenants"
                  element={
                    <ProtectedRoute roles={['SuperAdmin']}>
                      <AppLayout>
                        <TenantListPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/tenant-settings"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin']}>
                      <AppLayout>
                        <TenantManagementPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Admin - Curriculum */}
                <Route
                  path="/admin/curriculum/*"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <CurriculumPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Exams */}
                <Route
                  path="/exams"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <ExamsPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exams/manage"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <ExamManagementPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Grading */}
                <Route
                  path="/grading"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <GradingPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Gamification */}
                <Route
                  path="/gamification"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <GamificationPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Presentations */}
                <Route
                  path="/presentations"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <PresentationsPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/presentations/builder"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <PresentationBuilderPageEnhanced />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Courses & Certificates */}
                <Route
                  path="/courses"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <CoursesPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/certificates"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <CertificatesPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Finance */}
                <Route
                  path="/finance"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin']}>
                      <AppLayout>
                        <AdvancedFinancePage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/payments"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin']}>
                      <AppLayout>
                        <PaymentsPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/subscriptions"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin']}>
                      <AppLayout>
                        <SubscriptionsPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Licenses & Royalty */}
                <Route
                  path="/licenses/packages"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin']}>
                      <AppLayout>
                        <LicensePackagesPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/royalty"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <RoyaltyManagementPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/royalty/author-dashboard"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <AuthorDashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/contracts"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin']}>
                      <AppLayout>
                        <ContractManagementPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Communication */}
                <Route
                  path="/communication"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <CommunicationCenterPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <NotificationCenter />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/parent-portal"
                  element={
                    <ProtectedRoute roles={['Parent', 'SuperAdmin', 'TenantAdmin']}>
                      <AppLayout>
                        <ParentPortalPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Integrations & Monitoring */}
                <Route
                  path="/integrations/lti"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin']}>
                      <AppLayout>
                        <LTIIntegrationPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/monitoring"
                  element={
                    <ProtectedRoute roles={['SuperAdmin']}>
                      <AppLayout>
                        <RealTimeMonitoringPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/locations"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin']}>
                      <AppLayout>
                        <LocationManagementPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
