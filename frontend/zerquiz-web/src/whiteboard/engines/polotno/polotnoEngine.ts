/**
 * Polotno Engine Implementation
 */

import { createStore } from 'polotno/model/store';
import { WhiteboardEngine, Tool } from '../core/engineTypes';
import { whiteboardApi } from '../core/api';

export class PolotnoEngine implements WhiteboardEngine {
  private store: any = null;
  private documentId: string | null = null;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    // Create Polotno store
    this.store = createStore({
      key: 'zercode-polotno-key', // License key verilmeli
      showCredit: false,
    });

    // Auto-save on changes
    this.store.on('change', () => {
      this.debouncedSave();
    });
  }

  async loadDocument(id: string): Promise<void> {
    this.documentId = id;
    
    try {
      const doc = await whiteboardApi.getSlideshow(id);
      
      if (doc.content && doc.content.pages) {
        this.store.loadJSON(doc.content);
      }
    } catch (error) {
      console.error('Failed to load slideshow:', error);
      throw error;
    }
  }

  async saveDocument(): Promise<void> {
    if (!this.store || !this.documentId) {
      throw new Error('Engine not ready or no document ID');
    }

    try {
      const content = this.store.toJSON();
      await whiteboardApi.updateSlideshow(this.documentId, content);
    } catch (error) {
      console.error('Failed to save slideshow:', error);
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
    if (!this.store) {
      throw new Error('Engine not ready');
    }

    switch (format) {
      case 'json': {
        const json = this.store.toJSON();
        return JSON.stringify(json, null, 2);
      }
      
      case 'pdf': {
        // Polotno PDF export
        const { exportToPDF } = await import('polotno/utils/export');
        const blob = await exportToPDF(this.store);
        return blob;
      }
      
      case 'png': {
        // Export current page as PNG
        const page = this.store.activePage;
        if (!page) throw new Error('No active page');
        
        const dataURL = await page.toDataURL();
        const blob = await fetch(dataURL).then(r => r.blob());
        return blob;
      }
      
      default:
        throw new Error(`Export format ${format} not supported by Polotno engine`);
    }
  }

  setTool(tool: Tool): void {
    if (!this.store) return;

    // Map generic tools to Polotno actions
    switch (tool) {
      case 'select':
        // Default selection mode
        break;
      case 'text':
        this.store.activePage?.addElement({
          type: 'text',
          text: 'Metin girin',
          x: 100,
          y: 100,
          fontSize: 24,
        });
        break;
      case 'rectangle':
        this.store.activePage?.addElement({
          type: 'rect',
          x: 100,
          y: 100,
          width: 200,
          height: 100,
          fill: '#3b82f6',
        });
        break;
      case 'circle':
        this.store.activePage?.addElement({
          type: 'ellipse',
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          fill: '#3b82f6',
        });
        break;
      case 'pen':
        // Enable drawing mode (not natively supported, would need custom implementation)
        console.log('Drawing mode not directly supported in Polotno');
        break;
    }
  }

  clear(): void {
    if (this.store && this.store.activePage) {
      this.store.activePage.children.forEach((child: any) => child.remove());
    }
  }

  undo(): void {
    if (this.store) {
      this.store.history.undo();
    }
  }

  redo(): void {
    if (this.store) {
      this.store.history.redo();
    }
  }

  isReady(): boolean {
    return this.store !== null;
  }

  getStore() {
    return this.store;
  }

  destroy() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.store = null;
    this.documentId = null;
  }
}

