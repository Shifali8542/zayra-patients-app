import { StyleSheet } from 'react-native';

export const ecgStyles = StyleSheet.create({
  container: { flex: 1 },

  // Sub-nav pill selector
  subNav: { flexDirection: 'row', marginHorizontal: 16, marginTop: 8, marginBottom: 12, borderRadius: 16, padding: 4 },
  subNavBtn: { flex: 1, paddingVertical: 8, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  subNavText: { letterSpacing: 0.3 },

  // Record selector tabs (horizontal scroll above waveform / report)
  recordSelector: { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },
  recordTab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  recordTabText: { letterSpacing: 0.3 },

  // Records sub-screen
  recordsList: { padding: 16, gap: 12, paddingBottom: 24 },
  recordCard: { borderRadius: 20, padding: 16, borderWidth: 1 },
  recordHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  recordLabel: { letterSpacing: -0.3 },
  datasetBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  datasetBadgeText: { letterSpacing: 1 },
  recordMetaRow: { flexDirection: 'row', gap: 20, marginBottom: 8 },
  recordMetaValue: {},
  recordMetaLabel: { letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 1 },
  recordDiagnosis: { lineHeight: 18, marginTop: 4, marginBottom: 10 },
  recordActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  recordActionText: {},

  //Waveform sub-screen 
  waveformScroll: { flex: 1 },
  waveformContent: { padding: 16, paddingBottom: 24, gap: 12 },
  waveformCard: { borderRadius: 20, borderWidth: 1, padding: 16 },
  waveformHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  waveformTitle: {},
  hrBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  hrBadgeText: { letterSpacing: 0.5 },
  waveformChartWrap: { borderRadius: 12, overflow: 'hidden', marginTop: 4 },
  waveformLoading: { alignItems: 'center', paddingVertical: 32, gap: 8 },
  waveformLoadingText: {},
  waveformMeta: {},
  waveformInfoCard: { borderRadius: 20, borderWidth: 1, padding: 16 },
  waveformInfoLabel: { letterSpacing: 2, textTransform: 'uppercase' },

  // ── Heart Report sub-screen ────────────────────────────────────────────────
  reportScroll: { flex: 1 },
  reportContent: { padding: 16, paddingBottom: 24, gap: 14 },
  reportHeader: { gap: 2 },
  reportHeaderLabel: { letterSpacing: 2, textTransform: 'uppercase' },
  reportHeaderTitle: { letterSpacing: -0.5 },
  reportCard: { borderRadius: 20, borderWidth: 1, padding: 16 },
  reportCardTitle: { letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
  metricsGrid: { gap: 10 },
  metricRow: { flexDirection: 'row', gap: 10 },
  metricCard: { flex: 1, borderRadius: 16, padding: 14, borderWidth: 1 },
  metricCardFull: { borderRadius: 16, padding: 14, borderWidth: 1 },
  metricValue: { letterSpacing: -0.5, marginBottom: 2 },
  metricLabel: { letterSpacing: 0.5, textTransform: 'uppercase' },
  metricHint: { marginTop: 3, lineHeight: 14 },
  rhythmRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  diagnosisList: { gap: 8 },
  diagnosisRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  diagnosisDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7, flexShrink: 0 },
  diagnosisText: { flex: 1, lineHeight: 20 },
  stRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  stBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  stBadgeText: { letterSpacing: 0.3, textTransform: 'uppercase' },
  stNote: { lineHeight: 18, marginTop: 4 },
  findingsList: { gap: 8, marginBottom: 4 },
  findingRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  findingDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7, flexShrink: 0 },
  findingText: { flex: 1, lineHeight: 18 },
  recommendationBox: {},


  // Segment tabs (Before / During / After)
  segmentTabs: { flexDirection: 'row', gap: 6, marginBottom: 8, marginTop: 4 },
  segmentTab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  segmentTabText: { letterSpacing: 0.5, textTransform: 'uppercase' },
  segmentTimeLabel: { textAlign: 'right', marginTop: 4, letterSpacing: 0.3 },

  // Lead switcher 
  leadSwitcherWrap: { marginTop: 12 },
  leadSwitcherLabel: { letterSpacing: 2, marginBottom: 6 },
  leadSwitcher: { gap: 6, paddingBottom: 2 },
  leadBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  leadBtnText: { letterSpacing: 0.5 },

  // Shared 
  emptyCard: { borderRadius: 20, borderWidth: 1, padding: 32, alignItems: 'center', gap: 10 },
  emptyText: { textAlign: 'center', lineHeight: 20 },
  reportLoading: { alignItems: 'center', paddingVertical: 48, gap: 10 },
});