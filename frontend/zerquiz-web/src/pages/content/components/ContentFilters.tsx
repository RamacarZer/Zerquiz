import { Search, Filter, Grid, List } from 'lucide-react';

interface ContentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  searchPlaceholder: string;
}

export default function ContentFilters({ 
  searchTerm, 
  onSearchChange, 
  viewMode, 
  onViewModeChange,
  searchPlaceholder 
}: ContentFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

