/**
 * Mode Switch Component
 * Switch between Board, Slides, and PDF modes
 */

import React from 'react';
import { useModeStore } from '../core/modeStore';
import { LayoutDashboard, Presentation, FileText } from 'lucide-react';

export function ModeSwitch() {
  const { mode, setMode } = useModeStore();

  const modes = [
    { id: 'board' as const, label: 'Beyaz Tahta', icon: LayoutDashboard, description: 'Excalidraw ile çizim' },
    { id: 'slides' as const, label: 'Sunum', icon: Presentation, description: 'Polotno ile slayt hazırlama' },
    { id: 'pdf' as const, label: 'PDF Annotator', icon: FileText, description: 'PDF üzerine çizim' },
  ];

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
      <div className="flex items-center gap-2">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all ${
              mode === m.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <m.icon size={20} />
            <div className="text-left">
              <div className="font-semibold">{m.label}</div>
              <div className={`text-xs ${mode === m.id ? 'text-blue-100' : 'text-gray-500'}`}>
                {m.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}






