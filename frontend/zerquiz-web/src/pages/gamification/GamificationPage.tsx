import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award, TrendingUp, Target, Star, Flame, Trophy, Crown, ChevronUp, ChevronDown,
  Minus, Calendar, BarChart3, Sparkles, Lock, Unlock,
} from 'lucide-react';
import {
  Badge, UserProgress, LeaderboardEntry, XPActivity,
  badgeCatalog, mockUserProgress, mockLeaderboard, mockXPActivities,
  getBadgeColor, getRarityLabel,
} from '../../mocks/gamificationData';

type ViewMode = 'profile' | 'badges' | 'leaderboard' | 'activities';

export default function GamificationPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('profile');
  const [badgeFilter, setBadgeFilter] = useState<string>('all');
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'alltime'>('alltime');

  const user = mockUserProgress;
  const xpProgress = (user.currentXP / user.xpToNextLevel) * 100;
  const accuracyRate = ((user.correctAnswers / user.totalQuestions) * 100).toFixed(1);

  const filteredBadges = badgeCatalog.filter(b =>
    badgeFilter === 'all' || b.category === badgeFilter
  );

  const userBadgeIds = user.badges.map(b => b.badgeId);
  const unlockedBadges = filteredBadges.filter(b => userBadgeIds.includes(b.id));
  const lockedBadges = filteredBadges.filter(b => !userBadgeIds.includes(b.id));

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <ChevronUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <ChevronDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                <Trophy className="h-8 w-8 text-yellow-500" />
                Oyunlaştırma Sistemi
              </h1>
              <p className="text-sm text-gray-600 mt-1">Rozetler, XP ve liderlik tablosu</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setViewMode('profile')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
                viewMode === 'profile'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Target className="h-4 w-4" /> Profilim
            </button>
            <button
              onClick={() => setViewMode('badges')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
                viewMode === 'badges'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Award className="h-4 w-4" /> Rozetler ({user.badges.length}/{badgeCatalog.length})
            </button>
            <button
              onClick={() => setViewMode('leaderboard')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
                viewMode === 'leaderboard'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Trophy className="h-4 w-4" /> Liderlik Tablosu
            </button>
            <button
              onClick={() => setViewMode('activities')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
                viewMode === 'activities'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="h-4 w-4" /> Aktiviteler
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {viewMode === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-lg shadow-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <img src={user.avatar} alt={user.userName} className="w-20 h-20 rounded-full border-4 border-white shadow-lg" />
                  <div>
                    <h2 className="text-2xl font-bold">{user.userName}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xl font-bold">Level {user.level}</span>
                      <Crown className="h-5 w-5 text-yellow-300" />
                    </div>
                  </div>
                </div>

                {/* XP Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>XP İlerleme</span>
                    <span>{user.currentXP.toLocaleString()} / {user.xpToNextLevel.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-4 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${xpProgress}%` }}
                    >
                      <span className="text-xs font-bold">{Math.round(xpProgress)}%</span>
                    </div>
                  </div>
                </div>

                {/* Streak */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-3">
                    <Flame className="h-6 w-6 mb-2 text-orange-300" />
                    <div className="text-2xl font-bold">{user.streakDays}</div>
                    <div className="text-xs opacity-80">Günlük Seri</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <Star className="h-6 w-6 mb-2 text-yellow-300" />
                    <div className="text-2xl font-bold">#{user.rank}</div>
                    <div className="text-xs opacity-80">Sıralama</div>
                  </div>
                </div>
              </div>

              {/* Recent Badges */}
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="font-bold text-gray-900 mb-4">Son Kazanılan Rozetler</h3>
                <div className="space-y-3">
                  {user.badges.slice(0, 4).map(badge => (
                    <div key={badge.badgeId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-3xl">{badge.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-gray-900">{badge.badgeName}</div>
                        <div className="text-xs text-gray-600">{badge.unlockedAt.toLocaleDateString('tr-TR')}</div>
                      </div>
                      <span className={`px-2 py-1 ${getBadgeColor(badge.rarity)} text-white text-xs rounded-full`}>
                        {getRarityLabel(badge.rarity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <Award className="h-8 w-8 text-purple-500 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{user.badges.length}</div>
                  <div className="text-sm text-gray-600">Rozet</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{user.totalXP.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Toplam XP</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <Target className="h-8 w-8 text-blue-500 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{user.completedExams}</div>
                  <div className="text-sm text-gray-600">Sınav</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <Sparkles className="h-8 w-8 text-yellow-500 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{accuracyRate}%</div>
                  <div className="text-sm text-gray-600">Doğruluk</div>
                </div>
              </div>

              {/* Progress Charts */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4">İstatistikler</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700">Doğru Cevaplar</span>
                      <span className="font-semibold">{user.correctAnswers} / {user.totalQuestions}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full"
                        style={{ width: `${(user.correctAnswers / user.totalQuestions) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700">Rozet Koleksiyonu</span>
                      <span className="font-semibold">{user.badges.length} / {badgeCatalog.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-purple-500 h-3 rounded-full"
                        style={{ width: `${(user.badges.length / badgeCatalog.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700">Level İlerleme</span>
                      <span className="font-semibold">Level {user.level}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full"
                        style={{ width: `${xpProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Streak Calendar (Demo) */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4">Seri Takvimi</h3>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold text-orange-500 flex items-center gap-2">
                      <Flame className="h-8 w-8" />
                      {user.streakDays} Gün
                    </div>
                    <p className="text-sm text-gray-600">En Uzun: {user.longestStreak} gün</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Bugün çalıştın mı?</p>
                    <button className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                      Seriyi Devam Ettir
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 28 }, (_, i) => (
                    <div
                      key={i}
                      className={`h-8 rounded ${
                        i < user.streakDays ? 'bg-orange-400' : 'bg-gray-200'
                      }`}
                      title={`Gün ${i + 1}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'badges' && (
          <div>
            {/* Filter */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center gap-4">
              <label className="font-semibold text-gray-700">Kategori:</label>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                value={badgeFilter}
                onChange={(e) => setBadgeFilter(e.target.value)}
              >
                <option value="all">Tümü</option>
                <option value="achievement">Başarı</option>
                <option value="streak">Seri</option>
                <option value="milestone">Kilometre Taşı</option>
                <option value="rank">Sıralama</option>
                <option value="special">Özel</option>
              </select>
              <div className="ml-auto text-sm text-gray-600">
                <span className="font-semibold text-green-600">{unlockedBadges.length}</span> Kazanıldı • 
                <span className="font-semibold text-gray-400 ml-2">{lockedBadges.length}</span> Kilitli
              </div>
            </div>

            {/* Unlocked Badges */}
            {unlockedBadges.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Unlock className="h-6 w-6 text-green-500" />
                  Kazanılan Rozetler
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {unlockedBadges.map(badge => {
                    const userBadge = user.badges.find(ub => ub.badgeId === badge.id);
                    return (
                      <div key={badge.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition border-2 border-green-500">
                        <div className="text-center mb-3">
                          <div className="text-5xl mb-2">{badge.icon}</div>
                          <h3 className="font-bold text-gray-900">{badge.name}</h3>
                          <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                        </div>
                        <div className="flex justify-between items-center text-xs mb-2">
                          <span className={`px-2 py-1 ${getBadgeColor(badge.rarity)} text-white rounded-full`}>
                            {getRarityLabel(badge.rarity)}
                          </span>
                          <span className="text-yellow-600 font-semibold">+{badge.xpReward} XP</span>
                        </div>
                        {userBadge && (
                          <div className="text-xs text-gray-500 text-center mt-2 pt-2 border-t border-gray-200">
                            {userBadge.unlockedAt.toLocaleDateString('tr-TR')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Locked Badges */}
            {lockedBadges.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="h-6 w-6 text-gray-400" />
                  Kilitli Rozetler
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {lockedBadges.map(badge => (
                    <div key={badge.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition opacity-60">
                      <div className="text-center mb-3">
                        <div className="text-5xl mb-2 grayscale">{badge.icon}</div>
                        <h3 className="font-bold text-gray-700">{badge.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                      </div>
                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className={`px-2 py-1 ${getBadgeColor(badge.rarity)} text-white rounded-full`}>
                          {getRarityLabel(badge.rarity)}
                        </span>
                        <span className="text-yellow-600 font-semibold">+{badge.xpReward} XP</span>
                      </div>
                      <div className="text-xs text-gray-600 text-center mt-2 pt-2 border-t border-gray-200">
                        <Lock className="h-3 w-3 inline mr-1" />
                        {badge.requirement}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {viewMode === 'leaderboard' && (
          <div>
            {/* Period Filter */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center justify-between">
              <div className="flex gap-2">
                {(['daily', 'weekly', 'monthly', 'alltime'] as const).map(period => (
                  <button
                    key={period}
                    onClick={() => setLeaderboardPeriod(period)}
                    className={`px-4 py-2 rounded-lg transition ${
                      leaderboardPeriod === period
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {period === 'daily' && 'Günlük'}
                    {period === 'weekly' && 'Haftalık'}
                    {period === 'monthly' && 'Aylık'}
                    {period === 'alltime' && 'Tüm Zamanlar'}
                  </button>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Sıra</th>
                    <th className="px-6 py-4 text-left">Kullanıcı</th>
                    <th className="px-6 py-4 text-center">Level</th>
                    <th className="px-6 py-4 text-right">Toplam XP</th>
                    <th className="px-6 py-4 text-center">Rozetler</th>
                    <th className="px-6 py-4 text-right">Haftalık XP</th>
                    <th className="px-6 py-4 text-center">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockLeaderboard.map(entry => (
                    <tr
                      key={entry.userId}
                      className={`hover:bg-gray-50 transition ${
                        entry.userId === user.userId ? 'bg-purple-50 font-semibold' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {entry.rank === 1 && <Crown className="h-5 w-5 text-yellow-500" />}
                          {entry.rank === 2 && <span className="text-xl">🥈</span>}
                          {entry.rank === 3 && <span className="text-xl">🥉</span>}
                          <span className="text-lg font-bold">#{entry.rank}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={entry.avatar} alt={entry.userName} className="w-10 h-10 rounded-full" />
                          <span>{entry.userName}</span>
                          {entry.userId === user.userId && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Sen</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {entry.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold">{entry.totalXP.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                          {entry.badges}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-green-600 font-semibold">
                        +{entry.weeklyXP}
                      </td>
                      <td className="px-6 py-4 text-center">{getTrendIcon(entry.trend)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewMode === 'activities' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Son Aktiviteler</h2>
            <div className="space-y-4">
              {mockXPActivities.map(activity => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className={`p-3 rounded-full ${
                    activity.activityType === 'exam' ? 'bg-blue-100' :
                    activity.activityType === 'badge' ? 'bg-purple-100' :
                    activity.activityType === 'streak' ? 'bg-orange-100' :
                    'bg-green-100'
                  }`}>
                    {activity.activityType === 'exam' && <Target className="h-6 w-6 text-blue-600" />}
                    {activity.activityType === 'badge' && <Award className="h-6 w-6 text-purple-600" />}
                    {activity.activityType === 'streak' && <Flame className="h-6 w-6 text-orange-600" />}
                    {activity.activityType === 'question' && <Sparkles className="h-6 w-6 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-600">{activity.timestamp.toLocaleString('tr-TR')}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-yellow-600">+{activity.xpEarned}</span>
                    <p className="text-xs text-gray-600">XP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

