import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../contexts/ThemeContext';
import { ZayraLogo } from '../../../../components/ui/ZayraLogo';
import { useAuth } from '../../../../contexts/AuthContext';
import { ECGChart } from '../../../../components/ui/ECGChart';
import { PulsingDot } from '../../../../components/ui/PulsingDot';
import { useBLEContext } from '../../../../contexts/BLEContext';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { homeStyles as styles } from './HomeScreen.style';
import type { HealthMetric, TimelineEvent, TimelineEventType, PatientSTResult } from '../../../../types';

interface HomeScreenProps {
  metrics: HealthMetric | null;
  timeline: TimelineEvent[];
  interpretation: string | null;
  stResult: PatientSTResult | null;
  journey?: 'wellness' | 'care' | 'evac' | 'hospital';
  ecgSamples?: number[] | null;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'GOOD MORNING';
  if (hour < 17) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
}

function getTimelineColors(type: TimelineEventType, theme: any) {
  switch (type) {
    case 'observation': return { bg: theme.colors.tealAlpha20, dot: theme.colors.primary };
    case 'confirmation': return { bg: 'rgba(59,130,246,0.12)', dot: '#3B82F6' };
    case 'alert': return { bg: 'rgba(239,68,68,0.12)', dot: '#EF4444' };
    case 'insight': return { bg: 'rgba(139,92,246,0.12)', dot: '#8B5CF6' };
    default: return { bg: 'rgba(107,114,128,0.12)', dot: '#6B7280' };
  }
}

function fmt(val: number | null | undefined, decimals = 0): string {
  if (val == null) return '—';
  return decimals > 0 ? val.toFixed(decimals) : String(Math.round(val));
}

