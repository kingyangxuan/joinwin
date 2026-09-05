// Joinwin 全局状态管理 - Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, Conversation, Message } from '../types';
import { setAuthCookie, clearAuthCookie } from '../services/api';

interface AppState {
  // 用户状态
  user: User | null;
  isLoggedIn: boolean;
  
  // 对话状态
  conversations: Conversation[];
  currentConversationId: string | null;
  messages: Message[];
  
  // UI 状态
  isLoading: boolean;
  isStreaming: boolean;
  sidebarVisible: boolean;
  
  // 动作
  setUser: (user: User | null) => void;
  login: (user: User, cookie: string) => void;
  logout: () => void;
  
  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (id: string | null) => void;
  addConversation: (conversation: Conversation) => void;
  removeConversation: (id: string) => void;
  
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string) => void;
  
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  toggleSidebar: () => void;
  setSidebarVisible: (visible: boolean) => void;
  
  reset: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      isLoggedIn: false,
      conversations: [],
      currentConversationId: null,
      messages: [],
      isLoading: false,
      isStreaming: false,
      sidebarVisible: false,
      
      // 用户动作
      setUser: (user) => set({ user }),
      
      login: (user, cookie) => {
        setAuthCookie(cookie);
        set({ user, isLoggedIn: true });
      },
      
      logout: () => {
        clearAuthCookie();
        set({
          user: null,
          isLoggedIn: false,
          conversations: [],
          currentConversationId: null,
          messages: [],
        });
      },
      
      // 对话动作
      setConversations: (conversations) => set({ conversations }),
      
      setCurrentConversation: (id) => set({ currentConversationId: id, messages: [] }),
      
      addConversation: (conversation) =>
        set((state) => ({
          conversations: [conversation, ...state.conversations],
        })),
      
      removeConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          currentConversationId: state.currentConversationId === id ? null : state.currentConversationId,
          messages: state.currentConversationId === id ? [] : state.messages,
        })),
      
      // 消息动作
      setMessages: (messages) => set({ messages }),
      
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      
      updateLastMessage: (content) =>
        set((state) => {
          if (state.messages.length === 0) return state;
          const lastIndex = state.messages.length - 1;
          const updated = [...state.messages];
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: updated[lastIndex].content + content,
          };
          return { messages: updated };
        }),
      
      // UI 动作
      setLoading: (isLoading) => set({ isLoading }),
      setStreaming: (isStreaming) => set({ isStreaming }),
      
      toggleSidebar: () =>
        set((state) => ({ sidebarVisible: !state.sidebarVisible })),
      
      setSidebarVisible: (sidebarVisible) => set({ sidebarVisible }),
      
      reset: () =>
        set({
          user: null,
          isLoggedIn: false,
          conversations: [],
          currentConversationId: null,
          messages: [],
          isLoading: false,
          isStreaming: false,
          sidebarVisible: false,
        }),
    }),
    {
      name: 'joinwin-storage',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
      partialize: (state: AppState) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }) as any,
    }
  )
);

export default useStore;
