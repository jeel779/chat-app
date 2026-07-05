import { create } from "zustand";
import { checkAuthStatus, signupUser, loginUser, logoutUser } from "../helpers/api-communicator";
import { io, Socket } from "socket.io-client";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

interface AuthStore {
  authUser: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  onlineUsers: string[];
  socket: Socket | null;
  checkAuth: () => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateAvatar: (avatarFile: File) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isLoggedIn: false,
  isLoading: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const resData = await checkAuthStatus();
      if (resData && resData.data && resData.data.user) {
        set({ authUser: resData.data.user, isLoggedIn: true });
      } else {
        set({ authUser: null, isLoggedIn: false });
      }
    } catch (error) {
      console.error("checkAuth failed:", error);
      set({ authUser: null, isLoggedIn: false });
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (username: string, email: string, password: string) => {
    set({ isLoading: true });
    try {
      const resData = await signupUser(username, email, password);
      if (resData && resData.data && resData.data.user) {
        set({ authUser: resData.data.user, isLoggedIn: true });
      }
    } catch (error) {
      console.error("signup failed:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const resData = await loginUser(email, password);
      if (resData && resData.data && resData.data.user) {
        set({ authUser: resData.data.user, isLoggedIn: true });
      }
    } catch (error) {
      console.error("login failed:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutUser();
      set({ authUser: null, isLoggedIn: false });
    } catch (error) {
      console.error("logout failed:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateAvatar: async (avatarFile: File) => {
    set({ isLoading: true });
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const res = await axiosInstance.put("/user/update-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data && res.data.data && res.data.data.user) {
        set({ authUser: res.data.data.user });
        toast.success("Avatar updated successfully");
      }
    } catch (error: any) {
      console.error("updateAvatar failed:", error);
      toast.error(error.response?.data?.message || "Failed to update avatar");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const newSocket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
      withCredentials: true,
      autoConnect: false,
    });

    newSocket.connect();

    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
      newSocket.emit("setup", authUser.id);
    });

    newSocket.on("get-online-users", (users: string[]) => {
      console.log("Online users:", users);
      set({ onlineUsers: users });
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  }
}));  