/**
 * Excalidraw Board Component
 * Excalidraw'ı wrap eden React komponenti
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Excalidraw, ExcalidrawImperativeAPI } from '@excalidraw/excalidraw';
import { ExcalidrawEngine } from './excalidrawEngine';
import { useModeStore } from '../../core/modeStore';

interface ExcalidrawBoardProps {
  documentId: string;
  onReady?: () => void;
}

export function ExcalidrawBoard({ documentId, onReady }: ExcalidrawBoardProps) {
  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const engineRef = useRef<ExcalidrawEngine | null>(null);
  const { setEngine, activeTool, config, setLoading } = useModeStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Excalidraw API callback
  const onExcalidrawAPI = useCallback(
    (api: ExcalidrawImperativeAPI) => {
      excalidrawAPIRef.current = api;
      
      // Delay engine initialization to avoid setState warnings
      requestAnimationFrame(() => {
        engineRef.current = new ExcalidrawEngine(api);
        setEngine(engineRef.current);
        
        // Load document
        setLoading(true);
        engineRef.current
          .loadDocument(documentId)
          .then(() => {
            setIsInitialized(true);
            onReady?.();
          })
          .catch((error) => {
            console.error('Failed to initialize Excalidraw:', error);
          })
          .finally(() => {
            setLoading(false);
          });
      });
    },
    [documentId, setEngine, setLoading, onReady]
  );

  // Handle changes (auto-save)
  const onChange = useCallback(() => {
    if (engineRef.current && isInitialized) {
      engineRef.current.autoSave();
    }
  }, [isInitialized]);

  // Apply tool changes from store
  useEffect(() => {
    if (engineRef.current && isInitialized) {
      engineRef.current.setTool(activeTool);
    }
  }, [activeTool, isInitialized]);

  return (
    <div className="h-full w-full">
      <Excalidraw
        excalidrawAPI={onExcalidrawAPI}
        onChange={onChange}
        theme={config.theme}
        gridModeEnabled={config.gridEnabled}
        UIOptions={{
          canvasActions: {
            changeViewBackgroundColor: true,
            clearCanvas: false, // We handle this via toolbar
            export: false, // We handle this via toolbar
            loadScene: false,
            saveAsImage: false,
            saveToActiveFile: false,
            toggleTheme: false,
          },
        }}
      />
    </div>
  );
}





