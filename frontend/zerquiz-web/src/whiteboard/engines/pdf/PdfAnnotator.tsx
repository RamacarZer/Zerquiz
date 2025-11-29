/**
 * PDF Annotator Component
 * React-PDF ile PDF görüntüleme + Canvas overlay ile annotation
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PdfEngine } from './pdfEngine';
import { useModeStore } from '../../core/modeStore';
import { Stroke, Point } from '../../core/engineTypes';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

// Import React-PDF CSS
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfAnnotatorProps {
  documentId: string;
  onReady?: () => void;
}

export function PdfAnnotator({ documentId, onReady }: PdfAnnotatorProps) {
  const engineRef = useRef<PdfEngine | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setEngine, activeTool, color, lineWidth, setLoading } = useModeStore();
  
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);

  // Initialize engine
  useEffect(() => {
    engineRef.current = new PdfEngine();
    setEngine(engineRef.current);

    setLoading(true);
    engineRef.current
      .loadDocument(documentId)
      .then(() => {
        const url = engineRef.current!.getPdfUrl();
        setPdfFile(url);
        onReady?.();
      })
      .catch((error) => {
        console.error('Failed to initialize PDF:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [documentId, setEngine, setLoading, onReady]);

  // Update engine's current page
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setCurrentPage(pageNumber);
    }
  }, [pageNumber]);

  // Drawing functions
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'select') return;
    
    setIsDrawing(true);
    const point = getMousePos(e);
    setCurrentStroke([point]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTool === 'select') return;

    const point = getMousePos(e);
    setCurrentStroke((prev) => [...prev, point]);

    // Draw on canvas
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = activeTool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (currentStroke.length > 0) {
      const lastPoint = currentStroke[currentStroke.length - 1];
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);

    if (currentStroke.length > 1 && engineRef.current) {
      const stroke: Stroke = {
        id: `stroke-${Date.now()}`,
        tool: activeTool,
        points: currentStroke,
        color: color,
        width: lineWidth,
      };

      engineRef.current.addStroke(stroke);
    }

    setCurrentStroke([]);
  };

  // Redraw annotations when page changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas || !engineRef.current) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw annotations for current page
    const annotation = engineRef.current.getAnnotationsForPage(pageNumber);
    if (annotation) {
      annotation.strokes.forEach((stroke) => {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        stroke.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      });
    }
  }, [pageNumber]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  // Resize canvas to match PDF page
  const onPageLoadSuccess = useCallback(() => {
    const canvas = canvasRef.current;
    const pageElement = document.querySelector('.react-pdf__Page__canvas') as HTMLCanvasElement;
    
    if (canvas && pageElement) {
      canvas.width = pageElement.width;
      canvas.height = pageElement.height;
    }
  }, []);

  if (!pdfFile) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        PDF yükleniyor...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm">
            Sayfa {pageNumber} / {numPages}
          </span>
          <button
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
            className="p-2 rounded hover:bg-gray-100"
          >
            <ZoomOut size={20} />
          </button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((s) => Math.min(2.0, s + 0.1))}
            className="p-2 rounded hover:bg-gray-100"
          >
            <ZoomIn size={20} />
          </button>
        </div>
      </div>

      {/* PDF + Canvas Overlay */}
      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto inline-block relative shadow-lg">
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="text-center p-4">PDF yükleniyor...</div>}
            error={<div className="text-center p-4 text-red-500">PDF yüklenemedi</div>}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              onLoadSuccess={onPageLoadSuccess}
              renderAnnotationLayer={true}
              renderTextLayer={true}
            />
          </Document>

          {/* Annotation Canvas Overlay */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 pointer-events-auto"
            style={{ cursor: activeTool === 'select' ? 'default' : 'crosshair' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>
    </div>
  );
}

