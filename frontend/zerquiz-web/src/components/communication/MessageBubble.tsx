import React, { useState } from 'react';
import { Message, User, Reaction } from '../../mocks/communicationDataAdvanced';
import { MoreVertical, Edit2, Trash2, Reply, Download } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  sender: User;
  currentUser: User;
  onReply?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  sender,
  currentUser,
  onReply,
  onEdit,
  onDelete,
  onReact,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  
  const isOwnMessage = message.senderId === currentUser.id;
  const quickReactions = ['👍', '❤️', '😊', '🎉', '👏', '🔥'];

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderAttachment = (attachment: any) => {
    if (attachment.type === 'document') {
      return (
        <div key={attachment.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded border border-gray-200">
          <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
            📄
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{attachment.name}</div>
            <div className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(0)} KB</div>
          </div>
          <button className="p-2 hover:bg-gray-200 rounded">
            <Download className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      );
    }
    if (attachment.type === 'image') {
      return (
        <div key={attachment.id} className="p-2 bg-gray-50 rounded border border-gray-200">
          <img
            src={attachment.url}
            alt={attachment.name}
            className="rounded-lg max-h-56 object-contain"
          />
          <div className="mt-1 text-xs text-gray-500 flex items-center justify-between">
            <span>{attachment.name}</span>
            <button className="flex items-center gap-1 text-blue-600 hover:underline text-xs">
              <Download className="h-3 w-3" />
              İndir
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} group`}>
      {/* Avatar */}
      {!isOwnMessage && (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {sender.name.charAt(0)}
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        {/* Sender name (only for received messages) */}
        {!isOwnMessage && (
          <div className="text-xs text-gray-600 px-2">{sender.name}</div>
        )}

        {/* Message bubble */}
        <div
          className="relative"
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwnMessage
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-900 rounded-bl-sm'
            }`}
          >
            {/* Reply to indicator */}
            {message.replyTo && (
              <div className={`text-xs mb-2 pb-2 border-l-2 pl-2 ${isOwnMessage ? 'border-blue-300' : 'border-gray-300'}`}>
                Yanıtlandı
              </div>
            )}

            {/* Message content */}
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

            {/* Edited indicator */}
            {message.isEdited && (
              <span className={`text-xs ml-2 ${isOwnMessage ? 'text-blue-200' : 'text-gray-500'}`}>
                (düzenlendi)
              </span>
            )}
          </div>

          {/* Actions menu */}
          {showActions && (
            <div className={`absolute top-0 ${isOwnMessage ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} flex items-center gap-1 px-2`}>
              <button
                onClick={() => setShowReactions(!showReactions)}
                className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50"
                title="Tepki ekle"
              >
                😊
              </button>
              <button
                onClick={() => onReply?.(message)}
                className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50"
                title="Yanıtla"
              >
                <Reply className="h-3 w-3 text-gray-600" />
              </button>
              {isOwnMessage && (
                <>
                  <button
                    onClick={() => onEdit?.(message)}
                    className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50"
                    title="Düzenle"
                  >
                    <Edit2 className="h-3 w-3 text-gray-600" />
                  </button>
                  <button
                    onClick={() => onDelete?.(message.id)}
                    className="p-1.5 bg-white rounded-full shadow-md hover:bg-red-50"
                    title="Sil"
                  >
                    <Trash2 className="h-3 w-3 text-red-600" />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Quick reactions panel */}
          {showReactions && (
            <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex gap-1 z-10">
              {quickReactions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReact?.(message.id, emoji);
                    setShowReactions(false);
                  }}
                  className="text-lg hover:bg-gray-100 rounded p-1 transition"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Attachments */}
        {message.attachments.length > 0 && (
          <div className="space-y-2 w-full">
            {message.attachments.map((att) => renderAttachment(att))}
          </div>
        )}

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {Object.entries(
              message.reactions.reduce((acc, r) => {
                acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => onReact?.(message.id, emoji)}
                className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs flex items-center gap-1"
              >
                <span>{emoji}</span>
                <span className="text-gray-600">{count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Timestamp and read status */}
        <div className={`flex items-center gap-2 text-xs ${isOwnMessage ? 'text-gray-500' : 'text-gray-500'} px-2`}>
          <span>{formatTime(message.sentAt)}</span>
          {isOwnMessage && (
            <span className="text-xs">
              {message.isRead ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

