import { useState } from 'react';
import { 
  Library as LibraryIcon, RefreshCw, BookOpen, FileText, Image,
  Video, Music, Sparkles, Wand2, Bot, Zap, TrendingUp, Plus,
  Search, Filter, Grid, List, Star, Eye, Download
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useContentData } from './hooks/useContentData';
import Tabs from '../../components/common/Tabs';

import LibraryTab from './tabs/LibraryTab';
import AIGenerationTab from './tabs/AIGenerationTab';
import AIAssistantsTab from './tabs/AIAssistantsTab';

export default function ContentModule() {
  const { t } = useLanguage();
  const { refreshData } = useContentData();
  const [activeTab, setActiveTab] = useState('library');

  const tabs = [
    { id: 'library', label: 'Kütüphane', icon: <LibraryIcon className="w-5 h-5" /> },
    { id: 'ai-generate', label: 'AI İçerik Üretimi', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'ai-assistants', label: 'AI Asistanları', icon: <Bot className="w-5 h-5" /> },
  ];

  const stats = [
    { label: 'Toplam İçerik', value: '1,245', icon: <FileText className="w-6 h-6" />, color: 'from-blue-500 to-blue-600' },
    { label: 'AI Üretilen', value: '328', icon: <Sparkles className="w-6 h-6" />, color: 'from-purple-500 to-purple-600' },
    { label: 'Aktif Asistan', value: '12', icon: <Bot className="w-6 h-6" />, color: 'from-green-500 to-green-600' },
    { label: 'Popüler İçerik', value: '89', icon: <TrendingUp className="w-6 h-6" />, color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <LibraryIcon className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">İçerik Yönetim Merkezi</h1>
                <p className="text-lg text-gray-600">Kütüphane ve AI destekli içerik oluşturma platformu</p>
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
              style={{ animationDelay: `${idx * 100}ms` }}
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border p-2">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border p-8 min-h-[500px]">
          {activeTab === 'library' && <LibraryTab />}
          {activeTab === 'ai-generate' && <AIGenerationTab />}
          {activeTab === 'ai-assistants' && <AIAssistantsTab />}
        </div>

        {/* Quick Actions Footer */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Hızlı Başlangıç</h3>
              <p className="text-lg opacity-90">AI destekli içerik üretimini deneyin ve verimliliğinizi artırın</p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-4 bg-white/20 backdrop-blur rounded-xl font-bold hover:bg-white/30 transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Yeni İçerik
              </button>
              <button className="px-6 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg">
                <Wand2 className="w-5 h-5" />
                AI ile Oluştur
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
