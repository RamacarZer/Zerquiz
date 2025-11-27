import { demoQuestions } from './questionDemoData';
import { demoExams } from './examDemoData';
import { demoResults } from './gradingDemoData';

// ==================== DASHBOARD VERİLERİ ====================

export interface DashboardStats {
  totalQuestions: number;
  totalExams: number;
  totalStudents: number;
  totalUsers: number;
  activeExams: number;
  completedExams: number;
  publishedQuestions: number;
  draftQuestions: number;
  avgExamScore: number;
  avgQuestionDifficulty: string;
}

export interface ActivityData {
  date: string;
  questionsCreated: number;
  examsCreated: number;
  studentsParticipated: number;
  examsCompleted: number;
}

export interface RecentActivity {
  id: string;
  type: 'question_created' | 'exam_created' | 'exam_started' | 'exam_completed' | 'user_registered' | 'question_approved' | 'question_rejected';
  title: string;
  description: string;
  user: string;
  timestamp: string;
  icon?: string;
  color?: string;
}

export interface SystemHealth {
  cpu: number; // %
  memory: number; // %
  disk: number; // %
  uptime: number; // hours
  responseTime: number; // ms
  status: 'healthy' | 'warning' | 'critical';
}

export interface ExamTypeDistribution {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

// ==================== İSTATİSTİKLERİ HESAPLA ====================

function calculateDashboardStats(): DashboardStats {
  const totalQuestions = demoQuestions.length;
  const publishedQuestions = demoQuestions.filter(q => q.status === 'published').length;
  const draftQuestions = demoQuestions.filter(q => q.status === 'draft').length;

  const totalExams = demoExams.length;
  const activeExams = demoExams.filter(e => e.status === 'active').length;
  const completedExams = demoExams.filter(e => e.status === 'completed').length;

  // Unique students from results
  const uniqueStudents = new Set(demoResults.map(r => r.studentId));
  const totalStudents = uniqueStudents.size;

  // Calculate average score
  const avgExamScore = demoResults.length > 0
    ? Math.round(demoResults.reduce((sum, r) => sum + r.score, 0) / demoResults.length)
    : 0;

  // Difficulty distribution
  const difficulties = demoQuestions.map(q => q.difficulty);
  const difficultyCount: Record<string, number> = {};
  difficulties.forEach(d => {
    difficultyCount[d] = (difficultyCount[d] || 0) + 1;
  });
  const maxDifficulty = Object.entries(difficultyCount).sort((a, b) => b[1] - a[1])[0];
  const avgQuestionDifficulty = maxDifficulty ? maxDifficulty[0] : 'medium';

  return {
    totalQuestions,
    totalExams,
    totalStudents,
    totalUsers: totalStudents + 5, // +5 for instructors
    activeExams,
    completedExams,
    publishedQuestions,
    draftQuestions,
    avgExamScore,
    avgQuestionDifficulty,
  };
}

// ==================== AKTİVİTE VERİLERİ OLUŞTUR ====================

function generateActivityData(): ActivityData[] {
  const activities: ActivityData[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    activities.push({
      date: date.toISOString().split('T')[0],
      questionsCreated: Math.floor(Math.random() * 15) + 3,
      examsCreated: Math.floor(Math.random() * 5) + 1,
      studentsParticipated: Math.floor(Math.random() * 30) + 10,
      examsCompleted: Math.floor(Math.random() * 8) + 2,
    });
  }

  return activities;
}

// ==================== SON AKTİVİTELER ====================

function generateRecentActivities(): RecentActivity[] {
  const activityTypes: Array<{
    type: RecentActivity['type'];
    titleTemplate: string;
    descTemplate: string;
    icon: string;
    color: string;
  }> = [
    {
      type: 'question_created',
      titleTemplate: 'Yeni Soru Oluşturuldu',
      descTemplate: '{user} tarafından "{title}" sorusu oluşturuldu',
      icon: '📝',
      color: 'blue',
    },
    {
      type: 'exam_created',
      titleTemplate: 'Yeni Sınav Oluşturuldu',
      descTemplate: '{user} tarafından "{title}" sınavı oluşturuldu',
      icon: '📋',
      color: 'green',
    },
    {
      type: 'exam_started',
      titleTemplate: 'Sınav Başlatıldı',
      descTemplate: '{user} "{title}" sınavına başladı',
      icon: '▶️',
      color: 'yellow',
    },
    {
      type: 'exam_completed',
      titleTemplate: 'Sınav Tamamlandı',
      descTemplate: '{user} "{title}" sınavını tamamladı',
      icon: '✅',
      color: 'green',
    },
    {
      type: 'question_approved',
      titleTemplate: 'Soru Onaylandı',
      descTemplate: '{user} tarafından "{title}" sorusu onaylandı',
      icon: '✓',
      color: 'green',
    },
    {
      type: 'user_registered',
      titleTemplate: 'Yeni Kullanıcı',
      descTemplate: '{user} sisteme kaydoldu',
      icon: '👤',
      color: 'purple',
    },
  ];

  const users = [
    'Ahmet Yılmaz',
    'Ayşe Demir',
    'Mehmet Kaya',
    'Fatma Çelik',
    'Ali Şahin',
    'Zeynep Yıldız',
    'Mustafa Aydın',
    'Elif Öztürk',
  ];

  const activities: RecentActivity[] = [];
  const now = new Date();

  for (let i = 0; i < 20; i++) {
    const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const timestamp = new Date(now.getTime() - i * 15 * 60 * 1000); // 15 dk arayla

    let title = '';
    if (activityType.type === 'question_created' || activityType.type === 'question_approved') {
      const question = demoQuestions[Math.floor(Math.random() * demoQuestions.length)];
      title = question.headerText || `Soru ${question.code}`;
    } else if (activityType.type.includes('exam')) {
      const exam = demoExams[Math.floor(Math.random() * demoExams.length)];
      title = exam.title;
    } else {
      title = user;
    }

    activities.push({
      id: `activity-${i}`,
      type: activityType.type,
      title: activityType.titleTemplate,
      description: activityType.descTemplate
        .replace('{user}', user)
        .replace('{title}', title),
      user,
      timestamp: timestamp.toISOString(),
      icon: activityType.icon,
      color: activityType.color,
    });
  }

  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// ==================== SİSTEM SAĞLIĞI ====================

function generateSystemHealth(): SystemHealth {
  const cpu = Math.floor(Math.random() * 30) + 20; // 20-50%
  const memory = Math.floor(Math.random() * 40) + 30; // 30-70%
  const disk = Math.floor(Math.random() * 20) + 40; // 40-60%
  const uptime = Math.floor(Math.random() * 500) + 100; // 100-600 hours
  const responseTime = Math.floor(Math.random() * 100) + 50; // 50-150ms

  let status: SystemHealth['status'] = 'healthy';
  if (cpu > 80 || memory > 85 || disk > 90) {
    status = 'critical';
  } else if (cpu > 60 || memory > 70 || disk > 75) {
    status = 'warning';
  }

  return {
    cpu,
    memory,
    disk,
    uptime,
    responseTime,
    status,
  };
}

// ==================== SINAV TİPİ DAĞILIMI ====================

function getExamTypeDistribution(): ExamTypeDistribution[] {
  const typeCount: Record<string, number> = {};
  
  demoExams.forEach(exam => {
    typeCount[exam.examType] = (typeCount[exam.examType] || 0) + 1;
  });

  const total = demoExams.length;
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return Object.entries(typeCount).map(([type, count], index) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count,
    percentage: Math.round((count / total) * 100),
    color: colors[index % colors.length],
  }));
}

// ==================== EXPORT ====================

export const dashboardStats = calculateDashboardStats();
export const activityData = generateActivityData();
export const recentActivities = generateRecentActivities();
export const systemHealth = generateSystemHealth();
export const examTypeDistribution = getExamTypeDistribution();

// ==================== HELPER FONKSİYONLAR ====================

export function getTopPerformingQuestions(limit: number = 5) {
  // Most used questions
  const questionUsage: Record<string, number> = {};
  
  demoResults.forEach(result => {
    result.answers.forEach(answer => {
      questionUsage[answer.questionId] = (questionUsage[answer.questionId] || 0) + 1;
    });
  });

  return Object.entries(questionUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([questionId, usage]) => {
      const question = demoQuestions.find(q => q.id === questionId);
      return {
        questionId,
        question,
        usageCount: usage,
      };
    });
}

export function getRecentExams(limit: number = 5) {
  return [...demoExams]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getTodayStats() {
  const today = new Date().toISOString().split('T')[0];
  const todayActivity = activityData.find(a => a.date === today);
  
  return todayActivity || {
    date: today,
    questionsCreated: 0,
    examsCreated: 0,
    studentsParticipated: 0,
    examsCompleted: 0,
  };
}

