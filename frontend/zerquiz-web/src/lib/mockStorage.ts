/**
 * Mock Storage Utility
 * LocalStorage tabanlı CRUD işlemleri için yardımcı fonksiyonlar
 */

export class MockStorage<T extends { id: string }> {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = `zerquiz_mock_${storageKey}`;
  }

  /**
   * Tüm kayıtları getir
   */
  getAll(): T[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  /**
   * ID'ye göre kayıt getir
   */
  getById(id: string): T | null {
    const items = this.getAll();
    return items.find((item) => item.id === id) || null;
  }

  /**
   * Yeni kayıt ekle
   */
  create(item: T): T {
    const items = this.getAll();
    items.push(item);
    this.saveAll(items);
    return item;
  }

  /**
   * Kayıt güncelle
   */
  update(id: string, updates: Partial<T>): T | null {
    const items = this.getAll();
    const index = items.findIndex((item) => item.id === id);
    
    if (index === -1) return null;
    
    items[index] = { ...items[index], ...updates };
    this.saveAll(items);
    return items[index];
  }

  /**
   * Kayıt sil
   */
  delete(id: string): boolean {
    const items = this.getAll();
    const filtered = items.filter((item) => item.id !== id);
    
    if (filtered.length === items.length) return false;
    
    this.saveAll(filtered);
    return true;
  }

  /**
   * Tüm kayıtları kaydet
   */
  saveAll(items: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  /**
   * Tüm kayıtları temizle
   */
  clear(): void {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Sayfalama ile getir
   */
  paginate(page: number = 1, pageSize: number = 20): { items: T[]; total: number; totalPages: number } {
    const allItems = this.getAll();
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      items: allItems.slice(start, end),
      total: allItems.length,
      totalPages: Math.ceil(allItems.length / pageSize),
    };
  }

  /**
   * Filtreleme
   */
  filter(predicate: (item: T) => boolean): T[] {
    return this.getAll().filter(predicate);
  }

  /**
   * Arama
   */
  search(query: string, fields: (keyof T)[]): T[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter((item) =>
      fields.some((field) => {
        const value = item[field];
        return typeof value === 'string' && value.toLowerCase().includes(lowerQuery);
      })
    );
  }
}

/**
 * API simülasyon delay'i
 */
export const mockDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Rastgele ID oluştur
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Rastgele UUID oluştur (v4 benzeri)
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Mock API Response wrapper
 */
export interface MockApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const mockSuccess = <T>(data: T, message?: string): MockApiResponse<T> => ({
  success: true,
  data,
  message,
});

export const mockError = (error: string): MockApiResponse<null> => ({
  success: false,
  error,
});

