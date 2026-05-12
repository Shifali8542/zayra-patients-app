import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 24, gap: 16 },

  // Greeting
  greetingRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  greetingLabel: { letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 },
  greetingName: { letterSpacing: -0.5 },

  // ST Emergency alert banner — shown only when stemi_suspected = true
  alertBanner: {
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
  },
  alertBannerIcon: { fontSize: 20 },
  alertBannerText: { flex: 1, lineHeight: 18 },

  // Monitor Card
  monitorCard: { borderRadius: 20, borderWidth: 1, padding: 16 },
  monitorHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  monitorHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  monitorLiveLabel: { letterSpacing: 2, textTransform: 'uppercase' },
  signalBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  signalText: { letterSpacing: 0.5 },
  monitorSubtext: { marginBottom: 12, lineHeight: 20 },
  metricsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: 12, marginTop: 4 },
  metricDivider: { width: 1, height: 32 },
  metricValue: { letterSpacing: -0.5, textAlign: 'center' },
  metricLabel: { letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center', marginTop: 2 },
  metricCenter: { alignItems: 'center' },

  // Timeline
  sectionLabel: { letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 },
  timelineList: { gap: 8 },
  timelineItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderRadius: 16, padding: 12, borderWidth: 1 },
  timelineIconWrap: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  timelineDot: { width: 8, height: 8, borderRadius: 4 },
  timelineTitle: { lineHeight: 20, flex: 1 },
  timelineTime: { marginTop: 2 },
  timelineTextWrap: { flex: 1 },

  // Empty timeline
  emptyTimeline: { alignItems: 'center', paddingVertical: 24, gap: 6 },
  emptyTimelineText: { textAlign: 'center', lineHeight: 20 },
});