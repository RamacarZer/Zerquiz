/**
 * Zercode Toolbar - Unified Tool Controls
 */

import React from 'react';
import { useModeStore } from '../core/modeStore';
import {
  MousePointer,
  Pencil,
  Eraser,
  Square,
  Circle,
  ArrowRight,
  Type,
  Minus,
  Highlighter,
  StickyNote,
  Undo,
  Redo,
  Trash2,
} from 'lucide-react';
import { Tool } from '../core/engineTypes';

export function ZercodeToolbar() {
  const { 
    activeTool, 
    setTool, 
    color, 
    setColor, 
    lineWidth, 
    setLineWidth,
    undo,
    redo,
    clear,
    mode 
  } = useModeStore();

  const tools: Array<{ id: Tool; icon: any; label: string; disabled?: boolean }> = [
    { id: 'select', icon: MousePointer, label: 'Seç' },
    { id: 'pen', icon: Pencil, label: 'Kalem' },
    { id: 'eraser', icon: Eraser, label: 'Silgi' },
    { id: 'line', icon: Minus, label: 'Çizgi' },
    { id: 'arrow', icon: ArrowRight, label: 'Ok' },
    { id: 'rectangle', icon: Square, label: 'Dikdörtgen' },
    { id: 'circle', icon: Circle, label: 'Daire' },
    { id: 'text', icon: Type, label: 'Metin' },
    { id: 'highlighter', icon: Highlighter, label: 'İşaretleyici', disabled: mode !== 'pdf' },
    { id: 'sticky', icon: StickyNote, label: 'Not', disabled: mode === 'pdf' },
  ];

  const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', 
    '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#ff8800', '#8800ff', '#888888', '#0088ff'
  ];

  const lineWidths = [1, 2, 3, 5, 8, 12];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Tools */}
      <div className="flex items-center gap-1">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          
          return (
            <button
              key={tool.id}
              onClick={() => !tool.disabled && setTool(tool.id)}
              disabled={tool.disabled}
              title={tool.label}
              className={`p-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${tool.disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}

        <div className="h-6 w-px bg-gray-300 mx-2" />

        {/* History */}
        <button
          onClick={undo}
          title="Geri Al"
          className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Undo className="h-5 w-5" />
        </button>
        <button
          onClick={redo}
          title="İleri Al"
          className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Redo className="h-5 w-5" />
        </button>
        <button
          onClick={() => {
            if (confirm('Tüm içerik silinecek. Emin misiniz?')) {
              clear();
            }
          }}
          title="Temizle"
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {/* Color & Width */}
      <div className="flex items-center gap-4">
        {/* Color Picker */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Renk:</span>
          <div className="flex gap-1">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded border-2 transition-all ${
                  color === c ? 'border-blue-600 scale-110' : 'border-gray-300 hover:scale-105'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        {/* Line Width */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Kalınlık:</span>
          <div className="flex gap-1">
            {lineWidths.map((w) => (
              <button
                key={w}
                onClick={() => setLineWidth(w)}
                className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
                  lineWidth === w 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={`${w}px`}
              >
                <div 
                  className="bg-current rounded-full"
                  style={{ width: `${w * 2}px`, height: `${w * 2}px` }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