export function HomeScreen({ metrics, timeline, interpretation, stResult, journey = 'care', ecgSamples = null }: HomeScreenProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { status: bleStatus, connect, disconnect } = useBLEContext();
  const isConnected = bleStatus === 'streaming';
  const isTransitional = ['scanning', 'connecting', 'discovering', 'reconnecting'].includes(bleStatus);
  const isEvac = journey === 'evac';
  const isWellness = journey === 'wellness';
  const isHospital = journey === 'hospital';
  const bleLabel = {
    idle: 'Connect Axiom',
    scanning: 'Scanning…',
    connecting: 'Connecting…',
    discovering: 'Setting up…',
    streaming: 'Disconnect',
    reconnecting: 'Reconnecting…',
    disconnected: 'Reconnect',
    error: 'Retry',
  }[bleStatus] ?? 'Connect Axiom';
  const firstName = user?.first_name?.toLowerCase() || user?.name?.toLowerCase() || '';

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* App header bar */}
      <View style={styles.appHeader}>
        <ZayraLogo size={28} showText={false} variant="icon" />
        <View style={[
          styles.journeyBadge,
          {
            borderColor: isEvac ? 'rgba(255,255,255,0.15)' : theme.colors.border,
            backgroundColor: isEvac ? 'rgba(255,255,255,0.05)' : theme.colors.surface,
          },
        ]}>
          <Text style={[styles.journeyBadgeText, {
            color: isEvac ? '#7DDDD5' : theme.colors.textSecondary,
            fontFamily: theme.fonts.sansSemiBold,
            fontSize: theme.fontSize.xs,
          }]}>
            {isEvac ? '🛡 Evac armed' : `● ${journey}`}
          </Text>
        </View>
      </View>

      {/* Greeting */}
      <View style={styles.greetingRow}>
        <View>
          <Text style={[styles.greetingLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
            {getGreeting()}
          </Text>
          <Text style={[styles.greetingName, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.h2 }]}>
            {firstName}.
          </Text>
        </View>
        <StatusBadge label={user?.journey ?? 'care'} />
      </View>

      {/* Evac */}
      {isEvac && (
        <View style={[styles.evacCTA, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }]}>
          <View style={styles.evacCTALeft}>
            <Text style={[styles.evacCTALabel, { color: 'rgba(13,27,42,0.70)' }]}>Response Center</Text>
            <Text style={[styles.evacCTATitle, { color: theme.colors.navy }]}>Activate assisted response</Text>
            <Text style={[styles.evacCTASub, { color: 'rgba(13,27,42,0.80)' }]}>Ambulance · NOK · Hospital pre-alert</Text>
          </View>
          <View style={styles.evacCTAIcon}>
            <Text style={styles.evacCTAEmoji}>📞</Text>
          </View>
        </View>
      )}

      {/* ── Evac: Grid Cards ── */}
      {isEvac && (
        <View style={styles.evacGrid}>
          {[
            { emoji: '📍', title: 'Nearest Hospital', sub: 'Apollo · 6 min' },
            { emoji: '🏥', title: 'ER Pre-alert',     sub: 'Ready' },
            { emoji: '👥', title: 'Next of Kin',      sub: '2 linked' },
            { emoji: '📋', title: 'Med Summary',      sub: 'Up to date' },
          ].map(({ emoji, title, sub }) => (
            <View key={title} style={[styles.evacCard, { borderColor: 'rgba(255,255,255,0.10)', backgroundColor: 'rgba(255,255,255,0.05)' }]}>
              <Text style={styles.evacCardEmoji}>{emoji}</Text>
              <Text style={[styles.evacCardTitle, { color: '#FFFFFF', fontFamily: theme.fonts.sansMedium }]}>{title}</Text>
              <Text style={[styles.evacCardSub, { color: '#7DDDD5' }]}>{sub}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Wellness: Body */}
      {isWellness && (
        <View style={[styles.wellnessCard, { shadowColor: theme.colors.primary }]}>
          <LinearGradient
            colors={theme.gradients.pulse as [string, string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.wellnessCardGrad}
          >
            <Text style={styles.wellnessBriefLabel}>Body Brief</Text>
            <Text style={styles.wellnessBriefText}>
              You recovered well overnight. Stress trended low. Today is a green-light day.
            </Text>
            <View style={styles.wellnessMetricsRow}>
              <View style={styles.wellnessRingPlaceholder}>
                <Text style={styles.wellnessRingValue}>
                  {metrics?.hrv_ms != null ? Math.min(99, Math.round(metrics.hrv_ms * 1.35)) : 84}
                </Text>
                <Text style={styles.wellnessRingLabel}>Readiness</Text>
              </View>
              <View style={styles.wellnessMetricsList}>
                {[
                  { label: 'Sleep', val: '7h 42m' },
                  { label: 'HRV', val: metrics?.hrv_ms != null ? `${Math.round(metrics.hrv_ms)} ms` : '— ms' },
                  { label: 'Resting HR', val: metrics?.avgHr != null ? `${Math.round(metrics.avgHr)} bpm` : '— bpm' },
                ].map((m) => (
                  <View key={m.label} style={styles.wellnessMetricItem}>
                    <Text style={styles.wellnessMetricLabel}>{m.label}</Text>
                    <Text style={styles.wellnessMetricVal}>{m.val}</Text>
                  </View>
                ))}
              </View>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* ── Wellness: Today's signals grid ── */}
      {isWellness && (
        <View>
          <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
            TODAY'S SIGNALS
          </Text>
          <View style={styles.signalsGrid}>
            {[
              { emoji: '🫀', label: 'Pulse', value: metrics?.avgHr != null ? `${Math.round(metrics.avgHr)}` : '—', unit: 'bpm' },
              { emoji: '⚡', label: 'Stress', value: 'Calm', unit: '' },
              { emoji: '🌙', label: 'Recovery', value: metrics?.signalStrength != null ? `${Math.round(metrics.signalStrength * 0.84)}%` : '84%', unit: '' },
              { emoji: '💧', label: 'Hydration', value: '68%', unit: '' },
            ].map((s) => (
              <View key={s.label} style={[styles.signalCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Text style={styles.signalEmoji}>{s.emoji}</Text>
                <Text style={[styles.signalLabel, { color: theme.colors.textSecondary }]}>{s.label}</Text>
                <Text style={[styles.signalValue, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold }]}>
                  {s.value}{s.unit ? <Text style={styles.signalUnit}> {s.unit}</Text> : null}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ── Hospital: Care Plan Card ── */}
      {isHospital && (
        <View style={[styles.hospitalCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.hospitalCardTitle, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold }]}>
            🏥 Recovery Plan Active
          </Text>
          <Text style={[styles.hospitalCardSub, { color: theme.colors.textSecondary }]}>
            Post-discharge day 3 · Next check-in in 4 hours
          </Text>
          <View style={styles.hospitalTasks}>
            {['Take 10mg Amlodipine', 'Blood pressure check', 'Attend physio session'].map((task, i) => (
              <View key={i} style={styles.hospitalTaskRow}>
                <Text style={{ color: theme.colors.primary, fontSize: 14 }}>✓</Text>
                <Text style={[styles.hospitalTaskText, { color: theme.colors.textPrimary }]}>{task}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ── ST Emergency Alert — only when stemi_suspected = true ── */}
      {stResult?.emergency_alert && (
        <View style={[styles.alertBanner, { backgroundColor: 'rgba(239,68,68,0.10)', borderColor: 'rgba(239,68,68,0.30)' }]}>
          <Text style={styles.alertBannerIcon}>🚨</Text>
          <Text style={[styles.alertBannerText, { color: '#EF4444', fontFamily: theme.fonts.sansMedium, fontSize: theme.fontSize.sm }]}>
            {stResult.your_result} — {stResult.what_this_means}
          </Text>
        </View>
      )}

      {/* Live Monitor Card */}
      <View style={[styles.monitorCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder, ...theme.shadow.card }]}>
        <View style={styles.monitorHeader}>
          <View style={styles.monitorHeaderLeft}>
            <PulsingDot size={8} />
            <Text style={[styles.monitorLiveLabel, { color: theme.colors.textSecondary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
              Axiom — Live
            </Text>
          </View>
          <TouchableOpacity
            onPress={isConnected ? disconnect : connect}
            disabled={isTransitional}
            style={[styles.signalBadge, {
              backgroundColor: isConnected ? theme.colors.primary : theme.colors.tealAlpha10,
              opacity: isTransitional ? 0.6 : 1,
            }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.signalText, {
              color: isConnected ? '#FFFFFF' : theme.colors.primary,
              fontFamily: theme.fonts.sansSemiBold,
              fontSize: theme.fontSize.xs,
            }]}>
              {bleLabel}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.monitorSubtext, { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansMedium, fontSize: theme.fontSize.sm }]}>
          {interpretation ?? 'Monitoring your ECG data continuously.'}
        </Text>

        <ECGChart height={56} samples={ecgSamples} />

        <View style={[styles.metricsRow, { borderTopWidth: 1, borderTopColor: theme.colors.divider }]}>
          {/* Avg HR */}
          <View style={styles.metricCenter}>
            <Text style={[styles.metricValue, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.xxl }]}>
              {fmt(metrics?.avgHr)}
            </Text>
            <Text style={[styles.metricLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xxs }]}>
              Avg HR
            </Text>
          </View>

          <View style={[styles.metricDivider, { backgroundColor: theme.colors.divider }]} />

          {/* HRV */}
          <View style={styles.metricCenter}>
            <Text style={[styles.metricValue, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.xxl }]}>
              {fmt(metrics?.hrv_ms)}
            </Text>
            <Text style={[styles.metricLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xxs }]}>
              HRV ms
            </Text>
          </View>

          <View style={[styles.metricDivider, { backgroundColor: theme.colors.divider }]} />

          {/* QRS Width */}
          <View style={styles.metricCenter}>
            <Text style={[styles.metricValue, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.xxl }]}>
              {fmt(metrics?.qrs_width_ms)}
            </Text>
            <Text style={[styles.metricLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xxs }]}>
              QRS ms
            </Text>
          </View>
        </View>
      </View>

      {/* Alyna Timeline */}
      <View>
        <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
          Alyna Timeline
        </Text>

        {timeline.length === 0 ? (
          <View style={styles.emptyTimeline}>
            <Text style={{ fontSize: 24 }}>🩺</Text>
            <Text style={[styles.emptyTimelineText, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.sm }]}>
              No AI insights yet. Run an AI analysis from your ECG tab.
            </Text>
          </View>
        ) : (
          <View style={styles.timelineList}>
            {timeline.map(event => {
              const colors = getTimelineColors(event.type, theme);
              return (
                <View key={event.id} style={[styles.timelineItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder, ...theme.shadow.card }]}>
                  <View style={[styles.timelineIconWrap, { backgroundColor: colors.bg }]}>
                    <View style={[styles.timelineDot, { backgroundColor: colors.dot }]} />
                  </View>
                  <View style={styles.timelineTextWrap}>
                    <Text style={[styles.timelineTitle, { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansMedium, fontSize: theme.fontSize.sm }]}>
                      {event.title}
                    </Text>
                    <Text style={[styles.timelineTime, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xs }]}>
                      {event.time}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}