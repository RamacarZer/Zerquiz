import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import LoginPage from "./pages/auth/LoginPage";

// Existing Pages
import SimpleDashboard from "./pages/dashboard/SimpleDashboard";
import ExamsPage from "./pages/exams/ExamsPage";
import UserManagementPage from "./pages/users/UserManagementPage";
import UserProfilePage from "./pages/users/UserProfilePage";
import { UserProfilePage as ProfilePage } from "./pages/profile/UserProfilePage";
import RolesManagementPage from "./pages/users/RolesManagementPage";
import DepartmentsManagementPage from "./pages/users/DepartmentsManagementPage";
import PositionsManagementPage from "./pages/users/PositionsManagementPage";
import EducationModelManagementPage from "./pages/curriculum/EducationModelManagementPage";
import CurriculumManagementPageV2 from "./pages/curriculum/CurriculumManagementPageV2";
import QuestionListPage from "./pages/questions/QuestionListPage";
import QuestionListPageEnhanced from "./pages/questions/QuestionListPageEnhanced";
import QuestionCreatePage from "./pages/questions/QuestionCreatePage";
import QuestionBuilderPage from "./pages/questions/QuestionBuilderPage";
import TenantManagementPage from "./pages/tenants/TenantManagementPage";
import TenantCreatePage from "./pages/tenants/TenantCreatePage";
import TenantDetailPage from "./pages/tenants/TenantDetailPage";
import TenantEditPage from "./pages/tenants/TenantEditPage";
import { LicensePackagesPage } from "./pages/licenses/LicensePackagesPage";
import PresentationListPage from "./pages/presentation/PresentationListPage";
import PresentationBuilderPage from "./pages/presentation/PresentationBuilderPage";
import PresentationPlayerPage from "./pages/presentation/PresentationPlayerPage";

// New Pages
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import SubscriptionsPage from "./pages/finance/SubscriptionsPage";
import AuthorDashboard from "./pages/royalty/AuthorDashboard";
import CertificatesPage from "./pages/certificates/CertificatesPage";
import NotificationCenter from "./pages/notifications/NotificationCenter";
import TenantSettings from "./pages/settings/TenantSettings";
import PortalSettings from "./pages/settings/PortalSettings";
import OrganizationSettings from "./pages/settings/OrganizationSettings";
import MailProviderSettingsPage from "./pages/settings/MailProviderSettingsPage";
import LocationManagementPage from "./pages/locations/LocationManagementPage";
import DynamicFieldsManagementPage from "./pages/settings/DynamicFieldsManagementPage";
import RealTimeMonitoringPage from "./pages/monitoring/RealTimeMonitoringPage";
import RubricEvaluationPage from "./pages/evaluation/RubricEvaluationPage";
import MathEditorDemoPage from "./pages/editors/MathEditorDemoPage";
import CodeEditorDemoPage from "./pages/editors/CodeEditorDemoPage";
import GamificationPage from "./pages/gamification/GamificationPage";
import QuestionPoolManagementPage from "./pages/questions/QuestionPoolManagementPage";
import { OfflineSettingsPage } from "./pages/settings/OfflineSettingsPage";
import { AIAnalyticsDashboardPage } from "./pages/analytics/AIAnalyticsDashboardPage";
import { LTIIntegrationPage } from "./pages/integrations/LTIIntegrationPage";
import { AudioVideoRecorderDemoPage } from "./components/recording/AudioVideoRecorder";
import { Whiteboard } from "./components/whiteboard/Whiteboard";
import { MultiLanguageDemoPage } from "./contexts/LanguageContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ParentPortalPage } from "./pages/parent/ParentPortalPage";

