import React from 'react';
import { Clock } from 'lucide-react';
import { RecentActivity } from '../../mocks/dashboardDemoData';

interface RecentActivitiesProps {
  activities: RecentActivity[];
  limit?: number;
}

export default function RecentActivities({ activities, limit = 10 }: RecentActivitiesProps) {
  const displayedActivities = activities.slice(0, limit);

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-600';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      case 'red':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Az önce';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    return `${diffDays} gün önce`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Son Aktiviteler
        </h3>
        <span className="text-xs text-gray-500">{activities.length} aktivite</span>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {displayedActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
          >
            {/* Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${getColorClasses(activity.color)} flex items-center justify-center text-lg`}>
              {activity.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 mb-1">
                {activity.title}
              </p>
              <p className="text-xs text-gray-600 line-clamp-2">
                {activity.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(activity.timestamp)}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{activity.user}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length > limit && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Tümünü Gör ({activities.length - limit} daha)
          </button>
        </div>
      )}
    </div>
  );
}

