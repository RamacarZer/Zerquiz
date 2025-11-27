import React from 'react';
import { Cpu, HardDrive, Activity, Clock, Zap } from 'lucide-react';
import { SystemHealth } from '../../mocks/dashboardDemoData';

interface SystemHealthCardProps {
  health: SystemHealth;
}

export default function SystemHealthCard({ health }: SystemHealthCardProps) {
  const getStatusColor = (status: SystemHealth['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
    }
  };

  const getStatusLabel = (status: SystemHealth['status']) => {
    switch (status) {
      case 'healthy':
        return '✓ Sağlıklı';
      case 'warning':
        return '⚠ Uyarı';
      case 'critical':
        return '✗ Kritik';
    }
  };

  const getBarColor = (value: number) => {
    if (value < 50) return 'bg-green-500';
    if (value < 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatUptime = (hours: number) => {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (days > 0) {
      return `${days} gün ${remainingHours} saat`;
    }
    return `${remainingHours} saat`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          Sistem Sağlığı
        </h3>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(health.status)}`}>
          {getStatusLabel(health.status)}
        </span>
      </div>

      <div className="space-y-4">
        {/* CPU */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">CPU Kullanımı</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{health.cpu}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getBarColor(health.cpu)} transition-all duration-500`}
              style={{ width: `${health.cpu}%` }}
            />
          </div>
        </div>

        {/* Memory */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Bellek Kullanımı</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{health.memory}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getBarColor(health.memory)} transition-all duration-500`}
              style={{ width: `${health.memory}%` }}
            />
          </div>
        </div>

        {/* Disk */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Disk Kullanımı</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{health.disk}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getBarColor(health.disk)} transition-all duration-500`}
              style={{ width: `${health.disk}%` }}
            />
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">Uptime</span>
            </div>
            <div className="text-sm font-bold text-blue-900">{formatUptime(health.uptime)}</div>
          </div>

          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <Zap className="h-4 w-4" />
              <span className="text-xs font-medium">Yanıt Süresi</span>
            </div>
            <div className="text-sm font-bold text-green-900">{health.responseTime}ms</div>
          </div>
        </div>
      </div>
    </div>
  );
}

