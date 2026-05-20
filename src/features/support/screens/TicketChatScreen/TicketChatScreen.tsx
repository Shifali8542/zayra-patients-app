import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { useSupportChat } from '../../hooks/useSupportChat';
import { api, ApiError } from '../../../../services/api';
import { ticketChatStyles as styles } from './TicketChatScreen.style';
import type { SupportMessage, SupportTicketDetail, TicketStatus } from '../../../../types';

interface TicketChatScreenProps {
  ticketId: number;
  onBack: () => void;
}

const STATUS_LABEL: Record<TicketStatus, string> = {
  open:        'Open',
  in_progress: 'In Progress',
  escalated:   'Escalated',
  resolved:    'Resolved',
  closed:      'Closed',
};

// CSAT prompt

function CsatPrompt({ ticketId, onDone, theme }: { ticketId: number; onDone: () => void; theme: any }) {
  const [score,      setScore]      = useState(0);
  const [comment,    setComment]    = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done,       setDone]       = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const handleSubmit = async () => {
    if (score === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.support.submitCsat(ticketId, { score, comment: comment.trim() || undefined });
      setDone(true);
      setTimeout(onDone, 1500);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Could not submit rating.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <View style={styles.csatDoneWrap}>
        <Text style={styles.csatDoneIcon}>✅</Text>
        <Text style={[styles.csatDoneText, { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansSemiBold }]}>
          Thanks for your feedback!
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.csatCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder }]}>
      <Text style={[styles.csatLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold }]}>
        Rate this support
      </Text>
      <Text style={[styles.csatTitle, { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansSemiBold }]}>
        How was your experience?
      </Text>
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map(s => (
          <TouchableOpacity key={s} onPress={() => setScore(s)} activeOpacity={0.8}>
            <Text style={[styles.star, { color: s <= score ? theme.colors.primary : theme.colors.divider }]}>★</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Tell us more (optional)…"
        placeholderTextColor={theme.colors.inputPlaceholder}
        multiline
        style={[styles.csatInput, {
          backgroundColor: theme.colors.inputBg,
          borderColor: theme.colors.inputBorder,
          color: theme.colors.inputText,
          fontFamily: theme.fonts.sansRegular,
        }]}
      />
      {error && <Text style={[styles.csatError, { color: '#EF4444', fontFamily: theme.fonts.sansRegular }]}>{error}</Text>}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={score === 0 || submitting}
        style={[styles.csatBtn, {
          backgroundColor: score > 0 && !submitting ? theme.colors.primary : theme.colors.textTertiary,
          opacity: score > 0 && !submitting ? 1 : 0.55,
        }]}
        activeOpacity={0.85}
      >
        <Text style={[styles.csatBtnText, { fontFamily: theme.fonts.sansSemiBold }]}>
          {submitting ? 'Submitting…' : 'Submit rating'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

//Message bubble

function MessageBubble({ msg, theme }: { msg: SupportMessage; theme: any }) {
  if (msg.sender_type === 'system') {
    return (
      <View style={styles.systemMsgWrap}>
        <Text style={[styles.systemMsgText, {
          color: theme.colors.textTertiary,
          backgroundColor: theme.colors.surfaceAlt,
          fontFamily: theme.fonts.sansRegular,
        }]}>{msg.text}</Text>
      </View>
    );
  }
  return (
    <View style={[styles.bubbleRow, { alignItems: msg.mine ? 'flex-end' : 'flex-start' }]}>
      {!msg.mine && (
        <Text style={[styles.bubbleSender, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular }]}>
          {msg.sender}
        </Text>
      )}
      <View style={[
        styles.bubble,
        msg.mine
          ? [styles.bubbleMine, { backgroundColor: theme.colors.primary }]
          : [styles.bubbleTheirs, { backgroundColor: theme.colors.surfaceAlt }],
      ]}>
        <Text style={[styles.bubbleText, {
          color: msg.mine ? '#FFFFFF' : theme.colors.textPrimary,
          fontFamily: theme.fonts.sansRegular,
        }]}>{msg.text}</Text>
      </View>
      <Text style={[styles.bubbleTime, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular }]}>
        {msg.time}
      </Text>
    </View>
  );
}

// Main screen

export function TicketChatScreen({ ticketId, onBack }: TicketChatScreenProps) {
  const { theme }   = useTheme();
  const { tokens }  = useAuth();
  const accessToken = tokens?.access ?? null;

  const { messages, connected, loading, error, sending, sendMessage } =
    useSupportChat(ticketId, accessToken);

  const [detail,        setDetail]        = useState<SupportTicketDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const [inputText,     setInputText]     = useState('');
  const [csatDone,      setCsatDone]      = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    api.support.getTicketDetail(ticketId)
      .then(d => { setDetail(d); setDetailLoading(false); })
      .catch(() => setDetailLoading(false));
  }, [ticketId]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || sending) return;
    setInputText('');
    await sendMessage(text);
  }, [inputText, sending, sendMessage]);

  const isResolved = detail?.status === 'resolved' || detail?.status === 'closed';

  type ListItem = { type: 'message'; data: SupportMessage } | { type: 'csat' };
  const listData: ListItem[] = messages.map(m => ({ type: 'message', data: m }));
  if (isResolved && !csatDone) listData.push({ type: 'csat' });

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === 'csat') {
      return <CsatPrompt ticketId={ticketId} onDone={() => setCsatDone(true)} theme={theme} />;
    }
    return <MessageBubble msg={item.data} theme={theme} />;
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.colors.card }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.divider }]}>
        <TouchableOpacity onPress={onBack} style={[styles.backBtn, { backgroundColor: theme.colors.surfaceAlt }]} activeOpacity={0.8}>
          <Text style={[styles.backBtnText, { color: theme.colors.textSecondary }]}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerText}>
          {detailLoading ? (
            <View style={[styles.headerSkeleton, { backgroundColor: theme.colors.divider }]} />
          ) : (
            <>
              <Text style={[styles.headerTitle, { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansSemiBold }]} numberOfLines={1}>
                {detail?.title ?? 'Support Ticket'}
              </Text>
              <View style={styles.headerMeta}>
                <Text style={[styles.headerNumber, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular }]}>
                  {detail?.ticket_number}
                </Text>
                <Text style={[styles.headerDot, { color: theme.colors.textTertiary }]}>·</Text>
                <Text style={[styles.headerStatus, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular }]}>
                  {detail ? STATUS_LABEL[detail.status] : ''}
                </Text>
              </View>
            </>
          )}
        </View>
        <View style={[styles.connDot, { backgroundColor: connected ? theme.colors.primary : theme.colors.textTertiary }]} />
      </View>

      {/* Message list */}
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={listData}
          keyExtractor={(item, index) =>
            item.type === 'message' ? String(item.data.id) : `csat-${index}`
          }
          renderItem={renderItem}
          contentContainerStyle={[styles.messageList, { paddingBottom: 8 }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            error ? (
              <View style={[styles.errorBox, { backgroundColor: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.20)' }]}>
                <Text>⚠️</Text>
                <Text style={[styles.errorText, { color: '#EF4444', fontFamily: theme.fonts.sansRegular }]}>{error}</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansSemiBold }]}>No messages yet</Text>
              <Text style={[styles.emptyBody, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular }]}>Our team will respond shortly.</Text>
            </View>
          }
        />
      )}

      {/* Input bar */}
      {!isResolved && (
        <View style={[styles.inputBar, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.divider }]}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message…"
            placeholderTextColor={theme.colors.inputPlaceholder}
            editable={!sending}
            style={[styles.input, {
              backgroundColor: theme.colors.inputBg,
              borderColor: theme.colors.inputBorder,
              color: theme.colors.inputText,
              fontFamily: theme.fonts.sansRegular,
              opacity: sending ? 0.6 : 1,
            }]}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
            style={[styles.sendBtn, {
              backgroundColor: inputText.trim() && !sending ? theme.colors.primary : theme.colors.textTertiary,
              opacity: inputText.trim() && !sending ? 1 : 0.5,
            }]}
            activeOpacity={0.85}
          >
            {sending
              ? <ActivityIndicator size="small" color="#FFFFFF" />
              : <Text style={styles.sendBtnText}>↑</Text>}
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}