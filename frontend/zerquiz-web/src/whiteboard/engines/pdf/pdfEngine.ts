/**
 * PDF Engine Implementation
 */

import { WhiteboardEngine, Tool, Annotation, Stroke, Point } from '../core/engineTypes';
import { whiteboardApi } from '../core/api';

export class PdfEngine implements WhiteboardEngine {
  private pdfId: string | null = null;
  private currentPage: number = 1;
  private totalPages: number = 0;
  private annotations: Map<number, Annotation> = new Map();
  private currentStroke: Stroke | null = null;
  private activeTool: Tool = 'pen';
  private color: string = '#ff0000';
  private lineWidth: number = 3;
  private canvasRef: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor() {}

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvasRef = canvas;
    this.ctx = canvas.getContext('2d');
  }

  async loadDocument(id: string): Promise<void> {
    this.pdfId = id;
    
    try {
      const pdfData = await whiteboardApi.getPdf(id);
      this.totalPages = pdfData.pages;
      
      // Load annotations for current page
      await this.loadPageAnnotations(this.currentPage);
    } catch (error) {
      console.error('Failed to load PDF:', error);
      throw error;
    }
  }

  async loadPageAnnotations(page: number): Promise<void> {
    if (!this.pdfId) return;
    
    try {
      const annotations = await whiteboardApi.getPdfAnnotations(this.pdfId, page);
      
      if (annotations && annotations.length > 0) {
        this.annotations.set(page, annotations[0]);
        this.redrawAnnotations();
      }
    } catch (error) {
      console.error('Failed to load annotations:', error);
    }
  }

  async saveDocument(): Promise<void> {
    if (!this.pdfId) {
      throw new Error('No PDF loaded');
    }

    try {
      // Save annotations for all pages
      for (const [page, annotation] of this.annotations.entries()) {
        await whiteboardApi.savePdfAnnotation(this.pdfId, annotation);
      }
    } catch (error) {
      console.error('Failed to save annotations:', error);
      throw error;
    }
  }

  async exportDocument(format: 'svg' | 'png' | 'pdf' | 'json'): Promise<Blob | string> {
    if (format === 'json') {
      const data = {
        pdfId: this.pdfId,
        annotations: Array.from(this.annotations.entries()).map(([page, ann]) => ({
          page,
          ...ann
        }))
      };
      return JSON.stringify(data, null, 2);
    }

    if (format === 'png' && this.canvasRef) {
      return new Promise((resolve) => {
        this.canvasRef!.toBlob((blob) => {
          resolve(blob || new Blob());
        });
      });
    }

    throw new Error(`Export format ${format} not supported by PDF engine`);
  }

  setTool(tool: Tool): void {
    this.activeTool = tool;
  }

  setColor(color: string): void {
    this.color = color;
  }

  setLineWidth(width: number): void {
    this.lineWidth = width;
  }

  startStroke(point: Point): void {
    if (!this.ctx) return;

    this.currentStroke = {
      id: `stroke-${Date.now()}`,
      tool: this.activeTool,
      points: [point],
      color: this.color,
      width: this.lineWidth,
      opacity: this.activeTool === 'highlighter' ? 0.3 : 1,
    };

    this.ctx.beginPath();
    this.ctx.moveTo(point.x, point.y);
  }

  addPoint(point: Point): void {
    if (!this.ctx || !this.currentStroke) return;

    this.currentStroke.points.push(point);

    // Draw in real-time
    this.ctx.strokeStyle = this.currentStroke.color;
    this.ctx.lineWidth = this.currentStroke.width;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.globalAlpha = this.currentStroke.opacity || 1;

    if (this.activeTool === 'eraser') {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.lineWidth = this.currentStroke.width * 3;
    } else {
      this.ctx.globalCompositeOperation = 'source-over';
    }

    this.ctx.lineTo(point.x, point.y);
    this.ctx.stroke();
  }

  endStroke(): void {
    if (!this.currentStroke) return;

    // Save stroke to current page annotations
    let annotation = this.annotations.get(this.currentPage);
    
    if (!annotation) {
      annotation = {
        id: `ann-${Date.now()}`,
        page: this.currentPage,
        strokes: [],
        timestamp: new Date().toISOString(),
      };
      this.annotations.set(this.currentPage, annotation);
    }

    annotation.strokes.push(this.currentStroke);
    this.currentStroke = null;

    // Auto-save (debounced in real app)
    this.saveDocument();
  }

  redrawAnnotations(): void {
    if (!this.ctx || !this.canvasRef) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);

    const annotation = this.annotations.get(this.currentPage);
    if (!annotation) return;

    // Redraw all strokes
    annotation.strokes.forEach(stroke => {
      this.ctx!.strokeStyle = stroke.color;
      this.ctx!.lineWidth = stroke.width;
      this.ctx!.lineCap = 'round';
      this.ctx!.lineJoin = 'round';
      this.ctx!.globalAlpha = stroke.opacity || 1;
      this.ctx!.globalCompositeOperation = 'source-over';

      if (stroke.points.length > 0) {
        this.ctx!.beginPath();
        this.ctx!.moveTo(stroke.points[0].x, stroke.points[0].y);
        
        for (let i = 1; i < stroke.points.length; i++) {
          this.ctx!.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        
        this.ctx!.stroke();
      }
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    
    this.currentPage = page;
    this.loadPageAnnotations(page);
  }

  getCurrentPage(): number {
    return this.currentPage;
  }

  getTotalPages(): number {
    return this.totalPages;
  }

  clear(): void {
    // Clear current page annotations
    this.annotations.delete(this.currentPage);
    this.redrawAnnotations();
  }

  undo(): void {
    const annotation = this.annotations.get(this.currentPage);
    if (annotation && annotation.strokes.length > 0) {
      annotation.strokes.pop();
      this.redrawAnnotations();
    }
  }

  redo(): void {
    // Would need a separate redo stack
    console.log('Redo not implemented for PDF engine');
  }

  isReady(): boolean {
    return this.pdfId !== null && this.ctx !== null;
  }

  destroy(): void {
    this.pdfId = null;
    this.canvasRef = null;
    this.ctx = null;
    this.annotations.clear();
  }
}

