// Student Progress Page - VARK analysis and performance tracking

import { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { 
  TrendingUp, TrendingDown, Brain, Target, Award, 
  BookOpen, AlertCircle, CheckCircle, Clock, BarChart3
} from 'lucide-react';

interface ProgressData {
  subject: string;
  mastery: number;
  trend: 'up' | 'down' | 'stable';
  lastActivity: string;
  questionsAnswered: number;
  accuracy: number;
}

const mockProgress: ProgressData[] = [
  { subject: 'Mathematics', mastery: 85, trend: 'up', lastActivity: '2 hours ago', questionsAnswered: 45, accuracy: 87 },
  { subject: 'Physics', mastery: 72, trend: 'stable', lastActivity: '1 day ago', questionsAnswered: 32, accuracy: 75 },
  { subject: 'Chemistry', mastery: 65, trend: 'down', lastActivity: '3 days ago', questionsAnswered: 28, accuracy: 68 },
  { subject: 'Biology', mastery: 90, trend: 'up', lastActivity: '5 hours ago', questionsAnswered: 52, accuracy: 92 },
];

const varkScores = {
  visual: 85,
  auditory: 65,
  kinesthetic: 72,
  reading: 78,
};

export default function StudentProgressPage() {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4 rounded-full bg-yellow-500" />;
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return 'text-green-600 dark:text-green-400';
    if (mastery >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('student_progress')}</h1>
            <p className="text-blue-100 text-lg">
              Track your learning journey and improve your skills
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
            <div className="text-3xl font-bold">85%</div>
            <div className="text-sm text-blue-100">Overall Mastery</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Study Streak', value: '7 days', icon: Award, color: 'bg-orange-500' },
          { label: 'Total Questions', value: '157', icon: Target, color: 'bg-blue-500' },
          { label: 'Avg Accuracy', value: '81%', icon: CheckCircle, color: 'bg-green-500' },
          { label: 'Study Time', value: '12.5h', icon: Clock, color: 'bg-purple-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Time Range Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Performance by Subject</h2>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all
                ${timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockProgress.map((subject) => (
          <div
            key={subject.subject}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                  {subject.subject}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {subject.questionsAnswered} questions answered
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(subject.trend)}
                <span className={`text-2xl font-bold ${getMasteryColor(subject.mastery)}`}>
                  {subject.mastery}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    subject.mastery >= 80
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : subject.mastery >= 60
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      : 'bg-gradient-to-r from-red-500 to-pink-500'
                  }`}
                  style={{ width: `${subject.mastery}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div>Accuracy: <strong>{subject.accuracy}%</strong></div>
              <div>{subject.lastActivity}</div>
            </div>
          </div>
        ))}
      </div>

      {/* VARK Learning Style Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {t('learning_style')} - VARK Analysis
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Radar Chart Placeholder */}
          <div className="flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8">
            <div className="text-center">
              <div className="w-48 h-48 rounded-full border-8 border-purple-200 dark:border-purple-800 flex items-center justify-center mb-4">
                <div className="text-center">
                  <Brain className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">VARK</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Profile</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your dominant learning style: <strong>Visual</strong>
              </p>
            </div>
          </div>

          {/* VARK Scores */}
          <div className="space-y-4">
            {Object.entries(varkScores).map(([type, score]) => (
              <div key={type}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {type}
                  </span>
                  <span className="text-sm font-bold text-purple-600">{score}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 shadow-lg text-white">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6" />
          <h2 className="text-xl font-bold">AI Study Recommendations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Focus on Chemistry - Chapter 5',
              desc: 'Your weak area. Practice 15 more questions to improve.',
              priority: 'High',
              icon: AlertCircle,
            },
            {
              title: 'Try Visual Learning Materials',
              desc: 'Based on your VARK profile, visual content will help you learn faster.',
              priority: 'Medium',
              icon: BookOpen,
            },
            {
              title: 'Maintain Your Streak!',
              desc: "You're on a 7-day streak. Keep it up to unlock achievements.",
              priority: 'Low',
              icon: Award,
            },
            {
              title: 'Review Mathematics Concepts',
              desc: 'Time to solidify your strong areas with advanced problems.',
              priority: 'Medium',
              icon: BarChart3,
            },
          ].map((rec, idx) => (
            <div
              key={idx}
              className="bg-white/20 backdrop-blur rounded-lg p-4 hover:bg-white/30 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="bg-white/30 p-2 rounded-lg">
                  <rec.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold">{rec.title}</h4>
                    <span className="text-xs px-2 py-1 bg-white/30 rounded-full">
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm text-purple-100">{rec.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak & Strong Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weak Areas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Areas to Improve</h3>
          </div>
          <div className="space-y-3">
            {['Organic Chemistry', 'Calculus - Integration', 'Quantum Physics'].map((area, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-800 dark:text-white">{area}</span>
                <button className="text-xs px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                  Practice
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Strong Areas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Your Strengths</h3>
          </div>
          <div className="space-y-3">
            {['Cell Biology', 'Algebra', 'Classical Mechanics'].map((area, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-800 dark:text-white">{area}</span>
                <span className="text-xs px-3 py-1 bg-green-600 text-white rounded-full">
                  Mastered
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
