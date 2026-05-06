import { StyleSheet } from 'react-native';

export const alynaStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerLabel: {
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  headerTitle: {
    letterSpacing: -0.5,
  },
  interpretationCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 20,
    padding: 16,
  },
  interpLabel: {
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  interpRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  sparkleCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  interpText: {
    flex: 1,
    lineHeight: 20,
  },
  messagesScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    gap: 10,
    paddingBottom: 12,
  },
  messageBubbleWrap: {
    flexDirection: 'row',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  messageText: {
    lineHeight: 20,
  },
  typingWrap: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    maxHeight: 80,
  },
  micBtn: {
    padding: 4,
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
