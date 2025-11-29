/**
 * Polotno Slides Editor Component
 * Polotno'yu wrap eden React komponenti
 */

import React, { useEffect, useRef, useState } from 'react';
import { PolotnoContainer, SidePanelWrap, Workspace, Toolbar, ZoomButtons } from 'polotno/canvas/canvas';
import { createStore, StoreType } from 'polotno/model/store';
import { PolotnoEngine } from './polotnoEngine';
import { useModeStore } from '../../core/modeStore';

// Import Polotno CSS
import 'polotno/polotno.css';

interface PolotnoSlidesEditorProps {
  documentId: string;
  onReady?: () => void;
}

export function PolotnoSlidesEditor({ documentId, onReady }: PolotnoSlidesEditorProps) {
  const [store] = useState<StoreType>(() =>
    createStore({
      key: 'nFA5H9elEytDyPyvKL7T', // Demo key - shows watermark
      showCredit: false,
    })
  );
  
  const engineRef = useRef<PolotnoEngine | null>(null);
  const { setEngine, setLoading } = useModeStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize engine
  useEffect(() => {
    engineRef.current = new PolotnoEngine(store);
    setEngine(engineRef.current);

    setLoading(true);
    engineRef.current
      .loadDocument(documentId)
      .then(() => {
        setIsInitialized(true);
        onReady?.();
      })
      .catch((error) => {
        console.error('Failed to initialize Polotno:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [documentId, store, setEngine, setLoading, onReady]);

  // Listen for store changes (auto-save)
  useEffect(() => {
    if (!isInitialized) return;

    const handleChange = () => {
      if (engineRef.current) {
        engineRef.current.autoSave();
      }
    };

    store.on('change', handleChange);

    return () => {
      store.off('change', handleChange);
    };
  }, [store, isInitialized]);

  return (
    <div className="h-full w-full flex flex-col">
      <PolotnoContainer className="flex-1">
        <SidePanelWrap store={store} />
        <div className="flex flex-col flex-1">
          <Toolbar store={store} />
          <Workspace store={store} />
          <ZoomButtons store={store} />
        </div>
      </PolotnoContainer>
    </div>
  );
}

