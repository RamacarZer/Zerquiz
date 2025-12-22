import { useState, useEffect } from 'react';
import {
  getDefinitionGroups,
  getDefinitionTree,
  deleteDefinition,
  type DefinitionGroupDto,
  type DefinitionDto
} from '../../services/api/definitionService';
import DefinitionModal from '../../components/modals/DefinitionModal';
import {
  CurriculumHeader,
  CurriculumGroupTabs,
  CurriculumActionsBar,
  CurriculumTree
} from './components';

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

  return (
    <div className="p-6">
      <CurriculumHeader
        title="Müfredat Yönetimi"
        description="Branş, Alt Branş, Konu, Alt Konu, Başlık ve Kazanım tanımlamalarını yönetin"
      />

      <CurriculumGroupTabs
        groups={groups}
        selectedGroup={selectedGroup}
        onSelectGroup={setSelectedGroup}
      />

      <CurriculumActionsBar
        selectedGroup={selectedGroup}
        loading={loading}
        totalCount={definitions.length}
        onCreate={handleCreate}
        onRefresh={loadDefinitions}
      />

      <CurriculumTree
        definitions={definitions}
        loading={loading}
        expandedNodes={expandedNodes}
        selectedGroup={selectedGroup}
        onToggleNode={toggleNode}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
      />

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
