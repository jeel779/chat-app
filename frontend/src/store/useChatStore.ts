import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
}

interface User {
  id: string;
  username: string;
  avatar?: string;
}
interface ChatState {
  messages: ChatMessage[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setSelectedUser: (user: User | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/chat/");
      set({ users: res.data.data.users });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/chat/${userId}`);
      set({ messages: res.data.data.chats });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (message: string) => {
    const { selectedUser } = get();
    try {
      const res = await axiosInstance.post(`/chat/${selectedUser?.id}`, { content: message });
      set((state) => ({
        messages: [...state.messages, res.data.data.message],
      }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("new-message", (newMessage: ChatMessage) => {
      console.log("[Socket] Received new-message:", newMessage);
      const { selectedUser } = get();

      // Ignore messages from other chats
      if (newMessage.senderId !== selectedUser?.id) {
        console.log(`[Socket] Ignored message from sender ${newMessage.senderId} because selectedUser ID is ${selectedUser?.id}`);
        return;
      }

      console.log("[Socket] Appending new message to state:", newMessage);
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    console.log("[Socket] Unsubscribing from new-message event");
    socket.off("new-message");
  },
  setSelectedUser: (user: User | null) => set({ selectedUser: user }),
}));