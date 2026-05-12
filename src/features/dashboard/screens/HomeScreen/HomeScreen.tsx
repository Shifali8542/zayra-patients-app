import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { ECGChart } from '../../../../components/ui/ECGChart';
import { PulsingDot } from '../../../../components/ui/PulsingDot';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { homeStyles as styles } from './HomeScreen.style';
import type { HealthMetric, TimelineEvent, TimelineEventType, PatientSTResult } from '../../../../types';

interface HomeScreenProps {
  metrics: HealthMetric | null;
  timeline: TimelineEvent[];
  interpretation: string | null;
  stResult: PatientSTResult | null;
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

export function HomeScreen({ metrics, timeline, interpretation, stResult }: HomeScreenProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const firstName = user?.first_name?.toLowerCase() || user?.name?.toLowerCase() || '';

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

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

      {/* ST Emergency Alert — only when stemi_suspected = true */}
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
          <View style={[styles.signalBadge, { backgroundColor: theme.colors.tealAlpha10 }]}>
            <Text style={[styles.signalText, { color: theme.colors.primary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
              {metrics?.signalStrength != null ? `Signal ${metrics.signalStrength}%` : 'Signal —'}
            </Text>
          </View>
        </View>

        {/* Real AI narrative replaces hardcoded string */}
        <Text style={[styles.monitorSubtext, { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansMedium, fontSize: theme.fontSize.sm }]}>
          {interpretation ?? 'Monitoring your ECG data continuously.'}
        </Text>

        <ECGChart height={56} />

        <View style={[styles.metricsRow, { borderTopWidth: 1, borderTopColor: theme.colors.divider }]}>
          {/* Avg HR — from ecg_analysis.heart_rate_bpm */}
          <View style={styles.metricCenter}>
            <Text style={[styles.metricValue, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.xxl }]}>
              {fmt(metrics?.avgHr)}
            </Text>
            <Text style={[styles.metricLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xxs }]}>
              Avg HR
            </Text>
          </View>

          <View style={[styles.metricDivider, { backgroundColor: theme.colors.divider }]} />

          {/* HRV — replaces SpO₂ (not available from ECG datasets) */}
          <View style={styles.metricCenter}>
            <Text style={[styles.metricValue, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.xxl }]}>
              {fmt(metrics?.hrv_ms)}
            </Text>
            <Text style={[styles.metricLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xxs }]}>
              HRV ms
            </Text>
          </View>

          <View style={[styles.metricDivider, { backgroundColor: theme.colors.divider }]} />

          {/* QRS Width — replaces Anomalies */}
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