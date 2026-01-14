import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Message } from '@/types';

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      isChatPanelOpen: false,
      activeView: 'dashboard',
      messages: [],
      isTyping: false,
      theme: 'light',
      animationsEnabled: true,
      soundEnabled: true,

      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      setChatPanelOpen: (open) => set({ isChatPanelOpen: open }),
      setActiveView: (view) => set({ activeView: view }),

      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: `msg-${Date.now()}-${Math.random()}`,
              timestamp: new Date(),
            },
          ],
        })),

      setTyping: (typing) => set({ isTyping: typing }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      toggleAnimations: () => set((state) => ({ animationsEnabled: !state.animationsEnabled })),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
    }),
    {
      name: 'pookie-app-storage',
      partialize: (state) => ({
        theme: state.theme,
        animationsEnabled: state.animationsEnabled,
        soundEnabled: state.soundEnabled,
      }),
    }
  )
);
