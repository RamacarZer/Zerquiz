/**
 * Zercode Whiteboard Shell - Main Container
 */

import React, { useEffect } from 'react';
import { useModeStore } from '../core/modeStore';
import { ExcalidrawBoard } from '../engines/excalidraw/ExcalidrawBoard';
import { PolotnoSlidesEditor } from '../engines/polotno/PolotnoSlidesEditor';
import { PdfAnnotator } from '../engines/pdf/PdfAnnotator';
import { ZercodeHeader } from './Header';
import { ZercodeToolbar } from './Toolbar';
import { ModeSwitch } from './ModeSwitch';

interface ZercodeWhiteboardShellProps {
  documentId?: string;
  initialMode?: 'board' | 'slides' | 'pdf';
}

export function ZercodeWhiteboardShell({ 
  documentId, 
  initialMode = 'board' 
}: ZercodeWhiteboardShellProps) {
  const { mode, setMode, setDocumentId } = useModeStore();

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode, setMode]);

  useEffect(() => {
    if (documentId) {
      setDocumentId(documentId);
    }
  }, [documentId, setDocumentId]);

  const renderEngine = () => {
    switch (mode) {
      case 'board':
        return <ExcalidrawBoard documentId={documentId} />;
      
      case 'slides':
        return <PolotnoSlidesEditor documentId={documentId} />;
      
      case 'pdf':
        return <PdfAnnotator documentId={documentId} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <ZercodeHeader />

      {/* Mode Switch */}
      <ModeSwitch />

      {/* Toolbar */}
      <ZercodeToolbar />

      {/* Main Canvas Area */}
      <div className="flex-1 overflow-hidden">
        {renderEngine()}
      </div>
    </div>
  );
}

