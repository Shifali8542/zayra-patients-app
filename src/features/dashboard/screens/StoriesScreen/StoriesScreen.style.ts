import { StyleSheet } from 'react-native';

export const storiesStyles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 24, gap: 16 },
  header: { gap: 2 },
  headerLabel: { letterSpacing: 2, textTransform: 'uppercase' },
  headerTitle: { letterSpacing: -0.5 },
  storyCard: { borderRadius: 20, padding: 20 },
  quoteIcon: { fontSize: 22, marginBottom: 10, opacity: 0.8 },
  storyType: { letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  storyQuote: { lineHeight: 22, marginBottom: 12 },
  storyFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  authorText: {},
  tagChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  tagText: { letterSpacing: 0.5, textTransform: 'uppercase' },
});
