import React from 'react';
import { Conversation, User } from '../../mocks/communicationDataAdvanced';
import { Pin, Volume2, VolumeX } from 'lucide-react';

interface ConversationListItemProps {
  conversation: Conversation;
  participants: User[];
  currentUser: User;
  isActive?: boolean;
  onClick?: () => void;
}

export const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  participants,
  currentUser,
  isActive = false,
  onClick,
}) => {
  const otherParticipants = participants.filter(p => p.id !== currentUser.id);
  const displayName = conversation.name || otherParticipants.map(p => p.name).join(', ');
  
  const getConversationIcon = () => {
    if (conversation.type === 'group') return '👥';
    if (conversation.type === 'channel') return '📢';
    return otherParticipants[0]?.name?.charAt(0) || '?';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Şimdi';
    if (diffMins < 60) return `${diffMins}d önce`;
    if (diffHours < 24) return `${diffHours}s önce`;
    if (diffDays === 1) return 'Dün';
    if (diffDays < 7) return `${diffDays} gün önce`;
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition ${
        isActive ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
      }`}
    >
      <div className="relative flex-shrink-0">
        {conversation.type === 'direct' && otherParticipants[0] ? (
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {otherParticipants[0].name.charAt(0)}
          </div>
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xl">
            {getConversationIcon()}
          </div>
        )}
        {conversation.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className={`font-semibold truncate ${conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
              {displayName}
            </span>
            {conversation.isPinned && <Pin className="h-3 w-3 text-blue-600" />}
            {conversation.isMuted && <VolumeX className="h-3 w-3 text-gray-400" />}
          </div>
          <span className="text-xs text-gray-500 flex-shrink-0">
            {formatTime(conversation.lastMessageAt)}
          </span>
        </div>

        {conversation.lastMessage && (
          <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
            {conversation.lastMessage.content}
          </p>
        )}

        {conversation.description && !conversation.lastMessage && (
          <p className="text-xs text-gray-500 truncate">{conversation.description}</p>
        )}
      </div>
    </div>
  );
};

