/**
 * Mock API Base Service
 * Tüm mock servisler için base class
 */

import { MockStorage, mockDelay, MockApiResponse, mockSuccess, mockError } from './mockStorage';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
}

export class MockApiService<T extends { id: string; createdAt?: string; updatedAt?: string }> {
  protected storage: MockStorage<T>;
  protected mockDelay: number;

  constructor(storageKey: string, mockDelay: number = 500) {
    this.storage = new MockStorage<T>(storageKey);
    this.mockDelay = mockDelay;
  }

  /**
   * Liste getir (sayfalama ve filtreleme ile)
   */
  async getList(options: FilterOptions = {}): Promise<PaginatedResponse<T>> {
    await mockDelay(this.mockDelay);

    const {
      page = 1,
      pageSize = 20,
      search = '',
      sortBy,
      sortOrder = 'desc',
      ...filters
    } = options;

    let items = this.storage.getAll();

    // Filtreleme
    if (search) {
      items = items.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
      );
    }

    // Custom filtreler
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== '') {
        items = items.filter((item: any) => {
          if (Array.isArray(filters[key])) {
            return filters[key].includes(item[key]);
          }
          return item[key] === filters[key];
        });
      }
    });

    // Sıralama
    if (sortBy) {
      items.sort((a: any, b: any) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    // Sayfalama
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedItems = items.slice(start, end);

    return {
      items: paginatedItems,
      total: items.length,
      page,
      pageSize,
      totalPages: Math.ceil(items.length / pageSize),
    };
  }

  /**
   * ID'ye göre getir
   */
  async getById(id: string): Promise<T> {
    await mockDelay(this.mockDelay);
    
    const item = this.storage.getById(id);
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    return item;
  }

  /**
   * Oluştur
   */
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    await mockDelay(this.mockDelay);

    const now = new Date().toISOString();
    const newItem: T = {
      ...data,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    } as T;

    return this.storage.create(newItem);
  }

  /**
   * Güncelle
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    await mockDelay(this.mockDelay);

    const updates = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const updated = this.storage.update(id, updates);
    if (!updated) {
      throw new Error(`Item with id ${id} not found`);
    }

    return updated;
  }

  /**
   * Sil
   */
  async delete(id: string): Promise<boolean> {
    await mockDelay(this.mockDelay);

    const deleted = this.storage.delete(id);
    if (!deleted) {
      throw new Error(`Item with id ${id} not found`);
    }

    return true;
  }

  /**
   * Toplu silme
   */
  async deleteMany(ids: string[]): Promise<number> {
    await mockDelay(this.mockDelay);

    let deletedCount = 0;
    ids.forEach((id) => {
      if (this.storage.delete(id)) {
        deletedCount++;
      }
    });

    return deletedCount;
  }

  /**
   * Tümünü getir (sayfalama olmadan)
   */
  async getAll(): Promise<T[]> {
    await mockDelay(this.mockDelay);
    return this.storage.getAll();
  }

  /**
   * Sayıyı getir
   */
  async count(filters: Record<string, any> = {}): Promise<number> {
    await mockDelay(this.mockDelay);
    
    let items = this.storage.getAll();
    
    // Filtreleme
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== '') {
        items = items.filter((item: any) => item[key] === filters[key]);
      }
    });

    return items.length;
  }

  /**
   * Seed data yükle
   */
  seed(data: T[]): void {
    this.storage.saveAll(data);
  }

  /**
   * Tümünü temizle
   */
  clear(): void {
    this.storage.clear();
  }

  /**
   * ID oluştur
   */
  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

