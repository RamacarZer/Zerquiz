import React, { useState } from 'react';
import { Brain, TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle, Users, Award, Zap } from 'lucide-react';

export default function AIAnalyticsTab() {
  const [selectedStudent, setSelectedStudent] = useState('student-1');

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

  const students = [
    { id: 'student-1', name: 'Ayşe Yılmaz' },
    { id: 'student-2', name: 'Ahmet Kaya' },
    { id: 'student-3', name: 'Mehmet Demir' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold">AI Analitik Dashboard</h2>
      </div>

      {/* Student Selector */}
      <div className="bg-white border rounded-xl p-6">
        <label className="block text-sm font-semibold mb-2">Öğrenci Seç</label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          {students.map((student) => (
            <option key={student.id} value={student.id}>{student.name}</option>
          ))}
        </select>
      </div>

      {/* Prediction Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <Target className="w-8 h-8 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">{studentPrediction.currentAverage}%</span>
          </div>
          <p className="text-gray-600 font-medium">Şu Anki Ortalama</p>
        </div>
        <div className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-3xl font-bold text-green-600">{studentPrediction.predictedScore}%</span>
          </div>
          <p className="text-gray-600 font-medium">Tahmini Puan</p>
        </div>
        <div className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <Zap className="w-8 h-8 text-purple-600" />
            <span className="text-3xl font-bold text-gray-900">{studentPrediction.confidence}%</span>
          </div>
          <p className="text-gray-600 font-medium">Güven Skoru</p>
        </div>
        <div className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-sm font-bold text-green-600">DÜŞÜK RİSK</span>
          </div>
          <p className="text-gray-600 font-medium">Risk Seviyesi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Recommendations */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            AI Önerileri
          </h3>
          <div className="space-y-3">
            {studentPrediction.recommendations.map((rec, idx) => (
              <div key={idx} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{rec.topic}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(rec.priority)}`}>
                    {rec.priority === 'high' ? 'Yüksek' : rec.priority === 'medium' ? 'Orta' : 'Düşük'}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Mevcut: <span className="font-semibold text-orange-600">{rec.currentScore}%</span></p>
                  <p>Hedef: <span className="font-semibold text-green-600">{rec.targetScore}%</span></p>
                  <p>Önerilen Çalışma: <span className="font-semibold text-blue-600">{rec.studyHours} saat</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="space-y-6">
          <div className="bg-white border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Güçlü Yönler
            </h3>
            <ul className="space-y-2">
              {studentPrediction.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingDown className="w-6 h-6 text-red-600" />
              Geliştirilmesi Gereken Alanlar
            </h3>
            <ul className="space-y-2">
              {studentPrediction.weaknesses.map((weakness, idx) => (
                <li key={idx} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-gray-700">{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          AI Öngörüsü
        </h3>
        <p className="text-gray-700 leading-relaxed">
          <span className="font-semibold">{studentPrediction.studentName}</span> için AI analizi, 
          mevcut performans trendine göre önümüzdeki dönemde <span className="font-bold text-green-600">+3.8 puanlık</span> bir 
          artış öngörüyor. Özellikle Geometri konusuna odaklanarak <span className="font-bold text-blue-600">4 saat</span> çalışma 
          ile hedef puana ulaşma olasılığı <span className="font-bold text-purple-600">%{studentPrediction.confidence}</span>.
        </p>
      </div>
    </div>
  );
}

