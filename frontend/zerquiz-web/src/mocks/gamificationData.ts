/**
 * Gamification Mock Data
 * Oyunlaştırma sistemi - Rozetler, XP, Liderlik
 */

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'achievement' | 'streak' | 'milestone' | 'special' | 'rank';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  requirement: string;
  unlockedBy: number; // Kaç kişi açtı
  totalUsers: number;
}

export interface UserProgress {
  userId: string;
  userName: string;
  avatar: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  badges: UserBadge[];
  streakDays: number;
  longestStreak: number;
  rank: number;
  totalQuestions: number;
  correctAnswers: number;
  averageScore: number;
  completedExams: number;
}

export interface UserBadge {
  badgeId: string;
  badgeName: string;
  icon: string;
  unlockedAt: Date;
  category: Badge['category'];
  rarity: Badge['rarity'];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatar: string;
  level: number;
  totalXP: number;
  badges: number;
  weeklyXP: number;
  trend: 'up' | 'down' | 'stable';
}

export interface XPActivity {
  id: string;
  activityType: 'exam' | 'question' | 'badge' | 'streak' | 'achievement';
  description: string;
  xpEarned: number;
  timestamp: Date;
}

// Badge Katalog (30+ rozet)
export const badgeCatalog: Badge[] = [
  // Achievement Badges
  {
    id: 'badge-first-exam',
    name: 'İlk Adım',
    description: 'İlk sınavını tamamladın!',
    icon: '🎯',
    category: 'achievement',
    rarity: 'common',
    xpReward: 50,
    requirement: '1 sınav tamamla',
    unlockedBy: 1247,
    totalUsers: 1500,
  },
  {
    id: 'badge-perfect-score',
    name: 'Mükemmel Puan',
    description: 'Bir sınavdan tam puan aldın!',
    icon: '🌟',
    category: 'achievement',
    rarity: 'rare',
    xpReward: 150,
    requirement: '100 puan al',
    unlockedBy: 342,
    totalUsers: 1500,
  },
  {
    id: 'badge-speed-demon',
    name: 'Hız Şampiyonu',
    description: 'Sınavı zamanın yarısından kısa sürede bitirdin!',
    icon: '⚡',
    category: 'achievement',
    rarity: 'epic',
    xpReward: 200,
    requirement: 'Sürenin %50\'sinden kısa',
    unlockedBy: 89,
    totalUsers: 1500,
  },
  {
    id: 'badge-night-owl',
    name: 'Gece Kuşu',
    description: 'Gece yarısı sınav çözdün!',
    icon: '🦉',
    category: 'special',
    rarity: 'rare',
    xpReward: 100,
    requirement: '00:00-05:00 arası sınav',
    unlockedBy: 234,
    totalUsers: 1500,
  },

  // Streak Badges
  {
    id: 'badge-streak-3',
    name: '3 Günlük Seri',
    description: '3 gün üst üste sınav çözdün!',
    icon: '🔥',
    category: 'streak',
    rarity: 'common',
    xpReward: 75,
    requirement: '3 gün ardışık',
    unlockedBy: 892,
    totalUsers: 1500,
  },
  {
    id: 'badge-streak-7',
    name: '1 Haftalık Seri',
    description: '7 gün üst üste sınav çözdün!',
    icon: '🔥🔥',
    category: 'streak',
    rarity: 'rare',
    xpReward: 200,
    requirement: '7 gün ardışık',
    unlockedBy: 456,
    totalUsers: 1500,
  },
  {
    id: 'badge-streak-30',
    name: '1 Aylık Seri',
    description: '30 gün üst üste sınav çözdün!',
    icon: '🔥🔥🔥',
    category: 'streak',
    rarity: 'epic',
    xpReward: 500,
    requirement: '30 gün ardışık',
    unlockedBy: 67,
    totalUsers: 1500,
  },
  {
    id: 'badge-streak-100',
    name: '100 Günlük Efsane',
    description: '100 gün üst üste sınav çözdün! İNANILMAZ!',
    icon: '👑',
    category: 'streak',
    rarity: 'legendary',
    xpReward: 1000,
    requirement: '100 gün ardışık',
    unlockedBy: 3,
    totalUsers: 1500,
  },

  // Milestone Badges
  {
    id: 'badge-10-exams',
    name: '10 Sınav',
    description: '10 sınav tamamladın!',
    icon: '📚',
    category: 'milestone',
    rarity: 'common',
    xpReward: 100,
    requirement: '10 sınav',
    unlockedBy: 734,
    totalUsers: 1500,
  },
  {
    id: 'badge-50-exams',
    name: '50 Sınav',
    description: '50 sınav tamamladın!',
    icon: '📖',
    category: 'milestone',
    rarity: 'rare',
    xpReward: 300,
    requirement: '50 sınav',
    unlockedBy: 278,
    totalUsers: 1500,
  },
  {
    id: 'badge-100-exams',
    name: '100 Sınav Ustası',
    description: '100 sınav tamamladın! Çalışkan!',
    icon: '🎓',
    category: 'milestone',
    rarity: 'epic',
    xpReward: 500,
    requirement: '100 sınav',
    unlockedBy: 89,
    totalUsers: 1500,
  },
  {
    id: 'badge-1000-questions',
    name: '1000 Soru',
    description: '1000 soru çözdün!',
    icon: '🧠',
    category: 'milestone',
    rarity: 'epic',
    xpReward: 400,
    requirement: '1000 soru',
    unlockedBy: 123,
    totalUsers: 1500,
  },

  // Rank Badges
  {
    id: 'badge-top-10',
    name: 'İlk 10',
    description: 'Liderlik tablosunda ilk 10\'a girdin!',
    icon: '🏅',
    category: 'rank',
    rarity: 'rare',
    xpReward: 250,
    requirement: 'Top 10 rank',
    unlockedBy: 10,
    totalUsers: 1500,
  },
  {
    id: 'badge-top-3',
    name: 'Podyum',
    description: 'Liderlik tablosunda ilk 3\'e girdin!',
    icon: '🥇',
    category: 'rank',
    rarity: 'epic',
    xpReward: 400,
    requirement: 'Top 3 rank',
    unlockedBy: 3,
    totalUsers: 1500,
  },
  {
    id: 'badge-champion',
    name: 'Şampiyon',
    description: 'Liderlik tablosunda 1. oldun!',
    icon: '👑',
    category: 'rank',
    rarity: 'legendary',
    xpReward: 1000,
    requirement: 'Rank #1',
    unlockedBy: 1,
    totalUsers: 1500,
  },

  // Special Badges
  {
    id: 'badge-all-topics',
    name: 'Çok Yönlü',
    description: 'Tüm konulardan sınav çözdün!',
    icon: '🌈',
    category: 'special',
    rarity: 'epic',
    xpReward: 350,
    requirement: 'Tüm konular',
    unlockedBy: 156,
    totalUsers: 1500,
  },
  {
    id: 'badge-early-bird',
    name: 'Erken Kalkan',
    description: 'Sabah 6\'dan önce sınav çözdün!',
    icon: '🌅',
    category: 'special',
    rarity: 'rare',
    xpReward: 100,
    requirement: '05:00-07:00 arası',
    unlockedBy: 345,
    totalUsers: 1500,
  },
  {
    id: 'badge-weekend-warrior',
    name: 'Hafta Sonu Savaşçısı',
    description: 'Hafta sonu da çalıştın!',
    icon: '⚔️',
    category: 'special',
    rarity: 'common',
    xpReward: 80,
    requirement: 'Hafta sonu sınav',
    unlockedBy: 567,
    totalUsers: 1500,
  },
];

