import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, gap: 16 },
  appHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  journeyBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 999, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
  journeyBadgeText: { letterSpacing: 1.5, textTransform: 'uppercase' },

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

  // Evac
  evacCTA: { borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  evacCTALeft: { flex: 1 },
  evacCTALabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 2.5, marginBottom: 2 },
  evacCTATitle: { fontSize: 20, fontWeight: '700', lineHeight: 26 },
  evacCTASub: { fontSize: 12, marginTop: 4 },
  evacCTAIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.30)', alignItems: 'center', justifyContent: 'center' },
  evacCTAEmoji: { fontSize: 24 },
  evacGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  evacCard: { width: '47%', borderRadius: 16, borderWidth: 1, padding: 14 },
  evacCardEmoji: { fontSize: 16, marginBottom: 8 },
  evacCardTitle: { fontSize: 13, marginBottom: 2 },
  evacCardSub: { fontSize: 11.5 },

  // Wellness
  wellnessCard: { borderRadius: 20, overflow: 'hidden', shadowOpacity: 0.2, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  wellnessCardGrad: { padding: 20 },
  wellnessBriefLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 2.5, color: 'rgba(255,255,255,0.80)' },
  wellnessBriefText: { fontSize: 15, lineHeight: 22, color: '#FFFFFF', marginTop: 6, fontWeight: '500' },
  wellnessMetricsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  wellnessRingPlaceholder: { width: 100, height: 100, borderRadius: 50, borderWidth: 8, borderColor: 'rgba(255,255,255,0.20)', alignItems: 'center', justifyContent: 'center' },
  wellnessRingValue: { fontSize: 28, fontWeight: '700', color: '#FFFFFF' },
  wellnessRingLabel: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.70)', marginTop: 2 },
  wellnessMetricsList: { alignItems: 'flex-end', gap: 8 },
  wellnessMetricItem: { alignItems: 'flex-end' },
  wellnessMetricLabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.70)' },
  wellnessMetricVal: { fontSize: 17, fontWeight: '700', color: '#FFFFFF', marginTop: 2 },

  // Wellness signals
  signalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  signalCard: { width: '47%', borderRadius: 16, borderWidth: 1, padding: 14 },
  signalEmoji: { fontSize: 14, marginBottom: 6 },
  signalLabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 },
  signalValue: { fontSize: 20, letterSpacing: -0.5 },
  signalUnit: { fontSize: 12, fontWeight: '400' },

  // Hospital
  hospitalCard: { borderRadius: 20, borderWidth: 1, padding: 18 },
  hospitalCardTitle: { fontSize: 17, marginBottom: 4 },
  hospitalCardSub: { fontSize: 13, lineHeight: 18, marginBottom: 14 },
  hospitalTasks: { gap: 10 },
  hospitalTaskRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  hospitalTaskText: { fontSize: 14 },
});