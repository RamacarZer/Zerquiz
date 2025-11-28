import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Cloud, CloudOff, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

interface OfflineStatusBarProps {
  className?: string;
}

export function OfflineStatusBar({ className = '' }: OfflineStatusBarProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Simulate auto-sync when coming back online
      syncPendingChanges();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Simulate pending changes (in real app, this would come from IndexedDB)
    const interval = setInterval(() => {
      if (!isOnline && Math.random() > 0.7) {
        setPendingChanges(prev => prev + 1);
      }
    }, 3000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [isOnline]);

  const syncPendingChanges = async () => {
    if (pendingChanges === 0) return;
    
    setIsSyncing(true);
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastSync(new Date());
    setPendingChanges(0);
    setIsSyncing(false);
  };

  const handleManualSync = () => {
    if (isOnline && !isSyncing) {
      syncPendingChanges();
    }
  };

  if (isOnline && pendingChanges === 0 && !isSyncing) {
    // Don't show bar when online and everything is synced
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${className}`}
    >
      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-yellow-500 text-white px-4 py-2 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <WifiOff className="h-5 w-5 animate-pulse" />
            <span className="font-medium">Çevrimdışı Mod Aktif</span>
            <span className="text-sm opacity-90">
              - Değişiklikleriniz cihazınıza kaydediliyor
            </span>
          </div>
          {pendingChanges > 0 && (
            <div className="flex items-center gap-2 bg-yellow-600 px-3 py-1 rounded-full">
              <CloudOff className="h-4 w-4" />
              <span className="text-sm font-semibold">{pendingChanges} senkronize edilmemiş değişiklik</span>
            </div>
          )}
        </div>
      )}

      {/* Syncing Banner */}
      {isSyncing && (
        <div className="bg-blue-500 text-white px-4 py-2 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span className="font-medium">Senkronize ediliyor...</span>
            <span className="text-sm opacity-90">
              {pendingChanges} değişiklik sunucuya gönderiliyor
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-blue-400 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {isOnline && !isSyncing && lastSync && (
        <div className="bg-green-500 text-white px-4 py-2 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Tüm değişiklikler senkronize edildi</span>
            <span className="text-sm opacity-90">
              Son senkronizasyon: {lastSync.toLocaleTimeString('tr-TR')}
            </span>
          </div>
          <button
            onClick={handleManualSync}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="text-sm">Manuel Senkronize</span>
          </button>
        </div>
      )}

      {/* Pending Changes Warning (when online but have pending changes) */}
      {isOnline && pendingChanges > 0 && !isSyncing && (
        <div className="bg-orange-500 text-white px-4 py-2 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">{pendingChanges} değişiklik senkronize edilmeyi bekliyor</span>
          </div>
          <button
            onClick={handleManualSync}
            className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="text-sm">Şimdi Senkronize Et</span>
          </button>
        </div>
      )}
    </div>
  );
}


