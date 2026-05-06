import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import type {
  HealthMetric,
  TimelineEvent,
  CircleMember,
  Journey,
  Story,
  RhythmStreak,
  ChatMessage,
} from '../../../types';

interface DashboardState {
  metrics: HealthMetric | null;
  timeline: TimelineEvent[];
  members: CircleMember[];
  journeys: Journey[];
  stories: Story[];
  streak: RhythmStreak | null;
  alynaChat: ChatMessage[];
  loading: boolean;
  error: string | null;
}

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    metrics: null,
    timeline: [],
    members: [],
    journeys: [],
    stories: [],
    streak: null,
    alynaChat: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [metrics, timeline, members, journeys, stories, streak, alynaChat] =
        await Promise.all([
          api.health.getMetrics(),
          api.health.getTimeline(),
          api.circle.getMembers(),
          api.community.getJourneys(),
          api.stories.getAll(),
          api.rhythm.getStreak(),
          api.alyna.getChat(),
        ]);
      setState({
        metrics,
        timeline,
        members,
        journeys,
        stories,
        streak,
        alynaChat,
        loading: false,
        error: null,
      });
    } catch {
      setState((prev) => ({ ...prev, loading: false, error: 'Failed to load data.' }));
    }
  };

  const sendAlynaMessage = async (message: string): Promise<ChatMessage | null> => {
    try {
      const reply = await api.alyna.sendMessage(message);
      setState((prev) => ({ ...prev, alynaChat: [...prev.alynaChat, reply] }));
      return reply;
    } catch {
      return null;
    }
  };

  return { ...state, sendAlynaMessage, reload: loadAll };
}
