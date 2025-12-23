import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Highlighter,
  MessageSquare,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  List,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTTS } from '../../hooks/useTTS';
import TTSControls from '../../components/reader/TTSControls';
import HighlightToolbar from '../../components/reader/HighlightToolbar';
import NotesPanel from '../../components/reader/NotesPanel';

interface Book {
  id: string;
  title: string;
  author?: string;
  coverImageUrl?: string;
}

interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface ReaderProgress {
  currentChapterId: string;
  currentPage: number;
  progressPercentage: number;
}

export default function ReaderPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [progress, setProgress] = useState<ReaderProgress | null>(null);
  
  const [showTOC, setShowTOC] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [highlightColor, setHighlightColor] = useState('#FFEB3B');

  const { speak, stop, isSpeaking, voices, currentVoice, setVoice } = useTTS();

  useEffect(() => {
    const fetchBookData = async () => {
      // Use demo content if no bookId
      if (!bookId) {
        setBook({
          id: 'demo-book',
          title: 'Demo E-Kitap Okuyucu',
          author: 'Zerquiz Platform',
          coverImageUrl: 'https://picsum.photos/seed/reader-demo/300/400'
        });
        setChapters([
          {
            id: 'chapter-1',
            title: '1. Bölüm: Giriş',
            content: `
              <h1>E-Kitap Okuyucuya Hoş Geldiniz</h1>
              <p>Zerquiz e-kitap okuyucu, modern eğitim materyallerini okumak için tasarlanmış gelişmiş bir araçtır.</p>
              
              <h2>Özellikler:</h2>
              <ul>
                <li>📖 <strong>Akıcı Okuma:</strong> Rahat okuma deneyimi</li>
                <li>🎨 <strong>Metni Vurgulama:</strong> Önemli kısımları işaretleyin</li>
                <li>📝 <strong>Not Alma:</strong> Kendi notlarınızı ekleyin</li>
                <li>🔖 <strong>Yer İmi:</strong> Kaldığınız yeri kaydedin</li>
                <li>🔊 <strong>Sesli Okuma (TTS):</strong> Metni dinleyin</li>
              </ul>

              <p>Sol üstteki menüden farklı özelliklere erişebilirsiniz.</p>

              <blockquote style="border-left: 4px solid #2196f3; padding-left: 15px; color: #666;">
                <em>"Okumak, düşünmenin en yüce biçimidir."</em> - Francis Bacon
              </blockquote>
            `,
            order: 0
          },
          {
            id: 'chapter-2',
            title: '2. Bölüm: Kullanım',
            content: `
              <h1>E-Kitap Okuyucu Kullanımı</h1>
              
              <h2>🎨 Metni Vurgulama:</h2>
              <p>Metni fare ile seçtiğinizde, vurgulama araç çubuğu belirecektir.</p>
              <ol>
                <li>Vurgulamak istediğiniz metni seçin</li>
                <li>Renk paletinden bir renk seçin</li>
                <li>"Vurgula" butonuna tıklayın</li>
              </ol>

              <h2>📝 Not Alma:</h2>
              <p>Sağ üstteki not ikonu ile not panelini açabilirsiniz.</p>
              <ul>
                <li>Yeni not ekleyin</li>
                <li>Notlarınızı düzenleyin</li>
                <li>Notları sayfaya göre filtreleyin</li>
              </ul>

              <h2>🔊 Sesli Okuma:</h2>
              <p>Sağ üstteki ses ikonu ile metni dinleyebilirsiniz.</p>
              <p>Ses hızını ve sesi değiştirebilirsiniz.</p>

              <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <strong>💡 İpucu:</strong> Klavye kısayolları ile daha hızlı gezinebilirsiniz!
              </div>
            `,
            order: 1
          },
          {
            id: 'chapter-3',
            title: '3. Bölüm: İleri Özellikler',
            content: `
              <h1>İleri Düzey Özellikler</h1>

              <h2>🔖 Yer İmi Sistemi:</h2>
              <p>Önemli sayfaları yer imine ekleyerek daha sonra kolayca erişebilirsiniz.</p>

              <h2>📊 İlerleme Takibi:</h2>
              <p>Okuma ilerlemeniz otomatik olarak kaydedilir.</p>
              <p>Kaldığınız yerden devam edebilirsiniz.</p>

              <h2>🎯 Etkileşimli İçerik:</h2>
              <p>Bazı e-kitaplar etkileşimli içerik sunar:</p>
              <ul>
                <li>Video entegrasyonları</li>
                <li>Quizler ve testler</li>
                <li>Animasyonlar</li>
                <li>3D modeller</li>
              </ul>

              <h2>🌐 Çok Dilli Destek:</h2>
              <p>E-kitaplar farklı dillerde okunabilir.</p>

              <div style="background: #d1ecf1; padding: 20px; border-radius: 5px; margin-top: 30px;">
                <h3>📚 Demo İçerik Hakkında</h3>
                <p>Bu demo içeriktir. Gerçek kitap içeriği için kitap listesinden bir kitap seçin.</p>
                <p><strong>Not:</strong> Tüm özellikler (vurgulama, not alma, sesli okuma) tam işlevseldir!</p>
              </div>
            `,
            order: 2
          }
        ]);
        return;
      }

      try {
        // Fetch book
        const bookResponse = await fetch(`http://localhost:5010/api/books/${bookId}`);
        const bookData = await bookResponse.json();
        setBook(bookData);

        // Fetch chapters
        const chaptersResponse = await fetch(`http://localhost:5010/api/books/${bookId}/chapters`);
        const chaptersData: Chapter[] = await chaptersResponse.json();
        setChapters(chaptersData.sort((a, b) => a.order - b.order));

        // Fetch progress
        try {
          const progressResponse = await fetch(
            `http://localhost:5010/api/books/${bookId}/reader/progress/current-user-id`
          );
          if (progressResponse.ok) {
            const progressData = await progressResponse.json();
            setProgress(progressData);
            
            // Set current chapter based on progress
            const chapterIndex = chaptersData.findIndex(c => c.id === progressData.currentChapterId);
            if (chapterIndex !== -1) {
              setCurrentChapterIndex(chapterIndex);
            }
          }
        } catch (error) {
          // Silent - no saved progress, start from beginning
        }
      } catch (error) {
        // Silent fail - fallback to demo content
        setBook({
          id: 'demo-book',
          title: 'Demo E-Kitap',
          author: 'Zerquiz',
        });
        setChapters([
          {
            id: 'chapter-1',
            title: 'Demo Bölüm',
            content: '<h1>Demo İçerik</h1><p>Backend bağlantısı kurulamadı. Demo içerik gösteriliyor.</p>',
            order: 0
          }
        ]);
      }
    };

    fetchBookData();
  }, [bookId]);

  useEffect(() => {
    // Handle text selection for highlighting
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        setSelectedText(selection.toString());
      } else {
        setSelectedText('');
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('touchend', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('touchend', handleSelection);
    };
  }, []);

  const currentChapter = chapters[currentChapterIndex];

  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      saveProgress(chapters[currentChapterIndex - 1].id);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      saveProgress(chapters[currentChapterIndex + 1].id);
    }
  };

  const handleChapterSelect = (index: number) => {
    setCurrentChapterIndex(index);
    setShowTOC(false);
    saveProgress(chapters[index].id);
  };

  const saveProgress = async (chapterId: string) => {
    if (!bookId) return;

    try {
      await fetch(`http://localhost:5010/api/books/${bookId}/reader/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user-id', // TODO: Get from auth
          bookId: bookId,
          currentChapterId: chapterId,
          currentPage: 1,
          progressPercentage: ((currentChapterIndex + 1) / chapters.length) * 100,
        }),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleBookmark = async () => {
    if (!bookId || !currentChapter) return;

    try {
      await fetch(`http://localhost:5010/api/books/${bookId}/reader/bookmarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user-id',
          bookId: bookId,
          chapterId: currentChapter.id,
          pageNumber: 1,
          contextText: currentChapter.content.substring(0, 100),
        }),
      });
      alert('Yer imi eklendi!');
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const handleHighlight = async () => {
    if (!bookId || !currentChapter || !selectedText) return;

    try {
      await fetch(`http://localhost:5010/api/books/${bookId}/reader/highlights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user-id',
          bookId: bookId,
          chapterId: currentChapter.id,
          highlightedText: selectedText,
          color: highlightColor,
          startOffset: 0, // TODO: Calculate actual offset
          endOffset: selectedText.length,
        }),
      });
      setSelectedText('');
    } catch (error) {
      console.error('Error adding highlight:', error);
    }
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      stop();
    } else if (currentChapter) {
      const textToRead = selectedText || currentChapter.content;
      speak(textToRead, book?.language || 'tr-TR');
    }
  };

  if (!book || chapters.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/books')} className="btn btn-ghost btn-sm gap-2">
            <ArrowLeft size={18} />
            Geri
          </button>
          <div>
            <h1 className="font-bold text-lg">{book.title}</h1>
            <p className="text-sm text-gray-600">{currentChapter?.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTOC(!showTOC)}
            className="btn btn-ghost btn-sm gap-2"
            title="İçindekiler"
          >
            <List size={18} />
          </button>
          <button
            onClick={handleBookmark}
            className="btn btn-ghost btn-sm gap-2"
            title="Yer İmi Ekle"
          >
            <Bookmark size={18} />
          </button>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="btn btn-ghost btn-sm gap-2"
            title="Notlar"
          >
            <MessageSquare size={18} />
          </button>
          <button
            onClick={() => navigate(`/smartboard/${bookId}`)}
            className="btn btn-ghost btn-sm gap-2"
            title="Smartboard Modu"
          >
            <Maximize size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Table of Contents Sidebar */}
        {showTOC && (
          <div className="w-80 bg-white border-r overflow-y-auto p-4">
            <h2 className="font-bold text-lg mb-4">İçindekiler</h2>
            <div className="space-y-2">
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  onClick={() => handleChapterSelect(index)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    index === currentChapterIndex
                      ? 'bg-blue-100 text-blue-900 font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="badge badge-outline">{chapter.order}</span>
                    <span className="flex-1">{chapter.title}</span>
                    {index < currentChapterIndex && (
                      <BookmarkCheck size={16} className="text-green-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reader Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-12">
            <article
              ref={contentRef}
              className="prose prose-lg max-w-none bg-white rounded-lg shadow-sm p-8"
              dangerouslySetInnerHTML={{ __html: currentChapter?.content || '' }}
            />

            {/* Chapter Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={handlePreviousChapter}
                disabled={currentChapterIndex === 0}
                className="btn btn-outline gap-2"
              >
                <ChevronLeft size={18} />
                Önceki Bölüm
              </button>
              <span className="text-sm text-gray-600">
                {currentChapterIndex + 1} / {chapters.length}
              </span>
              <button
                onClick={handleNextChapter}
                disabled={currentChapterIndex === chapters.length - 1}
                className="btn btn-outline gap-2"
              >
                Sonraki Bölüm
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Notes Sidebar */}
        {showNotes && (
          <NotesPanel
            bookId={bookId!}
            chapterId={currentChapter?.id}
            onClose={() => setShowNotes(false)}
          />
        )}
      </div>

      {/* Bottom TTS Controls */}
      <TTSControls
        isReading={isSpeaking}
        onPlay={handleReadAloud}
        onStop={stop}
        voices={voices}
        currentVoice={currentVoice}
        onVoiceChange={setVoice}
      />

      {/* Highlight Toolbar (appears when text is selected) */}
      {selectedText && (
        <HighlightToolbar
          onHighlight={handleHighlight}
          onReadAloud={handleReadAloud}
          highlightColor={highlightColor}
          onColorChange={setHighlightColor}
        />
      )}
    </div>
  );
}

