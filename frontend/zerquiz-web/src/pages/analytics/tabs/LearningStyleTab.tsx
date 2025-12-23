import React, { useState } from 'react';
import { Brain, Eye, Ear, Hand, BookOpen, TrendingUp, Award, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface LearningStyleData {
  visual: number;
  auditory: number;
  kinesthetic: number;
  reading: number;
}

export default function LearningStyleTab() {
  const [selectedStudent, setSelectedStudent] = useState<string>('student-1');

  // Mock data
  const styleScores: LearningStyleData = {
    visual: 85,
    auditory: 60,
    kinesthetic: 70,
    reading: 55,
  };

  const students = [
    { id: 'student-1', name: 'Ahmet Yılmaz', dominantStyle: 'Görsel (Visual)' },
    { id: 'student-2', name: 'Ayşe Demir', dominantStyle: 'İşitsel (Auditory)' },
    { id: 'student-3', name: 'Mehmet Kaya', dominantStyle: 'Kinestetik (Kinesthetic)' },
  ];

  const recommendations = [
    '📹 Video tabanlı içerikler kullanın',
    '📊 Grafikler ve diyagramlar ekleyin',
    '🎨 Renkli görseller ile destekleyin',
    '🗺️ Mind map ve şemalardan yararlanın',
  ];

  const performanceByStyle = [
    { style: 'Görsel', avgScore: 88, completionRate: 92 },
    { style: 'İşitsel', avgScore: 72, completionRate: 78 },
    { style: 'Kinestetik', avgScore: 81, completionRate: 85 },
    { style: 'Okuma/Yazma', avgScore: 68, completionRate: 71 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold">Öğrenme Stili Analizi</h2>
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
            <option key={student.id} value={student.id}>
              {student.name} - {student.dominantStyle}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Style Scores */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <PieChartIcon className="w-6 h-6 text-purple-600" />
            Öğrenme Stili Skorları
          </h3>
          <div className="space-y-4">
            {[
              { icon: Eye, label: 'Görsel (Visual)', score: styleScores.visual, color: 'blue' },
              { icon: Ear, label: 'İşitsel (Auditory)', score: styleScores.auditory, color: 'green' },
              { icon: Hand, label: 'Kinestetik (Kinesthetic)', score: styleScores.kinesthetic, color: 'orange' },
              { icon: BookOpen, label: 'Okuma/Yazma', score: styleScores.reading, color: 'purple' },
            ].map((style, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <style.icon className={`w-5 h-5 text-${style.color}-600`} />
                    <span className="font-medium">{style.label}</span>
                  </div>
                  <span className="font-bold text-gray-900">{style.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`bg-${style.color}-600 h-3 rounded-full transition-all`}
                    style={{ width: `${style.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-600" />
            Öneriler
          </h3>
          <ul className="space-y-3">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <span className="text-purple-600 font-bold">✓</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Performance by Style */}
      <div className="bg-white border rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          Stil Bazlı Performans
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Öğrenme Stili</th>
                <th className="px-6 py-3 text-left font-semibold">Ortalama Puan</th>
                <th className="px-6 py-3 text-left font-semibold">Tamamlama Oranı</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {performanceByStyle.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{item.style}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${item.avgScore >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                      {item.avgScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-blue-600">{item.completionRate}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

