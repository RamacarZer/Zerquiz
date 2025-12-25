/**
 * Whiteboard Header Component
 * Save, Export, Undo/Redo controls
 */

import React, { useState } from 'react';
import { useModeStore } from '../core/modeStore';
import { Save, Download, Undo, Redo, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

export function Header() {
  const { currentDocumentId, isSaving, lastSaved, save, export: exportDoc, undo, redo } = useModeStore();
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'png' | 'svg' | 'pdf' | 'json'>('png');

  const handleSave = async () => {
    try {
      await save();
    } catch (error) {
      console.error('Save failed:', error);
      alert('Kaydetme başarısız oldu!');
    }
  };

  const handleExport = async (format: 'png' | 'svg' | 'pdf' | 'json') => {
    setExporting(true);
    setExportFormat(format);
    
    try {
      const data = await exportDoc(format);
      
      // Create download link
      let blob: Blob;
      let filename: string;
      
      if (typeof data === 'string') {
        blob = new Blob([data], { type: 'application/json' });
        filename = `whiteboard-${currentDocumentId || 'untitled'}.${format}`;
      } else {
        blob = data;
        filename = `whiteboard-${currentDocumentId || 'untitled'}.${format}`;
      }
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert(`${format.toUpperCase()} olarak dışa aktarıldı!`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Dışa aktarma başarısız oldu!');
    } finally {
      setExporting(false);
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'Az önce';
    if (diff < 3600) return `${Math.floor(diff / 60)} dakika önce`;
    return `${Math.floor(diff / 3600)} saat önce`;
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
      {/* Left: Document info */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900">Zercode Whiteboard</h1>
        {currentDocumentId && (
          <span className="text-sm text-gray-500">
            Belge: {currentDocumentId}
          </span>
        )}
      </div>

      {/* Center: Save status */}
      <div className="flex items-center gap-2 text-sm">
        {isSaving ? (
          <>
            <Loader2 className="animate-spin text-blue-600" size={16} />
            <span className="text-gray-600">Kaydediliyor...</span>
          </>
        ) : lastSaved ? (
          <>
            <CheckCircle className="text-green-600" size={16} />
            <span className="text-gray-600">Kaydedildi • {formatTime(lastSaved)}</span>
          </>
        ) : (
          <>
            <AlertTriangle className="text-yellow-600" size={16} />
            <span className="text-gray-600">Kaydedilmedi</span>
          </>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <button
          onClick={undo}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Geri Al (Ctrl+Z)"
        >
          <Undo size={20} />
        </button>
        <button
          onClick={redo}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="İleri Al (Ctrl+Y)"
        >
          <Redo size={20} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Save size={18} />
          <span>Kaydet</span>
        </button>

        {/* Export dropdown */}
        <div className="relative group">
          <button
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            <Download size={18} />
            <span>{exporting ? 'Dışa Aktarılıyor...' : 'Dışa Aktar'}</span>
          </button>
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <button
              onClick={() => handleExport('png')}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg"
            >
              PNG Resmi
            </button>
            <button
              onClick={() => handleExport('svg')}
              className="w-full px-4 py-2 text-left hover:bg-gray-50"
            >
              SVG Vektörel
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="w-full px-4 py-2 text-left hover:bg-gray-50"
            >
              PDF Dosyası
            </button>
            <button
              onClick={() => handleExport('json')}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 last:rounded-b-lg"
            >
              JSON Veri
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}






