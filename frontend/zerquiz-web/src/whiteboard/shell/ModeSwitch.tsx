/**
 * Zercode Mode Switch
 */

import React from 'react';
import { useModeStore } from '../core/modeStore';
import { Paintbrush, Presentation, FileText } from 'lucide-react';

export function ModeSwitch() {
  const { mode, setMode } = useModeStore();

  const modes = [
    { id: 'board' as const, label: 'Beyaz Tahta', icon: Paintbrush, color: 'blue' },
    { id: 'slides' as const, label: 'Sunum', icon: Presentation, color: 'purple' },
    { id: 'pdf' as const, label: 'PDF Annotator', icon: FileText, color: 'green' },
  ];

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-2">
      <div className="flex items-center gap-2">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? `bg-${m.color}-600 text-white shadow-lg`
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

