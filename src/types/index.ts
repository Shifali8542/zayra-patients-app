// ─── User & Auth ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  journey: 'wellness' | 'care' | 'evac' | 'hospital';
  baseline: UserBaseline;
  preferences: UserPreferences;
}

export interface UserBaseline {
  age: number;
  hrv: number;
  restingHr: number;
  stressSignature: string;
  lifestyle: string;
  sleepPattern: string;
  stressLevel: string;
  activity: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  shareWithCircle: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface OnboardingData {
  name: string;
  intentions: string[];
  age: number;
  lifestyle: string;
  sleepPattern: string;
  stressLevel: string;
  activity: string;
}

// ─── Health ──────────────────────────────────────────────────────────────────

export interface HealthMetric {
  avgHr: number;
  spo2: number;
  anomalies: number;
  signalStrength: number;
  status: 'normal' | 'warning' | 'alert';
}

export type TimelineEventType = 'observation' | 'confirmation' | 'alert' | 'insight';
export type TimelineSource = 'axiom' | 'zen' | 'alyna' | 'clinician';

export interface TimelineEvent {
  id: string;
  time: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  source: TimelineSource;
}

// ─── Circle & Community ───────────────────────────────────────────────────────

export interface CircleMember {
  id: string;
  name: string;
  initials: string;
  color: string;
  relation: string;
  lastMessage?: string;
}

export interface Journey {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  participants?: number;
  curator?: string;
  emoji?: string;
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export interface Story {
  id: string;
  type: string;
  quote: string;
  author: string;
  authorAge?: number;
  tag: string;
  tagColor: string;
}

// ─── Rhythm ──────────────────────────────────────────────────────────────────

export interface RhythmStreak {
  days: number;
  milestones: Milestone[];
  weekDots: boolean[];
}

export interface Milestone {
  label: string;
  days: number;
  achieved: boolean;
  active: boolean;
}

// ─── Alyna Chat ───────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  sender: 'user' | 'alyna';
  message: string;
  time: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type TabParamList = {
  Home: undefined;
  Alyna: undefined;
  Circle: undefined;
  Rhythm: undefined;
  Stories: undefined;
  Profile: undefined;
};
