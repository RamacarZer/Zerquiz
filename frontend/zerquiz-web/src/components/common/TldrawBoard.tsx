import React, { useEffect, useRef } from 'react';
import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { Button } from '../ui/button';
import { Download, Trash2, Save } from 'lucide-react';

interface TldrawBoardProps {
  onSave?: (snapshot: any) => void;
  onExport?: (dataUrl: string) => void;
  initialData?: any;
  height?: number;
  readonly?: boolean;
  showToolbar?: boolean;
}

export default function TldrawBoard({
  onSave,
  onExport,
  initialData,
  height = 600,
  readonly = false,
  showToolbar = true,
}: TldrawBoardProps) {
  const editorRef = useRef<any>(null);

  const handleSave = () => {
    if (editorRef.current && onSave) {
      const snapshot = editorRef.current.store.getSnapshot();
      onSave(snapshot);
    }
  };

  const handleExport = async () => {
    if (editorRef.current && onExport) {
      try {
        const svg = await editorRef.current.getSvg();
        if (svg) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          const svgBlob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(svgBlob);

          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            onExport(dataUrl);
            URL.revokeObjectURL(url);
          };

          img.src = url;
        }
      } catch (error) {
        console.error('Export failed:', error);
      }
    }
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.selectAll();
      editorRef.current.deleteShapes(editorRef.current.getSelectedShapeIds());
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {showToolbar && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 border-b border-gray-300">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={readonly}
          >
            <Save className="h-4 w-4 mr-2" />
            Kaydet
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Dışa Aktar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={readonly}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Temizle
          </Button>
        </div>
      )}
      <div style={{ height: `${height}px` }}>
        <Tldraw
          onMount={(editor) => {
            editorRef.current = editor;
            if (initialData) {
              editor.store.loadSnapshot(initialData);
            }
          }}
          inferDarkMode={false}
        />
      </div>
    </div>
  );
}

