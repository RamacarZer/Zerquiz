import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "./pages/auth/LoginPage";
import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
import ExamsPage from "./pages/exams/ExamsPage";
import UserListPage from "./pages/users/UserListPage";
import UserCreatePage from "./pages/users/UserCreatePage";
import UserDetailPage from "./pages/users/UserDetailPage";
import UserEditPage from "./pages/users/UserEditPage";
import SubjectListPage from "./pages/curriculum/SubjectListPage";
import EducationModelManagementPage from "./pages/curriculum/EducationModelManagementPage";
import SubjectManagementPage from "./pages/curriculum/SubjectManagementPage";
import CurriculumHubPage from "./pages/curriculum/CurriculumHubPage";
import TopicManagementPage from "./pages/curriculum/TopicManagementPage";
import LearningOutcomeManagementPage from "./pages/curriculum/LearningOutcomeManagementPage";
import QuestionListPage from "./pages/questions/QuestionListPage";
import TenantListPage from "./pages/tenants/TenantListPage";
import TenantCreatePage from "./pages/tenants/TenantCreatePage";
import TenantDetailPage from "./pages/tenants/TenantDetailPage";
import TenantEditPage from "./pages/tenants/TenantEditPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/questions" element={<QuestionListPage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/users" element={<UserListPage />} />
          <Route path="/users/create" element={<UserCreatePage />} />
          <Route path="/users/:id" element={<UserDetailPage />} />
          <Route path="/users/:id/edit" element={<UserEditPage />} />
          <Route path="/tenants" element={<TenantListPage />} />
          <Route path="/tenants/create" element={<TenantCreatePage />} />
          <Route path="/tenants/:id" element={<TenantDetailPage />} />
          <Route path="/tenants/:id/edit" element={<TenantEditPage />} />
          <Route path="/curriculum" element={<CurriculumHubPage />} />
          <Route
            path="/curriculum/education-models"
            element={<EducationModelManagementPage />}
          />
          <Route
            path="/curriculum/subjects-manage"
            element={<SubjectManagementPage />}
          />
          <Route path="/curriculum/topics" element={<TopicManagementPage />} />
          <Route
            path="/curriculum/learning-outcomes"
            element={<LearningOutcomeManagementPage />}
          />
          <Route path="/curriculum/subjects" element={<SubjectListPage />} />
          <Route
            path="/grading"
            element={
              <div className="p-8">
                <h1 className="text-3xl font-bold">Değerlendirme</h1>
                <p className="text-gray-600 mt-2">
                  Bu modül geliştirilme aşamasında...
                </p>
              </div>
            }
          />
          <Route
            path="/royalty"
            element={
              <div className="p-8">
                <h1 className="text-3xl font-bold">Telif Yönetimi</h1>
                <p className="text-gray-600 mt-2">
                  Bu modül geliştirilme aşamasında...
                </p>
              </div>
            }
          />
          <Route
            path="/reports"
            element={
              <div className="p-8">
                <h1 className="text-3xl font-bold">Raporlar</h1>
                <p className="text-gray-600 mt-2">
                  Bu modül geliştirilme aşamasında...
                </p>
              </div>
            }
          />
          <Route
            path="/certificates"
            element={
              <div className="p-8">
                <h1 className="text-3xl font-bold">Sertifikalar</h1>
                <p className="text-gray-600 mt-2">
                  Bu modül geliştirilme aşamasında...
                </p>
              </div>
            }
          />
          <Route
            path="/settings"
            element={
              <div className="p-8">
                <h1 className="text-3xl font-bold">Sistem Ayarları</h1>
                <p className="text-gray-600 mt-2">
                  Bu modül geliştirilme aşamasında...
                </p>
              </div>
            }
          />
          <Route
            path="/audit-logs"
            element={
              <div className="p-8">
                <h1 className="text-3xl font-bold">Audit Logları</h1>
                <p className="text-gray-600 mt-2">
                  Bu modül geliştirilme aşamasında...
                </p>
              </div>
            }
          />
          <Route
            path="/notifications"
            element={
              <div className="p-8">
                <h1 className="text-3xl font-bold">Bildirimler</h1>
                <p className="text-gray-600 mt-2">
                  Bu modül geliştirilme aşamasında...
                </p>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
