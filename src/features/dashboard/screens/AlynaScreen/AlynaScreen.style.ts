import { StyleSheet } from 'react-native';

export const alynaStyles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  headerLabel: { letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 },
  headerTitle: { letterSpacing: -0.5 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  riskBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  riskBadgeText: { letterSpacing: 0.5, textTransform: 'uppercase' },

  // Interpretation card (gradient)
  interpretationCard: { marginHorizontal: 16, marginBottom: 8, borderRadius: 20, padding: 16 },
  interpLabel: { letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  interpRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  sparkleCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  interpText: { flex: 1, lineHeight: 20 },

  // AI Findings chips
  findingsWrap: { marginHorizontal: 16, marginBottom: 8 },
  findingsLabel: { letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 },
  findingsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  findingChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  findingChipText: { letterSpacing: 0.3, lineHeight: 16 },

  // Recommendation card
  recommendationCard: { marginHorizontal: 16, marginBottom: 8, borderRadius: 16, padding: 14, borderWidth: 1 },
  recommendationLabel: { letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  recommendationText: { lineHeight: 20 },

  // Messages
  messagesScroll: { flex: 1, paddingHorizontal: 16 },
  messagesContent: { gap: 10, paddingBottom: 12 },
  messageBubbleWrap: { flexDirection: 'row' },
  messageBubble: { maxWidth: '80%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  messageText: { lineHeight: 20 },
  typingWrap: { flexDirection: 'row', gap: 4, padding: 4 },
  typingDot: { width: 8, height: 8, borderRadius: 4 },

  // Input
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginBottom: 8,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1,
  },
  textInput: { flex: 1, fontSize: 14, maxHeight: 80 },
  micBtn: { padding: 4 },
  sendBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});