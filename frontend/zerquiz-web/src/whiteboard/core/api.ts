/**
 * Zercode Whiteboard Suite - API Layer
 * Backend communication için wrapper
 */

import { WhiteboardDocument, WhiteboardMode, Annotation } from './engineTypes';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Mock token - gerçek uygulamada auth'dan gelecek
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token') || 'mock-token'}`,
  'X-Tenant-ID': localStorage.getItem('tenant_id') || 'tenant-001',
});

export const whiteboardApi = {
  // ==================== WHITEBOARDS (Excalidraw) ====================
  
  async createWhiteboard(data: Partial<WhiteboardDocument>): Promise<WhiteboardDocument> {
    // Mock implementation
    return {
      id: `wb-${Date.now()}`,
      tenant_id: 'tenant-001',
      title: data.title || 'Yeni Beyaz Tahta',
      mode: 'board',
      content: data.content || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Real implementation:
    // const response = await fetch(`${API_BASE}/whiteboards`, {
    //   method: 'POST',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(data),
    // });
    // return response.json();
  },
  
  async getWhiteboard(id: string): Promise<WhiteboardDocument> {
    // Mock implementation
    return {
      id,
      tenant_id: 'tenant-001',
      title: 'Demo Beyaz Tahta',
      mode: 'board',
      content: {
        elements: [],
        appState: {},
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Real implementation:
    // const response = await fetch(`${API_BASE}/whiteboards/${id}`, {
    //   headers: getAuthHeaders(),
    // });
    // return response.json();
  },
  
  async updateWhiteboard(id: string, content: any): Promise<void> {
    console.log('Whiteboard saved:', id, content);
    // Mock - gerçekte DB'ye POST
    
    // Real implementation:
    // await fetch(`${API_BASE}/whiteboards/${id}`, {
    //   method: 'PUT',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify({ content }),
    // });
  },
  
  async deleteWhiteboard(id: string): Promise<void> {
    console.log('Whiteboard deleted:', id);
    
    // Real implementation:
    // await fetch(`${API_BASE}/whiteboards/${id}`, {
    //   method: 'DELETE',
    //   headers: getAuthHeaders(),
    // });
  },
  
  // ==================== SLIDESHOWS (Polotno) ====================
  
  async createSlideshow(data: Partial<WhiteboardDocument>): Promise<WhiteboardDocument> {
    return {
      id: `slide-${Date.now()}`,
      tenant_id: 'tenant-001',
      title: data.title || 'Yeni Sunum',
      mode: 'slides',
      content: data.content || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },
  
  async getSlideshow(id: string): Promise<WhiteboardDocument> {
    return {
      id,
      tenant_id: 'tenant-001',
      title: 'Demo Sunum',
      mode: 'slides',
      content: {
        pages: [],
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },
  
  async updateSlideshow(id: string, content: any): Promise<void> {
    console.log('Slideshow saved:', id, content);
  },
  
  // ==================== PDF ANNOTATIONS ====================
  
  async getPdf(id: string): Promise<{ url: string; pages: number; annotations?: any[] }> {
    // Demo PDF - Mozilla'nın örnek PDF'i veya local demo
    const demoPdfs: Record<string, { url: string; pages: number }> = {
      'demo': {
        // Mozilla'nın resmi test PDF'i
        url: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        pages: 14,
      },
      'sample': {
        // Alternatif: Mozilla'nın başka bir test PDF'i
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
        pages: 1,
      },
      'guide': {
        // Kısa bir test PDF
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        pages: 1,
      }
    };
    
    // ID'ye göre PDF seç, yoksa demo kullan
    const pdf = demoPdfs[id] || demoPdfs['demo'];
    
    return {
      url: pdf.url,
      pages: pdf.pages,
      annotations: [], // Mevcut annotation'lar varsa buradan gelir
    };
    
    // Real implementation:
    // const response = await fetch(`${API_BASE}/pdf/${id}`, {
    //   headers: getAuthHeaders(),
    // });
    // return response.json();
  },
  
  async getPdfAnnotations(pdfId: string, page: number): Promise<Annotation[]> {
    return [];
    
    // Real implementation:
    // const response = await fetch(`${API_BASE}/pdf/${pdfId}/annotations?page=${page}`, {
    //   headers: getAuthHeaders(),
    // });
    // return response.json();
  },
  
  async savePdfAnnotation(pdfId: string, annotation: Annotation): Promise<void> {
    console.log('PDF annotation saved:', pdfId, annotation);
    
    // Real implementation:
    // await fetch(`${API_BASE}/pdf/${pdfId}/annotations`, {
    //   method: 'POST',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(annotation),
    // });
  },
  
  // ==================== EXPORT ====================
  
  async exportWhiteboard(id: string, format: 'svg' | 'png' | 'pdf'): Promise<Blob> {
    // Mock blob
    return new Blob(['mock export data'], { type: 'text/plain' });
    
    // Real implementation:
    // const response = await fetch(`${API_BASE}/whiteboards/${id}/export?format=${format}`, {
    //   headers: getAuthHeaders(),
    // });
    // return response.blob();
  },
};





