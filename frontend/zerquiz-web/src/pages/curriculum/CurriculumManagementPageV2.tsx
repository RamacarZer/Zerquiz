import { useState, useEffect } from 'react';
import {
  getDefinitionGroups,
  getDefinitionTree,
  deleteDefinition,
  getGroupColor,
  getGroupIcon,
  type DefinitionGroupDto,
  type DefinitionDto
} from '../../services/api/definitionService';
import DefinitionModal from '../../components/modals/DefinitionModal';

export default function CurriculumManagementPageV2() {
  const [groups, setGroups] = useState<DefinitionGroupDto[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<DefinitionGroupDto | null>(null);
  const [definitions, setDefinitions] = useState<DefinitionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedDefinition, setSelectedDefinition] = useState<DefinitionDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      loadDefinitions();
    }
  }, [selectedGroup]);

  const loadGroups = async () => {
    try {
      const data = await getDefinitionGroups();
      setGroups(data);
      if (data.length > 0 && !selectedGroup) {
        setSelectedGroup(data[0]);
      }
    } catch (error) {
      console.error('Failed to load groups:', error);
    }
  };

  const loadDefinitions = async () => {
    if (!selectedGroup) return;
    
    setLoading(true);
    try {
      const data = await getDefinitionTree(selectedGroup.code);
      setDefinitions(data);
    } catch (error) {
      console.error('Failed to load definitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  const handleCreate = () => {
    setSelectedDefinition(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (definition: DefinitionDto) => {
    setSelectedDefinition(definition);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (definition: DefinitionDto) => {
    setSelectedDefinition(definition);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu tanımı silmek istediğinizden emin misiniz?')) return;
    
    try {
      await deleteDefinition(id);
      loadDefinitions();
    } catch (error) {
      console.error('Failed to delete definition:', error);
      alert('Silme işlemi başarısız oldu.');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDefinition(null);
  };

  const handleModalSave = async () => {
    await loadDefinitions();
    handleModalClose();
  };

  const renderDefinitionTree = (items: DefinitionDto[], level: number = 0) => {
    return items.map(item => {
      const isExpanded = expandedNodes.has(item.id);
      const hasChildren = item.children && item.children.length > 0;
      const color = item.color || getGroupColor(item.groupKey);

      return (
        <div key={item.id} style={{ marginLeft: `${level * 24}px` }}>
          <div
            className="flex items-center justify-between p-3 bg-white border rounded-lg mb-2 hover:shadow-md transition-shadow"
            style={{ borderLeft: `4px solid ${color}` }}
          >
            <div className="flex items-center space-x-3 flex-1">
              {hasChildren && (
                <button
                  onClick={() => toggleNode(item.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {isExpanded ? '▼' : '▶'}
                </button>
              )}
              {!hasChildren && <div className="w-6" />}
              
              <span className="text-2xl">{item.icon || getGroupIcon(item.groupKey)}</span>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <span className="text-xs text-gray-500">({item.code})</span>
                  {item.isSystem && (
                    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                      Sistem
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                )}
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className="px-2 py-0.5 text-xs rounded"
                    style={{ backgroundColor: `${color}20`, color: color }}
                  >
                    {item.groupName}
                  </span>
                  {item.translations && item.translations.length > 0 && (
                    <span className="text-xs text-gray-500">
                      🌍 {item.translations.length} çeviri
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleView(item)}
                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
              >
                👁️ Görüntüle
              </button>
              <button
                onClick={() => handleEdit(item)}
                className="px-3 py-1 text-sm text-yellow-600 hover:bg-yellow-50 rounded"
              >
                ✏️ Düzenle
              </button>
              {!item.isSystem && (
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  🗑️ Sil
                </button>
              )}
              <button
                onClick={() => handleCreate()}
                className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
              >
                ➕ Alt Ekle
              </button>
            </div>
          </div>

          {hasChildren && isExpanded && renderDefinitionTree(item.children, level + 1)}
        </div>
      );
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Müfredat Yönetimi</h1>
        <p className="text-gray-600 mt-2">
          Branş, Alt Branş, Konu, Alt Konu, Başlık ve Kazanım tanımlamalarını yönetin
        </p>
      </div>

      {/* Group Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {groups.map(group => (
          <button
            key={group.id}
            onClick={() => setSelectedGroup(group)}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
              selectedGroup?.id === group.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="mr-2">{group.icon}</span>
            {group.name}
          </button>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleCreate()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Yeni {selectedGroup?.name} Ekle</span>
          </button>
          <button
            onClick={loadDefinitions}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
            disabled={loading}
          >
            <span>🔄</span>
            <span>{loading ? 'Yükleniyor...' : 'Yenile'}</span>
          </button>
        </div>

        <div className="text-sm text-gray-600">
          Toplam: <strong>{definitions.length}</strong> tanım
        </div>
      </div>

      {/* Definition Tree */}
      <div className="bg-gray-50 rounded-lg p-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Yükleniyor...</p>
          </div>
        ) : definitions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Henüz tanım bulunmuyor.</p>
            <button
              onClick={() => handleCreate()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              İlk {selectedGroup?.name} Oluştur
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {renderDefinitionTree(definitions)}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <DefinitionModal
          isOpen={isModalOpen}
          mode={modalMode}
          group={selectedGroup}
          definition={selectedDefinition}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}

