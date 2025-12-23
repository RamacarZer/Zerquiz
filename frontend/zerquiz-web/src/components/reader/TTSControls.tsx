import { Play, Pause, StopCircle, Volume2, Settings2, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface TTSControlsProps {
  isReading: boolean;
  onPlay: () => void;
  onStop: () => void;
  voices: SpeechSynthesisVoice[];
  currentVoice: SpeechSynthesisVoice | null;
  onVoiceChange: (voice: SpeechSynthesisVoice | null) => void;
}

export default function TTSControls({
  isReading,
  onPlay,
  onStop,
  voices,
  currentVoice,
  onVoiceChange,
}: TTSControlsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  const turkishVoices = voices.filter((v) => v.lang.startsWith('tr'));
  const otherVoices = voices.filter((v) => !v.lang.startsWith('tr'));

  return (
    <div className="bg-white border-t shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            {!isReading ? (
              <button
                onClick={onPlay}
                className="btn btn-primary btn-sm gap-2"
                title="Sesli Okumaya Başla"
              >
                <Play size={18} />
                Sesli Oku
              </button>
            ) : (
              <button
                onClick={onStop}
                className="btn btn-error btn-sm gap-2"
                title="Durdur"
              >
                <StopCircle size={18} />
                Durdur
              </button>
            )}

            {isReading && (
              <div className="flex items-center gap-2 ml-4">
                <Volume2 size={18} className="text-blue-600 animate-pulse" />
                <span className="text-sm text-gray-600">Okunuyor...</span>
              </div>
            )}
          </div>

          {/* Voice & Settings */}
          <div className="flex items-center gap-3">
            <div className="dropdown dropdown-top dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-sm gap-2">
                <Settings2 size={18} />
                Ses Ayarları
                <ChevronDown size={16} />
              </label>
              <div
                tabIndex={0}
                className="dropdown-content z-[1] menu p-4 shadow-lg bg-base-100 rounded-box w-80"
              >
                <h3 className="font-semibold mb-3">Ses Ayarları</h3>

                {/* Voice Selection */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Ses Seçimi</span>
                  </label>
                  <select
                    className="select select-bordered select-sm w-full"
                    value={currentVoice?.name || ''}
                    onChange={(e) => {
                      const voice = voices.find((v) => v.name === e.target.value);
                      onVoiceChange(voice || null);
                    }}
                  >
                    <option disabled value="">
                      Ses Seçin
                    </option>
                    {turkishVoices.length > 0 && (
                      <optgroup label="Türkçe Sesler">
                        {turkishVoices.map((voice) => (
                          <option key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang})
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {otherVoices.length > 0 && (
                      <optgroup label="Diğer Sesler">
                        {otherVoices.slice(0, 10).map((voice) => (
                          <option key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang})
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>

                {/* Rate Control */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Hız</span>
                    <span className="label-text-alt">{rate}x</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="range range-primary range-sm"
                  />
                  <div className="w-full flex justify-between text-xs px-2 mt-1">
                    <span>0.5x</span>
                    <span>1x</span>
                    <span>2x</span>
                  </div>
                </div>

                {/* Pitch Control */}
                <div className="form-control mb-2">
                  <label className="label">
                    <span className="label-text font-medium">Ton</span>
                    <span className="label-text-alt">{pitch}</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={pitch}
                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                    className="range range-secondary range-sm"
                  />
                </div>

                <div className="alert alert-info mt-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current shrink-0 w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span className="text-xs">
                    Ayarlar otomatik uygulanır. Tekrar okutmayı deneyin.
                  </span>
                </div>
              </div>
            </div>

            {currentVoice && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Ses:</span> {currentVoice.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

