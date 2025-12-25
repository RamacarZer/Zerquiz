/**
 * Zercode Whiteboard Shell
 * Tüm engine'leri orkestre eden ana component
 */

import React, { useEffect, Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { useModeStore } from '../core/modeStore';
import { Header } from './Header';
import { Toolbar } from './Toolbar';
import { ModeSwitch } from './ModeSwitch';
import { ExcalidrawBoard } from '../engines/excalidraw/ExcalidrawBoard';

// Lazy load Polotno and PDF for better performance
const PolotnoSlidesEditor = lazy(() =>
  import('../engines/polotno/PolotnoSlidesEditor').then(module => ({
    default: module.PolotnoSlidesEditor
  }))
);

const PdfAnnotator = lazy(() =>
  import('../engines/pdf/PdfAnnotator').then(module => ({
    default: module.PdfAnnotator
  }))
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Yükleniyor...</p>
    </div>
  </div>
);

interface ZercodeWhiteboardShellProps {
  documentId?: string;
  initialMode?: 'board' | 'slides' | 'pdf';
}

export function ZercodeWhiteboardShell({
  documentId,
  initialMode = 'board',
}: ZercodeWhiteboardShellProps) {
  const { mode, setMode, setDocumentId } = useModeStore();

  // Set initial mode and document ID
  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode, setMode]);

  useEffect(() => {
    setDocumentId(documentId || null);
  }, [documentId, setDocumentId]);

  const effectiveDocumentId = documentId || 'new-document';

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with save/export controls */}
      <Header />

      {/* Toolbar with drawing tools */}
      <Toolbar />

      {/* Mode switch buttons */}
      <ModeSwitch />

      {/* Main canvas area */}
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<LoadingFallback />}>
          {mode === 'board' && <ExcalidrawBoard documentId={effectiveDocumentId} />}
          {mode === 'slides' && <PolotnoSlidesEditor documentId={effectiveDocumentId} />}
          {mode === 'pdf' && <PdfAnnotator documentId={effectiveDocumentId} />}
        </Suspense>
      </div>
    </div>
  );
}






