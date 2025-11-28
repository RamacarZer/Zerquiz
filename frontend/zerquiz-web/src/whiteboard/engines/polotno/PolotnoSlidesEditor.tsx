/**
 * Polotno Slides Editor Component
 */

import React, { useEffect, useRef } from 'react';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { SidePanel } from 'polotno/side-panel';
import { Workspace } from 'polotno/canvas/workspace';
import { PolotnoEngine } from './polotnoEngine';
import { useModeStore } from '../../core/modeStore';

interface PolotnoSlidesEditorProps {
  documentId?: string;
  onReady?: (engine: PolotnoEngine) => void;
}

export function PolotnoSlidesEditor({ documentId, onReady }: PolotnoSlidesEditorProps) {
  const engineRef = useRef<PolotnoEngine | null>(null);
  const { setEngine, config } = useModeStore();

  // Initialize engine
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new PolotnoEngine();
      setEngine(engineRef.current);
      
      if (onReady) {
        onReady(engineRef.current);
      }
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, [setEngine, onReady]);

  // Load document
  useEffect(() => {
    if (documentId && engineRef.current) {
      engineRef.current.loadDocument(documentId);
    }
  }, [documentId]);

  if (!engineRef.current) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Polotno yükleniyor...</p>
        </div>
      </div>
    );
  }

  const store = engineRef.current.getStore();

  return (
    <div className="h-full w-full polotno-container">
      <PolotnoContainer>
        <SidePanelWrap>
          <SidePanel store={store} />
        </SidePanelWrap>
        <WorkspaceWrap>
          <Toolbar store={store} />
          <Workspace store={store} />
          <ZoomButtons store={store} />
        </WorkspaceWrap>
      </PolotnoContainer>
    </div>
  );
}

