import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useQuestionData } from '../hooks/useQuestionData';
import { QUESTION_TYPES, CATEGORY_LABELS } from '../../../data/questionTypes';

export default function ManualQuestionTab() {
  const { questions } = useQuestionData();
  const [selectedType, setSelectedType] = useState<string>('all');

  const availableTypes = QUESTION_TYPES.slice(0, 22); // 22 template'li tip

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Kolay': return 'bg-blue-100 text-blue-800';
      case 'Orta': return 'bg-yellow-100 text-yellow-800';
      case 'Zor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Edit className="w-8 h-8 text-blue-600" />
            Elle Soru Girişi - 22 Template Hazır
          </h2>
          <p className="text-gray-600 mt-1">Manuel olarak soru oluşturun ve düzenleyin • 22 hazır template</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tüm Tipler</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <optgroup key={key} label={label}>
                {availableTypes
                  .filter(qt => qt.category === key)
                  .map(qt => (
                    <option key={qt.code} value={qt.code}>{qt.nameTR}</option>
                  ))}
              </optgroup>
            ))}
          </select>
          <button className="btn btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Yeni Soru Oluştur
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Soru</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{questions.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Edit className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktif Sorular</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {questions.filter(q => q.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taslak</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">
                {questions.filter(q => q.status === 'draft').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Edit className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Question List */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold">Soru Listesi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Soru Metni</th>
                <th className="px-6 py-3 text-left font-semibold">Tip</th>
                <th className="px-6 py-3 text-left font-semibold">Ders</th>
                <th className="px-6 py-3 text-left font-semibold">Zorluk</th>
                <th className="px-6 py-3 text-left font-semibold">Durum</th>
                <th className="px-6 py-3 text-left font-semibold">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {questions.map((question) => (
                <tr key={question.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 line-clamp-2">{question.text}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {question.createdBy} • {question.createdAt}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{question.type}</td>
                  <td className="px-6 py-4 text-gray-600">{question.subject}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(question.status)}`}>
                      {question.status === 'active' ? 'Aktif' : question.status === 'draft' ? 'Taslak' : 'Arşiv'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Görüntüle">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Düzenle">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Sil">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
