// =============================================================================
// NEW FILE: src/features/support/screens/TicketChatScreen/TicketChatScreen.style.ts
// =============================================================================

import { StyleSheet } from 'react-native';

export const ticketChatStyles = StyleSheet.create({
  root:           { flex: 1 },

  header:         { flexDirection: 'row', alignItems: 'center', gap: 10,
                    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn:        { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  backBtnText:    { fontSize: 20 },
  headerText:     { flex: 1, minWidth: 0, gap: 2 },
  headerTitle:    { fontSize: 14 },
  headerMeta:     { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerNumber:   { fontSize: 10 },
  headerDot:      { fontSize: 10 },
  headerStatus:   { fontSize: 10 },
  headerSkeleton: { height: 14, width: 130, borderRadius: 6 },
  connDot:        { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },

  messageList:    { flex: 1, paddingHorizontal: 16, paddingVertical: 10 },

  loadingWrap:    { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },

  errorBox:       { flexDirection: 'row', alignItems: 'center', gap: 8,
                    padding: 12, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  errorText:      { flex: 1, fontSize: 12 },

  emptyWrap:      { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 8 },
  emptyTitle:     { fontSize: 14 },
  emptyBody:      { fontSize: 12, textAlign: 'center' },

  systemMsgWrap:  { alignItems: 'center', marginVertical: 4 },
  systemMsgText:  { fontSize: 10, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },

  bubbleRow:      { marginBottom: 4 },
  bubbleSender:   { fontSize: 10, marginBottom: 2, marginLeft: 2 },
  bubble:         { maxWidth: '78%', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18 },
  bubbleMine:     { borderTopRightRadius: 4 },
  bubbleTheirs:   { borderTopLeftRadius: 4 },
  bubbleText:     { fontSize: 14, lineHeight: 20 },
  bubbleTime:     { fontSize: 10, marginTop: 2, marginHorizontal: 4 },

  csatCard:       { borderRadius: 20, padding: 16, borderWidth: 1, marginTop: 8 },
  csatLabel:      { fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  csatTitle:      { fontSize: 14, marginBottom: 12 },
  starRow:        { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 },
  star:           { fontSize: 28 },
  csatInput:      { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14,
                    borderWidth: 1, fontSize: 13, marginBottom: 12, minHeight: 60, textAlignVertical: 'top' },
  csatError:      { fontSize: 11, marginBottom: 8 },
  csatBtn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                    gap: 8, paddingVertical: 12, borderRadius: 16 },
  csatBtnText:    { color: '#FFFFFF', fontSize: 13 },
  csatDoneWrap:   { alignItems: 'center', gap: 8, paddingVertical: 16 },
  csatDoneIcon:   { fontSize: 24 },
  csatDoneText:   { fontSize: 14 },

  inputBar:       { flexDirection: 'row', alignItems: 'center', gap: 10,
                    paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1 },
  input:          { flex: 1, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999,
                    borderWidth: 1, fontSize: 14 },
  sendBtn:        { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  sendBtnText:    { fontSize: 18, color: '#FFFFFF' },
});