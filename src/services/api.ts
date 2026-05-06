import type {
  User,
  HealthMetric,
  TimelineEvent,
  CircleMember,
  Journey,
  Story,
  RhythmStreak,
  ChatMessage,
} from '../types';
import {
  mockUser,
  mockHealthMetric,
  mockTimeline,
  mockCircleMembers,
  mockJourneys,
  mockStories,
  mockRhythmStreak,
  mockAlynaChat,
} from '../mocks/mockData';

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  auth: {
    login: async (email: string, _password: string): Promise<User> => {
      await delay(600);
      return { ...mockUser, email };
    },
    signup: async (name: string, email: string, _password: string): Promise<User> => {
      await delay(600);
      return { ...mockUser, name, email };
    },
    logout: async (): Promise<void> => {
      await delay(200);
    },
  },

  user: {
    getProfile: async (): Promise<User> => {
      await delay(300);
      return mockUser;
    },
    updateProfile: async (data: Partial<User>): Promise<User> => {
      await delay(400);
      return { ...mockUser, ...data };
    },
  },

  health: {
    getMetrics: async (): Promise<HealthMetric> => {
      await delay(300);
      return mockHealthMetric;
    },
    getTimeline: async (): Promise<TimelineEvent[]> => {
      await delay(300);
      return mockTimeline;
    },
  },

  circle: {
    getMembers: async (): Promise<CircleMember[]> => {
      await delay(300);
      return mockCircleMembers;
    },
  },

  community: {
    getJourneys: async (): Promise<Journey[]> => {
      await delay(300);
      return mockJourneys;
    },
  },

  stories: {
    getAll: async (): Promise<Story[]> => {
      await delay(300);
      return mockStories;
    },
  },

  rhythm: {
    getStreak: async (): Promise<RhythmStreak> => {
      await delay(300);
      return mockRhythmStreak;
    },
  },

  alyna: {
    getChat: async (): Promise<ChatMessage[]> => {
      await delay(300);
      return mockAlynaChat;
    },
    sendMessage: async (_message: string): Promise<ChatMessage> => {
      await delay(800);
      return {
        id: Date.now().toString(),
        sender: 'alyna',
        message:
          "I've noted that. Your biometrics look stable right now. Is there anything specific you'd like me to monitor?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    },
  },
};
