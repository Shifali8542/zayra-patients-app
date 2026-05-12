import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../contexts/ThemeContext';
import { ECGChart } from '../../../../components/ui/ECGChart';
import { ecgStyles as styles } from './ECGScreen.style';
import type {
  PatientMe, WaveformData, HeartReport,
} from '../../../../types';

// ─── Types ─────────────────────────────────────────────────────────────────────

type SubScreen = 'records' | 'waveform' | 'report';

interface ECGScreenProps {
  patientMe: PatientMe | null;
  getWaveform: (recordId: number) => Promise<WaveformData | null>;
  getHeartReport: (recordId: number) => Promise<HeartReport | null>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(val: number | null | undefined): string {
  if (val == null) return '—';
  return String(Math.round(val));
}

function getSTColors(status: string | null): { bg: string; text: string } {
  if (!status) return { bg: 'rgba(107,114,128,0.12)', text: '#6B7280' };
  if (status.includes('STEMI')) return { bg: 'rgba(239,68,68,0.12)', text: '#EF4444' };
  if (status === 'Abnormal') return { bg: 'rgba(245,158,11,0.12)', text: '#D97706' };
  if (status === 'At Risk') return { bg: 'rgba(245,158,11,0.10)', text: '#D97706' };
  return { bg: 'rgba(16,185,129,0.12)', text: '#059669' };
}

// ─── Sub-screen: My Records ───────────────────────────────────────────────────

function RecordsSubScreen({
  patientMe,
  onSelectRecord,
  theme,
}: {
  patientMe: PatientMe | null;
  onSelectRecord: (id: number, to: SubScreen) => void;
  theme: any;
}) {
  if (!patientMe || patientMe.ecg_records.length === 0) {
    return (
      <View style={[styles.emptyCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder, margin: 16 }]}>
        <Text style={{ fontSize: 32 }}>📋</Text>
        <Text style={[styles.emptyText, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.sm }]}>
          No ECG records found for your profile.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.recordsList} showsVerticalScrollIndicator={false}>
      {patientMe.ecg_records.map((record, i) => (
        <TouchableOpacity
          key={record.id}
          style={[styles.recordCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder, ...theme.shadow.card }]}
          activeOpacity={0.8}
          onPress={() => onSelectRecord(record.id, 'waveform')}
        >
          <View style={styles.recordHeader}>
            <Text style={[styles.recordLabel, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.h2 }]}>
              ECG {i + 1}
            </Text>
            <View style={[styles.datasetBadge, { backgroundColor: theme.colors.tealAlpha10 }]}>
              <Text style={[styles.datasetBadgeText, { color: theme.colors.primary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xxs }]}>
                {patientMe.dataset_source?.replace(/_/g, ' ').toUpperCase() ?? 'ECG'}
              </Text>
            </View>
          </View>

          <View style={styles.recordMetaRow}>
            <View>
              <Text style={[styles.recordMetaValue, { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.sm }]}>
                {record.duration_seconds != null ? `${Math.round(record.duration_seconds)}s` : '—'}
              </Text>
              <Text style={[styles.recordMetaLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xxs }]}>
                Duration
              </Text>
            </View>
            <View>
              <Text style={[styles.recordMetaValue, { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.sm }]}>
                {record.num_channels ?? '—'}
              </Text>
              <Text style={[styles.recordMetaLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xxs }]}>
                Leads
              </Text>
            </View>
            <View>
              <Text style={[styles.recordMetaValue, { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.sm }]}>
                {record.sampling_rate != null ? `${record.sampling_rate} Hz` : '—'}
              </Text>
              <Text style={[styles.recordMetaLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xxs }]}>
                Sample Rate
              </Text>
            </View>
          </View>

          {patientMe.diagnoses[0] && (
            <Text
              style={[styles.recordDiagnosis, { color: theme.colors.textSecondary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xs }]}
              numberOfLines={2}
            >
              {patientMe.diagnoses[0]}
            </Text>
          )}

          <View style={styles.recordActions}>
            <TouchableOpacity onPress={() => onSelectRecord(record.id, 'waveform')} activeOpacity={0.8}>
              <Text style={[styles.recordActionText, { color: theme.colors.primary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
                Waveform →
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onSelectRecord(record.id, 'report')} activeOpacity={0.8}>
              <Text style={[styles.recordActionText, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
                Heart Report →
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ─── Sub-screen: Waveform ─────────────────────────────────────────────────────

function WaveformSubScreen({
  patientMe,
  selectedRecordId,
  onSelectRecord,
  getWaveform,
  theme,
}: {
  patientMe: PatientMe | null;
  selectedRecordId: number | null;
  onSelectRecord: (id: number) => void;
  getWaveform: (id: number) => Promise<WaveformData | null>;
  theme: any;
}) {
  const [waveform, setWaveform] = useState<WaveformData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedRecordId) return;
    setLoading(true);
    getWaveform(selectedRecordId).then(data => {
      setWaveform(data);
      setLoading(false);
    });
  }, [selectedRecordId]);

  const records = patientMe?.ecg_records ?? [];

  return (
    <ScrollView style={styles.waveformScroll} contentContainerStyle={styles.waveformContent} showsVerticalScrollIndicator={false}>
      {/* Record selector tabs */}
      {records.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recordSelector}>
          {records.map((r, i) => {
            const isActive = r.id === selectedRecordId;
            return (
              <TouchableOpacity
                key={r.id}
                style={[styles.recordTab, {
                  backgroundColor: isActive ? theme.colors.primary : theme.colors.surfaceAlt,
                  borderColor: isActive ? theme.colors.primary : theme.colors.divider,
                }]}
                onPress={() => onSelectRecord(r.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.recordTabText, {
                  color: isActive ? '#FFFFFF' : theme.colors.textSecondary,
                  fontFamily: isActive ? theme.fonts.sansSemiBold : theme.fonts.sansRegular,
                  fontSize: theme.fontSize.xs,
                }]}>
                  ECG {i + 1}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Waveform card */}
      <View style={[styles.waveformCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder, ...theme.shadow.card }]}>
        <View style={styles.waveformHeader}>
          <Text style={[styles.waveformTitle, { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.sm }]}>
            {waveform ? `Lead II — ${waveform.record_name}` : 'ECG Waveform'}
          </Text>
          {waveform && (
            <View style={[styles.hrBadge, { backgroundColor: theme.colors.tealAlpha10 }]}>
              <Text style={[styles.hrBadgeText, { color: theme.colors.primary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
                {waveform.sampling_rate} Hz
              </Text>
            </View>
          )}
        </View>

        {loading ? (
          <View style={styles.waveformLoading}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={[styles.waveformLoadingText, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xs }]}>
              Loading ECG from S3…
            </Text>
          </View>
        ) : (
          <View style={styles.waveformChartWrap}>
            {/* ECGChart renders the animated waveform — real data feeds it when available */}
            <ECGChart height={80} />
          </View>
        )}

        {waveform && (
          <Text style={[styles.waveformMeta, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xs, marginTop: 8 }]}>
            {waveform.duration_seconds != null ? `${Math.round(waveform.duration_seconds)}s` : '—'} · {waveform.channel_names.length} leads · {waveform.effective_sampling_rate} Hz effective
          </Text>
        )}
      </View>

      {/* Patient info */}
      {waveform && (
        <View style={[styles.waveformInfoCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder, ...theme.shadow.card }]}>
          <Text style={[styles.waveformInfoLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
            PATIENT
          </Text>
          <Text style={[{ color: theme.colors.textPrimary, fontFamily: theme.fonts.sansMedium, fontSize: theme.fontSize.sm, marginTop: 4 }]}>
            {waveform.patient_code}
            {waveform.age != null ? ` · ${waveform.age}y` : ''}
            {waveform.sex ? ` · ${waveform.sex}` : ''}
          </Text>
          {waveform.diagnosis && (
            <Text style={[{ color: theme.colors.textSecondary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xs, marginTop: 4, lineHeight: 18 }]}>
              {waveform.diagnosis}
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

// ─── Sub-screen: Heart Report ─────────────────────────────────────────────────

function HeartReportSubScreen({
  patientMe,
  selectedRecordId,
  onSelectRecord,
  getHeartReport,
  theme,
}: {
  patientMe: PatientMe | null;
  selectedRecordId: number | null;
  onSelectRecord: (id: number) => void;
  getHeartReport: (id: number) => Promise<HeartReport | null>;
  theme: any;
}) {
  const [report, setReport] = useState<HeartReport | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedRecordId) return;
    setLoading(true);
    getHeartReport(selectedRecordId).then(data => {
      setReport(data);
      setLoading(false);
    });
  }, [selectedRecordId]);

  const records = patientMe?.ecg_records ?? [];
  const ecg = report?.ecg_metrics;
  const ai = report?.ai_analysis;
  const st = report?.st_result;
  const stColors = getSTColors(st?.overall_status ?? null);

  return (
    <ScrollView style={styles.reportScroll} contentContainerStyle={styles.reportContent} showsVerticalScrollIndicator={false}>
      {/* Record selector */}
      {records.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recordSelector}>
          {records.map((r, i) => {
            const isActive = r.id === selectedRecordId;
            return (
              <TouchableOpacity
                key={r.id}
                style={[styles.recordTab, {
                  backgroundColor: isActive ? theme.colors.primary : theme.colors.surfaceAlt,
                  borderColor: isActive ? theme.colors.primary : theme.colors.divider,
                }]}
                onPress={() => onSelectRecord(r.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.recordTabText, {
                  color: isActive ? '#FFFFFF' : theme.colors.textSecondary,
                  fontFamily: isActive ? theme.fonts.sansSemiBold : theme.fonts.sansRegular,
                  fontSize: theme.fontSize.xs,
                }]}>
                  ECG {i + 1}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {loading ? (
        <View style={styles.reportLoading}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[{ color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.sm }]}>
            Loading heart report…
          </Text>
        </View>
      ) : !report ? (
        <View style={[styles.emptyCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder }]}>
          <Text style={{ fontSize: 32 }}>🫀</Text>
          <Text style={[styles.emptyText, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.sm }]}>
            Heart report not yet available for this record.
          </Text>
        </View>
      ) : (
        <>
          {/* Header */}
          <View style={styles.reportHeader}>
            <Text style={[styles.reportHeaderLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
              {report.dataset_source_display} · {report.record_label}
            </Text>
            <Text style={[styles.reportHeaderTitle, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.h2 }]}>
              Heart Report
            </Text>
          </View>

          {/* ECG Metrics */}
          {report.metrics_available && ecg && (
            <View style={[styles.reportCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder, ...theme.shadow.card }]}>
              <Text style={[styles.reportCardTitle, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
                ECG Metrics
              </Text>
              <View style={styles.metricsGrid}>
                <View style={styles.metricRow}>
                  <View style={[styles.metricCard, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.divider }]}>
                    <Text style={[styles.metricValue, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.xl }]}>
                      {fmt(ecg.heart_rate_bpm)}
                    </Text>
                    <Text style={[styles.metricLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xxs }]}>Heart Rate</Text>
                    <Text style={[styles.metricHint, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xxs }]}>normal: 60–100 bpm</Text>
                  </View>
                  <View style={[styles.metricCard, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.divider }]}>
                    <Text style={[styles.metricValue, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.xl }]}>
                      {fmt(ecg.hrv_ms)}
                    </Text>
                    <Text style={[styles.metricLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xxs }]}>HRV</Text>
                    <Text style={[styles.metricHint, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xxs }]}>higher = better</Text>
                  </View>
                </View>
                <View style={styles.metricRow}>
                  <View style={[styles.metricCard, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.divider }]}>
                    <Text style={[styles.metricValue, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.xl }]}>
                      {fmt(ecg.qrs_width_ms)}
                    </Text>
                    <Text style={[styles.metricLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xxs }]}>QRS Width</Text>
                    <Text style={[styles.metricHint, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xxs }]}>normal: 70–110 ms</Text>
                  </View>
                  <View style={[styles.metricCard, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.divider }]}>
                    <Text style={[styles.metricValue, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.xl }]}>
                      {fmt(ecg.qt_ms)}
                    </Text>
                    <Text style={[styles.metricLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xxs }]}>QT Interval</Text>
                    <Text style={[styles.metricHint, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xxs }]}>normal: 350–440 ms</Text>
                  </View>
                </View>
                {/* Rhythm — full width */}
                <View style={[styles.metricCardFull, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.divider }]}>
                  <View style={styles.rhythmRow}>
                    <Text style={[styles.metricLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xxs }]}>Rhythm</Text>
                    <Text style={[{ color: theme.colors.textPrimary, fontFamily: theme.fonts.sansMedium, fontSize: theme.fontSize.sm }]}>
                      {ecg.rhythm ?? '—'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Diagnoses */}
          {report.diagnoses.length > 0 && (
            <View style={[styles.reportCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder, ...theme.shadow.card }]}>
              <Text style={[styles.reportCardTitle, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
                Diagnosis
              </Text>
              <View style={styles.diagnosisList}>
                {report.diagnoses.map((d, i) => (
                  <View key={i} style={styles.diagnosisRow}>
                    <View style={[styles.diagnosisDot, { backgroundColor: theme.colors.primary }]} />
                    <Text style={[styles.diagnosisText, { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.sm }]}>{d}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ST Elevation */}
          {report.st_available && st && (
            <View style={[styles.reportCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder, ...theme.shadow.card }]}>
              <Text style={[styles.reportCardTitle, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
                ST Analysis
              </Text>
              <View style={styles.stRow}>
                <Text style={[{ color: theme.colors.textSecondary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.sm }]}>Status</Text>
                <View style={[styles.stBadge, { backgroundColor: stColors.bg }]}>
                  <Text style={[styles.stBadgeText, { color: stColors.text, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
                    {st.overall_status}
                  </Text>
                </View>
              </View>
              {st.overall_status_note && (
                <Text style={[styles.stNote, { color: theme.colors.textSecondary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xs }]}>
                  {st.overall_status_note}
                </Text>
              )}
              <Text style={[{ color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xs, marginTop: 6 }]}>
                Last checked: {st.last_checked}
              </Text>
            </View>
          )}

          {/* AI Analysis */}
          {report.ai_available && ai && (
            <View style={[styles.reportCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder, ...theme.shadow.card }]}>
              <Text style={[styles.reportCardTitle, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
                AI Analysis
              </Text>
              {ai.narrative && (
                <Text style={[{ color: theme.colors.textPrimary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.sm, lineHeight: 20, marginBottom: 12 }]}>
                  {ai.narrative}
                </Text>
              )}
              {ai.findings.length > 0 && (
                <View style={styles.findingsList}>
                  {ai.findings.map((f, i) => (
                    <View key={i} style={styles.findingRow}>
                      <View style={[styles.findingDot, { backgroundColor: theme.colors.primary }]} />
                      <Text style={[styles.findingText, { color: theme.colors.textSecondary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xs }]}>{f}</Text>
                    </View>
                  ))}
                </View>
              )}
              {ai.recommendation && (
                <View style={[styles.recommendationBox, { backgroundColor: theme.colors.tealAlpha10, borderRadius: 12, padding: 12, marginTop: 10 }]}>
                  <Text style={[{ color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xxs, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }]}>
                    Recommendation
                  </Text>
                  <Text style={[{ color: theme.colors.textPrimary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.sm, lineHeight: 20 }]}>
                    {ai.recommendation}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* No AI message */}
          {!report.ai_available && (
            <View style={[styles.emptyCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder }]}>
              <Text style={{ fontSize: 24 }}>🤖</Text>
              <Text style={[styles.emptyText, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.sm }]}>
                AI analysis not yet run for this record. Contact your care team.
              </Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

// ─── Main ECGScreen ───────────────────────────────────────────────────────────

export function ECGScreen({ patientMe, getWaveform, getHeartReport }: ECGScreenProps) {
  const { theme } = useTheme();
  const [subScreen, setSubScreen] = useState<SubScreen>('records');
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(
    patientMe?.ecg_records[0]?.id ?? null,
  );

  const SUB_TABS: { key: SubScreen; label: string }[] = [
    { key: 'records', label: 'Records' },
    { key: 'waveform', label: 'Waveform' },
    { key: 'report', label: 'Heart Report' },
  ];

  const handleSelectRecord = (id: number, to: SubScreen = 'waveform') => {
    setSelectedRecordId(id);
    setSubScreen(to);
  };

  return (
    <View style={styles.container}>
      {/* Sub-nav */}
      <View style={[styles.subNav, { backgroundColor: theme.colors.surfaceAlt }]}>
        {SUB_TABS.map(tab => {
          const isActive = subScreen === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.subNavBtn, { backgroundColor: isActive ? theme.colors.card : 'transparent' }]}
              onPress={() => setSubScreen(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.subNavText, {
                color: isActive ? theme.colors.textPrimary : theme.colors.textTertiary,
                fontFamily: isActive ? theme.fonts.sansSemiBold : theme.fonts.sansRegular,
                fontSize: theme.fontSize.xs,
              }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Sub-screens */}
      {subScreen === 'records' && (
        <RecordsSubScreen patientMe={patientMe} onSelectRecord={handleSelectRecord} theme={theme} />
      )}
      {subScreen === 'waveform' && (
        <WaveformSubScreen
          patientMe={patientMe}
          selectedRecordId={selectedRecordId}
          onSelectRecord={(id) => handleSelectRecord(id, 'waveform')}
          getWaveform={getWaveform}
          theme={theme}
        />
      )}
      {subScreen === 'report' && (
        <HeartReportSubScreen
          patientMe={patientMe}
          selectedRecordId={selectedRecordId}
          onSelectRecord={(id) => handleSelectRecord(id, 'report')}
          getHeartReport={getHeartReport}
          theme={theme}
        />
      )}
    </View>
  );
}