import { useState } from 'react';
import { HelpCircle, RefreshCw } from 'lucide-react';
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
    { id: 'manual', label: 'Elle Soru Girişi' },
    { id: 'ai', label: 'AI ile Soru Üretimi' },
    { id: 'editor', label: 'Profesyonel Editör' },
    { id: 'bank', label: 'Soru Bankası' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Soru Yönetimi</h1>
              <p className="text-gray-600">Elle, AI veya Profesyonel Editör ile soru oluşturun</p>
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

      <div className={activeTab === 'editor' ? '' : 'bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6'}>
        {activeTab === 'manual' && <ManualQuestionTab />}
        {activeTab === 'ai' && <AIQuestionTab />}
        {activeTab === 'editor' && <QuestionEditorPageV4 />}
        {activeTab === 'bank' && <QuestionBankTab />}
      </div>
    </div>
  );
}

