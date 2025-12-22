import React, { useState } from 'react';
import { 
  Users, TrendingUp, Calendar, Mail, BookOpen, Award, AlertCircle,
  BarChart3, Clock, Target, MessageSquare, Bell, CheckCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ParentPortalPage() {
  const [selectedChild, setSelectedChild] = useState('student-1');

  // Mock data for parent portal
  const children = [
    { id: 'student-1', name: 'Ahmet Yılmaz', grade: '10', class: '10-A' },
    { id: 'student-2', name: 'Ayşe Yılmaz', grade: '8', class: '8-B' },
  ];

  const studentData = {
    id: 'student-1',
    name: 'Ahmet Yılmaz',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AY',
    grade: '10',
    class: '10-A',
    studentNumber: '2024001234',
    overallAverage: 78.5,
    classRank: 12,
    totalStudents: 45,
    attendance: 96,
    absenceDays: 2,
    lastExamScore: 85,
    lastExamDate: '2024-11-25',
  };

  // Performance over time
  const performanceData = [
    { month: 'Eylül', score: 72, classAvg: 68 },
    { month: 'Ekim', score: 75, classAvg: 70 },
    { month: 'Kasım', score: 78, classAvg: 72 },
  ];

  // Subject performance
  const subjectData = [
    { subject: 'Matematik', score: 85, classAvg: 72 },
    { subject: 'Fizik', score: 78, classAvg: 70 },
    { subject: 'Kimya', score: 72, classAvg: 68 },
    { subject: 'Biyoloji', score: 80, classAvg: 75 },
    { subject: 'Türkçe', score: 88, classAvg: 78 },
    { subject: 'İngilizce', score: 82, classAvg: 74 },
  ];

  // Recent exams
  const recentExams = [
    { id: 1, name: 'Matematik Deneme #3', date: '2024-11-25', score: 85, maxScore: 100, status: 'completed' },
    { id: 2, name: 'Fizik Ara Sınav', date: '2024-11-22', score: 78, maxScore: 100, status: 'completed' },
    { id: 3, name: 'Kimya Test', date: '2024-11-20', score: 72, maxScore: 100, status: 'completed' },
    { id: 4, name: 'Türkçe Kompozisyon', date: '2024-11-18', score: 88, maxScore: 100, status: 'completed' },
  ];

  // Study hours per week
  const studyHoursData = [
    { day: 'Pzt', hours: 3 },
    { day: 'Sal', hours: 2.5 },
    { day: 'Çar', hours: 4 },
    { day: 'Per', hours: 3.5 },
    { day: 'Cum', hours: 2 },
    { day: 'Cmt', hours: 5 },
    { day: 'Paz', hours: 4 },
  ];

  // Notifications
  const notifications = [
    { id: 1, type: 'exam', title: 'Matematik Sınavı Yaklaşıyor', message: 'Matematik deneme sınavı 2 gün sonra.', date: '2024-11-26', read: false },
    { id: 2, type: 'message', title: 'Öğretmen Mesajı', message: 'Fizik öğretmeni not gönderdi.', date: '2024-11-25', read: false },
    { id: 3, type: 'result', title: 'Sınav Sonucu Açıklandı', message: 'Kimya test sonuçları yayınlandı.', date: '2024-11-24', read: true },
  ];

  // Upcoming events
  const upcomingEvents = [
    { id: 1, title: 'Matematik Deneme Sınavı', date: '2024-11-28', time: '09:00', type: 'exam' },
    { id: 2, title: 'Veli Toplantısı', date: '2024-11-30', time: '14:00', type: 'meeting' },
    { id: 3, title: 'Fizik Laboratuvar Sınavı', date: '2024-12-02', time: '10:30', type: 'exam' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTrendIcon = (current: number, avg: number) => {
    if (current > avg) return <TrendingUp className="h-4 w-4 text-green-600" />;
    return <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-purple-600" />
            Veli Portalı
          </h1>
          <p className="text-gray-600 mt-2">
            Çocuğunuzun akademik gelişimini takip edin
          </p>
        </div>

        {/* Child Selector */}
        {children.length > 1 && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Öğrenci Seçin</label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full md:w-64 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name} - {child.class}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Student Overview */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-md p-6 mb-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <img src={studentData.avatar} alt={studentData.name} className="w-20 h-20 rounded-full border-4 border-white" />
            <div>
              <h2 className="text-2xl font-bold">{studentData.name}</h2>
              <p className="text-sm opacity-90">{studentData.class} • Numara: {studentData.studentNumber}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-sm opacity-90">Genel Ortalama</p>
              <p className="text-2xl font-bold">{studentData.overallAverage}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-sm opacity-90">Sınıf Sıralaması</p>
              <p className="text-2xl font-bold">{studentData.classRank}/{studentData.totalStudents}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-sm opacity-90">Devam Oranı</p>
              <p className="text-2xl font-bold">%{studentData.attendance}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-sm opacity-90">Son Sınav</p>
              <p className="text-2xl font-bold">{studentData.lastExamScore}</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Trend */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Performans Trendi
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[60, 90]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} name="Öğrenci" />
                  <Line type="monotone" dataKey="classAvg" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" name="Sınıf Ort." />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-3 text-center">
                📈 Son 3 ayda <strong>+6 puan</strong> ilerleme. Trend: <strong className="text-green-600">Yükseliyor ↗</strong>
              </p>
            </div>

            {/* Subject Performance Radar */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Ders Bazlı Performans
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={subjectData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar name="Öğrenci" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Radar name="Sınıf Ort." dataKey="classAvg" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Study Hours */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Haftalık Çalışma Saatleri
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={studyHoursData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#8b5cf6" name="Saat" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-3 text-center">
                Toplam: <strong>24 saat/hafta</strong> • Önerilen: <strong>25-30 saat</strong>
              </p>
            </div>

            {/* Recent Exams */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Son Sınavlar
              </h2>
              <div className="space-y-3">
                {recentExams.map(exam => (
                  <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{exam.name}</h3>
                      <p className="text-sm text-gray-600">{new Date(exam.date).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-lg font-bold ${getScoreColor(exam.score)}`}>
                        {exam.score}/{exam.maxScore}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">%{((exam.score / exam.maxScore) * 100).toFixed(0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Info Cards */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-purple-600" />
                  Bildirimler
                </h2>
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                  {notifications.filter(n => !n.read).length}
                </span>
              </div>
              <div className="space-y-3">
                {notifications.map(notif => (
                  <div key={notif.id} className={`p-3 rounded-lg border-l-4 ${
                    notif.type === 'exam' ? 'bg-blue-50 border-blue-500' :
                    notif.type === 'message' ? 'bg-purple-50 border-purple-500' :
                    'bg-green-50 border-green-500'
                  } ${!notif.read ? 'font-medium' : 'opacity-75'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-900">{notif.title}</h3>
                        <p className="text-xs text-gray-700 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(notif.date).toLocaleDateString('tr-TR')}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Yaklaşan Etkinlikler
              </h2>
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${
                      event.type === 'exam' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {event.type === 'exam' ? <BookOpen className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{event.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(event.date).toLocaleDateString('tr-TR')} • {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Güçlü & Zayıf Yönler
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-green-800 mb-2 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> Güçlü Yönler
                  </h3>
                  <ul className="space-y-1">
                    {subjectData.filter(s => s.score > s.classAvg).slice(0, 3).map(s => (
                      <li key={s.subject} className="text-sm text-gray-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        {s.subject}: {s.score} (Sınıf: {s.classAvg})
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-800 mb-2 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> Geliştirilmesi Gerekenler
                  </h3>
                  <ul className="space-y-1">
                    {subjectData.filter(s => s.score <= s.classAvg).map(s => (
                      <li key={s.subject} className="text-sm text-gray-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        {s.subject}: {s.score} (Sınıf: {s.classAvg})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Teacher */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg shadow-md p-6 text-white">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Öğretmen ile İletişim
              </h2>
              <p className="text-sm opacity-90 mb-4">
                Öğretmenlerle doğrudan iletişim kurun, randevu alın veya soru sorun.
              </p>
              <button className="w-full px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                <Mail className="h-4 w-4 inline mr-2" />
                Mesaj Gönder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


