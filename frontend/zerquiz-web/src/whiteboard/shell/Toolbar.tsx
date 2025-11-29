/**
 * Whiteboard Toolbar Component
 * Universal tool selector for all engines
 */

import React from 'react';
import { useModeStore } from '../core/modeStore';
import { Tool } from '../core/engineTypes';
import {
  MousePointer2,
  Pencil,
  Eraser,
  Minus,
  ArrowRight,
  Square,
  Circle,
  Type,
  Highlighter,
  StickyNote,
  Trash2,
} from 'lucide-react';

export function Toolbar() {
  const { activeTool, setTool, color, setColor, lineWidth, setLineWidth, clear, mode } = useModeStore();

  const tools: Array<{ id: Tool; icon: any; label: string; disabled?: boolean }> = [
    { id: 'select', icon: MousePointer2, label: 'Seç' },
    { id: 'pen', icon: Pencil, label: 'Kalem' },
    { id: 'eraser', icon: Eraser, label: 'Silgi' },
    { id: 'line', icon: Minus, label: 'Çizgi' },
    { id: 'arrow', icon: ArrowRight, label: 'Ok' },
    { id: 'rectangle', icon: Square, label: 'Dikdörtgen' },
    { id: 'circle', icon: Circle, label: 'Daire' },
    { id: 'text', icon: Type, label: 'Metin' },
    { id: 'highlighter', icon: Highlighter, label: 'Vurgulayıcı', disabled: mode === 'slides' },
    { id: 'sticky', icon: StickyNote, label: 'Yapışkan Not', disabled: mode !== 'board' },
  ];

  const colors = [
    { value: '#000000', name: 'Siyah' },
    { value: '#ffffff', name: 'Beyaz' },
    { value: '#ff0000', name: 'Kırmızı' },
    { value: '#00ff00', name: 'Yeşil' },
    { value: '#0000ff', name: 'Mavi' },
    { value: '#ffff00', name: 'Sarı' },
    { value: '#ff00ff', name: 'Magenta' },
    { value: '#00ffff', name: 'Cyan' },
    { value: '#ff8800', name: 'Turuncu' },
    { value: '#8800ff', name: 'Mor' },
    { value: '#888888', name: 'Gri' },
    { value: '#0088ff', name: 'Açık Mavi' },
  ];

  const lineWidths = [1, 2, 3, 5, 8, 12, 20];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center gap-6">
        {/* Tools */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">Araçlar:</span>
          <div className="flex gap-1">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => !tool.disabled && setTool(tool.id)}
                disabled={tool.disabled}
                className={`p-2 rounded-lg border-2 transition-all ${
                  activeTool === tool.id
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : tool.disabled
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
                title={tool.label}
              >
                <tool.icon size={18} />
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-8 bg-gray-300" />

        {/* Colors */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">Renk:</span>
          <div className="flex gap-1">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 ${
                  color === c.value ? 'border-blue-500 scale-110' : 'border-gray-300'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <div className="w-px h-8 bg-gray-300" />

        {/* Line Width */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">Kalınlık:</span>
          <div className="flex gap-1">
            {lineWidths.map((width) => (
              <button
                key={width}
                onClick={() => setLineWidth(width)}
                className={`w-10 h-8 rounded-lg border-2 transition-all flex items-center justify-center ${
                  lineWidth === width
                    ? 'bg-blue-100 border-blue-500'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                title={`${width}px`}
              >
                <div
                  className="rounded-full bg-gray-800"
                  style={{
                    width: `${Math.min(width * 2, 20)}px`,
                    height: `${Math.min(width * 2, 20)}px`,
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-8 bg-gray-300" />

        {/* Clear */}
        <button
          onClick={() => {
            if (confirm('Tüm çizimleri temizlemek istediğinize emin misiniz?')) {
              clear();
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 size={18} />
          <span className="text-sm font-medium">Temizle</span>
        </button>
      </div>
    </div>
  );
}

