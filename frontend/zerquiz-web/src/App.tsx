import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import LoginPage from "./pages/auth/LoginPage";

// Existing Pages
import SimpleDashboard from "./pages/dashboard/SimpleDashboard";
import ExamsPage from "./pages/exams/ExamsPage";
import UserManagementPage from "./pages/users/UserManagementPage";
import UserProfilePage from "./pages/users/UserProfilePage";
import RolesManagementPage from "./pages/users/RolesManagementPage";
import DepartmentsManagementPage from "./pages/users/DepartmentsManagementPage";
import PositionsManagementPage from "./pages/users/PositionsManagementPage";
import EducationModelManagementPage from "./pages/curriculum/EducationModelManagementPage";
import CurriculumManagementPageV2 from "./pages/curriculum/CurriculumManagementPageV2";
import QuestionListPage from "./pages/questions/QuestionListPage";
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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
                <SimpleDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/questions"
            element={
              <DashboardLayout>
                <QuestionListPage />
              </DashboardLayout>
            }
          />
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
                <ExamsPage />
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
            path="/presentations"
            element={
              <DashboardLayout>
                <PresentationListPage />
              </DashboardLayout>
            }
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
          <Route
            path="/finance/subscriptions"
            element={
              <DashboardLayout>
                <SubscriptionsPage />
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
            path="/certificates"
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
    </QueryClientProvider>
  );
}

export default App;
