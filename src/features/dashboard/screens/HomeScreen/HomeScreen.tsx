import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { ECGChart } from '../../../../components/ui/ECGChart';
import { PulsingDot } from '../../../../components/ui/PulsingDot';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { homeStyles as styles } from './HomeScreen.style';
import type { HealthMetric, TimelineEvent, TimelineEventType } from '../../../../types';

interface HomeScreenProps {
  metrics: HealthMetric | null;
  timeline: TimelineEvent[];
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'GOOD MORNING';
  if (hour < 17) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
}

function getTimelineColors(type: TimelineEventType, theme: any) {
  switch (type) {
    case 'observation':
      return { bg: theme.colors.tealAlpha20, dot: theme.colors.primary };
    case 'confirmation':
      return { bg: 'rgba(59,130,246,0.12)', dot: '#3B82F6' };
    case 'alert':
      return { bg: 'rgba(239,68,68,0.12)', dot: '#EF4444' };
    case 'insight':
      return { bg: 'rgba(139,92,246,0.12)', dot: '#8B5CF6' };
    default:
      return { bg: 'rgba(107,114,128,0.12)', dot: '#6B7280' };
  }
}

export function HomeScreen({ metrics, timeline }: HomeScreenProps) {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting Row */}
      <View style={styles.greetingRow}>
        <View>
          <Text
            style={[
              styles.greetingLabel,
              {
                color: theme.colors.textTertiary,
                fontFamily: theme.fonts.sansSemiBold,
                fontSize: theme.fontSize.xs,
              },
            ]}
          >
            {getGreeting()}
          </Text>
          <Text
            style={[
              styles.greetingName,
              {
                color: theme.colors.textPrimary,
                fontFamily: theme.fonts.displayBold,
                fontSize: theme.fontSize.h2,
              },
            ]}
          >
            {user?.name.toLowerCase()}.
          </Text>
        </View>
        <StatusBadge label={user?.journey ?? 'care'} />
      </View>

      {/* Live Monitor Card */}
      <View
        style={[
          styles.monitorCard,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.cardBorder,
            ...theme.shadow.card,
          },
        ]}
      >
        <View style={styles.monitorHeader}>
          <View style={styles.monitorHeaderLeft}>
            <PulsingDot size={8} />
            <Text
              style={[
                styles.monitorLiveLabel,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.fonts.sansSemiBold,
                  fontSize: theme.fontSize.xs,
                },
              ]}
            >
              Axiom — Live
            </Text>
          </View>
          <View style={[styles.signalBadge, { backgroundColor: theme.colors.tealAlpha10 }]}>
            <Text
              style={[
                styles.signalText,
                {
                  color: theme.colors.primary,
                  fontFamily: theme.fonts.sansSemiBold,
                  fontSize: theme.fontSize.xs,
                },
              ]}
            >
              Signal {metrics?.signalStrength ?? 98}%
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.monitorSubtext,
            {
              color: theme.colors.textPrimary,
              fontFamily: theme.fonts.sansMedium,
              fontSize: theme.fontSize.sm,
            },
          ]}
        >
          You are being monitored continuously. Nothing has changed in the last 24 hours.
        </Text>

        <ECGChart height={56} />

        <View
          style={[
            styles.metricsRow,
            { borderTopWidth: 1, borderTopColor: theme.colors.divider },
          ]}
        >
          <View style={styles.metricCenter}>
            <Text
              style={[
                styles.metricValue,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: theme.fonts.displayBold,
                  fontSize: theme.fontSize.xxl,
                },
              ]}
            >
              {metrics?.avgHr ?? 62}
            </Text>
            <Text
              style={[
                styles.metricLabel,
                { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xxs },
              ]}
            >
              Avg HR
            </Text>
          </View>
          <View style={[styles.metricDivider, { backgroundColor: theme.colors.divider }]} />
          <View style={styles.metricCenter}>
            <Text
              style={[
                styles.metricValue,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: theme.fonts.displayBold,
                  fontSize: theme.fontSize.xxl,
                },
              ]}
            >
              {metrics?.spo2 ?? 98}%
            </Text>
            <Text
              style={[
                styles.metricLabel,
                { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xxs },
              ]}
            >
              SpO₂
            </Text>
          </View>
          <View style={[styles.metricDivider, { backgroundColor: theme.colors.divider }]} />
          <View style={styles.metricCenter}>
            <Text
              style={[
                styles.metricValue,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: theme.fonts.displayBold,
                  fontSize: theme.fontSize.xxl,
                },
              ]}
            >
              {metrics?.anomalies ?? 0}
            </Text>
            <Text
              style={[
                styles.metricLabel,
                { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xxs },
              ]}
            >
              Anomalies
            </Text>
          </View>
        </View>
      </View>

      {/* Alyna Timeline */}
      <View>
        <Text
          style={[
            styles.sectionLabel,
            {
              color: theme.colors.textTertiary,
              fontFamily: theme.fonts.sansSemiBold,
              fontSize: theme.fontSize.xs,
            },
          ]}
        >
          Alyna Timeline
        </Text>
        <View style={styles.timelineList}>
          {timeline.map((event) => {
            const colors = getTimelineColors(event.type, theme);
            return (
              <View
                key={event.id}
                style={[
                  styles.timelineItem,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.cardBorder,
                    ...theme.shadow.card,
                  },
                ]}
              >
                <View style={[styles.timelineIconWrap, { backgroundColor: colors.bg }]}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: colors.dot,
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.timelineTitle,
                      {
                        color: theme.colors.textPrimary,
                        fontFamily: theme.fonts.sansMedium,
                        fontSize: theme.fontSize.sm,
                      },
                    ]}
                  >
                    {event.title}
                  </Text>
                  <Text
                    style={[
                      styles.timelineTime,
                      {
                        color: theme.colors.textTertiary,
                        fontFamily: theme.fonts.sansRegular,
                        fontSize: theme.fontSize.xs,
                      },
                    ]}
                  >
                    {event.time}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
