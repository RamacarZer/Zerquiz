import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, BookOpen, Users, Settings, Download, Upload } from 'lucide-react';

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'new-question',
      title: 'Yeni Soru',
      description: 'Soru bankasına ekle',
      icon: <FileText className="h-5 w-5" />,
      color: 'blue',
      onClick: () => navigate('/questions/new'),
    },
    {
      id: 'new-exam',
      title: 'Yeni Sınav',
      description: 'Sınav oluştur',
      icon: <BookOpen className="h-5 w-5" />,
      color: 'green',
      onClick: () => navigate('/exams/new'),
    },
    {
      id: 'manage-students',
      title: 'Öğrenci Yönetimi',
      description: 'Öğrencileri görüntüle',
      icon: <Users className="h-5 w-5" />,
      color: 'purple',
      onClick: () => navigate('/students'),
    },
    {
      id: 'import-questions',
      title: 'Soru İçe Aktar',
      description: 'Excel/CSV yükle',
      icon: <Upload className="h-5 w-5" />,
      color: 'orange',
      onClick: () => alert('Import functionality'),
    },
    {
      id: 'export-data',
      title: 'Veri Dışa Aktar',
      description: 'Raporları indir',
      icon: <Download className="h-5 w-5" />,
      color: 'yellow',
      onClick: () => alert('Export functionality'),
    },
    {
      id: 'settings',
      title: 'Ayarlar',
      description: 'Sistem ayarları',
      icon: <Settings className="h-5 w-5" />,
      color: 'gray',
      onClick: () => navigate('/settings'),
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'green':
        return 'bg-green-600 hover:bg-green-700';
      case 'purple':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'orange':
        return 'bg-orange-600 hover:bg-orange-700';
      case 'yellow':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'gray':
        return 'bg-gray-600 hover:bg-gray-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Plus className="h-5 w-5 text-blue-600" />
        Hızlı İşlemler
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`${getColorClasses(action.color)} text-white rounded-lg p-4 text-left transition group`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition">
                {action.icon}
              </div>
            </div>
            <h4 className="text-sm font-semibold mb-1">{action.title}</h4>
            <p className="text-xs opacity-90">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

