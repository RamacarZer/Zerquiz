const API_BASE_URL = import.meta.env.VITE_BOOKS_API_URL || 'http://localhost:5010';

export interface Book {
  id: string;
  userId: string;
  tenantId: string;
  title: string;
  subtitle?: string;
  description?: string;
  isbn?: string;
  author?: string;
  publisher?: string;
  language: string;
  coverImageUrl?: string;
  contentType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookChapter {
  id: string;
  bookId: string;
  parentChapterId?: string;
  title: string;
  content: string;
  order: number;
  level: number;
}

export interface ExportRequest {
  exportType: 'epub' | 'pdf' | 'html' | 'kindle';
  requestedByUserId: string;
  tenantId: string;
}

export interface ExportStatus {
  id: string;
  bookId: string;
  exportType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileKey: string;
  fileName: string;
  url?: string;
  errorMessage?: string;
  completedAt?: string;
}

class BooksService {
  async getBooks(tenantId?: string, userId?: string, status?: string): Promise<Book[]> {
    const params = new URLSearchParams();
    if (tenantId) params.append('tenantId', tenantId);
    if (userId) params.append('userId', userId);
    if (status) params.append('status', status);

    const response = await fetch(`${API_BASE_URL}/api/books?${params}`);
    if (!response.ok) throw new Error('Failed to fetch books');
    return response.json();
  }

  async getBook(bookId: string): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/api/books/${bookId}`);
    if (!response.ok) throw new Error('Failed to fetch book');
    return response.json();
  }

  async createBook(book: Partial<Book>): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/api/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    if (!response.ok) throw new Error('Failed to create book');
    return response.json();
  }

  async updateBook(bookId: string, book: Partial<Book>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/books/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    if (!response.ok) throw new Error('Failed to update book');
  }

  async deleteBook(bookId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/books/${bookId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete book');
  }

  async getChapters(bookId: string, parentChapterId?: string): Promise<BookChapter[]> {
    const params = new URLSearchParams();
    if (parentChapterId) params.append('parentChapterId', parentChapterId);

    const response = await fetch(`${API_BASE_URL}/api/books/${bookId}/chapters?${params}`);
    if (!response.ok) throw new Error('Failed to fetch chapters');
    return response.json();
  }

  async requestExport(bookId: string, request: ExportRequest): Promise<ExportStatus> {
    const response = await fetch(`${API_BASE_URL}/api/books/${bookId}/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to request export');
    return response.json();
  }

  async getExportStatus(bookId: string, exportId: string): Promise<ExportStatus> {
    const response = await fetch(`${API_BASE_URL}/api/books/${bookId}/export/${exportId}/status`);
    if (!response.ok) throw new Error('Failed to get export status');
    return response.json();
  }

  async downloadExport(bookId: string, exportId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/books/${bookId}/export/${exportId}/download`);
    if (!response.ok) throw new Error('Failed to download export');
    
    // Trigger download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `book_export_${exportId}.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export const booksService = new BooksService();

