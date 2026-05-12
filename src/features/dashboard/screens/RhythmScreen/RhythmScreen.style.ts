import { StyleSheet } from 'react-native';

export const rhythmStyles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 24, gap: 16 },
  header: { gap: 2 },
  headerLabel: { letterSpacing: 2, textTransform: 'uppercase' },
  headerTitle: { letterSpacing: -0.5 },
  streakCard: { borderRadius: 20, padding: 20 },
  flameIcon: { fontSize: 24, marginBottom: 8 },
  streakNumRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 4 },
  streakNum: { letterSpacing: -2 },
  streakUnit: {},
  streakDesc: { lineHeight: 20, marginBottom: 16 },
  dotsRow: { flexDirection: 'row', gap: 8 },
  weekDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  weekDotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF' },
  sectionLabel: { letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 },
  milestonesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  milestoneCard: { width: '31%', borderRadius: 16, padding: 12, alignItems: 'center' },
  milestoneNum: { letterSpacing: -0.5, marginVertical: 2 },
  milestoneLabel: { letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center' },
  starIcon: { fontSize: 14, opacity: 0.7, marginBottom: 4 },

  // Consistency areas
  consistencyArea: { marginBottom: 12 },
  consistencyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3 },

  // ECG Intervals section — new, real data from clinical-info
  intervalsGrid: { gap: 10 },
  intervalRow: { flexDirection: 'row', gap: 10 },
  intervalCard: { flex: 1, borderRadius: 16, padding: 14, borderWidth: 1 },
  intervalValue: { letterSpacing: -0.5, marginBottom: 2 },
  intervalLabel: { letterSpacing: 0.5, textTransform: 'uppercase' },
  intervalHint: { marginTop: 3, lineHeight: 14 },
  intervalCardFull: { borderRadius: 16, padding: 14, borderWidth: 1 },
  rhythmRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rhythmDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
});