import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  MessageSquare,
  Users,
  Bell,
  Megaphone,
  Plus,
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Settings,
  Archive,
  Trash2,
  Pin,
  Volume2,
  VolumeX,
  UserPlus,
  FileText,
  ChevronDown,
  X,
  CheckCircle,
  BellOff,
} from 'lucide-react';
import {
  demoUsers,
  demoConversations,
  demoMessages,
  demoNotifications,
  demoAnnouncements,
  getConversationById,
  getMessagesByConversation,
  getUnreadNotificationsCount,
  getUnreadMessagesCount,
  getPinnedAnnouncements,
  type User,
  type Conversation,
  type Message,
  type Notification,
  type Announcement,
  type Attachment,
  type Reaction,
  type MessageTemplate,
} from '../../mocks/communicationDataAdvanced';
import { UserListItem } from '../../components/communication/UserListItem';
import { ConversationListItem } from '../../components/communication/ConversationListItem';
import { MessageBubble } from '../../components/communication/MessageBubble';
import { communicationApi } from '../../services/api/communicationApi';
import { communicationSocket } from '../../services/realtime/communicationSocket';
import { webRTCService, type CallType } from '../../services/realtime/webRTCService';

const TEMPLATE_CATEGORIES = [
  { id: 'duyuru', label: 'Duyurular', color: 'bg-blue-100 text-blue-700' },
  { id: 'hatirlatma', label: 'Hatırlatmalar', color: 'bg-amber-100 text-amber-700' },
  { id: 'bilgilendirme', label: 'Bilgilendirme', color: 'bg-green-100 text-green-700' },
  { id: 'destek', label: 'Destek', color: 'bg-purple-100 text-purple-700' },
] as const;

const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'exam-reminder',
    name: 'Sınav Hatırlatma',
    category: 'hatirlatma',
    content:
      'Merhaba {{ogrenci_adi}}, yarın saat 10:00’da yapılacak {{sinav_adi}} sınavı için hazır olduğundan emin olmalısın. Başarılar! 🎯',
    isPublic: true,
    createdBy: 'u1',
    usageCount: 42,
  },
  {
    id: 'certificate-ready',
    name: 'Sertifika Hazır',
    category: 'bilgilendirme',
    content:
      'Tebrikler {{ogrenci_adi}}! {{program_adi}} programını başarıyla tamamladın. Sertifikan sisteme yüklendi. 🎓',
    isPublic: true,
    createdBy: 'u1',
    usageCount: 31,
  },
  {
    id: 'payment-reminder',
    name: 'Ödeme Hatırlatma',
    category: 'destek',
    content:
      'Merhaba {{veli_adi}}, {{ogrenci_adi}} için {{donem}} dönemine ait ödemeyi 5 gün içinde tamamlamanız gerekmektedir. Yardımcı olmamızı ister misiniz?',
    isPublic: true,
    createdBy: 'u1',
    usageCount: 15,
  },
  {
    id: 'new-feature',
    name: 'Yeni Özellik Duyurusu',
    category: 'duyuru',
    content:
      'Platformumuza yeni eklenen {{ozellik_adi}} özelliğini denediniz mi? Detaylar için yardım merkezi yazımızı inceleyebilirsiniz.',
    isPublic: true,
    createdBy: 'u1',
    usageCount: 22,
  },
] as const;

const USER_STATUSES: Array<User['status']> = ['online', 'away', 'busy', 'offline'];

type ViewMode = 'conversations' | 'contacts' | 'notifications' | 'announcements';

