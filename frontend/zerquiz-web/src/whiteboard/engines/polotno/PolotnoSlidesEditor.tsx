/**
 * Polotno Slides Editor Component
 * Polotno'yu wrap eden React komponenti
 */

import React, { useEffect, useRef, useState } from 'react';
// Polotno imports - using default exports
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { createStore, StoreType } from 'polotno/model/store';
import { PolotnoEngine } from './polotnoEngine';
import { useModeStore } from '../../core/modeStore';

// Polotno CSS is loaded automatically by the package

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
    if (!isInitialized || !store) return;

    const handleChange = () => {
      if (engineRef.current) {
        engineRef.current.autoSave();
      }
    };

    // Polotno uses addEventListener pattern
    try {
      if (store.on) {
        store.on('change', handleChange);
      }
    } catch (error) {
      console.warn('Could not attach Polotno change listener:', error);
    }

    return () => {
      // Safe cleanup - only call off if it exists
      try {
        if (store && typeof store.off === 'function') {
          store.off('change', handleChange);
        }
      } catch (error) {
        // Ignore cleanup errors
        console.debug('Polotno cleanup skipped:', error);
      }
    };
  }, [store, isInitialized]);

  return (
    <div className="h-full w-full flex flex-col">
      <PolotnoContainer className="flex-1">
        <SidePanelWrap store={store} />
        <div className="flex flex-col flex-1">
          <Toolbar store={store} />
          <WorkspaceWrap store={store} />
          <ZoomButtons store={store} />
        </div>
      </PolotnoContainer>
    </div>
  );
}





