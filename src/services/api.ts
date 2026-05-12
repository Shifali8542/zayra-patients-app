/**
 * src/services/api.ts
 * ===================
 * Production API client — no mock data.
 *
 * Change API_BASE_URL to match your server:
 *   Local dev (Expo on device): 'http://192.168.1.172:8000'
 *   Production:                 'https://api.zayrahealth.com'
 */

import type {
  User,
  BackendUser,
  LoginResponse,
  RegisterResponse,
  PatientMe,
  ClinicalInfo,
  WaveformData,
  AIAnalysisResponse,
  PatientSTResult,
  AuthTokens,
  HealthMetric,
  TimelineEvent,
  RhythmStreak,
  ChatMessage,
} from '../types';

// ─── Config ──────────────────────────────────────────────────────────────────

export const API_BASE_URL = 'http://192.168.1.172:8000';

// ─── In-memory token store (set by AuthContext after login) ──────────────────

let _accessToken: string | null = null;
let _refreshToken: string | null = null;
let _onRefreshFailed: (() => void) | null = null;

export function setTokens(tokens: AuthTokens | null): void {
  _accessToken = tokens?.access ?? null;
  _refreshToken = tokens?.refresh ?? null;
}

export function setRefreshFailedCallback(cb: () => void): void {
  _onRefreshFailed = cb;
}

// ─── ApiError class ───────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, any>;
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

