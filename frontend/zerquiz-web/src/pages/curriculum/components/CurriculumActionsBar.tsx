import { type DefinitionGroupDto } from '../../../services/api/definitionService';

interface CurriculumActionsBarProps {
  selectedGroup: DefinitionGroupDto | null;
  loading: boolean;
  totalCount: number;
  onCreate: () => void;
  onRefresh: () => void;
}

export default function CurriculumActionsBar({
  selectedGroup,
  loading,
  totalCount,
  onCreate,
  onRefresh
}: CurriculumActionsBarProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onCreate}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Yeni {selectedGroup?.name} Ekle</span>
        </button>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
          disabled={loading}
        >
          <span>🔄</span>
          <span>{loading ? 'Yükleniyor...' : 'Yenile'}</span>
        </button>
      </div>

      <div className="text-sm text-gray-600">
        Toplam: <strong>{totalCount}</strong> tanım
      </div>
    </div>
  );
}

