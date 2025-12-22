/**
 * PDF Engine Implementation
 * WhiteboardEngine interface'ini PDF annotation için implement eder
 */

import { WhiteboardEngine, Tool, Stroke, Annotation } from '../../core/engineTypes';
import { whiteboardApi } from '../../core/api';

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export class PdfEngine implements WhiteboardEngine {
  private documentId: string | null = null;
  private tenantId: string = 'mock-tenant-id'; // TODO: Get from auth context
  private ready: boolean = false;
  private annotations: Map<number, Annotation> = new Map(); // page -> annotation
  private currentPage: number = 1;
  private pdfUrl: string | null = null;
  private debouncedSave: ReturnType<typeof debounce>;
  private currentTool: Tool = 'pen';

  constructor() {
    this.debouncedSave = debounce(this.saveDocument.bind(this), 700);
  }

  async loadDocument(id: string): Promise<void> {
    try {
      this.documentId = id;
      const doc = await whiteboardApi.getPdf(id);
      
      if (doc) {
        this.pdfUrl = doc.url || '/sample.pdf'; // Fallback to sample
        
        // Load existing annotations
        if (doc.annotations) {
          doc.annotations.forEach((ann: Annotation) => {
            this.annotations.set(ann.page, ann);
          });
        }
      }
      
      this.ready = true;
    } catch (error) {
      console.error('Failed to load PDF document:', error);
      // Use sample PDF as fallback
      this.pdfUrl = '/sample.pdf';
      this.ready = true;
    }
  }

  async saveDocument(): Promise<void> {
    if (!this.documentId) {
      console.warn('No document ID set, skipping save');
      return;
    }

    try {
      const annotationsArray = Array.from(this.annotations.values());
      
      await whiteboardApi.savePdfAnnotation(this.documentId, {
        annotations: annotationsArray,
        tenantId: this.tenantId,
      });
      
      console.log('PDF annotations saved successfully');
    } catch (error) {
      console.error('Failed to save PDF annotations:', error);
      throw error;
    }
  }

  async exportDocument(format: 'svg' | 'png' | 'pdf' | 'json'): Promise<Blob | string> {
    try {
      if (format === 'json') {
        const annotationsArray = Array.from(this.annotations.values());
        return JSON.stringify(annotationsArray, null, 2);
      }

      throw new Error(`Export format ${format} not supported for PDF annotations yet`);
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }

  setTool(tool: Tool): void {
    this.currentTool = tool;
  }

  clear(): void {
    // Clear annotations for current page
    this.annotations.delete(this.currentPage);
    console.log(`Annotations cleared for page ${this.currentPage}`);
  }

  undo(): void {
    // Remove last stroke from current page annotation
    const annotation = this.annotations.get(this.currentPage);
    if (annotation && annotation.strokes.length > 0) {
      annotation.strokes.pop();
    }
  }

  redo(): void {
    // PDF redo is complex, would need a proper history stack
    console.log('Redo not implemented for PDF annotator');
  }

  isReady(): boolean {
    return this.ready;
  }

  // PDF-specific methods
  getPdfUrl(): string | null {
    return this.pdfUrl;
  }

  setCurrentPage(page: number): void {
    this.currentPage = page;
  }

  getCurrentPage(): number {
    return this.currentPage;
  }

  getAnnotationsForPage(page: number): Annotation | undefined {
    return this.annotations.get(page);
  }

  addStroke(stroke: Stroke): void {
    let annotation = this.annotations.get(this.currentPage);
    
    if (!annotation) {
      annotation = {
        id: `ann-${this.currentPage}-${Date.now()}`,
        page: this.currentPage,
        strokes: [],
        timestamp: new Date().toISOString(),
      };
      this.annotations.set(this.currentPage, annotation);
    }
    
    annotation.strokes.push(stroke);
    this.autoSave();
  }

  // Public method for auto-save
  autoSave(): void {
    this.debouncedSave();
  }
}





