// =============================================================================
// NEW FILE: src/features/support/screens/SupportListScreen/SupportListScreen.style.ts
// =============================================================================

import { StyleSheet } from 'react-native';

export const supportListStyles = StyleSheet.create({
  scroll:         { flex: 1 },
  content:        { padding: 16, paddingBottom: 32, gap: 14 },

  header:         { gap: 2 },
  headerLabel:    { letterSpacing: 2, textTransform: 'uppercase' },
  headerTitle:    { letterSpacing: -0.5 },
  headerRow:      { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },

  refreshBtn:     { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  refreshIcon:    { fontSize: 16 },

  newBtn:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                    paddingVertical: 14, borderRadius: 20 },
  newBtnText:     { color: '#FFFFFF', fontSize: 14 },

  filterRow:      { flexDirection: 'row', gap: 8 },
  filterChip:     { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  filterChipText: { fontSize: 12 },

  errorBox:       { flexDirection: 'row', alignItems: 'center', gap: 8,
                    padding: 12, borderRadius: 16, borderWidth: 1 },
  errorText:      { flex: 1, fontSize: 12 },

  // Skeleton
  skeleton:       { borderRadius: 20, padding: 14 },
  skeletonLine1:  { height: 10, width: 90, borderRadius: 6, marginBottom: 8 },
  skeletonLine2:  { height: 14, width: '75%', borderRadius: 6, marginBottom: 6 },
  skeletonLine3:  { height: 10, width: '40%', borderRadius: 6 },

  // Empty state
  emptyWrap:      { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12 },
  emptyIcon:      { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  emptyIconText:  { fontSize: 22 },
  emptyTitle:     { fontSize: 14 },
  emptyBody:      { fontSize: 12, textAlign: 'center', maxWidth: 200, lineHeight: 18 },

  // Ticket row
  ticketRow:      { flexDirection: 'row', alignItems: 'center', gap: 12,
                    borderRadius: 20, padding: 14, borderWidth: 1 },
  severityDot:    { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  ticketBody:     { flex: 1, minWidth: 0, gap: 2 },
  ticketMeta:     { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ticketNumber:   { fontSize: 10 },
  statusBadge:    { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  statusBadgeText:{ fontSize: 10 },
  activeDot:      { width: 6, height: 6, borderRadius: 3 },
  ticketTitle:    { fontSize: 13 },
  ticketSub:      { fontSize: 11 },
  ticketChevron:  { fontSize: 16, flexShrink: 0 },

  list:           { gap: 8 },
});