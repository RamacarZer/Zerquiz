/**
 * Polotno Engine Implementation
 * WhiteboardEngine interface'ini Polotno için implement eder
 */

import { StoreType } from 'polotno/model/store';
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

export class PolotnoEngine implements WhiteboardEngine {
  private store: StoreType;
  private documentId: string | null = null;
  private tenantId: string = 'mock-tenant-id'; // TODO: Get from auth context
  private ready: boolean = false;
  private debouncedSave: ReturnType<typeof debounce>;

  constructor(store: StoreType) {
    this.store = store;
    this.debouncedSave = debounce(this.saveDocument.bind(this), 700);
  }

  async loadDocument(id: string): Promise<void> {
    try {
      this.documentId = id;
      const doc = await whiteboardApi.getSlideshow(id);
      
      if (doc && doc.content) {
        this.store.loadJSON(doc.content);
      }
      
      this.ready = true;
    } catch (error) {
      console.error('Failed to load Polotno document:', error);
      this.ready = true; // Continue with empty slides
    }
  }

  async saveDocument(): Promise<void> {
    if (!this.documentId) {
      console.warn('No document ID set, skipping save');
      return;
    }

    try {
      const json = this.store.toJSON();
      
      await whiteboardApi.updateSlideshow(this.documentId, {
        content: json,
        type: 'slides',
        title: `Presentation ${this.documentId}`,
        tenantId: this.tenantId,
      });
      
      console.log('Polotno document saved successfully');
    } catch (error) {
      console.error('Failed to save Polotno document:', error);
      throw error;
    }
  }

  async exportDocument(format: 'svg' | 'png' | 'pdf' | 'json'): Promise<Blob | string> {
    try {
      if (format === 'json') {
        const json = this.store.toJSON();
        return JSON.stringify(json, null, 2);
      }

      if (format === 'png') {
        // Export current page as PNG
        const page = this.store.activePage;
        if (!page) throw new Error('No active page');
        
        const dataURL = await page.toDataURL({ pixelRatio: 2 });
        const response = await fetch(dataURL);
        return await response.blob();
      }

      if (format === 'pdf') {
        // This would require additional Polotno PDF export functionality
        // For now, return a placeholder
        throw new Error('PDF export requires Polotno Pro license');
      }

      throw new Error(`Export format ${format} not supported by Polotno`);
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }

  setTool(tool: Tool): void {
    // Polotno doesn't have explicit tool setting like Excalidraw
    // Tools are accessed via side panel
    // We can set the active tool in the store if needed
    console.log(`Polotno tool change: ${tool}`);
  }

  clear(): void {
    // Clear current page
    const page = this.store.activePage;
    if (page) {
      page.children.forEach((child) => {
        child.remove();
      });
    }
    console.log('Current slide cleared');
  }

  undo(): void {
    this.store.history.undo();
  }

  redo(): void {
    this.store.history.redo();
  }

  isReady(): boolean {
    return this.ready;
  }

  // Public method for auto-save on change
  autoSave(): void {
    this.debouncedSave();
  }

  // Polotno-specific methods
  addPage(): void {
    this.store.addPage();
  }

  deletePage(pageId: string): void {
    const page = this.store.pages.find((p) => p.id === pageId);
    if (page) {
      page.delete();
    }
  }

  setActivePage(pageId: string): void {
    this.store.selectPage(pageId);
  }
}





