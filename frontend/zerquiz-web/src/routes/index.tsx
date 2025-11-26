import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";

// Lazy load pages
const Dashboard = lazy(() => import("@/pages/dashboard/AdminDashboard"));
const Login = lazy(() => import("@/pages/auth/LoginPage"));
const Register = lazy(() => import("@/pages/auth/RegisterPage"));

// Curriculum
const CurriculumPage = lazy(() => import("@/pages/curriculum/CurriculumPage"));

// Questions
const QuestionsPage = lazy(() => import("@/pages/questions/QuestionsPage"));
const QuestionReviewQueue = lazy(
  () => import("@/pages/questions/QuestionReviewQueue")
);
const CreateQuestionPage = lazy(
  () => import("@/pages/questions/CreateQuestionPage")
);

// Exams
const ExamsPage = lazy(() => import("@/pages/exams/ExamsPage"));
const CreateExamPage = lazy(() => import("@/pages/exams/CreateExamPage"));
const ExamSessionPage = lazy(() => import("@/pages/exams/ExamSessionPage"));

// Grading
const GradingPage = lazy(() => import("@/pages/grading/GradingPage"));
const CertificatesPage = lazy(
  () => import("@/pages/certificates/CertificatesPage")
);

// Royalty
const AuthorDashboard = lazy(() => import("@/pages/royalty/AuthorDashboard"));

// Finance
const SubscriptionsPage = lazy(
  () => import("@/pages/finance/SubscriptionsPage")
);
const PaymentsPage = lazy(() => import("@/pages/finance/PaymentsPage"));

// Presentation
const PresentationsPage = lazy(
  () => import("@/pages/presentations/PresentationsPage")
);
const PresentationLivePage = lazy(
  () => import("@/pages/presentations/PresentationLivePage")
);

// Settings
const NotificationCenter = lazy(
  () => import("@/pages/notifications/NotificationCenter")
);
const TenantSettings = lazy(() => import("@/pages/settings/TenantSettings"));
const ProfileSettings = lazy(() => import("@/pages/settings/ProfileSettings"));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Main App Routes */}
        <Route element={<MainLayout />}>
          {/* Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Curriculum */}
          <Route path="/curriculum" element={<CurriculumPage />} />

          {/* Questions */}
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/questions/create" element={<CreateQuestionPage />} />
          <Route
            path="/questions/review-queue"
            element={<QuestionReviewQueue />}
          />

          {/* Exams */}
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/exams/create" element={<CreateExamPage />} />
          <Route path="/exams/:examId/session" element={<ExamSessionPage />} />

          {/* Grading */}
          <Route path="/grading" element={<GradingPage />} />
          <Route path="/certificates" element={<CertificatesPage />} />

          {/* Royalty */}
          <Route
            path="/royalty/author-dashboard"
            element={<AuthorDashboard />}
          />

          {/* Finance */}
          <Route
            path="/finance/subscriptions"
            element={<SubscriptionsPage />}
          />
          <Route path="/finance/payments" element={<PaymentsPage />} />

          {/* Presentations */}
          <Route path="/presentations" element={<PresentationsPage />} />
          <Route
            path="/presentations/:presentationId/live"
            element={<PresentationLivePage />}
          />

          {/* Settings */}
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/settings/tenant" element={<TenantSettings />} />
          <Route path="/settings/profile" element={<ProfileSettings />} />
        </Route>

        {/* Public Certificate Verification */}
        <Route path="/verify/:token" element={<CertificatesPage />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
