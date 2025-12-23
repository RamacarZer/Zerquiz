import { useState, useEffect } from 'react';
import { X, Volume2, BookmarkPlus, ExternalLink, Star } from 'lucide-react';

interface DictionaryEntry {
  word: string;
  phonetic?: string;
  audioUrl?: string;
  partOfSpeech?: string;
  definition: string;
  translation?: string;
  synonyms?: string[];
  antonyms?: string[];
  exampleSentences?: string[];
  imageUrl?: string;
}

interface DictionaryPopupProps {
  word: string;
  position: { x: number; y: number };
  onClose: () => void;
  onAddToVocabulary?: (word: string) => void;
}

export default function DictionaryPopup({ word, position, onClose, onAddToVocabulary }: DictionaryPopupProps) {
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDefinition = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:5011/api/dictionary/lookup?word=${encodeURIComponent(word)}&lang=tr`
        );

        if (response.ok) {
          const data = await response.json();
          setEntry(data);
        } else {
          // Fallback to external API or mock data
          setEntry({
            word: word,
            definition: `"${word}" kelimesinin tanımı bulunamadı.`,
            translation: 'Çeviri mevcut değil',
          });
        }
      } catch (err) {
        console.error('Error fetching dictionary entry:', err);
        setError('Sözlük verisi alınamadı.');
      } finally {
        setLoading(false);
      }
    };

    if (word) {
      fetchDefinition();
    }
  }, [word]);

  const handlePlayAudio = () => {
    if (entry?.audioUrl) {
      const audio = new Audio(entry.audioUrl);
      audio.play();
    } else {
      // Fallback to Web Speech API
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'tr-TR';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAddToVocabulary = () => {
    if (onAddToVocabulary) {
      onAddToVocabulary(word);
    }
  };

  // Calculate position to keep popup within viewport
  const popupStyle: React.CSSProperties = {
    position: 'fixed',
    left: Math.min(position.x, window.innerWidth - 400),
    top: Math.min(position.y + 20, window.innerHeight - 400),
    zIndex: 9999,
  };

  return (
    <div style={popupStyle} className="w-96 max-h-[500px] overflow-y-auto">
      <div className="card bg-white shadow-2xl border border-gray-200">
        <div className="card-body p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {word}
                <button
                  onClick={handlePlayAudio}
                  className="btn btn-circle btn-ghost btn-sm"
                  title="Telaffuz"
                >
                  <Volume2 size={16} />
                </button>
              </h3>
              {entry?.phonetic && (
                <p className="text-sm text-gray-500 italic">{entry.phonetic}</p>
              )}
              {entry?.partOfSpeech && (
                <span className="badge badge-outline badge-sm mt-1">{entry.partOfSpeech}</span>
              )}
            </div>
            <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
              <X size={18} />
            </button>
          </div>

          {loading && (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {!loading && entry && (
            <>
              {/* Translation */}
              {entry.translation && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 text-sm mb-1">Çeviri:</h4>
                  <p className="text-blue-600 font-medium">{entry.translation}</p>
                </div>
              )}

              {/* Definition */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 text-sm mb-1">Tanım:</h4>
                <p className="text-gray-800">{entry.definition}</p>
              </div>

              {/* Example Sentences */}
              {entry.exampleSentences && entry.exampleSentences.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 text-sm mb-2">Örnek Cümleler:</h4>
                  <ul className="space-y-1">
                    {entry.exampleSentences.map((sentence, index) => (
                      <li key={index} className="text-sm text-gray-600 italic">
                        • {sentence}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Synonyms */}
              {entry.synonyms && entry.synonyms.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 text-sm mb-2">Eş Anlamlılar:</h4>
                  <div className="flex flex-wrap gap-2">
                    {entry.synonyms.map((synonym, index) => (
                      <span key={index} className="badge badge-primary badge-outline">
                        {synonym}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Antonyms */}
              {entry.antonyms && entry.antonyms.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 text-sm mb-2">Zıt Anlamlılar:</h4>
                  <div className="flex flex-wrap gap-2">
                    {entry.antonyms.map((antonym, index) => (
                      <span key={index} className="badge badge-secondary badge-outline">
                        {antonym}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Image */}
              {entry.imageUrl && (
                <div className="mb-4">
                  <img
                    src={entry.imageUrl}
                    alt={word}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t">
                <button
                  onClick={handleAddToVocabulary}
                  className="btn btn-primary btn-sm gap-2 flex-1"
                >
                  <BookmarkPlus size={16} />
                  Kelime Defterime Ekle
                </button>
                <a
                  href={`https://sozluk.gov.tr/?word=${encodeURIComponent(word)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-sm gap-2"
                  title="TDK'da Aç"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

