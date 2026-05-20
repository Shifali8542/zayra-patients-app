// Auth tokens 
export interface AuthTokens {
  access: string;
  refresh: string;
}

// Backend raw user 
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
}

// App-level User 
export interface User extends BackendUser {
  name: string;  
  journey: 'wellness' | 'care' | 'evac' | 'hospital';
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  shareWithCircle: boolean;
}

// Login / Register responses

export interface LoginResponse {
  message: string;
  user: BackendUser;
  access: string;
  refresh: string;
}

export interface RegisterResponse {
  message: string;
  user: BackendUser;
  access: string;
  refresh: string;
}

// ECGRecord
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

// PatientMe
export interface PatientMe {
  id: number;
  patient_code: string;
  age: number | null;
  sex: string | null;
  diagnosis: string | null;
  extra_info: Record<string, unknown>;
  ecg_records: ECGRecord[];
  record_count: number;
  diagnoses: string[];
  dataset_source: string | null;
  dataset_source_display: string | null;
}

// ECGAnalysis
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
  source?: 'cache' | 'live' | 'error';
  error?: string;
}

// ClinicalInfo 
export interface ClinicalInfo {
  patient_code: string;
  record_name: string;
  demographics: {
    age: number | null;
    sex: string | null;
    diagnosis: string | null;
  };
  clinical_summary: Record<string, unknown>;
  ecg_analysis: ECGAnalysis;
  record_info: {
    sampling_rate: number | null;
    num_channels: number | null;
    duration_seconds: number | null;
    channel_names: string[];
  };
  diagnoses: string[];
}

// WaveformData
export interface WaveformSegment {
  samples: number[];
  start_sec: number;
  end_sec: number;
}

export interface WaveformSegments {
  before: WaveformSegment;
  anomaly: WaveformSegment;
  after: WaveformSegment;
}

export interface WaveformSegment {
  samples: number[];
  start_sec: number;
  end_sec: number;
}

export interface WaveformData {
  patient_code: string;
  record_id: number;
  record_name: string;
  record_label: string;
  record_index: number;
  total_records: number;
  diagnosis: string | null;
  age: number | null;
  sex: string | null;
  sampling_rate: number;
  effective_sampling_rate: number;
  num_samples: number;
  duration_seconds: number | null;
  channel_names: string[];
  all_channel_names: string[];
  units: string[];
  waveforms: Record<string, number[]>;
  grid: {
    paper_speed_mm_per_sec: number;
    amplitude_mm_per_mv: number;
    small_box_ms: number;
    large_box_ms: number;
    small_box_mv: number;
    large_box_mv: number;
  };
  recommended_display_seconds: number;
  segments: {
    before: WaveformSegment;
    anomaly: WaveformSegment;
    after: WaveformSegment;
  };
  filtered: boolean;
}

// AIAnalysisResult
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

// AIAnalysisResponse
export interface AIAnalysisResponse {
  source: 'cache' | 'orinn';
  analysis: AIAnalysisResult;
}

// PatientSTResult
export interface PatientSTResult {
  your_result: string;
  what_this_means: string;
  heart_region: string;
  emergency_alert: boolean;
  last_checked: string;
}

// HeartReport 
export interface HeartReport {
  patient_code: string;
  record_id: number;
  record_name: string;
  record_label: string;
  record_index: number;
  total_records: number;
  dataset_source: string;
  dataset_source_display: string;
  demographics: {
    age: number | null;
    sex: string | null;
    diagnosis: string | null;
  };
  diagnoses: string[];
  ecg_metrics: ECGAnalysis | null;
  metrics_source: 'cache' | 'live' | 'error' | 'none';
  ai_analysis: AIAnalysisResult | null;
  st_result: HeartReportSTResult | null;
  metrics_available: boolean;
  ai_available: boolean;
  st_available: boolean;
}

// ST result shape inside heart-report 
export interface HeartReportSTResult {
  overall_status: string;
  overall_status_note: string;
  stemi_suspected: boolean;
  affected_region: string;
  emergency_alert: boolean;
  confidence_score: number;
  last_checked: string;
}

// Derived app-only types
export interface HealthMetric {
  avgHr: number | null;
  hrv_ms: number | null;
  qrs_width_ms: number | null;
  signalStrength: number | null;
  status: 'normal' | 'warning' | 'alert';
  rhythm: string | null;
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

export interface ChatMessage {
  id: string;
  sender: 'user' | 'alyna';
  message: string;
  time: string;
}

// App-defined static content
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
  emoji?: string;
  participants?: number;
  curator?: string;
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

// Navigation
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

// Tab order: Home | ECG | Alyna | Rhythm | Circle | Stories | Profile
export type TabParamList = {
  Home: undefined;
  ECG: undefined;
  Alyna: undefined;
  Rhythm: undefined;
  Circle: undefined;
  Stories: undefined;
  Profile: undefined;
};

// Customer Support
export type TicketStatus = 'open' | 'in_progress' | 'escalated' | 'resolved' | 'closed';
export type TicketSeverity = 'critical' | 'urgent' | 'normal' | 'resolved';
export type TicketCategory =
| 'device_sync'
| 'alyna_alert'
| 'billing'
| 'onboarding'
| 'evac_alert'
| 'other';
export interface SupportMessage {
id: number;
sender: string;
text: string;
time: string;
sent_at: string;
mine: boolean;
sender_type: 'customer' | 'agent' | 'system';
}
export interface SupportTicket {
id: number;
ticket_number: string;
title: string;
severity: TicketSeverity;
status: TicketStatus;
category: TicketCategory;
user_name: string;
user_plan: string;
tags: string[];
time_ago: string;
message_count: number;
assigned_to: { id: number; name: string } | null;
created_at: string;
}
export interface SupportTicketDetail extends SupportTicket {
description: string;
user_email: string | null;
member_since: string | null;
clinician: string | null;
note: string | null;
messages: SupportMessage[];
updated_at: string;
resolved_at: string | null;
}
export interface PaginatedTickets {
count: number;
next: string | null;
previous: string | null;
results: SupportTicket[];
}
export interface CreateTicketPayload extends Record<string, unknown> {
title: string;
description: string;
category: TicketCategory;
}
export interface CsatPayload extends Record<string, unknown> {
score: number;
comment?: string;
}
export interface WsChatMessage {
type: 'chat_message';
id: number;
sender: string;
sender_type: 'customer' | 'agent' | 'system';
text: string;
time: string;
sent_at: string;
mine: boolean;
}