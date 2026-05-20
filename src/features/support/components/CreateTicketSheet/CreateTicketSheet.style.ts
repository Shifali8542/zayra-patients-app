// =============================================================================
// NEW FILE: src/features/support/components/CreateTicketSheet/CreateTicketSheet.style.ts
// =============================================================================

import { StyleSheet } from 'react-native';

export const createTicketStyles = StyleSheet.create({
  overlay:       { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                   backgroundColor: 'rgba(13,27,42,0.55)', justifyContent: 'flex-end' },
  sheet:         { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 36 },

  handleRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  handle:        { width: 40, height: 4, borderRadius: 2, alignSelf: 'center' },
  closeBtn:      { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  closeBtnText:  { fontSize: 16 },

  sectionLabel:  { fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  sheetLabel:    { fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  sheetTitle:    { letterSpacing: -0.5, marginBottom: 20 },

  categoryGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  categoryBtn:   { width: '47%', padding: 12, borderRadius: 16, borderWidth: 1 },
  categoryLabel: { fontSize: 12 },
  categorySub:   { fontSize: 10, marginTop: 2 },

  inputLabel:    { fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  input:         { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderWidth: 1, fontSize: 14, marginBottom: 12 },
  textarea:      { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderWidth: 1, fontSize: 14,
                   marginBottom: 12, minHeight: 80, textAlignVertical: 'top' },

  errorBox:      { flexDirection: 'row', alignItems: 'center', gap: 8,
                   padding: 12, borderRadius: 14, borderWidth: 1, marginBottom: 12 },
  errorText:     { flex: 1, fontSize: 12 },

  submitBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                   gap: 8, paddingVertical: 14, borderRadius: 20 },
  submitBtnText: { color: '#FFFFFF', fontSize: 14 },

  spinnerWrap:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
});