import React, { useRef, useState, useEffect } from 'react';
import { 
  Pencil, Eraser, Square, Circle, ArrowRight, Type, Image as ImageIcon,
  Undo, Redo, Trash2, Download, ZoomIn, ZoomOut, Grid, Palette, Move
} from 'lucide-react';

type Tool = 'pen' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'arrow' | 'text' | 'select';

interface Point {
  x: number;
  y: number;
}

export function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [startPoint, setStartPoint] = useState<Point | null>(null);

  const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff', '#888888', '#0088ff'];
  const lineWidths = [1, 3, 5, 8, 12];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }

    // Save initial state
    saveToHistory(ctx);
  }, []);

  useEffect(() => {
    if (showGrid) {
      redrawWithGrid();
    }
  }, [showGrid]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    
    const gridSize = 20;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const redrawWithGrid = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    if (historyStep >= 0 && history[historyStep]) {
      ctx.putImageData(history[historyStep], 0, 0);
    }
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }
  };

  const saveToHistory = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    setStartPoint(pos);
    setIsDrawing(true);

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'pen' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      if (tool === 'eraser') {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = lineWidth * 3;
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const pos = getMousePos(e);

    if (tool === 'pen' || tool === 'eraser') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (startPoint) {
      // For shapes, redraw from history to show preview
      if (historyStep >= 0 && history[historyStep]) {
        ctx.putImageData(history[historyStep], 0, 0);
        if (showGrid) {
          drawGrid(ctx, canvas.width, canvas.height);
        }
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();

      switch (tool) {
        case 'line':
          ctx.moveTo(startPoint.x, startPoint.y);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
          break;
        case 'rectangle':
          ctx.strokeRect(startPoint.x, startPoint.y, pos.x - startPoint.x, pos.y - startPoint.y);
          break;
        case 'circle':
          const radius = Math.sqrt(Math.pow(pos.x - startPoint.x, 2) + Math.pow(pos.y - startPoint.y, 2));
          ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
          ctx.stroke();
          break;
        case 'arrow':
          drawArrow(ctx, startPoint.x, startPoint.y, pos.x, pos.y);
          break;
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        saveToHistory(ctx);
      }
    }
    setIsDrawing(false);
    setStartPoint(null);
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) => {
    const headlen = 15;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  };

  const undo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && history[newStep]) {
        ctx.putImageData(history[newStep], 0, 0);
        if (showGrid) {
          const canvas = canvasRef.current;
          if (canvas) drawGrid(ctx, canvas.width, canvas.height);
        }
      }
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && history[newStep]) {
        ctx.putImageData(history[newStep], 0, 0);
        if (showGrid) {
          const canvas = canvasRef.current;
          if (canvas) drawGrid(ctx, canvas.width, canvas.height);
        }
      }
    }
  };

  const clearCanvas = () => {
    if (!confirm('Tüm çizimleri silmek istediğinize emin misiniz?')) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }
    saveToHistory(ctx);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `whiteboard_${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-lg shadow-md p-4 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Pencil className="h-6 w-6 text-blue-600" />
            Beyaz Tahta
          </h1>
          
          {/* Main Tools */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded-lg transition-colors ${tool === 'pen' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              title="Kalem"
            >
              <Pencil className="h-5 w-5" />
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded-lg transition-colors ${tool === 'eraser' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              title="Silgi"
            >
              <Eraser className="h-5 w-5" />
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <button
              onClick={() => setTool('line')}
              className={`p-2 rounded-lg transition-colors ${tool === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              title="Çizgi"
            >
              <span className="text-lg font-bold">━</span>
            </button>
            <button
              onClick={() => setTool('rectangle')}
              className={`p-2 rounded-lg transition-colors ${tool === 'rectangle' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              title="Dikdörtgen"
            >
              <Square className="h-5 w-5" />
            </button>
            <button
              onClick={() => setTool('circle')}
              className={`p-2 rounded-lg transition-colors ${tool === 'circle' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              title="Daire"
            >
              <Circle className="h-5 w-5" />
            </button>
            <button
              onClick={() => setTool('arrow')}
              className={`p-2 rounded-lg transition-colors ${tool === 'arrow' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              title="Ok"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={undo} disabled={historyStep <= 0} className="p-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors" title="Geri Al">
              <Undo className="h-5 w-5" />
            </button>
            <button onClick={redo} disabled={historyStep >= history.length - 1} className="p-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors" title="İleri Al">
              <Redo className="h-5 w-5" />
            </button>
            <button onClick={clearCanvas} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors" title="Temizle">
              <Trash2 className="h-5 w-5" />
            </button>
            <button onClick={downloadImage} className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors" title="İndir">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white shadow-md p-4 flex flex-wrap items-center gap-6">
          {/* Color Palette */}
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-gray-600" />
            <div className="flex gap-1">
              {colors.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${color === c ? 'border-blue-600 scale-110' : 'border-gray-300'}`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Line Width */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Kalınlık:</span>
            <div className="flex gap-1">
              {lineWidths.map(w => (
                <button
                  key={w}
                  onClick={() => setLineWidth(w)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center ${lineWidth === w ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}
                >
                  <div className="rounded-full bg-gray-800" style={{ width: w, height: w }}></div>
                </button>
              ))}
            </div>
          </div>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${showGrid ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <Grid className="h-4 w-4" />
            <span className="text-sm font-medium">Izgara</span>
          </button>

          {/* Zoom */}
          <div className="flex items-center gap-2">
            <button onClick={handleZoomOut} className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-gray-700 w-12 text-center">{zoom}%</span>
            <button onClick={handleZoomIn} className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-b-lg shadow-md p-6">
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}>
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="cursor-crosshair"
              style={{ width: '100%', height: '600px' }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-3 text-center">
            💡 Çizim yapmak için fareyi sürükleyin. Geometri problemleri, fizik diyagramları, matematik grafikleri için idealdir.
          </p>
        </div>
      </div>
    </div>
  );
}

