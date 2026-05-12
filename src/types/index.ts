// ─── Auth & User (matches backend: UserProfileSerializer) ────────────────────

export interface User {
  id: number;                   // backend returns integer
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: 'admin' | 'doctor' | 'nurse' | 'patient';
  created_at: string;
  specialization: string | null;
  license_number: string | null;
  hospital_name: string | null;
  years_of_experience: number | null;
  qualification: string | null;
  is_doctor: boolean;
  is_patient: boolean;

  // ── App-level fields (not from backend) ──────────────────────────────────
  name: string;                 // derived: `${first_name} ${last_name}`.trim()
  journey: 'wellness' | 'care' | 'evac' | 'hospital';
  preferences: UserPreferences;
  baseline: UserBaseline | null;
}

export interface UserBaseline {
  hrv: number | null;
  restingHr: number | null;
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

export interface AuthTokens {
  access: string;
  refresh: string;
}

// ─── Backend Auth Response Shapes ─────────────────────────────────────────────

/** POST /api/v1/auth/login/ */
export interface LoginResponse {
  message: string;
  user: BackendUser;
  access: string;
  refresh: string;
}

/** POST /api/v1/auth/register/user/ */
export interface RegisterResponse {
  message: string;
  user: BackendUser;
  access: string;
  refresh: string;
}

/**
 * Raw backend user — exactly as returned by UserProfileSerializer.
 * Mapped to the richer `User` type via mapBackendUser() in api.ts.
 */
export interface BackendUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: 'admin' | 'doctor' | 'nurse' | 'patient';
  created_at: string;
  specialization: string | null;
  license_number: string | null;
  hospital_name: string | null;
  years_of_experience: number | null;
  qualification: string | null;
  is_doctor: boolean;
  is_patient: boolean;
  patient_count?: number;
  ecg_record_count?: number;
}

// ─── Patient / ECG (apps/patients/serializers.py) ────────────────────────────

/** PatientMeSerializer — GET /api/v1/patients/me/ */
export interface PatientMe {
  id: number;
  patient_code: string;
  age: number | null;
  sex: string | null;
  diagnosis: string | null;
  extra_info: Record<string, any>;
  ecg_records: ECGRecord[];
  record_count: number;
  diagnoses: string[];
}

/** ECGRecordSerializer */
export interface ECGRecord {
  id: number;
  record_name: string;
  record_index: number;
  sampling_rate: number | null;
  num_channels: number | null;
  channel_names: string[];
  num_samples: number | null;
  duration_seconds: number | null;
  split: 'train' | 'validation' | 'test' | null;
}

/** GET /api/v1/patients/me/clinical-info/ */
export interface ClinicalInfo {
  patient_code: string;
  record_name: string;
  demographics: {
    age: number | null;
    sex: string | null;
    diagnosis: string | null;
  };
  clinical_summary: Record<string, any>;
  ecg_analysis: ECGAnalysis;
  record_info: {
    sampling_rate: number | null;
    num_channels: number | null;
    duration_seconds: number | null;
    channel_names: string[];
  };
  diagnoses: string[];
}

/** ECG analysis metrics — from ecg_analyzer.py (NeuroKit2) */
export interface ECGAnalysis {
  heart_rate_bpm: number | null;
  heart_rate_min: number | null;
  heart_rate_max: number | null;
  hrv_ms: number | null;
  num_beats: number;
  rhythm: string;
  quality_score: number | null;
  qrs_width_ms: number | null;
  qt_ms: number | null;
  qtc_ms: number | null;
  source?: 'cache' | 'live';
  error?: string;
}

/** GET /api/v1/patients/me/waveform/ */
export interface WaveformData {
  patient_code: string;
  record_name: string;
  diagnosis: string | null;
  age: number | null;
  sex: string | null;
  sampling_rate: number;
  effective_sampling_rate: number;
  num_samples: number;
  duration_seconds: number | null;
  channel_names: string[];
  waveforms: Record<string, number[]>;
  grid: ECGGrid;
  recommended_display_seconds: number;
}

export interface ECGGrid {
  paper_speed_mm_per_sec: number;
  amplitude_mm_per_mv: number;
  small_box_ms: number;
  large_box_ms: number;
  small_box_mv: number;
  large_box_mv: number;
}

// ─── Cardio Assessments (apps/cardio_assessments/serializers.py) ─────────────

/** GET /api/v1/assessments/me/ai-analysis/ */
export interface AIAnalysisResult {
  id: number;
  risk_level: 'Low' | 'Moderate' | 'High' | 'Critical' | null;
  risk_score: number | null;
  findings: string[];
  differential: string[];
  narrative: string | null;
  recommendation: string | null;
  created_at: string;
}

export interface AIAnalysisResponse {
  source: 'cache' | 'orinn';
  analysis: AIAnalysisResult;
}

/** GET /api/v1/assessments/st-elevation/me/ — patient-friendly shape */
export interface PatientSTResult {
  your_result: string;
  what_this_means: string;
  heart_region: string;
  emergency_alert: boolean;
  last_checked: string;
}

// ─── Derived / App-Only types ─────────────────────────────────────────────────

/**
 * HealthMetric — assembled in useDashboard from real backend data:
 *   avgHr        ← clinical_info.ecg_analysis.heart_rate_bpm
 *   hrv_ms       ← clinical_info.ecg_analysis.hrv_ms
 *   rhythm       ← clinical_info.ecg_analysis.rhythm
 *   signalStrength ← clinical_info.ecg_analysis.quality_score × 100
 *   anomalies    ← ai_analysis.risk_score (proxy)
 *   spo2         ← null (wearable-only, not in backend)
 *   status       ← derived from risk_level / rhythm
 */
export interface HealthMetric {
  avgHr: number | null;
  spo2: number | null;
  anomalies: number | null;
  signalStrength: number | null;
  status: 'normal' | 'warning' | 'alert';
  rhythm: string | null;
  hrv_ms: number | null;
}

/** TimelineEvent — synthesized from AI findings + ST alert */
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

/** RhythmStreak — derived from patient's ECG record_count */
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

/** ChatMessage — local state only; history not stored on backend */
export interface ChatMessage {
  id: string;
  sender: 'user' | 'alyna';
  message: string;
  time: string;
}

/**
 * Circle / Journey / Story — no backend endpoints in this version.
 * Static app-defined content in useDashboard.ts.
 */
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

export interface Story {
  id: string;
  type: string;
  quote: string;
  author: string;
  authorAge?: number;
  tag: string;
  tagColor: string;
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

export interface ApiError {
  detail?: string;
  message?: string;
  [key: string]: any;
}