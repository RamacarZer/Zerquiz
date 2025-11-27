import React from 'react';
import { Users, TrendingUp, Award, Clock, CheckCircle, XCircle } from 'lucide-react';
import { ExamGradingStats } from '../../mocks/gradingDemoData';

interface ExamStatsOverviewProps {
  stats: ExamGradingStats;
}

export default function ExamStatsOverview({ stats }: ExamStatsOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-600">Katılımcı</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalStudents}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-xs text-gray-600">Ortalama</div>
              <div className="text-2xl font-bold text-gray-900">{stats.averageScore}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-xs text-gray-600">En Yüksek</div>
              <div className="text-2xl font-bold text-gray-900">{stats.highestScore}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <div className="text-xs text-gray-600">Ort. Süre</div>
              <div className="text-2xl font-bold text-gray-900">{stats.averageTime}dk</div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Range & Pass Rate */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Not Aralığı</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">En Yüksek</span>
              <span className="text-lg font-bold text-green-600">{stats.highestScore}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ortalama</span>
              <span className="text-lg font-bold text-blue-600">{stats.averageScore}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">En Düşük</span>
              <span className="text-lg font-bold text-red-600">{stats.lowestScore}</span>
            </div>
          </div>

          {/* Visual Range */}
          <div className="mt-4 relative h-8 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-lg">
            <div
              className="absolute w-1 h-full bg-white border-2 border-gray-900 rounded"
              style={{ left: `${stats.lowestScore}%` }}
              title={`En Düşük: ${stats.lowestScore}`}
            />
            <div
              className="absolute w-1 h-full bg-white border-2 border-blue-900 rounded"
              style={{ left: `${stats.averageScore}%` }}
              title={`Ortalama: ${stats.averageScore}`}
            />
            <div
              className="absolute w-1 h-full bg-white border-2 border-gray-900 rounded"
              style={{ left: `${stats.highestScore}%` }}
              title={`En Yüksek: ${stats.highestScore}`}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Başarı Oranı</h3>
          
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - stats.passRate / 100)}`}
                  className={stats.passRate >= 70 ? 'text-green-600' : stats.passRate >= 50 ? 'text-yellow-600' : 'text-red-600'}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl font-bold ${
                  stats.passRate >= 70 ? 'text-green-600' : 
                  stats.passRate >= 50 ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {stats.passRate}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Geçti</span>
              </div>
              <span className="font-bold">
                {Math.round((stats.passRate / 100) * stats.totalStudents)} öğrenci
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-4 w-4" />
                <span>Kaldı</span>
              </div>
              <span className="font-bold">
                {stats.totalStudents - Math.round((stats.passRate / 100) * stats.totalStudents)} öğrenci
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

