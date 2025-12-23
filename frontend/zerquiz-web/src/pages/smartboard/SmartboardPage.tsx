import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Minimize,
  ChevronLeft,
  ChevronRight,
  Home,
  Wifi,
  WifiOff,
  Download,
  Upload,
  Settings,
  Pencil,
  Eraser,
  Hand,
} from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author?: string;
}

interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

export default function SmartboardPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false); // Start as false, let user trigger
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineReady, setOfflineReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  
  // Drawing tools
  const [drawingMode, setDrawingMode] = useState<'none' | 'pen' | 'eraser'>('none');
  const [penColor, setPenColor] = useState('#FF0000');
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchBookData = async () => {
      // If no bookId in URL, use demo content
      if (!bookId) {
        setBook({
          id: 'demo-book',
          title: 'Demo Akıllı Tahta',
          author: 'Zerquiz Platform'
        });
        setChapters([
          {
            id: 'chapter-1',
            title: 'Hoş Geldiniz',
            content: `
              <h1>Zerquiz Akıllı Tahta'ya Hoş Geldiniz!</h1>
              <p>Bu sayfa etkileşimli ders sunumları için tasarlanmıştır.</p>
              
              <h2>Özellikler:</h2>
              <ul>
                <li>✅ Çizim Araçları (Kalem, Silgi)</li>
                <li>✅ Offline Mod Desteği</li>
                <li>✅ Sayfa Navigasyonu</li>
                <li>✅ Online/Offline Senkronizasyon</li>
              </ul>
              
              <h2>Nasıl Kullanılır:</h2>
              <ol>
                <li>Üstteki araç çubuğundan "Kalem" veya "Silgi" seçin</li>
                <li>Canvas üzerinde çizim yapın</li>
                <li>Sayfa navigasyonu için ok tuşlarını kullanın</li>
                <li>Offline kullanım için "Offline Paket" indirin</li>
              </ol>
              
              <p><strong>Not:</strong> Bu demo içeriktir. Gerçek kitap içeriği için bir kitap ID'si ile sayfayı açın.</p>
            `,
            order: 0
          },
          {
            id: 'chapter-2',
            title: 'Çizim Araçları',
            content: `
              <h1>Çizim Araçları</h1>
              <p>Akıllı tahta üzerinde çeşitli çizim araçları kullanabilirsiniz:</p>
              
              <h3>🖊️ Kalem Aracı</h3>
              <p>Serbest çizim yapmanızı sağlar. Renk seçeneği ile farklı renkler kullanabilirsiniz.</p>
              
              <h3>🧹 Silgi Aracı</h3>
              <p>Yaptığınız çizimleri silmenizi sağlar.</p>
              
              <h3>🗑️ Temizle</h3>
              <p>Tüm çizimleri bir anda temizler.</p>
              
              <div style="margin-top: 30px; padding: 20px; background: #f0f0f0; border-radius: 10px;">
                <h4>Deneme Alanı</h4>
                <p>Bu alanda kalem aracı ile çizim yapabilirsiniz!</p>
              </div>
            `,
            order: 1
          },
          {
            id: 'chapter-3',
            title: 'Offline Mod',
            content: `
              <h1>Offline Mod Kullanımı</h1>
              <p>Akıllı tahtayı internet bağlantısı olmadan da kullanabilirsiniz.</p>
              
              <h3>📥 Offline Paket İndirme:</h3>
              <ol>
                <li>Üst menüden "Offline Paket" butonuna tıklayın</li>
                <li>İçerik bilgisayarınıza indirilecek</li>
                <li>Artık offline kullanabilirsiniz!</li>
              </ol>
              
              <h3>🔄 Senkronizasyon:</h3>
              <p>Tekrar online olduğunuzda "Senkronize Et" butonu ile ilerlemenizi kaydedin.</p>
              
              <div style="background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin-top: 20px;">
                <strong>💡 İpucu:</strong> Offline mod, internet bağlantısı olmayan ortamlarda ders anlatımı için idealdir.
              </div>
            `,
            order: 2
          }
        ]);
        return;
      }

      try {
        const bookResponse = await fetch(`http://localhost:5010/api/books/${bookId}`);
        const bookData = await bookResponse.json();
        setBook(bookData);

        const chaptersResponse = await fetch(`http://localhost:5010/api/books/${bookId}/chapters`);
        const chaptersData: Chapter[] = await chaptersResponse.json();
        setChapters(chaptersData.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error('Error fetching book data:', error);
        // Try loading from cache if offline
        loadFromCache();
      }
    };

    fetchBookData();
  }, [bookId]);

  useEffect(() => {
    // Fullscreen can only be triggered by user interaction
    // Don't auto-trigger on mount, only when user clicks toggle button
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const loadFromCache = () => {
    try {
      const cached = localStorage.getItem(`smartboard_book_${bookId}`);
      if (cached) {
        const data = JSON.parse(cached);
        setBook(data.book);
        setChapters(data.chapters);
        setOfflineReady(true);
      }
    } catch (error) {
      console.warn('Failed to load from cache:', error);
      // Gracefully fail - offline mode won't be available
    }
  };

  const handleDownloadOfflinePackage = async () => {
    if (!bookId || !book) return;

    try {
      const response = await fetch('http://localhost:5010/api/smartboard/generate-offline-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: bookId,
          tenantId: 'current-tenant-id',
          userId: 'current-user-id',
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartboard_${book.title}_offline.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Save to localStorage for quick access (with error handling)
        try {
          localStorage.setItem(
            `smartboard_book_${bookId}`,
            JSON.stringify({ book, chapters })
          );
          setOfflineReady(true);
        } catch (storageError) {
          console.warn('Failed to save to localStorage:', storageError);
          // Download still succeeded, just can't cache
        }
        
        alert('Offline paket indirildi ve kaydedildi!');
      }
    } catch (error) {
      console.error('Error downloading offline package:', error);
      alert('Offline paket indirilemedi.');
    }
  };

  const handleSyncProgress = async () => {
    if (!bookId) return;

    setSyncStatus('syncing');
    try {
      // Get progress data from localStorage
      const progressData = localStorage.getItem(`smartboard_progress_${bookId}`);
      
      const response = await fetch('http://localhost:5010/api/smartboard/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: bookId,
          userId: 'current-user-id',
          tenantId: 'current-tenant-id',
          progressData: progressData ? JSON.parse(progressData) : [],
        }),
      });

      if (response.ok) {
        setSyncStatus('synced');
        setTimeout(() => setSyncStatus('idle'), 3000);
      } else {
        setSyncStatus('error');
      }
    } catch (error) {
      console.error('Error syncing progress:', error);
      setSyncStatus('error');
    }
  };

  const currentChapter = chapters[currentChapterIndex];

  const exitFullscreen = async () => {
    try {
      // Exit fullscreen if active
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.debug('Fullscreen exit failed:', error);
    } finally {
      setIsFullscreen(false);
      navigate(`/reader/${bookId}`);
    }
  };

  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawingMode === 'none') return;
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || drawingMode === 'none') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = drawingMode === 'eraser' ? 20 : 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = drawingMode === 'eraser' ? '#FFFFFF' : penColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  if (!book || chapters.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <span className="loading loading-spinner loading-lg text-white"></span>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Top Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={exitFullscreen} className="btn btn-ghost btn-sm gap-2 text-white">
            <Minimize size={18} />
            Çıkış
          </button>
          <div className="divider divider-horizontal mx-0"></div>
          <h1 className="text-xl font-bold">{book.title}</h1>
          <span className="badge badge-outline">{currentChapter?.title}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Online/Offline Status */}
          <div className={`flex items-center gap-2 ${isOnline ? 'text-green-400' : 'text-orange-400'}`}>
            {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
            <span className="text-sm">{isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}</span>
          </div>

          {/* Download Offline Package */}
          {isOnline && !offlineReady && (
            <button
              onClick={handleDownloadOfflinePackage}
              className="btn btn-sm btn-outline btn-info gap-2"
              title="Offline Paket İndir"
            >
              <Download size={16} />
              Offline Paket
            </button>
          )}

          {/* Sync Button */}
          {isOnline && (
            <button
              onClick={handleSyncProgress}
              disabled={syncStatus === 'syncing'}
              className={`btn btn-sm gap-2 ${
                syncStatus === 'synced'
                  ? 'btn-success'
                  : syncStatus === 'error'
                  ? 'btn-error'
                  : 'btn-outline btn-primary'
              }`}
              title="İlerlemeyi Senkronize Et"
            >
              <Upload size={16} className={syncStatus === 'syncing' ? 'animate-bounce' : ''} />
              {syncStatus === 'syncing' ? 'Senkronize Ediliyor...' : syncStatus === 'synced' ? 'Senkronize Edildi' : 'Senkronize Et'}
            </button>
          )}
        </div>
      </div>

      {/* Drawing Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-2 flex items-center gap-4">
        <span className="text-sm font-medium">Çizim Araçları:</span>
        
        <button
          onClick={() => setDrawingMode(drawingMode === 'pen' ? 'none' : 'pen')}
          className={`btn btn-sm gap-2 ${drawingMode === 'pen' ? 'btn-primary' : 'btn-ghost'}`}
        >
          <Pencil size={16} />
          Kalem
        </button>

        {drawingMode === 'pen' && (
          <input
            type="color"
            value={penColor}
            onChange={(e) => setPenColor(e.target.value)}
            className="w-10 h-8 rounded cursor-pointer"
          />
        )}

        <button
          onClick={() => setDrawingMode(drawingMode === 'eraser' ? 'none' : 'eraser')}
          className={`btn btn-sm gap-2 ${drawingMode === 'eraser' ? 'btn-primary' : 'btn-ghost'}`}
        >
          <Eraser size={16} />
          Silgi
        </button>

        <button
          onClick={() => setDrawingMode('none')}
          className={`btn btn-sm gap-2 ${drawingMode === 'none' ? 'btn-primary' : 'btn-ghost'}`}
        >
          <Hand size={16} />
          İşaretçi
        </button>

        <button onClick={clearDrawing} className="btn btn-sm btn-outline btn-error gap-2">
          Temizle
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {/* Chapter Content */}
        <div className="absolute inset-0 overflow-y-auto px-12 py-8">
          <article
            className="prose prose-2xl prose-invert max-w-none text-white"
            style={{
              fontSize: '1.75rem',
              lineHeight: '1.8',
              letterSpacing: '0.02em',
            }}
            dangerouslySetInnerHTML={{ __html: currentChapter?.content || '' }}
          />
        </div>

        {/* Drawing Canvas Overlay */}
        <canvas
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
          className="absolute inset-0 pointer-events-auto"
          style={{
            cursor:
              drawingMode === 'pen'
                ? 'crosshair'
                : drawingMode === 'eraser'
                ? 'cell'
                : 'default',
          }}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
        />
      </div>

      {/* Bottom Navigation */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentChapterIndex(Math.max(0, currentChapterIndex - 1))}
          disabled={currentChapterIndex === 0}
          className="btn btn-lg gap-3"
        >
          <ChevronLeft size={24} />
          Önceki
        </button>

        <div className="text-center">
          <p className="text-lg font-semibold">
            Bölüm {currentChapterIndex + 1} / {chapters.length}
          </p>
          <p className="text-sm text-gray-400">{currentChapter?.title}</p>
        </div>

        <button
          onClick={() =>
            setCurrentChapterIndex(Math.min(chapters.length - 1, currentChapterIndex + 1))
          }
          disabled={currentChapterIndex === chapters.length - 1}
          className="btn btn-lg gap-3"
        >
          Sonraki
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}

