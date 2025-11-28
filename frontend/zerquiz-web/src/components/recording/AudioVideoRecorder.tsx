import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, Video, Square, Play, Pause, RotateCcw, Upload, Download,
  Volume2, VideoOff, MicOff, Clock, FileAudio, FileVideo, Check, X
} from 'lucide-react';

interface AudioVideoRecorderProps {
  questionId?: string;
  maxDuration?: number; // seconds
  recordingType?: 'audio' | 'video' | 'both';
  onComplete?: (blob: Blob, type: 'audio' | 'video') => void;
}

export function AudioVideoRecorder({
  questionId = 'demo',
  maxDuration = 300, // 5 minutes default
  recordingType = 'both',
  onComplete,
}: AudioVideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedMode, setSelectedMode] = useState<'audio' | 'video'>('audio');
  const [hasPermission, setHasPermission] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const audioPreviewRef = useRef<HTMLAudioElement>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const requestPermission = async () => {
    try {
      const constraints = selectedMode === 'video' 
        ? { video: true, audio: true } 
        : { audio: true };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setHasPermission(true);

      if (selectedMode === 'video' && videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }

      return stream;
    } catch (error) {
      alert('Mikrofon/kamera erişimi reddedildi. Lütfen tarayıcı izinlerini kontrol edin.');
      return null;
    }
  };

  const startRecording = async () => {
    let stream = streamRef.current;
    if (!stream) {
      stream = await requestPermission();
      if (!stream) return;
    }

    chunksRef.current = [];
    const mimeType = selectedMode === 'video' ? 'video/webm' : 'audio/webm';
    const mediaRecorder = new MediaRecorder(stream, { mimeType });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      setRecordedBlob(blob);
      if (onComplete) {
        onComplete(blob, selectedMode);
      }
    };

    mediaRecorder.start(100); // Collect data every 100ms
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    setRecordingTime(0);

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        const newTime = prev + 1;
        if (newTime >= maxDuration) {
          stopRecording();
          return maxDuration;
        }
        return newTime;
      });
    }, 1000);
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newTime;
        });
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resetRecording = () => {
    setRecordedBlob(null);
    setRecordingTime(0);
    setIsPlaying(false);
    chunksRef.current = [];
  };

  const playRecording = () => {
    if (!recordedBlob) return;

    const url = URL.createObjectURL(recordedBlob);
    if (selectedMode === 'video' && videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
      videoPreviewRef.current.src = url;
      videoPreviewRef.current.play();
      setIsPlaying(true);
    } else if (selectedMode === 'audio' && audioPreviewRef.current) {
      audioPreviewRef.current.src = url;
      audioPreviewRef.current.play();
      setIsPlaying(true);
    }
  };

  const downloadRecording = () => {
    if (!recordedBlob) return;

    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${questionId}_${selectedMode}_${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uploadRecording = () => {
    if (!recordedBlob) return;
    // In real app: Upload to server
    alert(`${selectedMode.toUpperCase()} kaydı sunucuya yükleniyor... (${(recordedBlob.size / 1024 / 1024).toFixed(2)} MB) [Demo]`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (recordingTime / maxDuration) * 100;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sesli/Video Cevap</h2>
        <p className="text-gray-600">Soruyu sesli veya video ile cevaplayın</p>
      </div>

      {/* Mode Selection */}
      {recordingType === 'both' && !isRecording && !recordedBlob && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Kayıt Türü</label>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedMode('audio')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                selectedMode === 'audio'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <Mic className="h-5 w-5" />
              <span className="font-medium">Sadece Ses</span>
            </button>
            <button
              onClick={() => setSelectedMode('video')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                selectedMode === 'video'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <Video className="h-5 w-5" />
              <span className="font-medium">Video + Ses</span>
            </button>
          </div>
        </div>
      )}

      {/* Preview Area */}
      <div className="mb-6">
        {selectedMode === 'video' ? (
          <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <video
              ref={videoPreviewRef}
              className="w-full h-full object-cover"
              muted={isRecording}
              onEnded={() => setIsPlaying(false)}
            />
            {!hasPermission && !recordedBlob && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                <div className="text-center text-white">
                  <VideoOff className="h-16 w-16 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">Kamera önizlemesi</p>
                  <p className="text-sm opacity-75">Kayda başlamak için izin verin</p>
                </div>
              </div>
            )}
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="font-medium">KAYIT</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-12 flex flex-col items-center justify-center text-white" style={{ aspectRatio: '16/9' }}>
            {isRecording ? (
              <>
                <div className="relative mb-6">
                  <Mic className="h-24 w-24" />
                  <div className="absolute inset-0 animate-ping">
                    <Mic className="h-24 w-24 opacity-75" />
                  </div>
                </div>
                <p className="text-2xl font-bold">Kayıt Yapılıyor...</p>
              </>
            ) : recordedBlob ? (
              <>
                <FileAudio className="h-24 w-24 mb-4" />
                <p className="text-xl font-bold">Ses Kaydı Hazır</p>
                <p className="text-sm opacity-90 mt-2">{formatTime(recordingTime)}</p>
                <audio ref={audioPreviewRef} onEnded={() => setIsPlaying(false)} className="hidden" />
              </>
            ) : (
              <>
                <Mic className="h-24 w-24 mb-4 opacity-75" />
                <p className="text-xl font-bold">Ses Kaydı Modu</p>
                <p className="text-sm opacity-90 mt-2">Başlamak için Kayda Başla'ya tıklayın</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Recording Timer & Progress */}
      {(isRecording || recordedBlob) && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="h-5 w-5" />
              <span className="text-2xl font-bold font-mono">{formatTime(recordingTime)}</span>
              <span className="text-sm text-gray-500">/ {formatTime(maxDuration)}</span>
            </div>
            {recordedBlob && (
              <span className="text-sm text-gray-600">
                Dosya Boyutu: {(recordedBlob.size / 1024 / 1024).toFixed(2)} MB
              </span>
            )}
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                progressPercentage >= 90 ? 'bg-red-500' : progressPercentage >= 70 ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          {progressPercentage >= 90 && isRecording && (
            <p className="text-sm text-red-600 mt-1 font-medium">⚠️ Süre dolmak üzere!</p>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {!isRecording && !recordedBlob && (
          <button
            onClick={startRecording}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            {selectedMode === 'video' ? <Video className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            Kayda Başla
          </button>
        )}

        {isRecording && !isPaused && (
          <>
            <button
              onClick={pauseRecording}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
            >
              <Pause className="h-5 w-5" />
              Duraklat
            </button>
            <button
              onClick={stopRecording}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-colors"
            >
              <Square className="h-5 w-5" />
              Durdur
            </button>
          </>
        )}

        {isRecording && isPaused && (
          <>
            <button
              onClick={resumeRecording}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Play className="h-5 w-5" />
              Devam Et
            </button>
            <button
              onClick={stopRecording}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-colors"
            >
              <Square className="h-5 w-5" />
              Durdur
            </button>
          </>
        )}

        {recordedBlob && (
          <>
            <button
              onClick={playRecording}
              disabled={isPlaying}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              <Play className="h-5 w-5" />
              {isPlaying ? 'Oynatılıyor...' : 'Dinle/İzle'}
            </button>
            <button
              onClick={resetRecording}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              title="Yeniden Kaydet"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
            <button
              onClick={downloadRecording}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              title="İndir"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={uploadRecording}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              <Upload className="h-5 w-5" />
              Cevabı Gönder
            </button>
          </>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>💡 İpucu:</strong> En iyi sonuç için sessiz bir ortamda kayıt yapın. 
          {selectedMode === 'video' && ' Kameranızın önünde ortalanmış şekilde oturun. '}
          Maksimum kayıt süresi: {Math.floor(maxDuration / 60)} dakika.
        </p>
      </div>
    </div>
  );
}

// Demo Page
export function AudioVideoRecorderDemoPage() {
  const [recordings, setRecordings] = useState<Array<{ id: string; type: 'audio' | 'video'; size: number; timestamp: string }>>([]);

  const handleComplete = (blob: Blob, type: 'audio' | 'video') => {
    const newRecording = {
      id: `rec-${Date.now()}`,
      type,
      size: blob.size,
      timestamp: new Date().toISOString(),
    };
    setRecordings(prev => [newRecording, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sesli/Video Cevap Demo</h1>
          <p className="text-gray-600">
            Yabancı dil, sunum değerlendirme ve oral exam soruları için ses/video kayıt arayüzü
          </p>
        </div>

        <AudioVideoRecorder
          questionId="q-demo-001"
          maxDuration={180}
          recordingType="both"
          onComplete={handleComplete}
        />

        {/* Recordings History */}
        {recordings.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Kayıt Geçmişi ({recordings.length})</h2>
            <div className="space-y-3">
              {recordings.map(rec => (
                <div key={rec.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {rec.type === 'video' ? (
                      <FileVideo className="h-6 w-6 text-purple-600" />
                    ) : (
                      <FileAudio className="h-6 w-6 text-blue-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {rec.type === 'video' ? 'Video' : 'Ses'} Kaydı
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(rec.timestamp).toLocaleString('tr-TR')} • {(rec.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Check className="h-5 w-5 text-green-600" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
