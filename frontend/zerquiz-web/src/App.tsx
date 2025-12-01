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
                  path="/questions/generator"
                  element={
                    <ProtectedRoute roles={['SuperAdmin', 'TenantAdmin', 'Teacher']}>
                      <AppLayout>
                        <QuestionGeneratorAdvanced />
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
