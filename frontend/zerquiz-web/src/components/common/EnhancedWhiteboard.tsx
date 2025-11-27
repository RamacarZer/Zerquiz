import React, { useState, useRef, useCallback } from 'react';
import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import Webcam from 'react-webcam';
import RecordRTC from 'recordrtc';
import { Button } from '../ui/button';
import { 
  Download, 
  Trash2, 
  Save,
  Video,
  Square,
  Pause,
  Play,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Grid3x3,
  Maximize2
} from 'lucide-react';

interface EnhancedWhiteboardProps {
  questionContent?: string; // HTML content of question
  onSave?: (snapshot: any, videoBlob?: Blob) => void;
  onExport?: (dataUrl: string) => void;
  initialData?: any;
  height?: number;
  readonly?: boolean;
  showToolbar?: boolean;
  enableVideo?: boolean;
}

type GridPosition = 
  | 'top-left' | 'top-center' | 'top-right'
  | 'middle-left' | 'middle-center' | 'middle-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export default function EnhancedWhiteboard({
  questionContent,
  onSave,
  onExport,
  initialData,
  height = 600,
  readonly = false,
  showToolbar = true,
  enableVideo = true,
}: EnhancedWhiteboardProps) {
  const editorRef = useRef<any>(null);
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<RecordRTC | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  // States
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [questionPosition, setQuestionPosition] = useState<GridPosition>('middle-center');
  const [showPositionGrid, setShowPositionGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Grid positions CSS
  const getPositionClass = (position: GridPosition): string => {
    const positions: Record<GridPosition, string> = {
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'middle-left': 'top-1/2 -translate-y-1/2 left-4',
      'middle-center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      'middle-right': 'top-1/2 -translate-y-1/2 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
    };
    return positions[position];
  };

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Combine Tldraw canvas and webcam into single stream
  const combineStreams = async (): Promise<MediaStream> => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Canvas not ready');

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    // Set canvas size
    canvas.width = 1920;
    canvas.height = 1080;

    // Get Tldraw canvas
    const tldrawCanvas = document.querySelector('.tl-canvas') as HTMLCanvasElement;
    
    // Start drawing loop
    const drawFrame = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Tldraw content
      if (tldrawCanvas) {
        ctx.drawImage(tldrawCanvas, 0, 0, canvas.width, canvas.height);
      }
      
      // Draw webcam if enabled
      if (isCameraEnabled && webcamRef.current?.video) {
        const video = webcamRef.current.video;
        // Draw webcam in corner (200x150px)
        ctx.drawImage(video, canvas.width - 220, 20, 200, 150);
      }
      
      animationFrameRef.current = requestAnimationFrame(drawFrame);
    };
    
    drawFrame();

    // Create stream from canvas
    const canvasStream = canvas.captureStream(30); // 30 FPS
    
    // Add audio if enabled
    if (isAudioEnabled) {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStream.getAudioTracks().forEach(track => canvasStream.addTrack(track));
    }
    
    return canvasStream;
  };

  const handleStartRecording = useCallback(async () => {
    try {
      const combinedStream = await combineStreams();
      
      const recorder = new RecordRTC(combinedStream, {
        type: 'video',
        mimeType: 'video/webm',
        bitsPerSecond: 256000,
      });

      recorder.startRecording();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);
      startTimer();
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Kayıt başlatılamadı. Lütfen izinleri kontrol edin.');
    }
  }, [isCameraEnabled, isAudioEnabled, startTimer]);

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stopRecording(() => {
        const blob = mediaRecorderRef.current!.getBlob();
        const url = URL.createObjectURL(blob);
        setRecordedBlob(blob);
        setRecordedUrl(url);
        setIsRecording(false);
        setIsPaused(false);
        stopTimer();
        
        // Stop animation frame
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        // Stop all tracks
        mediaRecorderRef.current!.stream.getTracks().forEach((track) => track.stop());
      });
    }
  }, [stopTimer]);

  const handlePauseResume = useCallback(() => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resumeRecording();
        startTimer();
      } else {
        mediaRecorderRef.current.pauseRecording();
        stopTimer();
      }
      setIsPaused(!isPaused);
    }
  }, [isPaused, startTimer, stopTimer]);

  const handleSave = () => {
    if (editorRef.current && onSave) {
      const snapshot = editorRef.current.store.getSnapshot();
      onSave(snapshot, recordedBlob || undefined);
    }
  };

  const handleExport = async () => {
    if (editorRef.current && onExport) {
      try {
        const svg = await editorRef.current.getSvg();
        if (svg) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          const svgBlob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(svgBlob);

          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            onExport(dataUrl);
            URL.revokeObjectURL(url);
          };

          img.src = url;
        }
      } catch (error) {
        console.error('Export failed:', error);
      }
    }
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.selectAll();
      editorRef.current.deleteShapes(editorRef.current.getSelectedShapeIds());
    }
  };

  const handleDownload = useCallback(() => {
    if (recordedUrl) {
      const a = document.createElement('a');
      a.href = recordedUrl;
      a.download = `whiteboard-recording-${Date.now()}.webm`;
      a.click();
    }
  }, [recordedUrl]);

  const handleDiscard = useCallback(() => {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    setRecordedBlob(null);
    setRecordedUrl(null);
    setRecordingTime(0);
  }, [recordedUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const gridPositions: GridPosition[] = [
    'top-left', 'top-center', 'top-right',
    'middle-left', 'middle-center', 'middle-right',
    'bottom-left', 'bottom-center', 'bottom-right',
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-300">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={readonly}
            >
              <Save className="h-4 w-4 mr-2" />
              Kaydet
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              PNG İndir
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={readonly}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Temizle
            </Button>
            
            {questionContent && (
              <>
                <div className="h-6 w-px bg-gray-300 mx-2" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPositionGrid(!showPositionGrid)}
                >
                  <Grid3x3 className="h-4 w-4 mr-2" />
                  Konum
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  <Maximize2 className="h-4 w-4 mr-2" />
                  {isFullscreen ? 'Normal' : 'Tam Ekran'}
                </Button>
              </>
            )}
          </div>

          {enableVideo && (
            <div className="flex items-center gap-2">
              {!isRecording && !recordedUrl && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCameraEnabled(!isCameraEnabled)}
                  >
                    {isCameraEnabled ? (
                      <Camera className="h-4 w-4" />
                    ) : (
                      <CameraOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  >
                    {isAudioEnabled ? (
                      <Mic className="h-4 w-4" />
                    ) : (
                      <MicOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleStartRecording}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Kayıt Başlat
                  </Button>
                </>
              )}

              {isRecording && (
                <>
                  <span className="text-sm font-mono text-red-600">
                    🔴 {formatTime(recordingTime)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePauseResume}
                  >
                    {isPaused ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Devam
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Duraklat
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleStopRecording}
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Durdur
                  </Button>
                </>
              )}

              {recordedUrl && (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleDownload}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    İndir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDiscard}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Sil
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative" style={{ height: `${height}px` }}>
        {/* Hidden canvas for recording */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Hidden webcam for video capture */}
        {enableVideo && isCameraEnabled && (
          <Webcam
            ref={webcamRef}
            audio={false}
            className="hidden"
            mirrored
          />
        )}

        {/* Question Content Overlay (Transparent Background) */}
        {questionContent && (
          <>
            <div
              className={`absolute ${getPositionClass(questionPosition)} max-w-2xl bg-white/90 backdrop-blur-sm border-2 border-blue-500 rounded-lg shadow-lg p-4 z-10 transition-all duration-300 ${
                isFullscreen ? 'max-w-full w-full h-full' : ''
              }`}
            >
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: questionContent }}
              />
            </div>

            {/* Position Grid Overlay */}
            {showPositionGrid && (
              <div className="absolute inset-0 z-20 bg-black/50 grid grid-cols-3 grid-rows-3 gap-2 p-2">
                {gridPositions.map((pos) => (
                  <button
                    key={pos}
                    onClick={() => {
                      setQuestionPosition(pos);
                      setShowPositionGrid(false);
                    }}
                    className={`border-2 border-white/50 rounded-lg hover:bg-white/20 transition flex items-center justify-center text-white text-sm ${
                      questionPosition === pos ? 'bg-blue-500/50 border-blue-500' : ''
                    }`}
                  >
                    {pos.split('-').map(w => w[0].toUpperCase()).join('')}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Tldraw Whiteboard (Transparent for drawing over question) */}
        <div className={`w-full h-full ${questionContent ? 'bg-transparent' : 'bg-white'}`}>
          <Tldraw
            onMount={(editor) => {
              editorRef.current = editor;
              if (initialData) {
                editor.store.loadSnapshot(initialData);
              }
            }}
            inferDarkMode={false}
          />
        </div>

        {/* Webcam Preview (Corner) */}
        {enableVideo && isCameraEnabled && isRecording && (
          <div className="absolute top-4 right-4 w-48 h-36 border-2 border-white rounded-lg overflow-hidden shadow-lg z-30">
            <Webcam
              audio={false}
              className="w-full h-full object-cover"
              mirrored
            />
          </div>
        )}

        {/* Playback Video */}
        {recordedUrl && (
          <div className="absolute inset-0 z-40 bg-black flex items-center justify-center">
            <video
              src={recordedUrl}
              controls
              className="max-w-full max-h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}

