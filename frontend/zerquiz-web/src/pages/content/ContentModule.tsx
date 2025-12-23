import { useState } from 'react';
import { Library as LibraryIcon, RefreshCw } from 'lucide-react';
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
    { id: 'library', label: 'Kütüphane' },
    { id: 'ai-generate', label: 'AI Üretim' },
    { id: 'ai-assistants', label: 'AI Asistanları' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <LibraryIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">İçerik Yönetimi</h1>
              <p className="text-gray-600">Kütüphane ve AI destekli içerik oluşturma</p>
            </div>
          </div>
          <button onClick={refreshData} className="btn btn-primary flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Yenile
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-4">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
        {activeTab === 'library' && <LibraryTab />}
        {activeTab === 'ai-generate' && <AIGenerationTab />}
        {activeTab === 'ai-assistants' && <AIAssistantsTab />}
      </div>
    </div>
  );
}
