/**
 * PDF Annotator Component
 */

import React, { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PdfEngine } from './pdfEngine';
import { useModeStore } from '../../core/modeStore';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

// PDF.js worker setup
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

interface PdfAnnotatorProps {
  documentId?: string;
  pdfUrl?: string;
  onReady?: (engine: PdfEngine) => void;
}

export function PdfAnnotator({ documentId, pdfUrl, onReady }: PdfAnnotatorProps) {
  const engineRef = useRef<PdfEngine | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { setEngine, activeTool, color, lineWidth } = useModeStore();
  
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pdfFile, setPdfFile] = useState<string>('/sample.pdf'); // Default demo PDF

  // Initialize engine
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new PdfEngine();
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

  // Set canvas when ready
  useEffect(() => {
    if (canvasRef.current && engineRef.current) {
      engineRef.current.setCanvas(canvasRef.current);
    }
  }, [canvasRef.current]);

  // Load document
  useEffect(() => {
    if (documentId && engineRef.current) {
      engineRef.current.loadDocument(documentId);
    }
  }, [documentId]);

  // Set PDF URL
  useEffect(() => {
    if (pdfUrl) {
      setPdfFile(pdfUrl);
    }
  }, [pdfUrl]);

  // Update engine tool settings
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setTool(activeTool);
      engineRef.current.setColor(color);
      engineRef.current.setLineWidth(lineWidth);
    }
  }, [activeTool, color, lineWidth]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    if (engineRef.current) {
      // Update engine with total pages
      (engineRef.current as any).totalPages = numPages;
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
      if (engineRef.current) {
        engineRef.current.goToPage(newPage);
      }
    }
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const pos = getMousePos(e);
    if (engineRef.current) {
      engineRef.current.startStroke(pos);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const pos = getMousePos(e);
    if (engineRef.current) {
      engineRef.current.addPoint(pos);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (engineRef.current) {
      engineRef.current.endStroke();
    }
  };

  return (
    <div ref={containerRef} className="h-full w-full flex flex-col bg-gray-100">
      {/* PDF Navigation */}
      <div className="bg-white border-b border-gray-300 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(pageNumber - 1)}
            disabled={pageNumber <= 1}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <span className="text-sm font-medium text-gray-700">
            Sayfa {pageNumber} / {numPages}
          </span>
          
          <button
            onClick={() => handlePageChange(pageNumber + 1)}
            disabled={pageNumber >= numPages}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(Math.max(0.5, scale - 0.1))}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale(Math.min(2.0, scale + 0.1))}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* PDF Viewer with Canvas Overlay */}
      <div className="flex-1 overflow-auto p-4">
        <div className="relative inline-block mx-auto">
          {/* PDF Page */}
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            }
            error={
              <div className="p-8 text-center">
                <p className="text-red-600 mb-4">PDF yüklenemedi</p>
                <p className="text-sm text-gray-600">
                  Lütfen public klasörüne sample.pdf dosyası ekleyin veya farklı bir PDF yükleyin
                </p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>

          {/* Annotation Canvas Overlay */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 cursor-crosshair pdf-annotation-canvas"
            style={{
              width: '100%',
              height: '100%',
              pointerEvents: 'all',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-t border-blue-200 px-4 py-2">
        <p className="text-sm text-blue-900">
          💡 <strong>İpucu:</strong> Toolbar'dan kalem, işaretleyici veya silgi seçin ve PDF üzerine çizim yapın.
          Tüm notlarınız sayfa bazında otomatik kaydedilir.
        </p>
      </div>
    </div>
  );
}

