// Dashboard page

import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import {
  BookOpen,
  FileText,
  Users,
  TrendingUp,
  CheckSquare,
  Sparkles,
  BarChart3,
  Clock,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, roles } = useAuth();
  const { t } = useLanguage();

  const isTeacher = roles.includes('Teacher') || roles.includes('TenantAdmin');
  const isStudent = roles.includes('Student');

  // Mock data
  const teacherStats = [
    { icon: BookOpen, label: t('lesson_plans'), value: '12', color: 'bg-blue-500' },
    { icon: FileText, label: t('content_library'), value: '45', color: 'bg-green-500' },
    { icon: CheckSquare, label: t('assignments'), value: '8', color: 'bg-orange-500' },
    { icon: Users, label: 'Students', value: '156', color: 'bg-purple-500' },
  ];

  const studentStats = [
    { icon: CheckSquare, label: 'Pending Assignments', value: '3', color: 'bg-orange-500' },
    { icon: TrendingUp, label: 'Average Score', value: '85%', color: 'bg-green-500' },
    { icon: BarChart3, label: 'Completed Exams', value: '24', color: 'bg-blue-500' },
    { icon: Clock, label: 'Study Streak', value: '7 days', color: 'bg-purple-500' },
  ];

  const stats = isTeacher ? teacherStats : studentStats;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {t('welcome')}, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-blue-100">
          {isTeacher
            ? 'Manage your lessons, track student progress, and create amazing content with AI.'
            : 'Continue your learning journey and achieve your goals!'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-800 dark:text-white">
                {stat.value}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {stat.label}
            </h3>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center space-x-3 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {isTeacher ? 'Generated quiz from "Introduction to AI"' : 'Completed assignment: Essay Writing'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-xl font-bold">AI Recommendations</h2>
          </div>
          <div className="space-y-3">
            {isTeacher ? (
              <>
                <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                  <p className="font-medium">Create flashcards from your recent PDFs</p>
                  <p className="text-sm text-purple-100 mt-1">
                    You have 5 documents ready for AI generation
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                  <p className="font-medium">3 students need attention</p>
                  <p className="text-sm text-purple-100 mt-1">
                    Their performance has declined this week
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                  <p className="font-medium">Focus on Math - Chapter 5</p>
                  <p className="text-sm text-purple-100 mt-1">
                    Your weak area. Practice 10 more questions.
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                  <p className="font-medium">Try visual learning materials</p>
                  <p className="text-sm text-purple-100 mt-1">
                    Based on your learning style analysis
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

