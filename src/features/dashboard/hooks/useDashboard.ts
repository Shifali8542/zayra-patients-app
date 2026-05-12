import { useState, useEffect, useCallback } from 'react';
import {
  api,
  deriveHealthMetric,
  deriveTimeline,
  deriveRhythmStreak,
  deriveAlynaInitialChat,
  deriveConsistencyAreas,
  ApiError,
} from '../../../services/api';
import type {
  HealthMetric,
  TimelineEvent,
  CircleMember,
  Journey,
  Story,
  RhythmStreak,
  ChatMessage,
  PatientMe,
  ClinicalInfo,
  AIAnalysisResponse,
  PatientSTResult,
} from '../../../types';

// ─── Static content (no backend endpoints yet) ────────────────────────────────
// Replace each with real API calls when backend endpoints are built.

const STATIC_CIRCLE_MEMBERS: CircleMember[] = [
  { id: '1', name: 'Emergency', initials: 'E', color: '#EF4444', relation: 'Emergency Contact' },
  { id: '2', name: 'Doctor', initials: 'D', color: '#00C2B2', relation: 'Clinician' },
];

const STATIC_JOURNEYS: Journey[] = [
  { id: '1', title: 'Better Sleep in 21 Days', subtitle: '1,248 walking together', emoji: '🌙', participants: 1248 },
  { id: '2', title: 'Heart-Aware Living', subtitle: 'Curated by Dr. Mehta', curator: 'Dr. Mehta', emoji: '🖤' },
  { id: '3', title: 'Stress Reset', subtitle: '12-min daily practice', emoji: '🌿' },
];

const STATIC_STORIES: Story[] = [
  {
    id: '1',
    type: 'EARLIER CARDIAC INSIGHT',
    quote: "Alyna flagged a pattern I'd ignored for months. My cardiologist confirmed it the next day.",
    author: 'Rohan',
    authorAge: 47,
    tag: 'CAUGHT EARLY. TREATED CALMLY.',
    tagColor: 'teal',
  },
  {
    id: '2',
    type: 'FAMILY REASSURANCE',
    quote: "My father is in another city. Zayra's circle quietly tells me he's okay every morning.",
    author: 'Meera',
    tag: 'DISTANCE WITHOUT WORRY.',
    tagColor: 'light',
  },
  {
    id: '3',
    type: 'RECOVERY SUPPORT',
    quote: 'After my procedure, Alyna tracked every step back to normal. My doctor loved the reports.',
    author: 'Aditya',
    authorAge: 55,
    tag: 'EVIDENCE-BASED RECOVERY.',
    tagColor: 'teal',
  },
];

// ─── State shape ──────────────────────────────────────────────────────────────

interface DashboardState {
  // Derived from backend
  metrics: HealthMetric | null;
  timeline: TimelineEvent[];
  streak: RhythmStreak | null;
  alynaChat: ChatMessage[];
  consistencyAreas: { label: string; value: number }[];

  // Raw backend responses (available if screens need more detail)
  patientMe: PatientMe | null;
  clinicalInfo: ClinicalInfo | null;
  aiAnalysis: AIAnalysisResponse | null;
  stResult: PatientSTResult | null;

  // Static app content (no backend endpoints yet)
  members: CircleMember[];
  journeys: Journey[];
  stories: Story[];

  loading: boolean;
  error: string | null;
  /** True when patient account exists but is not linked to an ECG profile */
  noPatientProfile: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    metrics: null,
    timeline: [],
    streak: null,
    alynaChat: [],
    consistencyAreas: [],
    patientMe: null,
    clinicalInfo: null,
    aiAnalysis: null,
    stResult: null,
    members: STATIC_CIRCLE_MEMBERS,
    journeys: STATIC_JOURNEYS,
    stories: STATIC_STORIES,
    loading: true,
    error: null,
    noPatientProfile: false,
  });

  const loadAll = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null, noPatientProfile: false }));

    try {
      // 1. Patient profile (requires linked patient_profile on the User)
      const patientMe = await api.patient.getMe();

      const firstRecordId = patientMe.ecg_records[0]?.id;

      // 2. Clinical info (ECG metrics) — non-fatal if no records yet
      const clinicalInfo = await api.patient.getClinicalInfo(firstRecordId).catch(() => null);

      // 3. AI analysis — 404 means not yet run, not an error
      const aiAnalysis = await api.assessments
        .getAIAnalysis({ recordId: firstRecordId })
        .catch((e) => {
          if (e instanceof ApiError && e.status === 404) return null;
          throw e;
        });

      // 4. ST result — 404 means not yet run, not an error
      const stResult = await api.assessments.getSTResult(firstRecordId);

      // Derive app-level types
      const metrics = deriveHealthMetric(
        clinicalInfo,
        aiAnalysis?.analysis?.risk_score ?? null,
        aiAnalysis?.analysis?.risk_level ?? null
      );
      const timeline = deriveTimeline(aiAnalysis, stResult);
      const streak = deriveRhythmStreak(patientMe.record_count);
      const alynaChat = deriveAlynaInitialChat(aiAnalysis);
      const consistencyAreas = deriveConsistencyAreas(clinicalInfo);

      setState((prev) => ({
        ...prev,
        patientMe,
        clinicalInfo,
        aiAnalysis,
        stResult,
        metrics,
        timeline,
        streak,
        alynaChat,
        consistencyAreas,
        loading: false,
        error: null,
        noPatientProfile: false,
      }));
    } catch (e: any) {
      // 403 = user account not linked to a patient ECG profile
      if (e instanceof ApiError && e.status === 403) {
        setState((prev) => ({ ...prev, loading: false, error: null, noPatientProfile: true }));
        return;
      }
      setState((prev) => ({
        ...prev,
        loading: false,
        error: e instanceof ApiError ? e.message : 'Failed to load health data. Check your connection.',
        noPatientProfile: false,
      }));
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  /**
   * Send a message to Alyna.
   * Calls AI analysis with refresh=true to get a fresh Orinn response,
   * then uses the narrative as Alyna's reply.
   */
  const sendAlynaMessage = useCallback(
    async (message: string): Promise<ChatMessage | null> => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      try {
        const recordId = state.patientMe?.ecg_records[0]?.id;
        if (!recordId) {
          return {
            id: Date.now().toString(),
            sender: 'alyna',
            message: 'Your ECG profile is not yet linked. Please contact your healthcare provider.',
            time: timeStr,
          };
        }

        const freshAnalysis = await api.assessments.getAIAnalysis({ recordId, refresh: true });
        const reply =
          freshAnalysis.analysis.narrative ||
          freshAnalysis.analysis.recommendation ||
          'Your ECG data looks stable. I have noted your message.';

        const chatReply: ChatMessage = {
          id: Date.now().toString(),
          sender: 'alyna',
          message: reply,
          time: timeStr,
        };

        setState((prev) => ({
          ...prev,
          aiAnalysis: freshAnalysis,
          alynaChat: [...prev.alynaChat, chatReply],
        }));

        return chatReply;
      } catch {
        const fallback: ChatMessage = {
          id: Date.now().toString(),
          sender: 'alyna',
          message: "I've noted that. Your biometrics look stable right now. Is there anything specific you'd like me to monitor?",
          time: timeStr,
        };
        setState((prev) => ({ ...prev, alynaChat: [...prev.alynaChat, fallback] }));
        return fallback;
      }
    },
    [state.patientMe]
  );

  return { ...state, sendAlynaMessage, reload: loadAll };
}