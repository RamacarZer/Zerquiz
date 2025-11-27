import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import { Button } from '../ui/button';
import { 
  Video, 
  Square, 
  Pause, 
  Play, 
  Download, 
  Trash2, 
  Mic, 
  MicOff,
  Camera,
  CameraOff,
  Monitor
} from 'lucide-react';

interface VideoRecorderProps {
  onRecordingComplete?: (blob: Blob, url: string) => void;
  recordingMode?: 'camera' | 'screen' | 'both';
  includeAudio?: boolean;
  maxDuration?: number; // seconds
  height?: number;
}

export default function VideoRecorder({
  onRecordingComplete,
  recordingMode = 'camera',
  includeAudio = true,
  maxDuration = 600, // 10 minutes default
  height = 400,
}: VideoRecorderProps) {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<RecordRTC | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(includeAudio);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= maxDuration) {
          handleStopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  }, [maxDuration]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleStartRecording = useCallback(async () => {
    try {
      let stream: MediaStream;

      if (recordingMode === 'screen') {
        // Screen recording
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: 'screen' } as any,
          audio: isAudioEnabled,
        });
      } else if (recordingMode === 'camera') {
        // Camera recording
        stream = await navigator.mediaDevices.getUserMedia({
          video: isCameraEnabled,
          audio: isAudioEnabled,
        });
      } else {
        // Both screen and camera
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: 'screen' } as any,
          audio: false,
        });
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: isCameraEnabled,
          audio: isAudioEnabled,
        });
        
        // Combine streams
        const videoTrack = screenStream.getVideoTracks()[0];
        const audioTrack = cameraStream.getAudioTracks()[0];
        stream = new MediaStream([videoTrack, audioTrack]);
      }

      const recorder = new RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/webm',
        bitsPerSecond: 128000,
        video: {
          width: 1920,
          height: 1080,
        },
        timeSlice: 1000,
        ondataavailable: (blob: Blob) => {
          // Real-time data processing if needed
        },
      });

      recorder.startRecording();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);
      startTimer();
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Kayıt başlatılamadı. Lütfen kamera/mikrofon izinlerini kontrol edin.');
    }
  }, [recordingMode, isCameraEnabled, isAudioEnabled, startTimer]);

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

        if (onRecordingComplete) {
          onRecordingComplete(blob, url);
        }

        // Stop all tracks
        mediaRecorderRef.current!.stream.getTracks().forEach((track) => track.stop());
      });
    }
  }, [onRecordingComplete, stopTimer]);

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

  const handleDownload = useCallback(() => {
    if (recordedUrl) {
      const a = document.createElement('a');
      a.href = recordedUrl;
      a.download = `recording-${Date.now()}.webm`;
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

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
      <div className="flex items-center justify-between p-3 bg-gray-100 border-b border-gray-300">
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-gray-700">Video Kayıt</span>
          {isRecording && (
            <span className="flex items-center gap-2 ml-4">
              <span className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-red-600 font-mono font-bold">
                {formatTime(recordingTime)} / {formatTime(maxDuration)}
              </span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCameraEnabled(!isCameraEnabled)}
            disabled={isRecording}
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
            disabled={isRecording}
          >
            {isAudioEnabled ? (
              <Mic className="h-4 w-4" />
            ) : (
              <MicOff className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="p-4" style={{ height: `${height}px` }}>
        {recordedUrl ? (
          <div className="w-full h-full">
            <video
              src={recordedUrl}
              controls
              className="w-full h-full rounded-lg bg-black"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
            {recordingMode === 'camera' && isCameraEnabled ? (
              <Webcam
                ref={webcamRef}
                audio={false}
                className="w-full h-full rounded-lg"
                mirrored
              />
            ) : (
              <div className="text-center text-gray-400">
                <Monitor className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Kayıt başlatmaya hazır</p>
                <p className="text-sm mt-2">
                  {recordingMode === 'screen' && 'Ekran kaydı yapılacak'}
                  {recordingMode === 'camera' && 'Kamera kaydı yapılacak'}
                  {recordingMode === 'both' && 'Ekran ve kamera kaydı yapılacak'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-3 bg-gray-100 border-t border-gray-300">
        <div className="flex items-center gap-2">
          {!isRecording && !recordedUrl && (
            <Button
              variant="default"
              onClick={handleStartRecording}
              className="bg-red-600 hover:bg-red-700"
            >
              <Video className="h-4 w-4 mr-2" />
              Kaydı Başlat
            </Button>
          )}

          {isRecording && (
            <>
              <Button
                variant="outline"
                onClick={handlePauseResume}
              >
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Devam Et
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
                onClick={handleStopRecording}
              >
                <Square className="h-4 w-4 mr-2" />
                Kaydı Durdur
              </Button>
            </>
          )}

          {recordedUrl && (
            <>
              <Button
                variant="default"
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                İndir
              </Button>
              <Button
                variant="outline"
                onClick={handleDiscard}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Sil
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  handleDiscard();
                  setTimeout(handleStartRecording, 100);
                }}
              >
                <Video className="h-4 w-4 mr-2" />
                Yeniden Kaydet
              </Button>
            </>
          )}
        </div>

        {recordedBlob && (
          <div className="text-sm text-gray-600">
            Dosya boyutu: {(recordedBlob.size / 1024 / 1024).toFixed(2)} MB
          </div>
        )}
      </div>
    </div>
  );
}

