import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LanguageProvider } from './hooks/useLanguage';
import Layout from './components/layout/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load pages for better performance
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// Content Module (with tabs)
const ContentModule = lazy(() => import('./pages/content/ContentModule'));

// Classroom Module (with tabs - lessons + homeworks)
const ClassroomModule = lazy(() => import('./pages/classroom/ClassroomModule'));

// Module Showcase (Demo page)
const ModuleShowcasePage = lazy(() => import('./pages/ModuleShowcasePage'));

// Analytics Module (with tabs)
const AnalyticsModule = lazy(() => import('./pages/analytics/AnalyticsModule'));
const ClassroomDashboardPage = lazy(() => import('./pages/analytics/ClassroomDashboardPage'));

// AI Assistant pages
const WritingAssistantPage = lazy(() => import('./pages/ai/WritingAssistantPage'));
const AutoModuleGeneratorPage = lazy(() => import('./pages/ai/AutoModuleGeneratorPage'));
const ProjectAnalysisPage = lazy(() => import('./pages/ai/ProjectAnalysisPage'));
const FileRefactorPage = lazy(() => import('./pages/ai/FileRefactorPage'));

// Questions Module (with tabs - Manual + AI + Bank)
const QuestionsModule = lazy(() => import('./pages/questions/QuestionsModule'));

// Profile & Settings pages
const UserProfilePage = lazy(() => import('./pages/profile/UserProfilePage'));
const ProfileSettings = lazy(() => import('./pages/settings/ProfileSettings'));
const TenantSettings = lazy(() => import('./pages/settings/TenantSettings'));
const OrganizationSettings = lazy(() => import('./pages/settings/OrganizationSettings'));

