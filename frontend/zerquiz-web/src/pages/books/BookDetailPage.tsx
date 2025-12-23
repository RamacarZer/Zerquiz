import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Download, Play, Trash2, Eye } from 'lucide-react';
import ExportDialog from '../../components/books/ExportDialog';

interface Book {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  author?: string;
  publisher?: string;
  isbn?: string;
  language: string;
  coverImageUrl?: string;
  contentType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Chapter {
  id: string;
  title: string;
  order: number;
  level: number;
  content: string;
}

export default function BookDetailPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExportDialog, setShowExportDialog] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!bookId) return;

      setLoading(true);
      try {
        // Fetch book details
        const bookResponse = await fetch(`http://localhost:5010/api/books/${bookId}`);
        const bookData = await bookResponse.json();
        setBook(bookData);

        // Fetch chapters
        const chaptersResponse = await fetch(`http://localhost:5010/api/books/${bookId}/chapters`);
        const chaptersData = await chaptersResponse.json();
        setChapters(chaptersData);
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleDelete = async () => {
    if (!book || !window.confirm(`"${book.title}" kitabını silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await fetch(`http://localhost:5010/api/books/${book.id}`, {
        method: 'DELETE',
      });
      // Navigate back to book list
      window.location.href = '/books';
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Kitap silinirken bir hata oluştu.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-error">
          <span>Kitap bulunamadı.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/books" className="btn btn-ghost btn-sm gap-2">
          <ArrowLeft size={18} />
          Kitaplara Dön
        </Link>
      </div>

      {/* Book Header */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Cover Image */}
            <div className="flex-shrink-0">
              <img
                src={book.coverImageUrl || 'https://via.placeholder.com/200x300/3B82F6/FFFFFF?text=NO+COVER'}
                alt={book.title}
                className="w-48 h-64 object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Book Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
                  {book.subtitle && <p className="text-xl text-gray-600 mt-1">{book.subtitle}</p>}
                </div>
                <div className={`badge ${book.status === 'published' ? 'badge-success' : 'badge-warning'} badge-lg`}>
                  {book.status}
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {book.author && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Yazar:</span> {book.author}
                  </p>
                )}
                {book.publisher && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Yayınevi:</span> {book.publisher}
                  </p>
                )}
                {book.isbn && (
                  <p className="text-gray-700">
                    <span className="font-semibold">ISBN:</span> {book.isbn}
                  </p>
                )}
                <p className="text-gray-700">
                  <span className="font-semibold">Dil:</span> {book.language.toUpperCase()}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Tür:</span> {book.contentType}
                </p>
              </div>

              {book.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Açıklama:</h3>
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link to={`/reader/${book.id}`} className="btn btn-primary gap-2">
                  <Eye size={18} />
                  Okuyucuda Aç
                </Link>
                <button 
                  onClick={() => setShowExportDialog(true)}
                  className="btn btn-secondary gap-2"
                >
                  <Download size={18} />
                  Dışa Aktar
                </button>
                <Link to={`/books/${book.id}/edit`} className="btn btn-outline gap-2">
                  <Edit size={18} />
                  Düzenle
                </Link>
                <button onClick={handleDelete} className="btn btn-outline btn-error gap-2">
                  <Trash2 size={18} />
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">
            Bölümler ({chapters.length})
          </h2>

          {chapters.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Henüz bölüm eklenmemiş.</p>
              <Link to={`/books/${book.id}/chapters/new`} className="btn btn-primary">
                İlk Bölümü Ekle
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="badge badge-outline">{chapter.order}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
                      <p className="text-sm text-gray-600">
                        {chapter.content.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/books/${book.id}/chapters/${chapter.id}`}
                      className="btn btn-sm btn-ghost"
                    >
                      Görüntüle
                    </Link>
                    <Link
                      to={`/books/${book.id}/chapters/${chapter.id}/edit`}
                      className="btn btn-sm btn-outline"
                    >
                      Düzenle
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {chapters.length > 0 && (
            <div className="mt-6">
              <Link to={`/books/${book.id}/chapters/new`} className="btn btn-outline w-full">
                + Yeni Bölüm Ekle
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        bookId={book.id}
        bookTitle={book.title}
      />
    </div>
  );
}

