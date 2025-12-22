import React, { useState } from 'react';
import { 
  Brain, TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle,
  Users, BarChart3, PieChart, LineChart, BookOpen, Award, Clock, Zap
} from 'lucide-react';
import { LineChart as RechartsLine, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function AIAnalyticsDashboardPage() {
  const [selectedStudent, setSelectedStudent] = useState('student-1');
  const [selectedExamType, setSelectedExamType] = useState('all');

  // Mock AI Predictions
  const studentPrediction = {
    studentId: 'student-1',
    studentName: 'Ayşe Yılmaz',
    currentAverage: 78.5,
    predictedScore: 82.3,
    confidence: 87,
    trend: 'improving',
    riskLevel: 'low',
    recommendations: [
      { topic: 'Geometri', currentScore: 65, targetScore: 78, studyHours: 4, priority: 'high' },
      { topic: 'İntegral', currentScore: 72, targetScore: 80, studyHours: 3, priority: 'medium' },
      { topic: 'Trigonometri', currentScore: 81, targetScore: 88, studyHours: 2, priority: 'low' },
    ],
    strengths: ['Cebir (92%)', 'Olasılık (88%)', 'Limit (85%)'],
    weaknesses: ['Geometri (65%)', 'İntegral (72%)', 'Türev (74%)'],
  };

  // Performance over time (real vs predicted)
  const performanceData = [
    { month: 'Eylül', actual: 72, predicted: 71 },
    { month: 'Ekim', actual: 75, predicted: 74 },
    { month: 'Kasım', actual: 78, predicted: 79 },
    { month: 'Aralık', actual: null, predicted: 82 },
    { month: 'Ocak', actual: null, predicted: 85 },
  ];

  // Topic proficiency (radar chart)
  const topicProficiency = [
    { topic: 'Cebir', score: 92, classAvg: 75 },
    { topic: 'Geometri', score: 65, classAvg: 70 },
    { topic: 'Trigonometri', score: 81, classAvg: 72 },
    { topic: 'İntegral', score: 72, classAvg: 68 },
    { topic: 'Limit', score: 85, classAvg: 74 },
    { topic: 'Olasılık', score: 88, classAvg: 76 },
  ];

  // Question quality analysis
  const questionQualityData = [
    { id: 'q-001', text: 'İki bilinmeyenli denklem...', difficulty: 0.62, discrimination: 0.45, quality: 'Mükemmel' },
    { id: 'q-002', text: 'Trigonometrik fonksiyon...', difficulty: 0.38, discrimination: 0.52, quality: 'Mükemmel' },
    { id: 'q-003', text: 'İntegral hesaplama...', difficulty: 0.15, discrimination: 0.28, quality: 'Zor - Gözden Geçir' },
    { id: 'q-004', text: 'Geometrik şekil...', difficulty: 0.85, discrimination: 0.22, quality: 'Kolay - Revize Et' },
    { id: 'q-005', text: 'Olasılık problemi...', difficulty: 0.58, discrimination: 0.48, quality: 'Mükemmel' },
  ];

  // Risk distribution
  const riskDistribution = [
    { name: 'Düşük Risk', value: 18, color: '#10b981' },
    { name: 'Orta Risk', value: 8, color: '#f59e0b' },
    { name: 'Yüksek Risk', value: 4, color: '#ef4444' },
  ];

  // Study recommendation efficiency
  const studyEfficiencyData = [
    { subject: 'Matematik', hoursStudied: 12, scoreImprovement: 8 },
    { subject: 'Fizik', hoursStudied: 8, scoreImprovement: 6 },
    { subject: 'Kimya', hoursStudied: 10, scoreImprovement: 5 },
    { subject: 'Biyoloji', hoursStudied: 6, scoreImprovement: 7 },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'improving' ? <TrendingUp className="h-5 w-5 text-green-600" /> : <TrendingDown className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-600" />
            AI Analytics & Tahminler
          </h1>
          <p className="text-gray-600 mt-2">
            Yapay zeka destekli başarı tahmini, risk analizi ve kişiselleştirilmiş öneriler
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Öğrenci Seç</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="student-1">Ayşe Yılmaz</option>
              <option value="student-2">Mehmet Demir</option>
              <option value="student-3">Zeynep Kaya</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sınav Türü</label>
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tüm Sınavlar</option>
              <option value="tyt">TYT</option>
              <option value="ayt">AYT</option>
              <option value="lgs">LGS</option>
            </select>
          </div>
        </div>

        {/* Main Prediction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Current Score */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Mevcut Ortalama</h3>
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{studentPrediction.currentAverage}</p>
            <p className="text-sm text-gray-500 mt-1">Son 5 sınav ortalaması</p>
          </div>

          {/* Predicted Score */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg shadow-md text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">AI Tahmini (Sonraki Sınav)</h3>
              <Brain className="h-5 w-5" />
            </div>
            <p className="text-3xl font-bold">{studentPrediction.predictedScore}</p>
            <div className="flex items-center gap-2 mt-2">
              {getTrendIcon(studentPrediction.trend)}
              <span className="text-sm">+{(studentPrediction.predictedScore - studentPrediction.currentAverage).toFixed(1)} puan artış bekleniyor</span>
            </div>
          </div>

          {/* Confidence */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Tahmin Güvenilirliği</h3>
              <Zap className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">%{studentPrediction.confidence}</p>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${studentPrediction.confidence}%` }}></div>
            </div>
          </div>

          {/* Risk Level */}
          <div className={`p-6 rounded-lg shadow-md border-2 ${getRiskColor(studentPrediction.riskLevel)}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Risk Seviyesi</h3>
              {studentPrediction.riskLevel === 'low' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            </div>
            <p className="text-2xl font-bold capitalize">{studentPrediction.riskLevel === 'low' ? 'Düşük' : studentPrediction.riskLevel === 'medium' ? 'Orta' : 'Yüksek'}</p>
            <p className="text-sm mt-1 opacity-80">
              {studentPrediction.riskLevel === 'low' ? 'Öğrenci hedefleri üzerinde' : 'Ekstra destek gerekebilir'}
            </p>
          </div>
        </div>

        {/* Performance Prediction Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <LineChart className="h-5 w-5 text-purple-600" />
            Performans Trendi & AI Tahmini
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLine data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[60, 90]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#8b5cf6" strokeWidth={3} name="Gerçek Not" dot={{ r: 6 }} />
              <Line type="monotone" dataKey="predicted" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" name="AI Tahmini" dot={{ r: 4 }} />
            </RechartsLine>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 mt-3 text-center">
            📈 Trend analizi: Öğrenci son 3 ayda <strong>+6 puan</strong> ilerleme gösterdi. AI modeli gelecek 2 ay için <strong>+4 puan</strong> daha artış öngörüyor.
          </p>
        </div>

        {/* Topic Proficiency Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              Konu Yetkinlik Analizi
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={topicProficiency}>
                <PolarGrid />
                <PolarAngleAxis dataKey="topic" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="Öğrenci" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Radar name="Sınıf Ort." dataKey="classAvg" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Sınıf Risk Dağılımı (30 Öğrenci)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {riskDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.value} öğrenci</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            AI Önerileri - Kişiselleştirilmiş Çalışma Planı
          </h2>
          <div className="space-y-3">
            {studentPrediction.recommendations.map((rec, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                rec.priority === 'high' ? 'bg-red-50 border-red-500' :
                rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                'bg-green-50 border-green-500'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-900">{rec.topic}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        rec.priority === 'high' ? 'bg-red-200 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {rec.priority === 'high' ? 'Yüksek Öncelik' : rec.priority === 'medium' ? 'Orta Öncelik' : 'Düşük Öncelik'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-700">
                      <div>
                        <span className="font-medium">Mevcut:</span> %{rec.currentScore}
                      </div>
                      <div>
                        <span className="font-medium">Hedef:</span> %{rec.targetScore}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{rec.studyHours} saat çalışma önerisi</span>
                      </div>
                    </div>
                    <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full transition-all" style={{ width: `${(rec.currentScore / rec.targetScore) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Quality Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Soru Kalite Analizi (Öğretmen Görünümü)
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            AI tarafından analiz edilen soru kalitesi metrikleri. Düşük kaliteli sorular revize edilmelidir.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Soru ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Soru Metni</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Zorluk</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ayırt Edicilik</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Kalite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {questionQualityData.map((q, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{q.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{q.text}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-semibold">{(q.difficulty * 100).toFixed(0)}%</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-semibold">{q.discrimination.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        q.quality === 'Mükemmel' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {q.quality}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>💡 AI Önerisi:</strong> q-003 sorusu çok zor (15% doğru cevap) ve ayırt ediciliği düşük (0.28). 
              Soruyu basitleştirin veya ipuçları ekleyin. q-004 sorusu çok kolay (85% doğru), zorluğu artırın.
            </p>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-md border border-green-200">
            <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Güçlü Yönler
            </h2>
            <ul className="space-y-2">
              {studentPrediction.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{strength}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-green-700 mt-4 italic">
              Bu alanlarda öğrenci sınıf ortalamasının üzerinde performans gösteriyor. 
              Bu başarıyı sürdürmek için düzenli tekrar yapılmalı.
            </p>
          </div>

          {/* Weaknesses */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg shadow-md border border-red-200">
            <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Geliştirilmesi Gereken Alanlar
            </h2>
            <ul className="space-y-2">
              {studentPrediction.weaknesses.map((weakness, idx) => (
                <li key={idx} className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{weakness}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-red-700 mt-4 italic">
              Bu konulara öncelik verilmeli. Yukarıdaki AI önerilerini takip ederek 
              2-3 hafta içinde belirgin iyileşme görülebilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