async function request<T>(endpoint: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, skipAuth = false, skipRefresh = false } = opts;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (!skipAuth && _accessToken) {
    headers['Authorization'] = `Bearer ${_accessToken}`;
  }

  const config: RequestInit = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const url = `${API_BASE_URL}${endpoint}`;
  let response = await fetch(url, config);

  // Auto-refresh on 401
  if (response.status === 401 && !skipAuth && !skipRefresh && _refreshToken) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${_accessToken}`;
      response = await fetch(url, { ...config, headers });
    } else {
      _onRefreshFailed?.();
      throw new ApiError('Session expired. Please log in again.', 401);
    }
  }

  if (!response.ok) {
    let errorBody: any = {};
    try { errorBody = await response.json(); } catch {}
    const message =
      errorBody?.detail ||
      errorBody?.message ||
      Object.values(errorBody)?.[0] ||
      `Request failed with status ${response.status}`;
    throw new ApiError(String(message), response.status);
  }

  if (response.status === 204) return undefined as unknown as T;
  return response.json() as Promise<T>;
}

async function tryRefreshToken(): Promise<boolean> {
  if (!_refreshToken) return false;
  try {
    const data = await request<{ access: string }>('/api/v1/auth/token/refresh/', {
      method: 'POST',
      body: { refresh: _refreshToken },
      skipAuth: true,
      skipRefresh: true,
    });
    _accessToken = data.access;
    return true;
  } catch {
    _accessToken = null;
    _refreshToken = null;
    return false;
  }
}

// ─── Mapper: BackendUser → User ───────────────────────────────────────────────

export function mapBackendUser(backendUser: BackendUser): User {
  return {
    ...backendUser,
    name: `${backendUser.first_name} ${backendUser.last_name}`.trim() || backendUser.email,
    journey: 'care',
    preferences: { theme: 'light', notifications: true, shareWithCircle: true },
    baseline: null,
  };
}

// ─── Derivation helpers ───────────────────────────────────────────────────────

export function deriveHealthMetric(
  clinical: ClinicalInfo | null,
  aiRiskScore: number | null,
  aiRiskLevel: string | null
): HealthMetric {
  const ecg = clinical?.ecg_analysis;

  let status: 'normal' | 'warning' | 'alert' = 'normal';
  if (aiRiskLevel === 'Critical' || aiRiskLevel === 'High') status = 'alert';
  else if (aiRiskLevel === 'Moderate') status = 'warning';
  else if (ecg?.rhythm && ecg.rhythm !== 'Normal Sinus Rhythm' && ecg.rhythm !== 'Unknown') {
    status = 'warning';
  }

  return {
    avgHr: ecg?.heart_rate_bpm ?? null,
    spo2: null,
    anomalies: aiRiskScore,
    signalStrength: ecg?.quality_score != null ? Math.round(ecg.quality_score * 100) : null,
    status,
    rhythm: ecg?.rhythm ?? null,
    hrv_ms: ecg?.hrv_ms ?? null,
  };
}

export function deriveTimeline(
  aiAnalysis: AIAnalysisResponse | null,
  stResult: PatientSTResult | null
): TimelineEvent[] {
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const events: TimelineEvent[] = [];

  if (stResult?.emergency_alert) {
    events.push({
      id: 'st-alert',
      time: timeStr,
      type: 'alert',
      title: `ST Alert: ${stResult.your_result}`,
      description: stResult.what_this_means,
      source: 'axiom',
    });
  }

  if (aiAnalysis?.analysis.findings) {
    const types: TimelineEvent['type'][] = ['observation', 'insight', 'confirmation'];
    aiAnalysis.analysis.findings.slice(0, 3).forEach((finding, i) => {
      events.push({
        id: `ai-${i}`,
        time: timeStr,
        type: types[i % types.length],
        title: finding,
        source: 'alyna',
      });
    });
  }

  if (events.length === 0 && aiAnalysis?.analysis.narrative) {
    events.push({
      id: 'narrative',
      time: timeStr,
      type: 'insight',
      title: aiAnalysis.analysis.narrative,
      source: 'alyna',
    });
  }

  return events;
}

export function deriveRhythmStreak(recordCount: number): RhythmStreak {
  const days = recordCount;
  const MILESTONES = [
    { label: 'SPARKED', days: 3 },
    { label: 'HELD', days: 7 },
    { label: 'EMBODIED', days: 21 },
    { label: 'GROUNDED', days: 30 },
    { label: 'ANCHORED', days: 90 },
    { label: 'SOVEREIGN', days: 365 },
  ];

  const milestones = MILESTONES.map((m, i) => {
    const achieved = days >= m.days;
    const next = MILESTONES[i + 1];
    const active = achieved && (!next || days < next.days);
    return { ...m, achieved, active };
  });

  const filled = days % 7 || (days > 0 ? 7 : 0);
  const weekDots = Array.from({ length: 7 }, (_, i) => i < filled);

  return { days, milestones, weekDots };
}

export function deriveAlynaInitialChat(aiAnalysis: AIAnalysisResponse | null): ChatMessage[] {
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const narrative = aiAnalysis?.analysis?.narrative;
  const recommendation = aiAnalysis?.analysis?.recommendation;

  if (!narrative) {
    return [{
      id: 'alyna-init',
      sender: 'alyna',
      message: 'Good morning. I am watching your ECG data. Ask me anything about your heart health.',
      time: timeStr,
    }];
  }

  const messages: ChatMessage[] = [
    { id: 'alyna-narrative', sender: 'alyna', message: narrative, time: timeStr },
  ];
  if (recommendation) {
    messages.push({
      id: 'alyna-rec',
      sender: 'alyna',
      message: `Recommendation: ${recommendation}`,
      time: timeStr,
    });
  }
  return messages;
}

export function deriveConsistencyAreas(clinical: ClinicalInfo | null) {
  const ecg = clinical?.ecg_analysis;
  if (!ecg) {
    return [
      { label: 'Heart Rhythm', value: 0 },
      { label: 'HRV Score', value: 0 },
      { label: 'Signal Quality', value: 0 },
      { label: 'Heart Rate Stability', value: 0 },
    ];
  }

  const heartRate = ecg.heart_rate_bpm
    ? Math.max(0, Math.min(100, Math.round(((ecg.heart_rate_bpm - 40) / 140) * 100)))
    : 0;
  const hrv = ecg.hrv_ms ? Math.max(0, Math.min(100, Math.round((ecg.hrv_ms / 100) * 100))) : 0;
  const quality = ecg.quality_score != null ? Math.round(ecg.quality_score * 100) : 0;
  const rhythmScore =
    ecg.rhythm === 'Normal Sinus Rhythm' ? 95 :
    ecg.rhythm === 'Bradycardia' ? 60 :
    ecg.rhythm === 'Tachycardia' ? 55 : 40;

  return [
    { label: 'Heart Rhythm', value: rhythmScore },
    { label: 'HRV Score', value: hrv },
    { label: 'Signal Quality', value: quality },
    { label: 'Heart Rate Stability', value: heartRate },
  ];
}

// ─── API Namespaces ───────────────────────────────────────────────────────────

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> => {
      const data = await request<LoginResponse>('/api/v1/auth/login/', {
        method: 'POST',
        body: { email, password },
        skipAuth: true,
      });
      setTokens({ access: data.access, refresh: data.refresh });
      return {
        user: mapBackendUser(data.user),
        tokens: { access: data.access, refresh: data.refresh },
      };
    },

    register: async (
      firstName: string,
      email: string,
      password: string
    ): Promise<{ user: User; tokens: AuthTokens }> => {
      const data = await request<RegisterResponse>('/api/v1/auth/register/user/', {
        method: 'POST',
        body: { first_name: firstName, last_name: '', email, password, confirm_password: password },
        skipAuth: true,
      });
      setTokens({ access: data.access, refresh: data.refresh });
      return {
        user: mapBackendUser(data.user),
        tokens: { access: data.access, refresh: data.refresh },
      };
    },

    logout: async (): Promise<void> => {
      if (!_refreshToken) return;
      try {
        await request<void>('/api/v1/auth/logout/', { method: 'POST', body: { refresh: _refreshToken } });
      } catch {
        // swallow — clear tokens regardless
      } finally {
        setTokens(null);
      }
    },

    getProfile: async (): Promise<User> => {
      const data = await request<BackendUser>('/api/v1/auth/profile/');
      return mapBackendUser(data);
    },
  },

  patient: {
    getMe: async (): Promise<PatientMe> =>
      request<PatientMe>('/api/v1/patients/me/'),

    getClinicalInfo: async (recordId?: number): Promise<ClinicalInfo> => {
      const qs = recordId ? `?record_id=${recordId}` : '';
      return request<ClinicalInfo>(`/api/v1/patients/me/clinical-info/${qs}`);
    },

    getWaveform: async (params?: {
      recordId?: number;
      channels?: string;
      downsample?: number;
    }): Promise<WaveformData> => {
      const qp = new URLSearchParams();
      if (params?.recordId) qp.set('record_id', String(params.recordId));
      if (params?.channels) qp.set('channels', params.channels);
      if (params?.downsample) qp.set('downsample', String(params.downsample));
      const qs = qp.toString() ? `?${qp.toString()}` : '';
      return request<WaveformData>(`/api/v1/patients/me/waveform/${qs}`);
    },
  },

  assessments: {
    getAIAnalysis: async (params?: {
      recordId?: number;
      refresh?: boolean;
    }): Promise<AIAnalysisResponse> => {
      const qp = new URLSearchParams();
      if (params?.recordId) qp.set('record_id', String(params.recordId));
      if (params?.refresh) qp.set('refresh', 'true');
      const qs = qp.toString() ? `?${qp.toString()}` : '';
      return request<AIAnalysisResponse>(`/api/v1/assessments/me/ai-analysis/${qs}`);
    },

    getSTResult: async (recordId?: number): Promise<PatientSTResult | null> => {
      const qs = recordId ? `?record_id=${recordId}` : '';
      try {
        return await request<PatientSTResult>(`/api/v1/assessments/st-elevation/me/${qs}`);
      } catch (e) {
        if (e instanceof ApiError && e.status === 404) return null;
        throw e;
      }
    },
  },
};