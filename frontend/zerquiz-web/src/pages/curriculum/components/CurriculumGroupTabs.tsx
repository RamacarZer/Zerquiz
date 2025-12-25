import { type DefinitionGroupDto } from '../../../services/api/definitionService';

interface CurriculumGroupTabsProps {
  groups: DefinitionGroupDto[];
  selectedGroup: DefinitionGroupDto | null;
  onSelectGroup: (group: DefinitionGroupDto) => void;
}

export default function CurriculumGroupTabs({
  groups,
  selectedGroup,
  onSelectGroup
}: CurriculumGroupTabsProps) {
  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
      {groups.map(group => (
        <button
          key={group.id}
          onClick={() => onSelectGroup(group)}
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
  );
}


