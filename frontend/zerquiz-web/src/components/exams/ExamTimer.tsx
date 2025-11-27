import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface ExamTimerProps {
  initialSeconds: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export default function ExamTimer({ initialSeconds, onTimeUp, isPaused = false }: ExamTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    setRemainingSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, onTimeUp]);

  useEffect(() => {
    const warningThreshold = initialSeconds * 0.25; // %25 kaldı
    const criticalThreshold = initialSeconds * 0.10; // %10 kaldı

    setIsWarning(remainingSeconds <= warningThreshold && remainingSeconds > criticalThreshold);
    setIsCritical(remainingSeconds <= criticalThreshold);
  }, [remainingSeconds, initialSeconds]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    return (remainingSeconds / initialSeconds) * 100;
  };

  const getTimerColor = (): string => {
    if (isCritical) return 'text-red-600';
    if (isWarning) return 'text-orange-600';
    return 'text-blue-600';
  };

  const getProgressColor = (): string => {
    if (isCritical) return 'bg-red-600';
    if (isWarning) return 'bg-orange-600';
    return 'bg-blue-600';
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className={`h-5 w-5 ${getTimerColor()}`} />
          <span className="text-sm font-medium text-gray-700">Kalan Süre</span>
        </div>
        {(isWarning || isCritical) && (
          <AlertTriangle className={`h-5 w-5 ${isCritical ? 'text-red-600' : 'text-orange-600'} animate-pulse`} />
        )}
      </div>

      <div className={`text-3xl font-bold font-mono ${getTimerColor()}`}>
        {formatTime(remainingSeconds)}
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getProgressColor()} transition-all duration-1000`}
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      {/* Warning Messages */}
      {isCritical && (
        <div className="mt-3 text-xs text-red-600 font-medium flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Süreniz bitmek üzere!
        </div>
      )}
      {isWarning && !isCritical && (
        <div className="mt-3 text-xs text-orange-600 font-medium">
          ⚠️ Sürenizin %25'inden azı kaldı
        </div>
      )}
    </div>
  );
}

