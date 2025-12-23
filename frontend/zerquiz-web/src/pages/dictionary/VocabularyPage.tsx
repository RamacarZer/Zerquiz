import { useState, useEffect } from 'react';
import { BookOpen, Trash2, RefreshCw, Download, Star, TrendingUp } from 'lucide-react';

interface UserVocabulary {
  id: string;
  userId: string;
  dictionaryEntryId: string;
  word: string;
  definition: string;
  translation?: string;
  notes?: string;
  masteryLevel: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  createdAt: string;
}

export default function VocabularyPage() {
  const [vocabulary, setVocabulary] = useState<UserVocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'review' | 'mastered'>('all');

  useEffect(() => {
    fetchVocabulary();
  }, []);

  const fetchVocabulary = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'http://localhost:5011/api/dictionary/vocabulary/current-user-id?page=1&pageSize=100'
      );
      if (response.ok) {
        const data = await response.json();
        setVocabulary(data);
      } else {
        // Load from localStorage as fallback
        const cached = localStorage.getItem('user_vocabulary');
        if (cached) {
          setVocabulary(JSON.parse(cached));
        }
      }
    } catch (error) {
      // Silent fail - use demo content if API fails
      const demoVocabulary: UserVocabulary[] = [
        {
          id: 'vocab-1',
          userId: 'demo-user',
          dictionaryEntryId: 'entry-1',
          word: 'Algorithm',
          definition: 'A step-by-step procedure for solving a problem or accomplishing a task.',
          translation: 'Algoritma',
          notes: 'Bilgisayar bilimlerinde temel kavram',
          masteryLevel: 4,
          lastReviewedAt: '2024-12-20T10:00:00Z',
          nextReviewAt: '2024-12-25T10:00:00Z',
          createdAt: '2024-12-01T00:00:00Z'
        },
        {
          id: 'vocab-2',
          userId: 'demo-user',
          dictionaryEntryId: 'entry-2',
          word: 'Photosynthesis',
          definition: 'The process by which plants convert light energy into chemical energy.',
          translation: 'Fotosentez',
          notes: 'Bitkiler için hayati öneme sahip',
          masteryLevel: 5,
          lastReviewedAt: '2024-12-18T15:30:00Z',
          nextReviewAt: '2024-12-24T15:30:00Z',
          createdAt: '2024-11-28T00:00:00Z'
        },
        {
          id: 'vocab-3',
          userId: 'demo-user',
          dictionaryEntryId: 'entry-3',
          word: 'Democracy',
          definition: 'A system of government by the whole population, typically through elected representatives.',
          translation: 'Demokrasi',
          notes: 'Toplum yönetim biçimi',
          masteryLevel: 3,
          lastReviewedAt: '2024-12-19T09:00:00Z',
          nextReviewAt: '2024-12-23T09:00:00Z',
          createdAt: '2024-12-05T00:00:00Z'
        },
        {
          id: 'vocab-4',
          userId: 'demo-user',
          dictionaryEntryId: 'entry-4',
          word: 'Momentum',
          definition: 'The quantity of motion of a moving body, measured as a product of its mass and velocity.',
          translation: 'Momentum',
          notes: 'Fizik - Hareket miktarı',
          masteryLevel: 2,
          lastReviewedAt: '2024-12-21T14:00:00Z',
          nextReviewAt: '2024-12-22T14:00:00Z',
          createdAt: '2024-12-10T00:00:00Z'
        },
        {
          id: 'vocab-5',
          userId: 'demo-user',
          dictionaryEntryId: 'entry-5',
          word: 'Ecosystem',
          definition: 'A biological community of interacting organisms and their physical environment.',
          translation: 'Ekosistem',
          notes: 'Canlılar ve çevrelerinin etkileşimi',
          masteryLevel: 4,
          lastReviewedAt: '2024-12-20T11:00:00Z',
          nextReviewAt: '2024-12-25T11:00:00Z',
          createdAt: '2024-12-03T00:00:00Z'
        },
        {
          id: 'vocab-6',
          userId: 'demo-user',
          dictionaryEntryId: 'entry-6',
          word: 'Renaissance',
          definition: 'The revival of art and literature under the influence of classical models in the 14th–16th centuries.',
          translation: 'Rönesans',
          notes: 'Avrupa tarihinde önemli dönem',
          masteryLevel: 3,
          lastReviewedAt: '2024-12-19T16:00:00Z',
          nextReviewAt: '2024-12-23T16:00:00Z',
          createdAt: '2024-12-07T00:00:00Z'
        },
        {
          id: 'vocab-7',
          userId: 'demo-user',
          dictionaryEntryId: 'entry-7',
          word: 'Hypothesis',
          definition: 'A supposition or proposed explanation made on the basis of limited evidence.',
          translation: 'Hipotez',
          notes: 'Bilimsel yöntemde kullanılır',
          masteryLevel: 2,
          lastReviewedAt: '2024-12-21T10:00:00Z',
          nextReviewAt: '2024-12-22T10:00:00Z',
          createdAt: '2024-12-12T00:00:00Z'
        },
        {
          id: 'vocab-8',
          userId: 'demo-user',
          dictionaryEntryId: 'entry-8',
          word: 'Catalyst',
          definition: 'A substance that increases the rate of a chemical reaction without itself undergoing any permanent chemical change.',
          translation: 'Katalizör',
          notes: 'Kimya - Reaksiyon hızlandırıcı',
          masteryLevel: 5,
          lastReviewedAt: '2024-12-18T13:00:00Z',
          nextReviewAt: '2024-12-24T13:00:00Z',
          createdAt: '2024-11-30T00:00:00Z'
        }
      ];
      setVocabulary(demoVocabulary);
      // Save to localStorage for persistence
      try {
        localStorage.setItem('user_vocabulary', JSON.stringify(demoVocabulary));
      } catch (storageError) {
        console.warn('Could not save to localStorage:', storageError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu kelimeyi silmek istediğinize emin misiniz?')) return;

    try {
      await fetch(`http://localhost:5011/api/dictionary/vocabulary/${id}`, {
        method: 'DELETE',
      });
      setVocabulary((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting vocabulary:', error);
    }
  };

  const handleReview = async (id: string) => {
    const item = vocabulary.find((v) => v.id === id);
    if (!item) return;

    const updatedMasteryLevel = Math.min(5, item.masteryLevel + 1);

    try {
      await fetch(`http://localhost:5011/api/dictionary/vocabulary/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id,
          masteryLevel: updatedMasteryLevel,
          lastReviewedAt: new Date().toISOString(),
          nextReviewAt: new Date(Date.now() + 86400000 * (updatedMasteryLevel + 1)).toISOString(), // Next review in (masteryLevel + 1) days
        }),
      });

      setVocabulary((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                masteryLevel: updatedMasteryLevel,
                lastReviewedAt: new Date().toISOString(),
              }
            : v
        )
      );
    } catch (error) {
      console.error('Error updating vocabulary:', error);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Kelime', 'Tanım', 'Çeviri', 'Notlar', 'Seviye', 'Tarih'].join(','),
      ...vocabulary.map((item) =>
        [
          item.word,
          `"${item.definition}"`,
          item.translation || '',
          `"${item.notes || ''}"`,
          item.masteryLevel,
          new Date(item.createdAt).toLocaleDateString('tr-TR'),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kelime-defterim-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredVocabulary = vocabulary.filter((item) => {
    if (filter === 'review') {
      return item.masteryLevel < 3;
    }
    if (filter === 'mastered') {
      return item.masteryLevel >= 4;
    }
    return true;
  });

  const stats = {
    total: vocabulary.length,
    mastered: vocabulary.filter((v) => v.masteryLevel >= 4).length,
    learning: vocabulary.filter((v) => v.masteryLevel > 0 && v.masteryLevel < 4).length,
    new: vocabulary.filter((v) => v.masteryLevel === 0).length,
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
          <h1 className="text-3xl font-bold text-gray-900">Kelime Defterim</h1>
          <p className="text-gray-600 mt-1">Öğrendiğiniz kelimeleri takip edin</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchVocabulary} className="btn btn-ghost gap-2">
            <RefreshCw size={18} />
            Yenile
          </button>
          <button onClick={handleExport} className="btn btn-primary gap-2">
            <Download size={18} />
            CSV İndir
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-primary">
            <BookOpen size={32} />
          </div>
          <div className="stat-title">Toplam Kelime</div>
          <div className="stat-value text-primary">{stats.total}</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-success">
            <Star size={32} />
          </div>
          <div className="stat-title">Öğrenildi</div>
          <div className="stat-value text-success">{stats.mastered}</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-warning">
            <TrendingUp size={32} />
          </div>
          <div className="stat-title">Öğreniliyor</div>
          <div className="stat-value text-warning">{stats.learning}</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-info">
            <RefreshCw size={32} />
          </div>
          <div className="stat-title">Yeni</div>
          <div className="stat-value text-info">{stats.new}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="tabs tabs-boxed mb-6">
        <a
          className={`tab ${filter === 'all' ? 'tab-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tümü ({vocabulary.length})
        </a>
        <a
          className={`tab ${filter === 'review' ? 'tab-active' : ''}`}
          onClick={() => setFilter('review')}
        >
          Tekrar Edilecek ({vocabulary.filter((v) => v.masteryLevel < 3).length})
        </a>
        <a
          className={`tab ${filter === 'mastered' ? 'tab-active' : ''}`}
          onClick={() => setFilter('mastered')}
        >
          Öğrenildi ({vocabulary.filter((v) => v.masteryLevel >= 4).length})
        </a>
      </div>

      {/* Vocabulary List */}
      {filteredVocabulary.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz kelime yok</h3>
          <p className="text-gray-600">
            Okurken kelime üzerine tıklayarak kelime defterinize ekleyin
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVocabulary.map((item) => (
            <div key={item.id} className="card bg-base-100 shadow-md hover:shadow-lg transition">
              <div className="card-body p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="card-title text-xl">{item.word}</h3>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < item.masteryLevel ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>

                {item.translation && (
                  <p className="text-blue-600 font-medium text-sm mb-2">{item.translation}</p>
                )}

                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{item.definition}</p>

                {item.notes && (
                  <div className="bg-yellow-50 p-2 rounded text-sm text-gray-700 mb-3 line-clamp-2">
                    💡 {item.notes}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>Eklenme: {new Date(item.createdAt).toLocaleDateString('tr-TR')}</span>
                  {item.lastReviewedAt && (
                    <span>
                      Son Tekrar: {new Date(item.lastReviewedAt).toLocaleDateString('tr-TR')}
                    </span>
                  )}
                </div>

                <div className="card-actions justify-end gap-2">
                  <button
                    onClick={() => handleReview(item.id)}
                    className="btn btn-sm btn-primary gap-1"
                  >
                    <RefreshCw size={14} />
                    Tekrar Et
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn btn-sm btn-ghost text-error gap-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

