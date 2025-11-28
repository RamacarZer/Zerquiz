import {
  demoConversations,
  demoMessages,
  demoNotifications,
  demoUsers,
  type Conversation,
  type Message,
  type Notification,
  type User,
} from "../../mocks/communicationDataAdvanced";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

async function safeFetch<T>(path: string, options?: RequestInit): Promise<T | null> {
  if (!API_BASE) return null;
  try {
    const response = await fetch(`${API_BASE}${path}`, options);
    if (!response.ok) throw new Error(await response.text());
    return (await response.json()) as T;
  } catch (error) {
    console.warn("[communicationApi] falling back to mock data:", error);
    return null;
  }
}

export const communicationApi = {
  async fetchInitialData() {
    const [users, conversations, messages, notifications] = await Promise.all([
      safeFetch<User[]>("/communication/users"),
      safeFetch<Conversation[]>("/communication/conversations"),
      safeFetch<Message[]>("/communication/messages"),
      safeFetch<Notification[]>("/communication/notifications"),
    ]);

    return {
      users: users ?? demoUsers,
      conversations: conversations ?? demoConversations,
      messages: messages ?? demoMessages,
      notifications: notifications ?? demoNotifications,
    };
  },

  async createConversation(payload: Partial<Conversation>) {
    const response = await safeFetch<Conversation>("/communication/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return (
      response ?? {
        ...payload,
        id: `conv-${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
        participantIds: payload.participantIds ?? [],
        createdBy: payload.createdBy ?? "u1",
        type: payload.type ?? "group",
        settings: payload.settings ?? {
          allowDeletion: false,
          allowEditing: true,
          allowFileSharing: true,
          allowReactions: true,
          notificationsEnabled: true,
        },
        isPinned: false,
        isMuted: false,
        isArchived: false,
      }
    );
  },

  async sendMessage(payload: Partial<Message>) {
    const response = await safeFetch<Message>("/communication/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return (
      response ?? {
        ...payload,
        id: `msg-${Date.now()}`,
        sentAt: new Date().toISOString(),
        isRead: false,
        isEdited: false,
        isDeleted: false,
        attachments: payload.attachments ?? [],
        reactions: payload.reactions ?? [],
        readBy: payload.readBy ?? [],
        type: payload.type ?? "text",
        content: payload.content ?? "",
        conversationId: payload.conversationId ?? "",
        senderId: payload.senderId ?? "u1",
        recipientIds: payload.recipientIds ?? [],
        mentions: payload.mentions ?? [],
      }
    );
  },
};

