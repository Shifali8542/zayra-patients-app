import type {
User,
BackendUser,
AuthTokens,
LoginResponse,
RegisterResponse,
PatientMe,
ClinicalInfo,
AIAnalysisResponse,
PatientSTResult,
HealthMetric,
TimelineEvent,
RhythmStreak,
ChatMessage,
PaginatedTickets,
SupportTicketDetail,
SupportMessage,
CreateTicketPayload,
CsatPayload,
} from '../types';

export const API_BASE_URL = 'http://192.168.1.172:8000';

// In-memory token store 

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

// ApiError 

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

//Core fetch wrapper
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown>;
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
    const refreshed = await _tryRefreshToken();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${_accessToken}`;
      response = await fetch(url, { ...config, headers });
    } else {
      _onRefreshFailed?.();
      throw new ApiError('Session expired. Please log in again.', 401);
    }
  }

  if (!response.ok) {
    let errorBody: Record<string, unknown> = {};
    try { errorBody = await response.json(); } catch { /* ignore */ }
    const message =
      (errorBody?.detail as string) ||
      (errorBody?.message as string) ||
      String(Object.values(errorBody)[0] ?? '') ||
      `Request failed: ${response.status}`;
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as unknown as T;
  return response.json() as Promise<T>;
}

async function _tryRefreshToken(): Promise<boolean> {
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

// Maps BackendUser → app User. 
export function mapBackendUser(b: BackendUser): User {
  return {
    ...b,
    name: `${b.first_name} ${b.last_name}`.trim() || b.email,
    journey: 'care',
    preferences: { theme: 'light', notifications: true, shareWithCircle: true },
  };
}

// These build app-only types from raw backend responses.
export function deriveHealthMetric(
  clinical: ClinicalInfo | null,
  aiRiskLevel: string | null,
): HealthMetric {
  const ecg = clinical?.ecg_analysis ?? null;

  let status: 'normal' | 'warning' | 'alert' = 'normal';
  if (aiRiskLevel === 'Critical' || aiRiskLevel === 'High') status = 'alert';
  else if (aiRiskLevel === 'Moderate') status = 'warning';
  else if (ecg?.rhythm && ecg.rhythm !== 'Normal Sinus Rhythm' && ecg.rhythm !== 'Unknown') {
    status = 'warning';
  }

  return {
    avgHr: ecg?.heart_rate_bpm ?? null,
    hrv_ms: ecg?.hrv_ms ?? null,
    qrs_width_ms: ecg?.qrs_width_ms ?? null,
    signalStrength:
      ecg?.quality_score != null ? Math.round(ecg.quality_score * 100) : null,
    status,
    rhythm: ecg?.rhythm ?? null,
  };
}

export function deriveTimeline(
  aiAnalysis: AIAnalysisResponse | null,
  stResult: PatientSTResult | null,
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

  const TYPES: TimelineEvent['type'][] = ['observation', 'insight', 'confirmation'];
  (aiAnalysis?.analysis?.findings ?? []).slice(0, 3).forEach((finding, i) => {
    events.push({
      id: `finding-${i}`,
      time: timeStr,
      type: TYPES[i % TYPES.length],
      title: finding,
      source: 'alyna',
    });
  });

  if (events.length === 0 && aiAnalysis?.analysis?.narrative) {
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

export function deriveConsistencyAreas(clinical: ClinicalInfo | null) {
  const ecg = clinical?.ecg_analysis ?? null;
  if (!ecg) {
    return [
      { label: 'Heart Rhythm', value: 0 },
      { label: 'HRV Score', value: 0 },
      { label: 'Signal Quality', value: 0 },
      { label: 'Heart Rate Stability', value: 0 },
    ];
  }
  const hr = ecg.heart_rate_bpm
    ? Math.max(0, Math.min(100, Math.round(((ecg.heart_rate_bpm - 40) / 140) * 100)))
    : 0;
  const hrv = ecg.hrv_ms
    ? Math.max(0, Math.min(100, Math.round((ecg.hrv_ms / 100) * 100)))
    : 0;
  const quality = ecg.quality_score != null ? Math.round(ecg.quality_score * 100) : 0;
  const rhythmScore =
    ecg.rhythm === 'Normal Sinus Rhythm' ? 95 :
    ecg.rhythm === 'Bradycardia' ? 60 :
    ecg.rhythm === 'Tachycardia' ? 55 : 40;
  return [
    { label: 'Heart Rhythm', value: rhythmScore },
    { label: 'HRV Score', value: hrv },
    { label: 'Signal Quality', value: quality },
    { label: 'Heart Rate Stability', value: hr },
  ];
}

export function deriveAlynaInitialChat(
  aiAnalysis: AIAnalysisResponse | null,
): ChatMessage[] {
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

  const msgs: ChatMessage[] = [
    { id: 'alyna-narrative', sender: 'alyna', message: narrative, time: timeStr },
  ];
  if (recommendation) {
    msgs.push({
      id: 'alyna-rec',
      sender: 'alyna',
      message: `Recommendation: ${recommendation}`,
      time: timeStr,
    });
  }
  return msgs;
}

// API namespace

export const api = {
  // Auth

  auth: {
    login: async (
      email: string,
      password: string,
    ): Promise<{ user: User; tokens: AuthTokens }> => {
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

    /** POST /api/v1/auth/register/user/ */
    register: async (
      firstName: string,
      email: string,
      password: string,
    ): Promise<{ user: User; tokens: AuthTokens }> => {
      const data = await request<RegisterResponse>('/api/v1/auth/register/user/', {
        method: 'POST',
        body: {
          first_name: firstName,
          last_name: '',
          email,
          password,
          confirm_password: password,
        },
        skipAuth: true,
      });
      setTokens({ access: data.access, refresh: data.refresh });
      return {
        user: mapBackendUser(data.user),
        tokens: { access: data.access, refresh: data.refresh },
      };
    },

    /** POST /api/v1/auth/logout/ */
    logout: async (): Promise<void> => {
      if (!_refreshToken) return;
      try {
        await request<void>('/api/v1/auth/logout/', {
          method: 'POST',
          body: { refresh: _refreshToken },
        });
      } catch { } finally {
        setTokens(null);
      }
    },

    /** GET /api/v1/auth/profile/ */
    getProfile: async (): Promise<User> => {
      const data = await request<BackendUser>('/api/v1/auth/profile/');
      return mapBackendUser(data);
    },
  },

  // Patient 
  patient: {
    getMe: async (): Promise<PatientMe> =>
      request<PatientMe>('/api/v1/patients/me/'),

    getClinicalInfo: async (recordId?: number): Promise<ClinicalInfo> => {
      const qs = recordId ? `?record_id=${recordId}` : '';
      return request<ClinicalInfo>(`/api/v1/patients/me/clinical-info/${qs}`);
    },

    getMyWaveform: async (recordId?: number): Promise<{ waveforms: Record<string, number[]> } | null> => {
      const params = new URLSearchParams();
      if (recordId) params.set('record_id', String(recordId));
      params.set('channels', 'ii'); 
      params.set('downsample', '8');
      return request<{ waveforms: Record<string, number[]> }>(
        `/api/v1/patients/me/waveform/?${params.toString()}`
      );
    },

    bleUpload: async (payload: {
      patient_code: string;
      samples: number[];
      sampling_hz?: number;
      heart_rate_bpm?: number | null;
      hrv_ms?: number | null;
      age?: number | null;
      sex?: string | null;
      condition?: string | null;
    }): Promise<{ ai_prediction?: Record<string, unknown> }> =>
      request<{ ai_prediction?: Record<string, unknown> }>('/api/v1/patients/me/ble-upload/', {
        method: 'POST',
        body: {
          patient_code: payload.patient_code,
          samples: payload.samples,
          sampling_hz: payload.sampling_hz ?? 500,
          heart_rate_bpm: payload.heart_rate_bpm ?? null,
          hrv_ms: payload.hrv_ms ?? null,
          age: payload.age ?? null,
          sex: payload.sex ?? null,
          condition: payload.condition ?? null,
        },
      }),

  },

  // Assessments

  assessments: {
    // Returns cached Orinn result. No Orinn API call unless refresh=true.
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

    // GET /api/v1/assessments/st-elevation/me/?record_id=
    getSTResult: async (recordId?: number): Promise<PatientSTResult | null> => {
      const qs = recordId ? `?record_id=${recordId}` : '';
      try {
        return await request<PatientSTResult>(
          `/api/v1/assessments/st-elevation/me/${qs}`,
        );
      } catch (e) {
        if (e instanceof ApiError && e.status === 404) return null;
        throw e;
      }
   },
  },

  // Support 
  support: {
    getMyTickets: async (status?: string): Promise<PaginatedTickets> => {
      const qs = status ? `?status=${status}` : '';
      return request<PaginatedTickets>(`/api/v1/support/tickets/mine/${qs}`);
    },

    getTicketDetail: async (ticketId: number): Promise<SupportTicketDetail> =>
      request<SupportTicketDetail>(`/api/v1/support/tickets/${ticketId}/`),

    createTicket: async (payload: CreateTicketPayload): Promise<SupportTicketDetail> =>
      request<SupportTicketDetail>('/api/v1/support/tickets/', {
        method: 'POST',
        body: payload,
      }),

    getMessages: async (ticketId: number): Promise<SupportMessage[]> =>
      request<SupportMessage[]>(`/api/v1/support/tickets/${ticketId}/messages/`),


    sendMessage: async (ticketId: number, message: string): Promise<SupportMessage> =>
      request<SupportMessage>(`/api/v1/support/tickets/${ticketId}/messages/`, {
        method: 'POST',
        body: { message },
      }),


    submitCsat: async (ticketId: number, payload: CsatPayload): Promise<void> =>
      request<void>(`/api/v1/support/tickets/${ticketId}/csat/`, {
        method: 'POST',
        body: payload,
      }),
  },
};