// Admin pages
const TenantListPage = lazy(() => import('./pages/tenants/TenantListPage'));
const TenantManagementPage = lazy(() => import('./pages/tenants/TenantManagementPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminRolesPage = lazy(() => import('./pages/admin/AdminRolesPage'));
const AdminDepartmentsPage = lazy(() => import('./pages/admin/AdminDepartmentsPage'));
const AdminSystemPage = lazy(() => import('./pages/admin/AdminSystemPage'));

// User management pages (will be created)
// const UsersListPage = lazy(() => import('./pages/users/UsersListPage'));
// const RolesPage = lazy(() => import('./pages/users/RolesPage'));
// const DepartmentsPage = lazy(() => import('./pages/users/DepartmentsPage'));

// Curriculum pages
const CurriculumPage = lazy(() => import('./pages/curriculum/CurriculumPage'));

// Exams Module (with tabs)
const ExamModule = lazy(() => import('./pages/exams/ExamModule'));
const GradingPage = lazy(() => import('./pages/grading/GradingPage'));

// Gamification page
const GamificationPage = lazy(() => import('./pages/gamification/GamificationPage'));

// Presentations Module (with tabs)
const PresentationModule = lazy(() => import('./pages/presentations/PresentationModule'));

// Courses & Certificates
const CoursesPage = lazy(() => import('./pages/courses/CoursesPage'));
const CertificatesModulePage = lazy(() => import('./pages/certificates/CertificatesModulePage'));
const CertificatesPage = lazy(() => import('./pages/certificates/CertificatesPage'));
const CertificatesPageEnhanced = lazy(() => import('./pages/certificates/CertificatesPageEnhanced'));

// Books & Reader
const BookListPage = lazy(() => import('./pages/books/BookListPage'));
const BookDetailPage = lazy(() => import('./pages/books/BookDetailPage'));
const ReaderPage = lazy(() => import('./pages/reader/ReaderPage'));

// Dictionary & Vocabulary
const VocabularyPage = lazy(() => import('./pages/dictionary/VocabularyPage'));

// Smartboard & Whiteboard
const SmartboardPage = lazy(() => import('./pages/smartboard/SmartboardPage'));
const WhiteboardPage = lazy(() => import('./pages/whiteboard/WhiteboardPage'));

// Lessons
const LessonPlansPage = lazy(() => import('./pages/lessons/LessonPlansPage'));
const LessonTemplatesPage = lazy(() => import('./pages/lessons/LessonTemplatesPage'));

// Assignments
const AssignmentManagePage = lazy(() => import('./pages/assignments/AssignmentManagePage'));

// Student Portal
const StudentExamPortalPage = lazy(() => import('./pages/student/StudentExamPortalPage'));

// Exam Management Advanced
const ExamPresentationPage = lazy(() => import('./pages/exam-presentation/ExamPresentationPage'));
const ExamReviewPage = lazy(() => import('./pages/exam-review/ExamReviewPage'));
const ExamParticipantsPage = lazy(() => import('./pages/exam-management/ExamParticipantsPage'));
const ExamGradingPage = lazy(() => import('./pages/grading/ExamGradingPage'));
const AdvancedExamSessionPage = lazy(() => import('./pages/exams/AdvancedExamSessionPage'));

// Reporting Dashboards
const StudentDashboard = lazy(() => import('./pages/reporting/StudentDashboard'));
const ParentDashboard = lazy(() => import('./pages/reporting/ParentDashboard'));
const SchoolDashboard = lazy(() => import('./pages/reporting/SchoolDashboard'));
const PublisherDashboard = lazy(() => import('./pages/reporting/PublisherDashboard'));

// Licensing
const PlansPage = lazy(() => import('./pages/licensing/PlansPage'));
const CheckoutPage = lazy(() => import('./pages/licensing/CheckoutPage'));
const BillingDashboard = lazy(() => import('./pages/licensing/BillingDashboard'));

// Admin - Books & Licenses
const BookApprovalPage = lazy(() => import('./pages/admin/BookApprovalPage'));
const LicenseManagementPage = lazy(() => import('./pages/admin/LicenseManagementPage'));

// Question Management Advanced
const QuestionReviewQueuePage = lazy(() => import('./pages/review/QuestionReviewQueuePage'));
const QuestionPoolManagementPage = lazy(() => import('./pages/questions/QuestionPoolManagementPage'));

// Presentation Advanced
const PresentationPlayerPage = lazy(() => import('./pages/presentation/PresentationPlayerPage'));
const PresentationEditorPageAdvanced = lazy(() => import('./pages/presentation/PresentationEditorPageAdvanced'));
const PresentationLivePage = lazy(() => import('./pages/presentations/PresentationLivePage'));

// Evaluation
const RubricEvaluationPage = lazy(() => import('./pages/evaluation/RubricEvaluationPage'));

// Editors Demo
const CodeEditorDemoPage = lazy(() => import('./pages/editors/CodeEditorDemoPage'));
const MathEditorDemoPage = lazy(() => import('./pages/editors/MathEditorDemoPage'));

// Settings Advanced
const DynamicFieldsManagementPage = lazy(() => import('./pages/settings/DynamicFieldsManagementPage'));
const MailProviderSettingsPage = lazy(() => import('./pages/settings/MailProviderSettingsPage'));
const OfflineSettingsPage = lazy(() => import('./pages/settings/OfflineSettingsPage'));

// Finance Module (with tabs)
const FinanceModule = lazy(() => import('./pages/finance/FinanceModule'));

// License & Royalty Module (with tabs)
const LicensePackagesPage = lazy(() => import('./pages/licenses/LicensePackagesPage'));
const RoyaltyModule = lazy(() => import('./pages/royalty/RoyaltyModule'));
const ContractManagementPage = lazy(() => import('./pages/contracts/ContractManagementPage'));

// Communication pages
const CommunicationCenterPage = lazy(() => import('./pages/communication/CommunicationCenterPage'));
const NotificationCenter = lazy(() => import('./pages/notifications/NotificationCenter'));
const ParentPortalPage = lazy(() => import('./pages/parent/ParentPortalPage'));

// Integration Module (with tabs)
const IntegrationModule = lazy(() => import('./pages/integrations/IntegrationModule'));
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
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
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

                {/* Module Showcase - Demo page to see all modules */}
                <Route
                  path="/modules"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ModuleShowcasePage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Content Management Module */}
                <Route
                  path="/content"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <ContentModule />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Classroom Module */}
                <Route
                  path="/classroom"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <ClassroomModule />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Analytics Module */}
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <AnalyticsModule />
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
                  path="/ai-assistants/project-analysis"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <ProjectAnalysisPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ai-assistants/file-refactor"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Developer']}>
                      <AppLayout>
                        <FileRefactorPage />
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

                {/* Questions Module (Manual + AI + Bank) */}
                <Route
                  path="/questions"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <QuestionsModule />
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

                {/* Admin - User Management */}
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin']}>
                      <AppLayout>
                        <AdminUsersPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/roles"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin']}>
                      <AppLayout>
                        <AdminRolesPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/departments"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin']}>
                      <AppLayout>
                        <AdminDepartmentsPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Admin - System Management */}
                <Route
                  path="/admin/system/definitions"
                  element={
                    <ProtectedRoute roles={['SuperAdmin']}>
                      <AppLayout>
                        <AdminSystemPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/system/ai-config"
                  element={
                    <ProtectedRoute roles={['SuperAdmin']}>
                      <AppLayout>
                        <AdminSystemPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/system/audit-logs"
                  element={
                    <ProtectedRoute roles={['SuperAdmin']}>
                      <AppLayout>
                        <AdminSystemPage />
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

                {/* Exams Module */}
                <Route
                  path="/exams"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <ExamModule />
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

                {/* Presentations Module */}
                <Route
                  path="/presentations"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <PresentationModule />
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
                        <CertificatesModulePage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Finance Module - Complete with internal tabs */}
                <Route
                  path="/finance"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin']}>
                      <AppLayout>
                        <FinanceModule />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* License Management */}
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

                {/* Royalty Module */}
                <Route
                  path="/royalty"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <RoyaltyModule />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Contracts */}
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

                {/* Integration Module */}
                <Route
                  path="/integrations"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin']}>
                      <AppLayout>
                        <IntegrationModule />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Monitoring */}
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

                {/* Location Management */}
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

                {/* Books & Reader */}
                <Route
                  path="/books"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <BookListPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/books/:id"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <BookDetailPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reader/:bookId"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ReaderPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Dictionary & Vocabulary */}
                <Route
                  path="/dictionary"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <VocabularyPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Smartboard & Whiteboard */}
                <Route
                  path="/smartboard"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <SmartboardPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/whiteboard"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <WhiteboardPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Lessons */}
                <Route
                  path="/lessons/plans"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <LessonPlansPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lessons/templates"
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
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <AssignmentManagePage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Student Portal */}
                <Route
                  path="/student/exams"
                  element={
                    <ProtectedRoute roles={['Student']}>
                      <AppLayout>
                        <StudentExamPortalPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Exam Management Advanced */}
                <Route
                  path="/exam-presentation/:examId"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ExamPresentationPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exam-review/:examId"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ExamReviewPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exam-participants/:examId"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <ExamParticipantsPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exam-grading/:examId"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <ExamGradingPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exams/session/:sessionId"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <AdvancedExamSessionPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Reporting Dashboards */}
                <Route
                  path="/reports/student"
                  element={
                    <ProtectedRoute roles={['Student', 'Parent', 'Teacher', 'TenantAdmin', 'SuperAdmin']}>
                      <AppLayout>
                        <StudentDashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports/parent"
                  element={
                    <ProtectedRoute roles={['Parent', 'TenantAdmin', 'SuperAdmin']}>
                      <AppLayout>
                        <ParentDashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports/school"
                  element={
                    <ProtectedRoute roles={['TenantAdmin', 'SuperAdmin']}>
                      <AppLayout>
                        <SchoolDashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports/publisher"
                  element={
                    <ProtectedRoute roles={['Publisher', 'SuperAdmin']}>
                      <AppLayout>
                        <PublisherDashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Licensing */}
                <Route
                  path="/licensing/plans"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <PlansPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/licensing/checkout"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <CheckoutPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/licensing/billing"
                  element={
                    <ProtectedRoute roles={['TenantAdmin', 'SuperAdmin']}>
                      <AppLayout>
                        <BillingDashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Admin - Books & Licenses */}
                <Route
                  path="/admin/books/approval"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin']}>
                      <AppLayout>
                        <BookApprovalPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/licenses"
                  element={
                    <ProtectedRoute roles={['SuperAdmin']}>
                      <AppLayout>
                        <LicenseManagementPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Question Management Advanced */}
                <Route
                  path="/questions/review-queue"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <QuestionReviewQueuePage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/questions/pool"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <QuestionPoolManagementPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Presentation Advanced */}
                <Route
                  path="/presentation/player/:id"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <PresentationPlayerPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/presentation/editor/advanced"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <PresentationEditorPageAdvanced />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/presentation/live/:id"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <PresentationLivePage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Evaluation */}
                <Route
                  path="/evaluation/rubric"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <RubricEvaluationPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Editors Demo */}
                <Route
                  path="/editors/code"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Developer']}>
                      <AppLayout>
                        <CodeEditorDemoPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/editors/math"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <MathEditorDemoPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Settings Advanced */}
                <Route
                  path="/settings/dynamic-fields"
                  element={
                    <ProtectedRoute roles={['SuperAdmin']}>
                      <AppLayout>
                        <DynamicFieldsManagementPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings/mail-provider"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin']}>
                      <AppLayout>
                        <MailProviderSettingsPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings/offline"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <OfflineSettingsPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Enhanced Certificates */}
                <Route
                  path="/certificates/enhanced"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <CertificatesPageEnhanced />
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
