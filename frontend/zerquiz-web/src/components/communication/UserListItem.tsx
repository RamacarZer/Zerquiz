import React from 'react';
import { User } from '../../mocks/communicationDataAdvanced';

interface UserListItemProps {
  user: User;
  isOnline?: boolean;
  onClick?: () => void;
  showStatus?: boolean;
}

export const UserListItem: React.FC<UserListItemProps> = ({
  user,
  isOnline = true,
  onClick,
  showStatus = true,
}) => {
  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
    }
  };

  const getStatusText = (status: User['status']) => {
    switch (status) {
      case 'online': return 'Çevrimiçi';
      case 'away': return 'Uzakta';
      case 'busy': return 'Meşgul';
      case 'offline': return 'Çevrimdışı';
    }
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
    >
      <div className="relative">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {user.name.charAt(0)}
          </div>
        )}
        {showStatus && (
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-white`}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">{user.name}</div>
        <div className="text-sm text-gray-600 truncate">{user.role}</div>
      </div>
      {showStatus && (
        <div className="text-xs text-gray-500">{getStatusText(user.status)}</div>
      )}
    </div>
  );
};

