/**
 * Excalidraw Board Component
 */

import React, { useEffect, useRef, useState } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { ExcalidrawEngine } from './excalidrawEngine';
import { useModeStore } from '../../core/modeStore';

interface ExcalidrawBoardProps {
  documentId?: string;
  onReady?: (engine: ExcalidrawEngine) => void;
}

export function ExcalidrawBoard({ documentId, onReady }: ExcalidrawBoardProps) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const engineRef = useRef<ExcalidrawEngine | null>(null);
  const { config, setEngine } = useModeStore();

  // Initialize engine
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new ExcalidrawEngine();
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  // Set API when ready
  useEffect(() => {
    if (excalidrawAPI && engineRef.current) {
      engineRef.current.setApi(excalidrawAPI);
      setEngine(engineRef.current);
      
      if (onReady) {
        onReady(engineRef.current);
      }
    }
  }, [excalidrawAPI, setEngine, onReady]);

  // Load document
  useEffect(() => {
    if (documentId && engineRef.current && excalidrawAPI) {
      engineRef.current.loadDocument(documentId);
    }
  }, [documentId, excalidrawAPI]);

  // Handle changes (autosave)
  const handleChange = () => {
    if (engineRef.current) {
      engineRef.current.debouncedSave();
    }
  };

  return (
    <div className="h-full w-full">
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        onChange={handleChange}
        initialData={{
          appState: {
            viewBackgroundColor: '#ffffff',
            gridSize: config.gridEnabled ? 20 : null,
            zenModeEnabled: false,
          },
        }}
        UIOptions={{
          canvasActions: {
            loadScene: false,
            export: false,
            saveToActiveFile: false,
            toggleTheme: true,
          },
        }}
        theme={config.theme === 'dark' ? 'dark' : 'light'}
      />
    </div>
  );
}

