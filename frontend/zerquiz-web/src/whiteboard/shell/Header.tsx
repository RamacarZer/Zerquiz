/**
 * Zercode Whiteboard Header
 */

import React from 'react';
import { useModeStore } from '../core/modeStore';
import { Save, Download, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export function ZercodeHeader() {
  const { 
    isSaving, 
    lastSaved, 
    save, 
    export: exportDoc 
  } = useModeStore();

  const handleExport = async () => {
    try {
      const blob = await exportDoc('png');
      const url = URL.createObjectURL(blob as Blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `zercode-whiteboard-${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export başarısız oldu');
    }
  };

  const handleSave = async () => {
    try {
      await save();
      alert('✅ Kaydedildi!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('❌ Kayıt başarısız');
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 flex items-center justify-between shadow-lg">
      {/* Left: Logo & Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-2xl font-bold text-blue-600">
            Z
          </div>
          <div>
            <div className="text-lg font-bold">Zercode Whiteboard</div>
            <div className="text-xs text-blue-100">Smart Whiteboard Suite</div>
          </div>
        </div>
      </div>

      {/* Center: Status */}
      <div className="flex items-center gap-2 text-sm">
        {isSaving ? (
          <>
            <Clock className="h-4 w-4 animate-spin" />
            <span>Kaydediliyor...</span>
          </>
        ) : lastSaved ? (
          <>
            <CheckCircle className="h-4 w-4" />
            <span>Son kayıt: {new Date(lastSaved).toLocaleTimeString('tr-TR')}</span>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4" />
            <span>Henüz kaydedilmedi</span>
          </>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          Kaydet
        </button>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>
    </header>
  );
}

