import { type DefinitionDto } from '../../../services/api/definitionService';
import CurriculumTreeNode from './CurriculumTreeNode';

interface CurriculumTreeProps {
  definitions: DefinitionDto[];
  loading: boolean;
  expandedNodes: Set<string>;
  selectedGroup: { name: string } | null;
  onToggleNode: (id: string) => void;
  onView: (definition: DefinitionDto) => void;
  onEdit: (definition: DefinitionDto) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export default function CurriculumTree({
  definitions,
  loading,
  expandedNodes,
  selectedGroup,
  onToggleNode,
  onView,
  onEdit,
  onDelete,
  onCreate
}: CurriculumTreeProps) {
  const renderDefinitionTree = (items: DefinitionDto[], level: number = 0): React.ReactNode => {
    return items.map(item => {
      const isExpanded = expandedNodes.has(item.id);

      return (
        <CurriculumTreeNode
          key={item.id}
          item={item}
          level={level}
          isExpanded={isExpanded}
          onToggle={onToggleNode}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onCreate={onCreate}
          renderChildren={
            item.children && item.children.length > 0
              ? () => renderDefinitionTree(item.children, level + 1)
              : undefined
          }
        />
      );
    });
  };

  return (
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
            onClick={onCreate}
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
  );
}

