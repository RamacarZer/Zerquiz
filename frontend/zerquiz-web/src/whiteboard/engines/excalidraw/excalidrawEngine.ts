/**
 * Excalidraw Engine Implementation
 */

import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { WhiteboardEngine, Tool } from '../core/engineTypes';
import { whiteboardApi } from '../core/api';

export class ExcalidrawEngine implements WhiteboardEngine {
  private api: ExcalidrawImperativeAPI | null = null;
  private documentId: string | null = null;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {}

  setApi(api: ExcalidrawImperativeAPI) {
    this.api = api;
  }

  async loadDocument(id: string): Promise<void> {
    this.documentId = id;
    
    try {
      const doc = await whiteboardApi.getWhiteboard(id);
      
      if (this.api && doc.content) {
        // Excalidraw scene'i yükle
        this.api.updateScene(doc.content);
      }
    } catch (error) {
      console.error('Failed to load whiteboard:', error);
      throw error;
    }
  }

  async saveDocument(): Promise<void> {
    if (!this.api || !this.documentId) {
      throw new Error('Engine not ready or no document ID');
    }

    try {
      const elements = this.api.getSceneElements();
      const appState = this.api.getAppState();
      
      const content = {
        elements,
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          currentItemStrokeColor: appState.currentItemStrokeColor,
          currentItemBackgroundColor: appState.currentItemBackgroundColor,
          currentItemFillStyle: appState.currentItemFillStyle,
          currentItemStrokeWidth: appState.currentItemStrokeWidth,
          currentItemRoughness: appState.currentItemRoughness,
          currentItemOpacity: appState.currentItemOpacity,
          gridSize: appState.gridSize,
          zoom: appState.zoom,
        },
      };

      await whiteboardApi.updateWhiteboard(this.documentId, content);
    } catch (error) {
      console.error('Failed to save whiteboard:', error);
      throw error;
    }
  }

  debouncedSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.saveDocument();
    }, 700);
  }

  async exportDocument(format: 'svg' | 'png' | 'pdf' | 'json'): Promise<Blob | string> {
    if (!this.api) {
      throw new Error('Engine not ready');
    }

    switch (format) {
      case 'svg': {
        const svg = await this.api.exportToSvg({
          elements: this.api.getSceneElements(),
          appState: this.api.getAppState(),
          files: this.api.getFiles(),
        });
        return new Blob([svg.outerHTML], { type: 'image/svg+xml' });
      }
      
      case 'png': {
        const blob = await this.api.exportToBlob({
          elements: this.api.getSceneElements(),
          appState: this.api.getAppState(),
          files: this.api.getFiles(),
          mimeType: 'image/png',
        });
        return blob;
      }
      
      case 'json': {
        const elements = this.api.getSceneElements();
        const appState = this.api.getAppState();
        return JSON.stringify({ elements, appState }, null, 2);
      }
      
      default:
        throw new Error(`Export format ${format} not supported by Excalidraw engine`);
    }
  }

  setTool(tool: Tool): void {
    if (!this.api) return;

    // Map generic tools to Excalidraw tools
    const toolMap: Record<Tool, any> = {
      select: { type: 'selection' },
      pen: { type: 'freedraw' },
      eraser: { type: 'eraser' },
      arrow: { type: 'arrow' },
      rectangle: { type: 'rectangle' },
      circle: { type: 'ellipse' },
      line: { type: 'line' },
      text: { type: 'text' },
      highlighter: { type: 'freedraw' }, // Will set opacity
      sticky: { type: 'rectangle' }, // Rectangle with yellow fill
    };

    const excalidrawTool = toolMap[tool];
    if (excalidrawTool) {
      this.api.setActiveTool(excalidrawTool);
    }
  }

  clear(): void {
    if (this.api) {
      this.api.updateScene({
        elements: [],
      });
    }
  }

  undo(): void {
    if (this.api) {
      this.api.history.undo();
    }
  }

  redo(): void {
    if (this.api) {
      this.api.history.redo();
    }
  }

  isReady(): boolean {
    return this.api !== null;
  }

  destroy() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.api = null;
    this.documentId = null;
  }
}