// Demo User Progress
export const mockUserProgress: UserProgress = {
  userId: 'user-001',
  userName: 'Ahmet Yılmaz',
  avatar: 'https://i.pravatar.cc/150?img=12',
  level: 12,
  currentXP: 3450,
  xpToNextLevel: 5000,
  totalXP: 23450,
  badges: [
    {
      badgeId: 'badge-first-exam',
      badgeName: 'İlk Adım',
      icon: '🎯',
      unlockedAt: new Date('2024-09-01'),
      category: 'achievement',
      rarity: 'common',
    },
    {
      badgeId: 'badge-streak-7',
      badgeName: '1 Haftalık Seri',
      icon: '🔥🔥',
      unlockedAt: new Date('2024-10-15'),
      category: 'streak',
      rarity: 'rare',
    },
    {
      badgeId: 'badge-50-exams',
      badgeName: '50 Sınav',
      icon: '📖',
      unlockedAt: new Date('2024-11-20'),
      category: 'milestone',
      rarity: 'rare',
    },
    {
      badgeId: 'badge-perfect-score',
      badgeName: 'Mükemmel Puan',
      icon: '🌟',
      unlockedAt: new Date('2024-11-22'),
      category: 'achievement',
      rarity: 'rare',
    },
  ],
  streakDays: 14,
  longestStreak: 21,
  rank: 8,
  totalQuestions: 1250,
  correctAnswers: 987,
  averageScore: 78.96,
  completedExams: 52,
};

