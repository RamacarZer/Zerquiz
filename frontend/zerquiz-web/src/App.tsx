import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import LoginPage from "./pages/auth/LoginPage";
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
import TenantManagementPage from "./pages/tenants/TenantManagementPage";
import TenantCreatePage from "./pages/tenants/TenantCreatePage";
import TenantDetailPage from "./pages/tenants/TenantDetailPage";
import TenantEditPage from "./pages/tenants/TenantEditPage";
import { LicensePackagesPage } from "./pages/licenses/LicensePackagesPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
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
          <Route
            path="/royalty"
            element={
              <DashboardLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold">Telif Yönetimi</h1>
                  <p className="text-gray-600 mt-2">
                    Bu modül geliştirilme aşamasında...
                  </p>
                </div>
              </DashboardLayout>
            }
          />
          <Route
            path="/reports"
            element={
              <DashboardLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold">Raporlar</h1>
                  <p className="text-gray-600 mt-2">
                    Bu modül geliştirilme aşamasında...
                  </p>
                </div>
              </DashboardLayout>
            }
          />
          <Route
            path="/certificates"
            element={
              <DashboardLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold">Sertifikalar</h1>
                  <p className="text-gray-600 mt-2">
                    Bu modül geliştirilme aşamasında...
                  </p>
                </div>
              </DashboardLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <DashboardLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold">Sistem Ayarları</h1>
                  <p className="text-gray-600 mt-2">
                    Bu modül geliştirilme aşamasında...
                  </p>
                </div>
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
          <Route
            path="/notifications"
            element={
              <DashboardLayout>
                <div className="p-8">
                  <h1 className="text-3xl font-bold">Bildirimler</h1>
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
