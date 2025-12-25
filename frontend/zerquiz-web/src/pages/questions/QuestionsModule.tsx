import { useState } from 'react';
import { 
  HelpCircle, RefreshCw, Sparkles, Brain, Database, Edit3,
  Plus, TrendingUp, FileQuestion, Target, Award, Zap
} from 'lucide-react';
import { useQuestionData } from './hooks/useQuestionData';
import Tabs from '../../components/common/Tabs';

import ManualQuestionTab from './tabs/ManualQuestionTab';
import AIQuestionTab from './tabs/AIQuestionTab';
import QuestionBankTab from './tabs/QuestionBankTab';
import QuestionEditorPageV4 from './QuestionEditorPageV4';

export default function QuestionsModule() {
  const { refreshData } = useQuestionData();
  const [activeTab, setActiveTab] = useState('manual');

  const tabs = [
    { id: 'manual', label: 'Elle Soru Girişi', icon: <Edit3 className="w-5 h-5" /> },
    { id: 'ai', label: 'AI ile Soru Üretimi', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'editor', label: 'Profesyonel Editör', icon: <Brain className="w-5 h-5" /> },
    { id: 'bank', label: 'Soru Bankası', icon: <Database className="w-5 h-5" /> },
  ];

  const stats = [
    { label: 'Toplam Soru', value: '2,845', icon: <FileQuestion className="w-6 h-6" />, color: 'from-blue-500 to-blue-600' },
    { label: 'AI Üretilen', value: '1,234', icon: <Sparkles className="w-6 h-6" />, color: 'from-purple-500 to-purple-600' },
    { label: 'Onaylandı', value: '2,541', icon: <Award className="w-6 h-6" />, color: 'from-green-500 to-green-600' },
    { label: 'Bu Hafta', value: '+156', icon: <TrendingUp className="w-6 h-6" />, color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <HelpCircle className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Soru Yönetim Merkezi</h1>
                <p className="text-lg text-gray-600">Elle, AI veya Profesyonel Editör ile soru oluşturun ve yönetin</p>
              </div>
            </div>
            <button 
              onClick={refreshData} 
              className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Yenile
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-all hover:-translate-y-1"
              style={{ 
                animationDelay: `${idx * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-md`}>
                  {stat.icon}
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border p-2">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className={activeTab === 'editor' ? '' : 'bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border p-8'}>
          {activeTab === 'manual' && <ManualQuestionTab />}
          {activeTab === 'ai' && <AIQuestionTab />}
          {activeTab === 'editor' && <QuestionEditorPageV4 />}
          {activeTab === 'bank' && <QuestionBankTab />}
        </div>

        {/* Quick Actions Footer */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Hızlı Soru Oluşturma</h3>
              <p className="text-lg opacity-90">AI destekli soru üretimi ile dakikalar içinde yüzlerce soru oluşturun</p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-4 bg-white/20 backdrop-blur rounded-xl font-bold hover:bg-white/30 transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Yeni Soru
              </button>
              <button className="px-6 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg">
                <Zap className="w-5 h-5" />
                AI ile Üret
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