// Demo Leaderboard
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'user-top1',
    userName: 'Zeynep Kaya',
    avatar: 'https://i.pravatar.cc/150?img=5',
    level: 25,
    totalXP: 87650,
    badges: 18,
    weeklyXP: 2340,
    trend: 'stable',
  },
  {
    rank: 2,
    userId: 'user-top2',
    userName: 'Mehmet Demir',
    avatar: 'https://i.pravatar.cc/150?img=8',
    level: 23,
    totalXP: 79230,
    badges: 15,
    weeklyXP: 1890,
    trend: 'up',
  },
  {
    rank: 3,
    userId: 'user-top3',
    userName: 'Ayşe Şahin',
    avatar: 'https://i.pravatar.cc/150?img=9',
    level: 22,
    totalXP: 74560,
    badges: 16,
    weeklyXP: 2100,
    trend: 'down',
  },
  {
    rank: 4,
    userId: 'user-004',
    userName: 'Ali Çelik',
    avatar: 'https://i.pravatar.cc/150?img=11',
    level: 20,
    totalXP: 68900,
    badges: 14,
    weeklyXP: 1750,
    trend: 'up',
  },
  {
    rank: 5,
    userId: 'user-005',
    userName: 'Fatma Öztürk',
    avatar: 'https://i.pravatar.cc/150?img=10',
    level: 19,
    totalXP: 64320,
    badges: 13,
    weeklyXP: 1620,
    trend: 'stable',
  },
  {
    rank: 6,
    userId: 'user-006',
    userName: 'Mustafa Aydın',
    avatar: 'https://i.pravatar.cc/150?img=13',
    level: 18,
    totalXP: 59870,
    badges: 12,
    weeklyXP: 1480,
    trend: 'up',
  },
  {
    rank: 7,
    userId: 'user-007',
    userName: 'Elif Arslan',
    avatar: 'https://i.pravatar.cc/150?img=15',
    level: 17,
    totalXP: 55210,
    badges: 11,
    weeklyXP: 1390,
    trend: 'down',
  },
  {
    rank: 8,
    userId: 'user-001',
    userName: 'Ahmet Yılmaz',
    avatar: 'https://i.pravatar.cc/150?img=12',
    level: 12,
    totalXP: 23450,
    badges: 4,
    weeklyXP: 890,
    trend: 'up',
  },
];

// Recent Activities
export const mockXPActivities: XPActivity[] = [
  {
    id: 'act-001',
    activityType: 'exam',
    description: 'TYT Matematik Deneme 1 tamamlandı',
    xpEarned: 250,
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: 'act-002',
    activityType: 'badge',
    description: 'Mükemmel Puan rozeti kazanıldı',
    xpEarned: 150,
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: 'act-003',
    activityType: 'streak',
    description: '14 günlük seri devam ediyor',
    xpEarned: 70,
    timestamp: new Date(Date.now() - 10800000),
  },
  {
    id: 'act-004',
    activityType: 'question',
    description: '50 soru doğru cevaplandı',
    xpEarned: 100,
    timestamp: new Date(Date.now() - 14400000),
  },
];

// Level System
export const getLevelFromXP = (xp: number): number => {
  // Basit formül: Her level için 2000 XP
  return Math.floor(xp / 2000) + 1;
};

export const getXPForNextLevel = (currentXP: number): number => {
  const currentLevel = getLevelFromXP(currentXP);
  return currentLevel * 2000;
};

export const getBadgeColor = (rarity: Badge['rarity']): string => {
  const colors = {
    common: 'bg-gray-400',
    rare: 'bg-blue-500',
    epic: 'bg-purple-600',
    legendary: 'bg-yellow-500',
  };
  return colors[rarity];
};

export const getRarityLabel = (rarity: Badge['rarity']): string => {
  const labels = {
    common: 'Yaygın',
    rare: 'Nadir',
    epic: 'Epik',
    legendary: 'Efsanevi',
  };
  return labels[rarity];
};

