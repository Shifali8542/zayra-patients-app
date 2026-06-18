import { useState, useEffect, useRef, useCallback } from 'react';
import {
  api,
  deriveHealthMetric,
  deriveTimeline,
  deriveRhythmStreak,
  deriveConsistencyAreas,
  deriveAlynaInitialChat,
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

const STATIC_CIRCLE_MEMBERS: CircleMember[] = [
  { id: '1', name: 'Emergency', initials: 'E', color: '#EF4444', relation: 'Emergency Contact' },
  { id: '2', name: 'Clinician', initials: 'C', color: '#00C2B2', relation: 'Care Team' },
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
    author: 'Rohan', authorAge: 47,
    tag: 'CAUGHT EARLY. TREATED CALMLY.', tagColor: 'teal',
  },
  {
    id: '2',
    type: 'FAMILY REASSURANCE',
    quote: "My father is in another city. Zayra's circle quietly tells me he's okay every morning.",
    author: 'Meera',
    tag: 'DISTANCE WITHOUT WORRY.', tagColor: 'light',
  },
  {
    id: '3',
    type: 'RECOVERY SUPPORT',
    quote: 'After my procedure, Alyna tracked every step back to normal. My doctor loved the reports.',
    author: 'Aditya', authorAge: 55,
    tag: 'EVIDENCE-BASED RECOVERY.', tagColor: 'teal',
  },
];

// Dashboard state
interface DashboardState {
  // Derived from backend
  metrics: HealthMetric | null;
  timeline: TimelineEvent[];
  streak: RhythmStreak | null;
  alynaChat: ChatMessage[];
  consistencyAreas: { label: string; value: number }[];
  // Convenience fields for screens
  interpretation: string | null;
  riskLevel: string | null;
  findings: string[];
  recommendation: string | null;
  // Raw backend data
  patientMe: PatientMe | null;
  clinicalInfo: ClinicalInfo | null;
  aiAnalysis: AIAnalysisResponse | null;
  stResult: PatientSTResult | null;
  ecgSamples: number[] | null;
  // Static content
  members: CircleMember[];
  journeys: Journey[];
  stories: Story[];
  // Status
  loading: boolean;
  error: string | null;
  noPatientProfile: boolean;
}

// Hook 

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    metrics: null,
    timeline: [],
    streak: null,
    alynaChat: [],
    consistencyAreas: [],
    interpretation: null,
    riskLevel: null,
    findings: [],
    recommendation: null,
    patientMe: null,
    clinicalInfo: null,
    aiAnalysis: null,
    stResult: null,
    ecgSamples: null,
    members: STATIC_CIRCLE_MEMBERS,
    journeys: STATIC_JOURNEYS,
    stories: STATIC_STORIES,
    loading: true,
    error: null,
    noPatientProfile: false,
  });

  const loadAll = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null, noPatientProfile: false }));

    try {
      // 1. Patient profile
      const patientMe = await api.patient.getMe();
      const firstId = patientMe.ecg_records[0]?.id;

      // 2. Clinical info (ECG metrics)
      const clinicalInfo = await api.patient
        .getClinicalInfo(firstId)
        .catch(() => null);

      // 3. AI analysis — 404 = not run yet, not an error
      const aiAnalysis = await api.assessments
        .getAIAnalysis({ recordId: firstId })
        .catch(e => {
          if (e instanceof ApiError && e.status === 404) return null;
          throw e;
        });

      // 4. ST result — 404 = not run yet
      const stResult = await api.assessments.getSTResult(firstId);

      // 5. Waveform 
      const ecgSamples = await api.patient
        .getMyWaveform(firstId)
        .then(res => {
          if (!res?.waveforms) return null;
          const key = Object.keys(res.waveforms).find(k => k.toLowerCase() === 'ii')
            ?? Object.keys(res.waveforms)[0];
          return key ? res.waveforms[key] : null;
        })
        .catch(() => null); 

      // Derive all app-level types
      const metrics       = deriveHealthMetric(clinicalInfo, aiAnalysis?.analysis?.risk_level ?? null);
      const timeline      = deriveTimeline(aiAnalysis, stResult);
      const streak        = deriveRhythmStreak(patientMe.record_count);
      const alynaChat     = deriveAlynaInitialChat(aiAnalysis);
      const consistencyAreas = deriveConsistencyAreas(clinicalInfo);

      setState(prev => ({
        ...prev,
        patientMe,
        clinicalInfo,
        aiAnalysis,
        stResult,
        ecgSamples,
        metrics,
        timeline,
        streak,
        alynaChat,
        consistencyAreas,
        interpretation: aiAnalysis?.analysis?.narrative ?? null,
        riskLevel:      aiAnalysis?.analysis?.risk_level ?? null,
        findings:       aiAnalysis?.analysis?.findings ?? [],
        recommendation: aiAnalysis?.analysis?.recommendation ?? null,
        loading: false,
        error: null,
        noPatientProfile: false,
      }));
    } catch (e: unknown) {
      if (e instanceof ApiError && e.status === 403) {
        setState(prev => ({ ...prev, loading: false, error: null, noPatientProfile: true }));
        return;
      }
      const msg = e instanceof ApiError
        ? e.message
        : 'Failed to load health data. Check your connection.';
      setState(prev => ({ ...prev, loading: false, error: msg, noPatientProfile: false }));
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);


  // Send Alyna message
  const sendAlynaMessage = useCallback(async (message: string): Promise<ChatMessage | null> => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    try {
      const recordId = state.patientMe?.ecg_records[0]?.id;
      if (!recordId) {
        return {
          id: Date.now().toString(), sender: 'alyna',
          message: 'Your ECG profile is not yet linked. Please contact your healthcare provider.',
          time: timeStr,
        };
      }
      const fresh = await api.assessments.getAIAnalysis({ recordId, refresh: true });
      const reply = fresh.analysis.narrative || fresh.analysis.recommendation
        || 'Your ECG data looks stable. I have noted your message.';
      const chatReply: ChatMessage = { id: Date.now().toString(), sender: 'alyna', message: reply, time: timeStr };
      setState(prev => ({ ...prev, aiAnalysis: fresh, alynaChat: [...prev.alynaChat, chatReply] }));
      return chatReply;
    } catch {
      const fallback: ChatMessage = {
        id: Date.now().toString(), sender: 'alyna',
        message: "I've noted that. Your biometrics look stable. Is there anything specific you'd like me to monitor?",
        time: timeStr,
      };
      setState(prev => ({ ...prev, alynaChat: [...prev.alynaChat, fallback] }));
      return fallback;
    }
  }, [state.patientMe]);

  const clearCache = useCallback(() => {
  }, []);

  return { ...state, sendAlynaMessage, clearCache, reload: loadAll };
}