import React from 'react';
import { Database, Search, Filter, Download } from 'lucide-react';
import { useQuestionData } from '../hooks/useQuestionData';

export default function QuestionBankTab() {
  const { questions } = useQuestionData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Database className="w-8 h-8 text-indigo-600" />
            Soru Bankası
          </h2>
          <p className="text-gray-600 mt-1">Tüm soruları görüntüleyin, filtreleyin ve yönetin</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Download className="w-5 h-5" />
          Dışa Aktar
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Soru metni, anahtar kelime..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <button className="w-full btn btn-secondary flex items-center justify-center gap-2">
              <Filter className="w-5 h-5" />
              Gelişmiş Filtre
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Toplam Soru', value: questions.length, color: 'blue' },
          { label: 'Çoktan Seçmeli', value: Math.floor(questions.length * 0.6), color: 'green' },
          { label: 'Doğru/Yanlış', value: Math.floor(questions.length * 0.2), color: 'purple' },
          { label: 'Diğer Tipler', value: Math.floor(questions.length * 0.2), color: 'orange' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white border rounded-xl p-6">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className={`text-3xl font-bold text-${stat.color}-600 mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Question List with Preview */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold">Soru Listesi</h3>
        </div>
        <div className="divide-y">
          {questions.map((question, idx) => (
            <div key={question.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-indigo-600">{idx + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{question.text}</h4>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                        {question.type}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                        {question.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{question.subject}</span>
                    <span>•</span>
                    <span>{question.createdBy}</span>
                    <span>•</span>
                    <span>{question.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

