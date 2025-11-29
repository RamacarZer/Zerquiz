/**
 * Excalidraw Engine Implementation
 * WhiteboardEngine interface'ini Excalidraw için implement eder
 */

import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { WhiteboardEngine, Tool } from '../../core/engineTypes';
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

export class ExcalidrawEngine implements WhiteboardEngine {
  private api: ExcalidrawImperativeAPI;
  private documentId: string | null = null;
  private tenantId: string = 'mock-tenant-id'; // TODO: Get from auth context
  private ready: boolean = false;
  private debouncedSave: ReturnType<typeof debounce>;

  constructor(api: ExcalidrawImperativeAPI) {
    this.api = api;
    this.debouncedSave = debounce(this.saveDocument.bind(this), 700);
  }

  async loadDocument(id: string): Promise<void> {
    try {
      this.documentId = id;
      const doc = await whiteboardApi.getWhiteboard(id);
      
      if (doc && doc.content) {
        this.api.updateScene(doc.content);
      }
      
      this.ready = true;
    } catch (error) {
      console.error('Failed to load Excalidraw document:', error);
      this.ready = true; // Continue with empty canvas
    }
  }

  async saveDocument(): Promise<void> {
    if (!this.documentId) {
      console.warn('No document ID set, skipping save');
      return;
    }

    try {
      const elements = this.api.getSceneElements();
      const appState = this.api.getAppState();
      
      await whiteboardApi.updateWhiteboard(this.documentId, {
        content: {
          elements,
          appState: {
            viewBackgroundColor: appState.viewBackgroundColor,
            gridSize: appState.gridSize,
          },
        },
        type: 'board',
        title: `Whiteboard ${this.documentId}`,
        tenantId: this.tenantId,
      });
      
      console.log('Excalidraw document saved successfully');
    } catch (error) {
      console.error('Failed to save Excalidraw document:', error);
      throw error;
    }
  }

  async exportDocument(format: 'svg' | 'png' | 'pdf' | 'json'): Promise<Blob | string> {
    try {
      const elements = this.api.getSceneElements();
      const appState = this.api.getAppState();

      if (format === 'json') {
        return JSON.stringify({ elements, appState }, null, 2);
      }

      if (format === 'svg') {
        const svg = await this.api.exportToSvg({
          elements,
          appState,
          files: this.api.getFiles(),
        });
        return new Blob([svg.outerHTML], { type: 'image/svg+xml' });
      }

      if (format === 'png') {
        const blob = await this.api.exportToBlob({
          elements,
          appState,
          files: this.api.getFiles(),
          mimeType: 'image/png',
        });
        return blob;
      }

      throw new Error(`Export format ${format} not supported by Excalidraw`);
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }

  setTool(tool: Tool): void {
    // Map our tool names to Excalidraw tool types
    const toolMap: Record<Tool, string> = {
      select: 'selection',
      pen: 'freedraw',
      eraser: 'eraser',
      arrow: 'arrow',
      rectangle: 'rectangle',
      circle: 'ellipse',
      line: 'line',
      text: 'text',
      highlighter: 'freedraw', // Excalidraw doesn't have highlighter, use freedraw
      sticky: 'text', // Use text for sticky notes
    };

    const excalidrawTool = toolMap[tool] || 'freedraw';
    this.api.setActiveTool({ type: excalidrawTool as any });
  }

  clear(): void {
    const elements = this.api.getSceneElements();
    const elementIds = elements.map((el) => el.id);
    this.api.updateScene({
      elements: [],
    });
    console.log('Canvas cleared');
  }

  undo(): void {
    this.api.history.undo();
  }

  redo(): void {
    this.api.history.redo();
  }

  isReady(): boolean {
    return this.ready;
  }

  // Public method for auto-save on change
  autoSave(): void {
    this.debouncedSave();
  }
}

