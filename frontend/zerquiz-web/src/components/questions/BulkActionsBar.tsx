import React from 'react';
import { Trash2, Archive, Copy, Move, CheckSquare, Square, Download, Upload } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkDelete: () => void;
  onBulkArchive: () => void;
  onBulkCopy: () => void;
  onBulkMove: () => void;
  onBulkExport: () => void;
  isAllSelected: boolean;
}

export default function BulkActionsBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkDelete,
  onBulkArchive,
  onBulkCopy,
  onBulkMove,
  onBulkExport,
  isAllSelected,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-blue-50 border-t-2 border-b-2 border-blue-600 px-6 py-3 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left: Selection Info */}
        <div className="flex items-center gap-4">
          <button
            onClick={isAllSelected ? onDeselectAll : onSelectAll}
            className="flex items-center gap-2 text-sm font-medium text-blue-900 hover:text-blue-700 transition"
          >
            {isAllSelected ? (
              <>
                <CheckSquare className="h-5 w-5" />
                Seçimi Kaldır
              </>
            ) : (
              <>
                <Square className="h-5 w-5" />
                Tümünü Seç
              </>
            )}
          </button>
          
          <div className="h-4 w-px bg-blue-300" />
          
          <span className="text-sm font-semibold text-blue-900">
            {selectedCount} soru seçildi
            {isAllSelected && totalCount > selectedCount && (
              <span className="ml-1 text-blue-700">
                (Tüm {totalCount} soru)
              </span>
            )}
          </span>
        </div>

        {/* Right: Bulk Actions */}
        <div className="flex items-center gap-2">
          {/* Copy */}
          <button
            onClick={onBulkCopy}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition text-sm font-medium"
            title="Seçili soruları kopyala"
          >
            <Copy className="h-4 w-4" />
            Kopyala
          </button>

          {/* Move */}
          <button
            onClick={onBulkMove}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition text-sm font-medium"
            title="Seçili soruları taşı"
          >
            <Move className="h-4 w-4" />
            Taşı
          </button>

          {/* Archive */}
          <button
            onClick={onBulkArchive}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-orange-700 rounded-lg hover:bg-orange-50 hover:border-orange-400 transition text-sm font-medium"
            title="Seçili soruları arşivle"
          >
            <Archive className="h-4 w-4" />
            Arşivle
          </button>

          {/* Export */}
          <button
            onClick={onBulkExport}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
            title="Seçili soruları dışa aktar"
          >
            <Download className="h-4 w-4" />
            Dışa Aktar
          </button>

          <div className="h-6 w-px bg-blue-300 mx-1" />

          {/* Delete */}
          <button
            onClick={onBulkDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
            title="Seçili soruları sil"
          >
            <Trash2 className="h-4 w-4" />
            Sil ({selectedCount})
          </button>
        </div>
      </div>
    </div>
  );
}

