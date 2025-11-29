/**
 * Content Service
 * İçerik oluşturma ve yönetimi için API servisi (Mock)
 */

import apiClient from './apiClient';

export interface ContentItem {
  id: string;
  tenantId: string;
  contentType: 'question' | 'book' | 'presentation' | 'flashcard' | 'dictionary' | 'activity';
  title: string;
  description?: string;
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived';
  contentJson: any;
  metadata?: any;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentAsset {
  id: string;
  contentId: string;
  assetType: 'whiteboard' | 'image' | 'video' | 'audio' | 'pdf';
  assetFormat: 'excalidraw_json' | 'polotno_json' | 'pdf_annotations' | 'png' | 'mp4' | 'svg';
  fileUrl?: string;
  fileSizeBytes?: number;
  assetJson?: any;
  metadata?: any;
}

// Mock data store
const MOCK_CONTENTS: Record<string, ContentItem> = {};
const MOCK_ASSETS: Record<string, ContentAsset[]> = {};

export const contentService = {
  /**
   * İçerik oluştur
   */
  async createContent(data: Partial<ContentItem>): Promise<ContentItem> {
    // Mock implementation
    const newContent: ContentItem = {
      id: `content-${Date.now()}`,
      tenantId: data.tenantId || 'tenant-001',
      contentType: data.contentType || 'question',
      title: data.title || 'Yeni İçerik',
      description: data.description,
      status: data.status || 'draft',
      contentJson: data.contentJson || {},
      metadata: data.metadata,
      createdBy: data.createdBy || 'user-001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_CONTENTS[newContent.id] = newContent;
    console.log('Content created:', newContent);
    return newContent;

    // Real implementation:
    // return apiClient.post('/api/content/items', data);
  },

  /**
   * İçerik getir
   */
  async getContent(id: string): Promise<ContentItem> {
    // Mock implementation
    const content = MOCK_CONTENTS[id];
    if (!content) {
      throw new Error(`Content not found: ${id}`);
    }
    return content;

    // Real implementation:
    // return apiClient.get(`/api/content/items/${id}`);
  },

  /**
   * İçerik güncelle
   */
  async updateContent(id: string, data: Partial<ContentItem>): Promise<ContentItem> {
    // Mock implementation
    const existing = MOCK_CONTENTS[id];
    if (!existing) {
      throw new Error(`Content not found: ${id}`);
    }

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    MOCK_CONTENTS[id] = updated;
    console.log('Content updated:', updated);
    return updated;

    // Real implementation:
    // return apiClient.put(`/api/content/items/${id}`, data);
  },

  /**
   * İçerik sil
   */
  async deleteContent(id: string): Promise<void> {
    // Mock implementation
    delete MOCK_CONTENTS[id];
    delete MOCK_ASSETS[id];
    console.log('Content deleted:', id);

    // Real implementation:
    // return apiClient.delete(`/api/content/items/${id}`);
  },

  /**
   * İçerik listele
   */
  async listContents(filters?: {
    contentType?: string;
    status?: string;
    tenantId?: string;
  }): Promise<ContentItem[]> {
    // Mock implementation
    let items = Object.values(MOCK_CONTENTS);

    if (filters?.contentType) {
      items = items.filter((item) => item.contentType === filters.contentType);
    }

    if (filters?.status) {
      items = items.filter((item) => item.status === filters.status);
    }

    if (filters?.tenantId) {
      items = items.filter((item) => item.tenantId === filters.tenantId);
    }

    return items;

    // Real implementation:
    // return apiClient.get('/api/content/items', { params: filters });
  },

  /**
   * Asset ekle (whiteboard, image, etc.)
   */
  async addAsset(contentId: string, asset: Partial<ContentAsset>): Promise<ContentAsset> {
    // Mock implementation
    const newAsset: ContentAsset = {
      id: `asset-${Date.now()}`,
      contentId,
      assetType: asset.assetType || 'whiteboard',
      assetFormat: asset.assetFormat || 'excalidraw_json',
      fileUrl: asset.fileUrl,
      fileSizeBytes: asset.fileSizeBytes,
      assetJson: asset.assetJson,
      metadata: asset.metadata,
    };

    if (!MOCK_ASSETS[contentId]) {
      MOCK_ASSETS[contentId] = [];
    }

    MOCK_ASSETS[contentId].push(newAsset);
    console.log('Asset added:', newAsset);
    return newAsset;

    // Real implementation:
    // return apiClient.post(`/api/content/items/${contentId}/assets`, asset);
  },

  /**
   * Asset'leri getir
   */
  async getAssets(contentId: string): Promise<ContentAsset[]> {
    // Mock implementation
    return MOCK_ASSETS[contentId] || [];

    // Real implementation:
    // return apiClient.get(`/api/content/items/${contentId}/assets`);
  },

  /**
   * Whiteboard asset kaydet (convenience method)
   */
  async saveWhiteboardAsset(
    contentId: string,
    whiteboardData: any,
    format: 'excalidraw_json' | 'polotno_json' = 'excalidraw_json'
  ): Promise<ContentAsset> {
    return this.addAsset(contentId, {
      assetType: 'whiteboard',
      assetFormat: format,
      assetJson: whiteboardData,
      fileSizeBytes: JSON.stringify(whiteboardData).length,
    });
  },

  /**
   * PDF asset kaydet
   */
  async savePdfAsset(
    contentId: string,
    pdfUrl: string,
    annotations?: any
  ): Promise<ContentAsset> {
    return this.addAsset(contentId, {
      assetType: 'pdf',
      assetFormat: 'pdf_annotations',
      fileUrl: pdfUrl,
      assetJson: annotations,
    });
  },
};

