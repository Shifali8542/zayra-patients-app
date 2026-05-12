import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../contexts/ThemeContext';
import { rhythmStyles as styles } from './RhythmScreen.style';
import type { RhythmStreak, ClinicalInfo } from '../../../../types';

interface RhythmScreenProps {
  streak: RhythmStreak | null;
  consistencyAreas: { label: string; value: number }[];
  clinicalInfo: ClinicalInfo | null;
}

function fmt(val: number | null | undefined, unit = ''): string {
  if (val == null) return '—';
  return `${Math.round(val)}${unit}`;
}

function getRhythmColor(rhythm: string | null): string {
  if (!rhythm || rhythm === 'Unknown') return '#6B7280';
  if (rhythm === 'Normal Sinus Rhythm') return '#10B981';
  return '#F59E0B';
}

export function RhythmScreen({ streak, consistencyAreas, clinicalInfo }: RhythmScreenProps) {
  const { theme } = useTheme();

  if (!streak) return null;

  const ecg = clinicalInfo?.ecg_analysis ?? null;
  const rhythm = ecg?.rhythm ?? null;
  const rhythmColor = getRhythmColor(rhythm);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
          Meaningful Consistency
        </Text>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.h2 }]}>
          Rhythm Streak
        </Text>
      </View>

      {/* Streak Card */}
      <LinearGradient colors={['#00C2B2', '#0D1B2A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.streakCard}>
        <Text style={styles.flameIcon}>🔥</Text>
        <View style={styles.streakNumRow}>
          <Text style={[styles.streakNum, { color: '#FFFFFF', fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.giant }]}>
            {streak.days}
          </Text>
          <Text style={[styles.streakUnit, { color: 'rgba(255,255,255,0.70)', fontFamily: theme.fonts.sansMedium, fontSize: theme.fontSize.xl }]}>
            {streak.days === 1 ? 'session' : 'sessions'}
          </Text>
        </View>
        {/* Real description — no more hardcoded "high-stress week" */}
        <Text style={[styles.streakDesc, { color: 'rgba(255,255,255,0.80)', fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.sm }]}>
          {streak.days > 0
            ? `${streak.days} ECG session${streak.days === 1 ? '' : 's'} recorded. Alyna's understanding of your baseline grows with each one.`
            : 'Your first ECG session will start your rhythm streak.'}
        </Text>
        <View style={styles.dotsRow}>
          {streak.weekDots.map((active, i) => (
            <View key={i} style={[styles.weekDot, { backgroundColor: active ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.10)' }]}>
              {active && <View style={styles.weekDotInner} />}
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Milestones */}
      <View>
        <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
          Milestones
        </Text>
        <View style={styles.milestonesGrid}>
          {streak.milestones.map(m => {
            const bgColor = m.active ? theme.colors.primary : m.achieved ? theme.colors.mint : theme.colors.surfaceAlt;
            const textColor = m.active ? '#FFFFFF' : m.achieved ? theme.colors.textPrimary : theme.colors.textTertiary;
            return (
              <View key={m.label} style={[styles.milestoneCard, { backgroundColor: bgColor }]}>
                <Text style={styles.starIcon}>⭐</Text>
                <Text style={[styles.milestoneNum, { color: textColor, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.xl }]}>{m.days}</Text>
                <Text style={[styles.milestoneLabel, { color: textColor, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xxs, opacity: 0.8 }]}>{m.label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* ECG Intervals — real data from clinical-info.ecg_analysis */}
      <View>
        <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
          Your ECG Intervals
        </Text>
        <View style={styles.intervalsGrid}>
          <View style={styles.intervalRow}>
            <View style={[styles.intervalCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder }]}>
              <Text style={[styles.intervalValue, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.xl }]}>
                {fmt(ecg?.heart_rate_bpm)}
              </Text>
              <Text style={[styles.intervalLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xxs }]}>Heart Rate</Text>
              <Text style={[styles.intervalHint, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xxs }]}>normal: 60–100 bpm</Text>
            </View>
            <View style={[styles.intervalCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder }]}>
              <Text style={[styles.intervalValue, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.xl }]}>
                {fmt(ecg?.hrv_ms)}
              </Text>
              <Text style={[styles.intervalLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xxs }]}>HRV</Text>
              <Text style={[styles.intervalHint, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xxs }]}>higher = better</Text>
            </View>
          </View>
          <View style={styles.intervalRow}>
            <View style={[styles.intervalCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder }]}>
              <Text style={[styles.intervalValue, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.xl }]}>
                {fmt(ecg?.qrs_width_ms)}
              </Text>
              <Text style={[styles.intervalLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xxs }]}>QRS Width</Text>
              <Text style={[styles.intervalHint, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xxs }]}>normal: 70–110 ms</Text>
            </View>
            <View style={[styles.intervalCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder }]}>
              <Text style={[styles.intervalValue, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.xl }]}>
                {fmt(ecg?.qt_ms)}
              </Text>
              <Text style={[styles.intervalLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xxs }]}>QT Interval</Text>
              <Text style={[styles.intervalHint, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xxs }]}>normal: 350–440 ms</Text>
            </View>
          </View>
          {/* Rhythm — full width */}
          <View style={[styles.intervalCardFull, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder }]}>
            <View style={styles.rhythmRow}>
              <Text style={[styles.intervalLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xxs }]}>Rhythm</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.rhythmDot, { backgroundColor: rhythmColor }]} />
                <Text style={[{ color: theme.colors.textPrimary, fontFamily: theme.fonts.sansMedium, fontSize: theme.fontSize.sm }]}>
                  {rhythm ?? '—'}
                </Text>
              </View>
            </View>
            {clinicalInfo?.record_name && (
              <Text style={[{ color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xs, marginTop: 4 }]}>
                From record: {clinicalInfo.record_name}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Consistency by Area — from deriveConsistencyAreas (real ECG data) */}
      <View>
        <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
          Consistency by Area
        </Text>
        {consistencyAreas.map(area => (
          <View key={area.label} style={styles.consistencyArea}>
            <View style={styles.consistencyHeader}>
              <Text style={[{ color: theme.colors.textSecondary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.sm }]}>{area.label}</Text>
              <Text style={[{ color: theme.colors.textSecondary, fontFamily: theme.fonts.sansMedium, fontSize: theme.fontSize.sm }]}>{area.value}%</Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: theme.colors.divider }]}>
              <View style={[styles.progressFill, { width: `${area.value}%`, backgroundColor: theme.colors.primary }]} />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}