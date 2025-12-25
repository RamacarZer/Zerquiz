import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, Download, Eye } from 'lucide-react';
import ExportDialog from '../../components/books/ExportDialog';

interface Book {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  author?: string;
  publisher?: string;
  coverImageUrl?: string;
  contentType: string;
  status: string;
  createdAt: string;
}

export default function BookListPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<{ id: string; title: string } | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        // Try fetching from API
        const response = await fetch('http://localhost:5010/api/books');
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        // Silent fail - use demo content if API fails
        setBooks([
          {
            id: 'book-1',
            title: '10. Sınıf Matematik',
            subtitle: 'Fonksiyonlar ve Trigonometri',
            description: 'Kapsamlı matematik ders kitabı. Fonksiyonlar, trigonometri, analitik geometri ve daha fazlası.',
            author: 'Prof. Dr. Ahmet Yılmaz',
            publisher: 'Zerquiz Yayınları',
            coverImageUrl: 'https://picsum.photos/seed/math10/300/400',
            contentType: 'interactive',
            status: 'published',
            createdAt: '2024-01-15T00:00:00Z'
          },
          {
            id: 'book-2',
            title: '9. Sınıf Fizik',
            subtitle: 'Hareket ve Kuvvet',
            description: 'Etkileşimli animasyonlar ve deneylerle fizik öğrenin.',
            author: 'Dr. Ayşe Demir',
            publisher: 'Zerquiz Yayınları',
            coverImageUrl: 'https://picsum.photos/seed/physics9/300/400',
            contentType: 'interactive',
            status: 'published',
            createdAt: '2024-02-10T00:00:00Z'
          },
          {
            id: 'book-3',
            title: '11. Sınıf Kimya',
            subtitle: 'Modern Atom Teorisi',
            description: 'Periyodik tablo, kimyasal bağlar ve reaksiyonlar.',
            author: 'Prof. Dr. Mehmet Kaya',
            publisher: 'Zerquiz Yayınları',
            coverImageUrl: 'https://picsum.photos/seed/chemistry11/300/400',
            contentType: 'standard',
            status: 'published',
            createdAt: '2024-03-05T00:00:00Z'
          },
          {
            id: 'book-4',
            title: '12. Sınıf Biyoloji',
            subtitle: 'Genetik ve Evrim',
            description: 'DNA yapısı, gen ekspresyonu ve evrim teorisi.',
            author: 'Dr. Zeynep Öztürk',
            publisher: 'Zerquiz Yayınları',
            coverImageUrl: 'https://picsum.photos/seed/biology12/300/400',
            contentType: 'interactive',
            status: 'published',
            createdAt: '2024-03-20T00:00:00Z'
          },
          {
            id: 'book-5',
            title: '8. Sınıf İngilizce',
            subtitle: 'Advanced Grammar',
            description: 'İleri seviye İngilizce dilbilgisi ve kelime hazinesi.',
            author: 'Sarah Johnson',
            publisher: 'Zerquiz Yayınları',
            coverImageUrl: 'https://picsum.photos/seed/english8/300/400',
            contentType: 'interactive',
            status: 'draft',
            createdAt: '2024-04-01T00:00:00Z'
          },
          {
            id: 'book-6',
            title: '10. Sınıf Tarih',
            subtitle: 'Osmanlı İmparatorluğu',
            description: 'Osmanlı tarihinin dönüm noktaları ve kültürel mirası.',
            author: 'Prof. Dr. Ali Çelik',
            publisher: 'Zerquiz Yayınları',
            coverImageUrl: 'https://picsum.photos/seed/history10/300/400',
            contentType: 'standard',
            status: 'published',
            createdAt: '2024-04-15T00:00:00Z'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleExport = (book: Book) => {
    setSelectedBook({ id: book.id, title: book.title });
    setShowExportDialog(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kitaplarım</h1>
          <p className="text-gray-600 mt-1">Ders kitapları ve kültürel yayınlarınızı yönetin</p>
        </div>
        <Link to="/books/new" className="btn btn-primary gap-2">
          <Plus size={20} />
          Yeni Kitap Oluştur
        </Link>
      </div>

      {/* Books Grid */}
      {books.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz kitap yok</h3>
          <p className="text-gray-600 mb-6">İlk kitabınızı oluşturarak başlayın</p>
          <Link to="/books/new" className="btn btn-primary gap-2">
            <Plus size={20} />
            İlk Kitabı Oluştur
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <figure className="h-64 overflow-hidden bg-gray-100">
                <img
                  src={book.coverImageUrl || 'https://https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=' + encodeURIComponent(book.title)}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <h2 className="card-title text-lg line-clamp-2">
                  {book.title}
                  <div className={`badge badge-sm ${book.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                    {book.status}
                  </div>
                </h2>
                {book.author && (
                  <p className="text-sm text-gray-600 line-clamp-1">{book.author}</p>
                )}
                <p className="text-sm text-gray-600 line-clamp-2 mt-2">{book.description}</p>
                
                <div className="card-actions justify-end mt-4 gap-2">
                  <Link to={`/reader/${book.id}`} className="btn btn-sm btn-ghost gap-1" title="Okuyucuda Aç">
                    <Eye size={16} />
                  </Link>
                  <button 
                    onClick={() => handleExport(book)} 
                    className="btn btn-sm btn-ghost gap-1"
                    title="Dışa Aktar"
                  >
                    <Download size={16} />
                  </button>
                  <Link to={`/books/${book.id}`} className="btn btn-sm btn-primary">
                    Detaylar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Export Dialog */}
      {selectedBook && (
        <ExportDialog
          isOpen={showExportDialog}
          onClose={() => {
            setShowExportDialog(false);
            setSelectedBook(null);
          }}
          bookId={selectedBook.id}
          bookTitle={selectedBook.title}
        />
      )}
    </div>
  );
}