export default function CommunicationCenterPageAdvanced() {
  const [viewMode, setViewMode] = useState<ViewMode>('conversations');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [newConversationType, setNewConversationType] = useState<'direct' | 'group' | 'channel'>('direct');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [conversationName, setConversationName] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [localUsers, setLocalUsers] = useState<User[]>(demoUsers);
  const [localMessages, setLocalMessages] = useState<Message[]>(demoMessages);
  const [localConversations, setLocalConversations] = useState<Conversation[]>(demoConversations);
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(demoNotifications);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    status: 'online' as User['status'],
  });
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<typeof TEMPLATE_CATEGORIES[number]['id']>('duyuru');
  const [templateVariables, setTemplateVariables] = useState<string[]>([]);
  const [templateValues, setTemplateValues] = useState<Record<string, string>>({});
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [bulkTargets, setBulkTargets] = useState<string[]>([]);
  const [scheduledMessages, setScheduledMessages] = useState<
    Array<{ id: string; conversationIds: string[]; content: string; attachments: Attachment[]; scheduledAt: string }>
  >([]);
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState<CallType>('audio');
  const [showConversationInfo, setShowConversationInfo] = useState(false);
  const [callSession, setCallSession] = useState<ReturnType<typeof webRTCService.createSession> | null>(null);
  const [localMediaStream, setLocalMediaStream] = useState<MediaStream | null>(null);
  const [remoteMediaStream, setRemoteMediaStream] = useState<MediaStream | null>(null);
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'in-call' | 'ended'>('idle');
  const [callTimer, setCallTimer] = useState(0);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callSessionRef = useRef<ReturnType<typeof webRTCService.createSession> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = useMemo(() => {
    const admin = localUsers.find((user) => user.id === 'u1');
    return admin ?? localUsers[0];
  }, [localUsers]);

  const findUserById = (userId: string) => {
    return localUsers.find((user) => user.id === userId) ?? demoUsers.find((user) => user.id === userId) ?? null;
  };

  const availableParticipants = useMemo(
    () => localUsers.filter((user) => user.id !== currentUser?.id),
    [localUsers, currentUser]
  );

  const templateTabs = useMemo(() => {
    const counts = MESSAGE_TEMPLATES.reduce<Record<string, number>>((acc, template) => {
      acc[template.category] = (acc[template.category] || 0) + 1;
      return acc;
    }, {});
    return TEMPLATE_CATEGORIES.map((category) => ({
      ...category,
      count: counts[category.id] ?? 0,
    }));
  }, []);

  const unreadNotifCount = getUnreadNotificationsCount(currentUser.id);
  const unreadMsgCount = getUnreadMessagesCount(currentUser.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    let mounted = true;
    communicationApi.fetchInitialData().then((data) => {
      if (!mounted) return;
      setLocalUsers(data.users);
      setLocalConversations(data.conversations);
      setLocalMessages(data.messages);
      setLocalNotifications(data.notifications);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  useEffect(() => {
    if (localVideoRef.current && localMediaStream) {
      localVideoRef.current.srcObject = localMediaStream;
    }
  }, [localMediaStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteMediaStream) {
      remoteVideoRef.current.srcObject = remoteMediaStream;
    }
  }, [remoteMediaStream]);

  useEffect(() => {
    callSessionRef.current = callSession;
  }, [callSession]);

  useEffect(() => {
    return () => {
      callSessionRef.current?.end();
    };
  }, []);

  useEffect(() => {
    if (callStatus !== 'in-call') return;
    const interval = window.setInterval(() => {
      setCallTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  useEffect(() => {
    const unsubscribe = communicationSocket.subscribe((event) => {
      if (event.type === 'status:changed') {
        setLocalUsers((prev) =>
          prev.map((user) =>
            user.id === event.userId ? { ...user, status: event.status as User['status'] } : user
          )
        );
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setScheduledMessages((prev) => {
        const now = Date.now();
        const ready = prev.filter((item) => new Date(item.scheduledAt).getTime() <= now);
        const upcoming = prev.filter((item) => new Date(item.scheduledAt).getTime() > now);
        ready.forEach((item) => {
          item.conversationIds.forEach((conversationId) => {
            void sendMessageToConversation(conversationId, item.content, item.attachments);
          });
        });
        return upcoming;
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [localConversations]);

  const sendMessageToConversation = async (
    conversationId: string,
    content: string,
    attachments: Attachment[] = []
  ) => {
    const conversation = localConversations.find((conv) => conv.id === conversationId);
    if (!conversation) return;
    const sentAt = new Date().toISOString();
    const recipients = conversation.participantIds.filter((id) => id !== currentUser.id);

    const payload: Partial<Message> = {
      conversationId,
      senderId: currentUser.id,
      recipientIds: recipients,
      content,
      type: attachments.length > 0 ? 'file' : 'text',
      attachments,
      replyTo: replyingTo?.id,
    };

    const persisted = await communicationApi.sendMessage(payload);
    const finalMessage: Message = {
      ...persisted,
      sentAt,
      readBy: persisted.readBy ?? [{ userId: currentUser.id, readAt: sentAt }],
    };

    setLocalMessages((prev) => [...prev, finalMessage]);
    setLocalConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? { ...conv, lastMessage: finalMessage, lastMessageAt: sentAt }
          : conv
      )
    );
  };

  const hasVariableErrors = templateVariables.some(
    (variable) => !(templateValues[variable] && templateValues[variable].trim())
  );

  const handleSendMessage = async () => {
    if (!selectedConversation) return;
    if (!messageInput.trim() && pendingAttachments.length === 0) return;
    if (hasVariableErrors) {
      alert('Lütfen tüm şablon değişkenlerini doldurun.');
      return;
    }

    const targetConversationIds =
      bulkTargets.length > 0 ? bulkTargets : [selectedConversation.id];

    const finalContent = templateVariables.reduce((acc, variable) => {
      const value = templateValues[variable] ?? '';
      return acc.replace(new RegExp(`{{\\s*${variable}\\s*}}`, 'g'), value);
    }, messageInput);

    if (scheduleEnabled && scheduleDate) {
      setScheduledMessages((prev) => [
        ...prev,
        {
          id: `sched-${Date.now()}`,
          conversationIds: targetConversationIds,
          content: finalContent,
          attachments: pendingAttachments,
          scheduledAt: scheduleDate,
        },
      ]);
      alert('Mesaj planlandı!');
    } else {
      for (const conversationId of targetConversationIds) {
        await sendMessageToConversation(conversationId, finalContent, pendingAttachments);
      }
    }

    setMessageInput('');
    setReplyingTo(null);
    setPendingAttachments([]);
    setShowEmojiPicker(false);
    setShowTemplatePicker(false);
    setTemplateVariables([]);
    setTemplateValues({});
    setBulkTargets([]);
    setScheduleEnabled(false);
    setScheduleDate('');
    setTimeout(scrollToBottom, 100);
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
      setLocalMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    }
  };

  const handleEditMessage = (message: Message) => {
    setEditingMessage(message);
    setMessageInput(message.content);
  };

  const handleSaveEdit = () => {
    if (!editingMessage || !messageInput.trim()) return;

    setLocalMessages((prev) =>
      prev.map((msg) =>
        msg.id === editingMessage.id
          ? { ...msg, content: messageInput, isEdited: true, editedAt: new Date().toISOString() }
          : msg
      )
    );

    setEditingMessage(null);
    setMessageInput('');
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setMessageInput('');
  };

  const handleReact = (messageId: string, emoji: string) => {
    setLocalMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;

        const reactionIndex = msg.reactions.findIndex(
          (reaction) => reaction.emoji === emoji && reaction.userId === currentUser.id
        );

        if (reactionIndex >= 0) {
          const updatedReactions = msg.reactions.filter(
            (_, index) => index !== reactionIndex
          );
          return { ...msg, reactions: updatedReactions };
        }

        const newReaction: Reaction = {
          emoji,
          userId: currentUser.id,
          userName: currentUser.name,
          addedAt: new Date().toISOString(),
        };

        return {
          ...msg,
          reactions: [...msg.reactions, newReaction],
        };
      })
    );
  };

  const handlePinConversation = () => {
    if (!selectedConversation) return;
    setLocalConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id ? { ...conv, isPinned: !conv.isPinned } : conv
      )
    );
    setSelectedConversation((prev) => (prev ? { ...prev, isPinned: !prev.isPinned } : null));
  };

  const handleMuteConversation = () => {
    if (!selectedConversation) return;
    setLocalConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id ? { ...conv, isMuted: !conv.isMuted } : conv
      )
    );
    setSelectedConversation((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null));
  };

  const handleArchiveConversation = () => {
    if (!selectedConversation) return;
    if (confirm('Bu konuşmayı arşivlemek istiyor musunuz?')) {
      setLocalConversations((prev) => prev.filter((conv) => conv.id !== selectedConversation.id));
      setSelectedConversation(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const newAttachment: Attachment = {
      id: `att-${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      mimeType: file.type || 'application/octet-stream',
      thumbnail: undefined,
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser.id,
    };

    setPendingAttachments((prev) => [...prev, newAttachment]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setPendingAttachments((prev) => prev.filter((att) => att.id !== attachmentId));
  };

  const extractTemplateVariables = (content: string) => {
    const matches = [...content.matchAll(/{{(.*?)}}/g)];
    return [...new Set(matches.map((match) => match[1].trim()))];
  };

  const handleTemplateInsert = (template: MessageTemplate) => {
    const content = template.content;
    setMessageInput((prev) => (prev ? `${prev}\n${content}` : content));
    const variables = extractTemplateVariables(content);
    setTemplateVariables(variables);
    const values: Record<string, string> = {};
    variables.forEach((variable) => {
      values[variable] = templateValues[variable] ?? '';
    });
    setTemplateValues(values);
    setShowTemplatePicker(false);
  };

  const initiateCall = async (type: CallType) => {
    callSession?.end();
    setCallStatus('connecting');
    setCallTimer(0);
    setMicEnabled(true);
    setCameraEnabled(type === 'video');
    const session = webRTCService.createSession();
    session.on('local-stream', (stream) => setLocalMediaStream(stream));
    session.on('remote-stream', (stream) => setRemoteMediaStream(stream));
    session.on('connected', () => setCallStatus('in-call'));
    session.on('disconnected', () => {
      setCallStatus('ended');
      setLocalMediaStream(null);
      setRemoteMediaStream(null);
      setCallSession(null);
    });
    session.on('error', (error) => {
      console.error('[WebRTC]', error);
      alert('Çağrı başlatılamadı. Tarayıcı izinlerini kontrol edin.');
      session.end();
    });
    setCallSession(session);
    await session.start(type);
  };

  const handleStartCall = async (type: CallType) => {
    setCallType(type);
    setShowCallModal(true);
    try {
      await initiateCall(type);
    } catch {
      setShowCallModal(false);
    }
  };

  const endCall = () => {
    callSession?.end();
    setCallSession(null);
    setLocalMediaStream(null);
    setRemoteMediaStream(null);
    setShowCallModal(false);
    setCallStatus('ended');
  };

  const toggleMic = () => {
    const next = !micEnabled;
    setMicEnabled(next);
    callSession?.toggleTrack('audio', next);
  };

  const toggleCamera = () => {
    const next = !cameraEnabled;
    setCameraEnabled(next);
    callSession?.toggleTrack('video', next);
  };

  const handleMarkNotificationRead = (notifId: string) => {
    setLocalNotifications(prev => prev.map(notif =>
      notif.id === notifId ? { ...notif, isRead: true } : notif
    ));
  };

  const handleMarkAllNotificationsRead = () => {
    setLocalNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleCreateUser = () => {
    if (!newUserForm.name.trim() || !newUserForm.email.trim() || !newUserForm.role.trim()) {
      alert('Lütfen ad, e-posta ve rol alanlarını doldurun');
      return;
    }

    const newUser: User = {
      id: `u${Date.now()}`,
      name: newUserForm.name.trim(),
      email: newUserForm.email.trim(),
      role: newUserForm.role.trim(),
      department: newUserForm.department.trim() || undefined,
      status: newUserForm.status,
    };

    setLocalUsers((prev) => [...prev, newUser]);
    setShowNewUserModal(false);
    setNewUserForm({
      name: '',
      email: '',
      role: '',
      department: '',
      status: 'online',
    });
    alert('Yeni kullanıcı eklendi!');
  };

  const handleAddParticipant = (userId: string) => {
    if (!selectedConversation) return;
    if (selectedConversation.participantIds.includes(userId)) return;

    setLocalConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, participantIds: [...conv.participantIds, userId] }
          : conv
      )
    );
    setSelectedConversation((prev) =>
      prev ? { ...prev, participantIds: [...prev.participantIds, userId] } : null
    );
  };

  const handleRemoveParticipant = (userId: string) => {
    if (!selectedConversation) return;
    if (userId === currentUser.id) return;

    setLocalConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, participantIds: conv.participantIds.filter((id) => id !== userId) }
          : conv
      )
    );
    setSelectedConversation((prev) =>
      prev
        ? { ...prev, participantIds: prev.participantIds.filter((id) => id !== userId) }
        : null
    );
  };

  const handleCreateConversation = async () => {
    if (newConversationType === 'direct' && selectedUsers.length !== 1) {
      alert('Lütfen bir kullanıcı seçin');
      return;
    }
    if (newConversationType === 'group' && selectedUsers.length === 0) {
      alert('Lütfen en az bir kullanıcı seçin');
      return;
    }
    if (newConversationType !== 'direct' && !conversationName.trim()) {
      alert('Lütfen bir isim girin');
      return;
    }

    const participantIds = Array.from(new Set([currentUser.id, ...selectedUsers]));

    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      type: newConversationType,
      name:
        newConversationType === 'direct'
          ? undefined
          : conversationName.trim(),
      participantIds,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      settings: {
        allowFileSharing: true,
        allowReactions: true,
        allowEditing: true,
        allowDeletion: false,
        notificationsEnabled: true,
      },
    };

    const persisted = await communicationApi.createConversation(newConversation);
    const finalConversation = { ...newConversation, ...persisted };

    setLocalConversations((prev) => [finalConversation, ...prev]);
    setSelectedConversation(finalConversation);
    setShowNewConversationModal(false);
    setSelectedUsers([]);
    setConversationName('');
    setNewConversationType('direct');

    alert(
      `${newConversationType === 'direct' ? 'Direkt mesaj' : newConversationType === 'group' ? 'Grup' : 'Kanal'} oluşturuldu!`
    );
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const getConversationMessages = (): Message[] => {
    if (!selectedConversation) return [];
    return localMessages.filter(msg => msg.conversationId === selectedConversation.id);
  };

  const getConversationParticipants = (): User[] => {
    if (!selectedConversation) return [];
    return selectedConversation.participantIds
      .map((id) => findUserById(id))
      .filter(Boolean) as User[];
  };

  const getConversationTitle = (): string => {
    if (!selectedConversation) return '';
    if (selectedConversation.name) return selectedConversation.name;
    const otherUsers = getConversationParticipants().filter((u) => u.id !== currentUser.id);
    return otherUsers.map((u) => u.name).join(', ');
  };

  const getConversationTitleForConv = (conv: Conversation): string => {
    if (conv.name) return conv.name;
    const participants = conv.participantIds
      .map((id) => findUserById(id))
      .filter(Boolean) as User[];
    const otherUsers = participants.filter((u) => u.id !== currentUser.id);
    return otherUsers.map((u) => u.name).join(', ');
  };

  const filteredConversations = localConversations.filter((conv) => {
    const title = getConversationTitleForConv(conv);
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredUsers = localUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">İletişim Merkezi</h1>
                <p className="text-sm text-gray-600">Mesajlar, bildirimler ve duyurular</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNewUserModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                <UserPlus className="h-4 w-4" />
                Yeni Kullanıcı
              </button>
              <button
                onClick={() => setShowNewConversationModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Plus className="h-4 w-4" />
                Yeni Konuşma
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* View Mode Tabs */}
          <div className="border-b border-gray-200 p-2 flex gap-1">
            <button
              onClick={() => setViewMode('conversations')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition ${
                viewMode === 'conversations' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">Sohbetler</span>
              {unreadMsgCount > 0 && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {unreadMsgCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setViewMode('contacts')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition ${
                viewMode === 'contacts' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Kişiler</span>
            </button>
          </div>

          <div className="border-b border-gray-200 p-2 flex gap-1">
            <button
              onClick={() => setViewMode('notifications')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition ${
                viewMode === 'notifications' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Bell className="h-4 w-4" />
              <span className="text-sm font-medium">Bildirimler</span>
              {unreadNotifCount > 0 && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {unreadNotifCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setViewMode('announcements')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition ${
                viewMode === 'announcements' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Megaphone className="h-4 w-4" />
              <span className="text-sm font-medium">Duyurular</span>
            </button>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto">
            {viewMode === 'conversations' && (
              <div className="p-2 space-y-1">
                {filteredConversations.map((conv) => (
                  <ConversationListItem
                    key={conv.id}
                    conversation={conv}
                    participants={
                      conv.participantIds
                        .map((id) => findUserById(id))
                        .filter(Boolean) as User[]
                    }
                    currentUser={currentUser}
                    isActive={selectedConversation?.id === conv.id}
                    onClick={() => setSelectedConversation(conv)}
                  />
                ))}
              </div>
            )}

            {viewMode === 'contacts' && (
              <div className="p-2 space-y-1">
                {filteredUsers.map((user) => (
                  <div 
                    key={user.id} 
                    onClick={() => handleViewUserDetails(user)}
                    className="cursor-pointer"
                  >
                    <UserListItem user={user} showStatus />
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'notifications' && (
              <div className="p-2 space-y-2">
                {localNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleMarkNotificationRead(notif.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition ${
                      notif.isRead ? 'bg-white border-gray-200 hover:bg-gray-50' : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">{notif.type === 'message' ? '💬' : notif.type === 'exam' ? '📝' : '📊'}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-900">{notif.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(notif.createdAt).toLocaleString('tr-TR')}
                          </span>
                          {!notif.isRead && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                              Yeni
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {localNotifications.some(n => !n.isRead) && (
                  <button
                    onClick={handleMarkAllNotificationsRead}
                    className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    Tümünü okundu işaretle
                  </button>
                )}
              </div>
            )}

            {viewMode === 'announcements' && (
              <div className="p-2 space-y-3">
                {demoAnnouncements.map((ann) => (
                  <div key={ann.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{ann.title}</h3>
                      {ann.isPinned && <Pin className="h-4 w-4 text-blue-600" />}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ann.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{ann.author.name}</span>
                      <span>{new Date(ann.publishedAt!).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedConversation.type === 'direct' ? getConversationTitle().charAt(0) : '👥'}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{getConversationTitle()}</h2>
                  <p className="text-sm text-gray-600">
                    {selectedConversation.participantIds.length} kişi
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePinConversation}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title={selectedConversation.isPinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}
                >
                  <Pin className={`h-5 w-5 ${selectedConversation.isPinned ? 'text-blue-600' : 'text-gray-600'}`} />
                </button>
                <button
                  onClick={handleMuteConversation}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title={selectedConversation.isMuted ? 'Sesi aç' : 'Sessiz'}
                >
                  {selectedConversation.isMuted ? (
                    <VolumeX className="h-5 w-5 text-gray-600" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-gray-600" />
                  )}
                </button>
                <button
                  onClick={() => handleStartCall('audio')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title="Sesli arama"
                >
                  <Phone className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => handleStartCall('video')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title="Görüntülü arama"
                >
                  <Video className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setShowConversationInfo(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title="Konuşma bilgileri"
                >
                  <Info className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={handleArchiveConversation}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title="Arşivle"
                >
                  <Archive className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {getConversationMessages().map((message) => {
                const sender = findUserById(message.senderId);
                if (!sender) return null;
                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    sender={sender}
                    currentUser={currentUser}
                    onReply={handleReply}
                    onEdit={handleEditMessage}
                    onDelete={handleDeleteMessage}
                    onReact={handleReact}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4 bg-white">
              {editingMessage && (
                <div className="mb-2 p-2 bg-yellow-50 rounded-lg flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Düzenleniyor:</span> {editingMessage.content.substring(0, 50)}...
                  </div>
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              )}
              
              {replyingTo && !editingMessage && (
                <div className="mb-2 p-2 bg-blue-50 rounded-lg flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Yanıtlanıyor:</span> {replyingTo.content.substring(0, 50)}...
                  </div>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              )}

              {pendingAttachments.length > 0 && (
                <div className="mb-3 space-y-2">
                  {pendingAttachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                    >
                      <div className="w-9 h-9 rounded bg-gray-200 flex items-center justify-center text-gray-600 text-lg">
                        {attachment.type === 'image' ? '🖼️' : '📄'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{attachment.name}</div>
                        <div className="text-xs text-gray-500">
                          {(attachment.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveAttachment(attachment.id)}
                        className="text-xs text-gray-500 hover:text-red-600"
                      >
                        Kaldır
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {templateVariables.length > 0 && (
                <div className="mb-3 border border-purple-200 bg-purple-50 rounded-lg p-3">
                  <div className="text-xs font-semibold text-purple-800 uppercase mb-2">
                    Şablon Değişkenleri
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {templateVariables.map((variable) => (
                      <div key={variable} className="flex flex-col gap-1">
                        <label className="text-xs text-purple-900 font-medium">
                          {variable}
                        </label>
                        <input
                          type="text"
                          value={templateValues[variable] ?? ''}
                          onChange={(e) =>
                            setTemplateValues((prev) => ({ ...prev, [variable]: e.target.value }))
                          }
                          className="px-3 py-2 border border-purple-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                          placeholder={`{{${variable}}}`}
                        />
                      </div>
                    ))}
                  </div>
                  {hasVariableErrors && (
                    <p className="text-xs text-red-600 mt-2">
                      Lütfen tüm değişken alanlarını doldurun.
                    </p>
                  )}
                </div>
              )}

              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Planlı Gönderim</div>
                      <p className="text-xs text-gray-500">Belirli tarih/saatte gönder</p>
                    </div>
                    <button
                      onClick={() => setScheduleEnabled((prev) => !prev)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        scheduleEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {scheduleEnabled ? 'Açık' : 'Kapalı'}
                    </button>
                  </div>
                  {scheduleEnabled && (
                    <input
                      type="datetime-local"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="text-sm font-semibold text-gray-900 mb-2">Toplu Gönderim</div>
                  <p className="text-xs text-gray-500 mb-2">
                    Birden fazla sohbet seçerseniz mesaj hepsine gönderilir.
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {localConversations.map((conv) => (
                      <label key={conv.id} className="flex items-center gap-2 text-xs text-gray-600">
                        <input
                          type="checkbox"
                          checked={bulkTargets.includes(conv.id)}
                          onChange={(e) => {
                            setBulkTargets((prev) =>
                              e.target.checked
                                ? [...prev, conv.id]
                                : prev.filter((id) => id !== conv.id)
                            );
                          }}
                          className="text-blue-600"
                        />
                        <span className="truncate">{getConversationTitleForConv(conv) || 'Konuşma'}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-end gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,application/pdf,.doc,.docx"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title="Dosya ekle"
                >
                  <Paperclip className="h-5 w-5 text-gray-600" />
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    title="Emoji ekle"
                  >
                    <Smile className="h-5 w-5 text-gray-600" />
                  </button>
                  
                  {showEmojiPicker && (
                    <div className="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 grid grid-cols-6 gap-2 z-10">
                      {['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🎉', '🔥', '✨', '💯', '🙏', '👏', '🎈', '🎁', '☕', '🍕', '🎵', '📝', '✅', '❌', '⭐', '💪', '🤝'].map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => handleEmojiSelect(emoji)}
                          className="text-2xl hover:bg-gray-100 rounded p-1 transition"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowTemplatePicker(!showTemplatePicker);
                      setShowEmojiPicker(false);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-1"
                    title="Şablon seç"
                  >
                    <FileText className="h-5 w-5 text-gray-600" />
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {showTemplatePicker && (
                    <div className="absolute bottom-12 left-0 w-80 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-20">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {templateTabs.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setSelectedTemplateCategory(tab.id)}
                            className={`px-3 py-1 text-xs rounded-full border transition ${
                              selectedTemplateCategory === tab.id
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-200 text-gray-600 hover:border-blue-200'
                            }`}
                          >
                            {tab.label} ({tab.count})
                          </button>
                        ))}
                      </div>

                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {MESSAGE_TEMPLATES.filter((template) => template.category === selectedTemplateCategory).map(
                          (template) => (
                            <button
                              key={template.id}
                              onClick={() => handleTemplateInsert(template)}
                              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 transition"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">{template.name}</div>
                                  <p className="text-xs text-gray-600 line-clamp-2">{template.content}</p>
                                </div>
                                <span className="text-[10px] text-gray-500">{template.usageCount}×</span>
                              </div>
                            </button>
                          )
                        )}

                        {MESSAGE_TEMPLATES.filter((template) => template.category === selectedTemplateCategory).length ===
                          0 && (
                          <div className="text-xs text-gray-500 text-center py-4">
                            Bu kategoride hazır şablon bulunmuyor.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 relative">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (editingMessage) {
                          handleSaveEdit();
                        } else {
                          handleSendMessage();
                        }
                      }
                    }}
                    placeholder={editingMessage ? "Mesajı düzenle..." : "Mesajınızı yazın... (Enter: gönder, Shift+Enter: yeni satır)"}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={1}
                  />
                </div>
                <button
                  onClick={editingMessage ? handleSaveEdit : handleSendMessage}
                  disabled={
                    (!messageInput.trim() && pendingAttachments.length === 0) || hasVariableErrors
                  }
                  className={`p-3 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
                    editingMessage ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  title={editingMessage ? "Kaydet" : "Gönder"}
                >
                  {editingMessage ? <span className="text-sm font-medium px-2">Kaydet</span> : <Send className="h-5 w-5" />}
                </button>
              </div>

              <div className="mt-2 text-xs text-gray-500 text-center">
                {selectedConversation.settings.allowEditing && 'Mesajları düzenleyebilirsiniz'} 
                {selectedConversation.settings.allowEditing && selectedConversation.settings.allowReactions && ' • '}
                {selectedConversation.settings.allowReactions && 'Tepki ekleyebilirsiniz'}
              </div>
              {scheduledMessages.length > 0 && (
                <div className="mt-3 border border-amber-200 bg-amber-50 rounded-lg p-3">
                  <div className="text-xs font-semibold text-amber-700 uppercase mb-2">
                    Bekleyen Planlı Mesajlar
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto text-xs text-amber-900">
                    {scheduledMessages.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-2">
                        <div className="truncate">
                          {new Date(item.scheduledAt).toLocaleString('tr-TR')} •{' '}
                          {item.conversationIds.length} sohbet
                        </div>
                        <button
                          onClick={() =>
                            setScheduledMessages((prev) => prev.filter((sched) => sched.id !== item.id))
                          }
                          className="text-[10px] text-amber-700 hover:underline"
                        >
                          İptal
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Konuşma Seçin</h3>
              <p className="text-gray-600 mb-6">Mesajlaşmaya başlamak için sol taraftan bir konuşma seçin</p>
              <button
                onClick={() => setShowNewConversationModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Yeni Konuşma Başlat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      {showNewConversationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Yeni Konuşma Oluştur</h2>
                <button
                  onClick={() => setShowNewConversationModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <span className="text-2xl text-gray-500">×</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Conversation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konuşma Tipi *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setNewConversationType('direct')}
                    className={`p-4 rounded-lg border-2 transition ${
                      newConversationType === 'direct'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">👤</div>
                    <div className="font-medium">Direkt Mesaj</div>
                    <div className="text-xs text-gray-600 mt-1">1-1 mesajlaşma</div>
                  </button>
                  <button
                    onClick={() => setNewConversationType('group')}
                    className={`p-4 rounded-lg border-2 transition ${
                      newConversationType === 'group'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">👥</div>
                    <div className="font-medium">Grup</div>
                    <div className="text-xs text-gray-600 mt-1">Özel grup sohbeti</div>
                  </button>
                  <button
                    onClick={() => setNewConversationType('channel')}
                    className={`p-4 rounded-lg border-2 transition ${
                      newConversationType === 'channel'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">📢</div>
                    <div className="font-medium">Kanal</div>
                    <div className="text-xs text-gray-600 mt-1">Açık kanal</div>
                  </button>
                </div>
              </div>

              {/* Conversation Name (for group/channel) */}
              {(newConversationType === 'group' || newConversationType === 'channel') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {newConversationType === 'group' ? 'Grup' : 'Kanal'} Adı *
                  </label>
                  <input
                    type="text"
                    value={conversationName}
                    onChange={(e) => setConversationName(e.target.value)}
                    placeholder={`${newConversationType === 'group' ? 'Grup' : 'Kanal'} adını girin...`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* User Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {newConversationType === 'direct' ? 'Kullanıcı Seç' : 'Katılımcılar Seç'} *
                  <span className="text-gray-500 font-normal ml-2">
                    ({selectedUsers.length} seçili)
                  </span>
                </label>
                <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
                  {availableParticipants.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          if (newConversationType === 'direct') {
                            setSelectedUsers([user.id]);
                          } else {
                            toggleUserSelection(user.id);
                          }
                        }}
                        className={`w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-0 ${
                          selectedUsers.includes(user.id) ? 'bg-blue-50' : ''
                        }`}
                      >
                        <input
                          type={newConversationType === 'direct' ? 'radio' : 'checkbox'}
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => {}}
                          className="h-4 w-4 text-blue-600"
                        />
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.role} • {user.email}</div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          user.status === 'online' ? 'bg-green-500' :
                          user.status === 'away' ? 'bg-yellow-500' :
                          user.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
                        }`} />
                      </button>
                    ))}
                </div>
              </div>

              {/* Info Text */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    {newConversationType === 'direct' && 'Direkt mesajda sadece bir kullanıcı seçebilirsiniz.'}
                    {newConversationType === 'group' && 'Grup sohbetinde birden fazla kullanıcı seçebilir ve sonradan da ekleyebilirsiniz.'}
                    {newConversationType === 'channel' && 'Kanallar herkese açıktır ve herkes katılabilir.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowNewConversationModal(false);
                  setSelectedUsers([]);
                  setConversationName('');
                  setNewConversationType('direct');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
              >
                İptal
              </button>
              <button
                onClick={handleCreateConversation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New User Modal */}
      {showNewUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Yeni Kullanıcı Ekle</h2>
              <button
                onClick={() => setShowNewUserModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Ad Soyad *</label>
                  <input
                    type="text"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Örn: Eda Yıldırım"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">E-posta *</label>
                  <input
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="kullanici@orneksite.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Rol *</label>
                  <input
                    type="text"
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm((prev) => ({ ...prev, role: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Örn: Öğretmen"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Departman</label>
                  <input
                    type="text"
                    value={newUserForm.department}
                    onChange={(e) => setNewUserForm((prev) => ({ ...prev, department: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Örn: Matematik"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Durum</label>
                <div className="flex gap-2 mt-2">
                  {USER_STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => setNewUserForm((prev) => ({ ...prev, status }))}
                      className={`px-3 py-1 rounded-full text-xs border transition ${
                        newUserForm.status === status
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-blue-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowNewUserModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                İptal
              </button>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call Modal */}
      {showCallModal && selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {callType === 'audio' ? 'Sesli Arama' : 'Görüntülü Arama'}
                </h2>
                <p className="text-sm text-gray-500">{getConversationTitle()}</p>
              </div>
              <button
                onClick={() => setShowCallModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="relative rounded-xl bg-gray-900 overflow-hidden h-48 flex items-center justify-center">
                  {callType === 'video' ? (
                    <video ref={localVideoRef} muted autoPlay playsInline className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-white text-center">
                      <div className="text-4xl mb-2">🎧</div>
                      <p className="text-sm opacity-70">Sesli arama başlatılıyor...</p>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 text-xs text-white bg-black/40 px-2 py-1 rounded-full">
                    Siz
                  </span>
                </div>
                <div className="relative rounded-xl bg-gray-200 overflow-hidden h-48 flex items-center justify-center">
                  {callType === 'video' ? (
                    remoteMediaStream ? (
                      <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-500 text-center text-sm">
                        Karşı taraf bağlanıyor...
                      </div>
                    )
                  ) : (
                    <div className="text-gray-600 text-center">
                      <div className="text-4xl mb-2">🔔</div>
                      <p className="text-sm">Karşı taraf çağrıya davet edildi.</p>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 text-xs text-gray-700 bg-white/60 px-2 py-1 rounded-full">
                    Karşı taraf
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  Durum: <span className="font-semibold text-gray-900">{callStatus}</span>
                </div>
                {callStatus === 'in-call' && (
                  <div className="font-mono text-gray-900">
                    {String(Math.floor(callTimer / 60)).padStart(2, '0')}:
                    {String(callTimer % 60).padStart(2, '0')}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={toggleMic}
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    micEnabled ? 'bg-gray-200 text-gray-700' : 'bg-red-500 text-white'
                  }`}
                >
                  {micEnabled ? '🎙️' : '🔇'}
                </button>
                {callType === 'video' && (
                  <button
                    onClick={toggleCamera}
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      cameraEnabled ? 'bg-gray-200 text-gray-700' : 'bg-red-500 text-white'
                    }`}
                  >
                    {cameraEnabled ? '🎥' : '🚫'}
                  </button>
                )}
                <button
                  onClick={endCall}
                  className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg"
                >
                  ✕
                </button>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-500 mb-2 uppercase">Katılımcılar</div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {getConversationParticipants().map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                        <div className="text-xs text-gray-500">{participant.role}</div>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded-full ${
                          participant.status === 'online'
                            ? 'bg-green-100 text-green-600'
                            : participant.status === 'away'
                            ? 'bg-yellow-100 text-yellow-700'
                            : participant.status === 'busy'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {participant.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conversation Info Drawer */}
      {showConversationInfo && selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end z-40">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Konuşma Detayları</h2>
                <p className="text-sm text-gray-500">{getConversationTitle()}</p>
              </div>
              <button
                onClick={() => setShowConversationInfo(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase">Ayarlar</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Bildirimler</div>
                      <p className="text-xs text-gray-500">Konuşma için bildirimleri yönet</p>
                    </div>
                    <button
                      onClick={() => {
                        if (!selectedConversation) return;
                        const newValue = !selectedConversation.settings.notificationsEnabled;
                        setLocalConversations((prev) =>
                          prev.map((conv) =>
                            conv.id === selectedConversation.id
                              ? {
                                  ...conv,
                                  settings: { ...conv.settings, notificationsEnabled: newValue },
                                }
                              : conv
                          )
                        );
                        setSelectedConversation((prev) =>
                          prev
                            ? {
                                ...prev,
                                settings: { ...prev.settings, notificationsEnabled: newValue },
                              }
                            : null
                        );
                      }}
                      className={`px-3 py-1 text-xs rounded-full ${
                        selectedConversation.settings.notificationsEnabled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {selectedConversation.settings.notificationsEnabled ? 'Açık' : 'Kapalı'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Sessiz Mod</div>
                      <p className="text-xs text-gray-500">Geçici olarak bildirimleri sustur</p>
                    </div>
                    <button
                      onClick={handleMuteConversation}
                      className={`px-3 py-1 text-xs rounded-full ${
                        selectedConversation.isMuted
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {selectedConversation.isMuted ? 'Aktif' : 'Pasif'}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Katılımcılar</div>
                <div className="space-y-2">
                  {getConversationParticipants().map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{participant.name}</div>
                        <p className="text-xs text-gray-500">{participant.role}</p>
                      </div>
                      {participant.id !== currentUser.id && (
                        <button
                          onClick={() => handleRemoveParticipant(participant.id)}
                          className="text-xs text-red-500 hover:text-red-600"
                        >
                          Kaldır
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Katılımcı ekle</p>
                  <div className="flex flex-wrap gap-2">
                    {availableParticipants
                      .filter((user) => !selectedConversation.participantIds.includes(user.id))
                      .map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleAddParticipant(user.id)}
                          className="px-3 py-1 text-xs border border-gray-200 rounded-full hover:border-blue-300"
                        >
                          {user.name}
                        </button>
                      ))}
                    {availableParticipants.filter(
                      (user) => !selectedConversation.participantIds.includes(user.id)
                    ).length === 0 && (
                      <span className="text-xs text-gray-500">Eklenebilir kullanıcı yok</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Kullanıcı Bilgileri</h2>
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setSelectedUser(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <span className="text-2xl text-gray-500">×</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Avatar & Status */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-3 h-3 rounded-full ${
                      selectedUser.status === 'online' ? 'bg-green-500' :
                      selectedUser.status === 'away' ? 'bg-yellow-500' :
                      selectedUser.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
                    }`} />
                    <span className="text-sm text-gray-600 capitalize">{selectedUser.status}</span>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Rol</div>
                  <div className="font-medium text-gray-900">{selectedUser.role}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">E-posta</div>
                  <div className="font-medium text-gray-900">{selectedUser.email}</div>
                </div>
                {selectedUser.department && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Departman</div>
                    <div className="font-medium text-gray-900">{selectedUser.department}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-gray-500 mb-1">Üyelik</div>
                  <div className="font-medium text-gray-900">
                    {new Date(selectedUser.joinedAt).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedUsers([selectedUser.id]);
                    setNewConversationType('direct');
                    setShowUserModal(false);
                    setShowNewConversationModal(true);
                  }}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                >
                  Mesaj Gönder
                </button>
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setSelectedUser(null);
                  }}
                  className="py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium text-sm"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

