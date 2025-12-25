import {
  type DefinitionDto,
  getGroupColor,
  getGroupIcon
} from '../../../services/api/definitionService';

interface CurriculumTreeNodeProps {
  item: DefinitionDto;
  level: number;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onView: (definition: DefinitionDto) => void;
  onEdit: (definition: DefinitionDto) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  renderChildren?: () => React.ReactNode;
}

export default function CurriculumTreeNode({
  item,
  level,
  isExpanded,
  onToggle,
  onView,
  onEdit,
  onDelete,
  onCreate,
  renderChildren
}: CurriculumTreeNodeProps) {
  const hasChildren = item.children && item.children.length > 0;
  const color = item.color || getGroupColor(item.groupKey);

  return (
    <div style={{ marginLeft: `${level * 24}px` }}>
      <div
        className="flex items-center justify-between p-3 bg-white border rounded-lg mb-2 hover:shadow-md transition-shadow"
        style={{ borderLeft: `4px solid ${color}` }}
      >
        <div className="flex items-center space-x-3 flex-1">
          {hasChildren && (
            <button
              onClick={() => onToggle(item.id)}
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
            onClick={() => onView(item)}
            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
          >
            👁️ Görüntüle
          </button>
          <button
            onClick={() => onEdit(item)}
            className="px-3 py-1 text-sm text-yellow-600 hover:bg-yellow-50 rounded"
          >
            ✏️ Düzenle
          </button>
          {!item.isSystem && (
            <button
              onClick={() => onDelete(item.id)}
              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              🗑️ Sil
            </button>
          )}
          <button
            onClick={onCreate}
            className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
          >
            ➕ Alt Ekle
          </button>
        </div>
      </div>

      {hasChildren && isExpanded && renderChildren && renderChildren()}
    </div>
  );
}