// Enhanced Pages (Mock Development)
import QuestionEditorPage from "./pages/questions/QuestionEditorPage";
import QuestionEditorPageV3 from "./pages/questions/QuestionEditorPageV3";
import QuestionEditorPageV4 from "./pages/questions/QuestionEditorPageV4";
import PresentationEditorPageAdvanced from "./pages/presentation/PresentationEditorPageAdvanced";
import ExamWizardPage from "./pages/exams/ExamWizardPage";
import ExamSessionPageEnhanced from "./pages/exams/ExamSessionPageEnhanced";
import AdvancedExamSessionPage from "./pages/exams/AdvancedExamSessionPage";
import ExamGradingPage from "./pages/grading/ExamGradingPage";
import ExamManagementPage from "./pages/exams/ExamManagementPage";
import StudentExamPortalPage from "./pages/student/StudentExamPortalPage";
import ExamReviewPage from "./pages/exam-review/ExamReviewPage";
import ExamPresentationPage from "./pages/exam-presentation/ExamPresentationPage";
import AdminDashboardPage from "./pages/dashboard/AdminDashboardPage";
import QuestionReviewQueuePage from "./pages/review/QuestionReviewQueuePage";
import CertificatesPageEnhanced from "./pages/certificates/CertificatesPageEnhanced";
import SubscriptionsPageEnhanced from "./pages/subscriptions/SubscriptionsPageEnhanced";
import PresentationBuilderPageEnhanced from "./pages/presentations/PresentationBuilderPageEnhanced";
import AdvancedFinancePage from "./pages/finance/AdvancedFinancePage";
import ContractManagementPage from "./pages/contracts/ContractManagementPage";
import CommunicationCenterPage from "./pages/communication/CommunicationCenterPage";
import CommunicationCenterPageAdvanced from "./pages/communication/CommunicationCenterPageAdvanced";
import RoyaltyManagementPage from "./pages/royalty/RoyaltyManagementPage";
import CoursesPage from "./pages/courses/CoursesPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Routes with Dashboard Layout */}
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <AdminDashboardPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/simple"
            element={
              <DashboardLayout>
                <SimpleDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/questions"
            element={
              <DashboardLayout>
                <QuestionListPageEnhanced />
              </DashboardLayout>
            }
          />
          <Route
            path="/questions/pool"
            element={
              <DashboardLayout>
                <QuestionPoolManagementPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/questions-old"
            element={
              <DashboardLayout>
                <QuestionListPage />
              </DashboardLayout>
            }
          />
          <Route path="/questions/editor" element={<QuestionEditorPageV4 />} />
          <Route path="/questions/editor/:id" element={<QuestionEditorPageV4 />} />
          <Route path="/questions/editor-v3" element={<QuestionEditorPageV3 />} />
          <Route path="/questions/editor-old" element={<QuestionEditorPage />} />
          <Route path="/questions/create" element={<QuestionBuilderPage />} />
          <Route
            path="/questions/create-legacy"
            element={
              <DashboardLayout>
                <QuestionCreatePage />
              </DashboardLayout>
            }
          />
          <Route
            path="/exams"
            element={
              <DashboardLayout>
                <ExamManagementPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/exams/old"
            element={
              <DashboardLayout>
                <ExamsPage />
              </DashboardLayout>
            }
          />
          <Route path="/exams/wizard" element={<ExamWizardPage />} />
          <Route path="/exams/wizard/:id" element={<ExamWizardPage />} />
          <Route path="/exams/:id/session" element={<AdvancedExamSessionPage />} />
          <Route path="/exams/:id/session-old" element={<ExamSessionPageEnhanced />} />
          <Route path="/exams/:id/grading" element={<ExamGradingPage />} />
          <Route path="/exams/:id/present" element={<ExamPresentationPage />} />
          <Route
            path="/exams/:id/monitor"
            element={
              <DashboardLayout>
                <RealTimeMonitoringPage />
              </DashboardLayout>
            }
          />
          {/* Student Exam Routes */}
          <Route
            path="/student/exams"
            element={
              <DashboardLayout>
                <StudentExamPortalPage />
              </DashboardLayout>
            }
          />
          <Route path="/student/exam/:id/review" element={<ExamReviewPage />} />
          <Route path="/teacher/exam/:id/review" element={<ExamReviewPage />} />
          <Route
            path="/evaluation/rubric"
            element={
              <DashboardLayout>
                <RubricEvaluationPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/editors/math"
            element={
              <DashboardLayout>
                <MathEditorDemoPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/editors/code"
            element={
              <DashboardLayout>
                <CodeEditorDemoPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/gamification"
            element={
              <DashboardLayout>
                <GamificationPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/review/queue"
            element={
              <DashboardLayout>
                <QuestionReviewQueuePage />
              </DashboardLayout>
            }
          />
          <Route
            path="/users"
            element={
              <DashboardLayout>
                <UserManagementPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/users/:id"
            element={
              <DashboardLayout>
                <UserProfilePage />
              </DashboardLayout>
            }
          />
          <Route
            path="/users/roles"
            element={
              <DashboardLayout>
                <RolesManagementPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/users/departments"
            element={
              <DashboardLayout>
                <DepartmentsManagementPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/users/positions"
            element={
              <DashboardLayout>
                <PositionsManagementPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/tenants"
            element={
              <DashboardLayout>
                <TenantManagementPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/tenants/create"
            element={
              <DashboardLayout>
                <TenantCreatePage />
              </DashboardLayout>
            }
          />
          <Route
            path="/tenants/:id"
            element={
              <DashboardLayout>
                <TenantDetailPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/tenants/:id/edit"
            element={
              <DashboardLayout>
                <TenantEditPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/licenses"
            element={
              <DashboardLayout>
                <LicensePackagesPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/curriculum"
            element={
              <DashboardLayout>
                <CurriculumManagementPageV2 />
              </DashboardLayout>
            }
          />
          <Route
            path="/curriculum/education-models"
            element={
              <DashboardLayout>
                <EducationModelManagementPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/courses"
            element={
              <DashboardLayout>
                <CoursesPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/presentations"
            element={
              <DashboardLayout>
                <PresentationBuilderPageEnhanced />
              </DashboardLayout>
            }
          />
          <Route
            path="/presentations-old"
            element={
              <DashboardLayout>
                <PresentationListPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/presentations/editor"
            element={<PresentationEditorPageAdvanced />}
          />
          <Route
            path="/presentations/editor/:id"
            element={<PresentationEditorPageAdvanced />}
          />
          <Route
            path="/presentations/create"
            element={<PresentationBuilderPage />}
          />
          <Route
            path="/presentations/:id/edit"
            element={<PresentationBuilderPage />}
          />
          <Route
            path="/presentations/:id/play"
            element={<PresentationPlayerPage />}
          />
          <Route
            path="/grading"
            element={
              <DashboardLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold">Değerlendirme</h1>
                  <p className="text-gray-600 mt-2">
                    Bu modül geliştirilme aşamasında...
                  </p>
                </div>
              </DashboardLayout>
            }
          />
          {/* New Enhanced Pages */}
          <Route
            path="/dashboard/admin"
            element={
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            }
          />
          {/* Finance Routes - Mali Yönetim */}
          <Route
            path="/finance/overview"
            element={
              <DashboardLayout>
                <AdvancedFinancePage />
              </DashboardLayout>
            }
          />
          <Route
            path="/finance/cash"
            element={
              <DashboardLayout>
                <AdvancedFinancePage />
              </DashboardLayout>
            }
          />
          <Route
            path="/finance/income-expense"
            element={
              <DashboardLayout>
                <AdvancedFinancePage />
              </DashboardLayout>
            }
          />
          <Route
            path="/finance/budget"
            element={
              <DashboardLayout>
                <AdvancedFinancePage />
              </DashboardLayout>
            }
          />
          <Route
            path="/finance/perdiem"
            element={
              <DashboardLayout>
                <AdvancedFinancePage />
              </DashboardLayout>
            }
          />
          <Route
            path="/finance/invoices"
            element={
              <DashboardLayout>
                <AdvancedFinancePage />
              </DashboardLayout>
            }
          />
          <Route
            path="/finance/proforma"
            element={
              <DashboardLayout>
                <AdvancedFinancePage />
              </DashboardLayout>
            }
          />
          <Route
            path="/finance/payments"
            element={
              <DashboardLayout>
                <AdvancedFinancePage />
              </DashboardLayout>
            }
          />
          <Route
            path="/finance/subscriptions"
            element={
              <DashboardLayout>
                <SubscriptionsPageEnhanced />
              </DashboardLayout>
            }
          />
          <Route
            path="/finance/subscriptions-old"
            element={
              <DashboardLayout>
                <SubscriptionsPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/finance/advanced"
            element={
              <DashboardLayout>
                <AdvancedFinancePage />
              </DashboardLayout>
            }
          />
          <Route
            path="/contracts"
            element={
              <DashboardLayout>
                <ContractManagementPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/communication"
            element={
              <DashboardLayout>
                <CommunicationCenterPageAdvanced />
              </DashboardLayout>
            }
          />
          <Route
            path="/communication-old"
            element={
              <DashboardLayout>
                <CommunicationCenterPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/royalty/author-dashboard"
            element={
              <DashboardLayout>
                <AuthorDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/royalty"
            element={
              <DashboardLayout>
                <RoyaltyManagementPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/royalty/:section"
            element={
              <DashboardLayout>
                <RoyaltyManagementPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/certificates"
            element={
              <DashboardLayout>
                <CertificatesPageEnhanced />
              </DashboardLayout>
            }
          />
          <Route
            path="/certificates-old"
            element={
              <DashboardLayout>
                <CertificatesPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/notifications"
            element={
              <DashboardLayout>
                <NotificationCenter />
              </DashboardLayout>
            }
          />
          <Route
            path="/settings/portal"
            element={
              <DashboardLayout>
                <PortalSettings />
              </DashboardLayout>
            }
          />
          <Route
            path="/settings/organization"
            element={
              <DashboardLayout>
                <OrganizationSettings />
              </DashboardLayout>
            }
          />
          {/* Legacy route - redirect to organization */}
          <Route
            path="/settings/tenant"
            element={
              <DashboardLayout>
                <OrganizationSettings />
              </DashboardLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <DashboardLayout>
                <OrganizationSettings />
              </DashboardLayout>
            }
          />
          <Route
            path="/settings/mail-providers"
            element={
              <DashboardLayout>
                <MailProviderSettingsPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/settings/offline"
            element={
              <DashboardLayout>
                <OfflineSettingsPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/settings/language"
            element={
              <DashboardLayout>
                <MultiLanguageDemoPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/analytics/ai"
            element={
              <DashboardLayout>
                <AIAnalyticsDashboardPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/integrations/lti"
            element={
              <DashboardLayout>
                <LTIIntegrationPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/recording/demo"
            element={
              <DashboardLayout>
                <AudioVideoRecorderDemoPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/whiteboard"
            element={
              <Whiteboard />
            }
          />
          <Route
            path="/parent/portal"
            element={
              <DashboardLayout>
                <ParentPortalPage />
              </DashboardLayout>
            }
          />
          {/* Location Management - Lokasyon Yönetimi */}
          <Route
            path="/locations/management"
            element={
              <DashboardLayout>
                <LocationManagementPage />
              </DashboardLayout>
            }
          />
          {/* Dynamic Fields Management - Dinamik Alan Yönetimi */}
          <Route
            path="/settings/dynamic-fields"
            element={
              <DashboardLayout>
                <DynamicFieldsManagementPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/audit-logs"
            element={
              <DashboardLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold">Audit Logları</h1>
                  <p className="text-gray-600 mt-2">
                    Bu modül geliştirilme aşamasında...
                  </p>
                </div>
              </DashboardLayout>
            }
          />
        </Routes>
      </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
