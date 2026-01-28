export interface User {
  id: string;
  email: string;
  name: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  tags: string[];
  aiInsight?: {
    summary: string;
    mood: string;
    advice: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export enum AppView {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  EDITOR = 'EDITOR',
}
