export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: number;
  description: string;
  completed: boolean;
  createdAt: Date;
  priority: Priority;
  tags: string[];
  dueDate: Date | null;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'pookie';
  timestamp: Date;
  type?: 'text' | 'action' | 'task-preview';
  actions?: MessageAction[];
  taskPreview?: Task;
}

export interface MessageAction {
  id: string;
  label: string;
  icon?: string;
  onClick: () => void;
}

export interface AppState {
  isSidebarOpen: boolean;
  isChatPanelOpen: boolean;
  activeView: 'dashboard' | 'today' | 'upcoming' | 'completed';
  messages: Message[];
  isTyping: boolean;
  theme: 'light' | 'dark';
  animationsEnabled: boolean;
  soundEnabled: boolean;
  setSidebarOpen: (open: boolean) => void;
  setChatPanelOpen: (open: boolean) => void;
  setActiveView: (view: AppState['activeView']) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setTyping: (typing: boolean) => void;
  toggleTheme: () => void;
  toggleAnimations: () => void;
  toggleSound: () => void;
}

export interface TagVariant {
  background: string;
  color: string;
  border: string;
}

export const TAG_VARIANTS: Record<string, TagVariant> = {
  shopping: {
    background: '#DBFFF0',
    color: '#00846A',
    border: '#B8FFE3',
  },
  work: {
    background: '#F3EFFF',
    color: '#7640E0',
    border: '#E6DBFF',
  },
  personal: {
    background: '#FFE9DC',
    color: '#CC5500',
    border: '#FFD4C2',
  },
  urgent: {
    background: '#FFE3E9',
    color: '#CC1155',
    border: '#FFC9D6',
  },
  default: {
    background: '#F5F5F5',
    color: '#404040',
    border: '#E5E5E5',
  },
};
