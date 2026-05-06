import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../contexts/ThemeContext';
import { alynaStyles as styles } from './AlynaScreen.style';
import type { ChatMessage } from '../../../../types';

interface AlynaScreenProps {
  initialChat: ChatMessage[];
  onSendMessage: (message: string) => Promise<ChatMessage | null>;
}

function TypingIndicator({ theme }: { theme: any }) {
  const anims = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const animations = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(anim, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      )
    );
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View style={styles.typingWrap}>
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.typingDot,
            { backgroundColor: theme.colors.primary, transform: [{ translateY: anim }] },
          ]}
        />
      ))}
    </View>
  );
}

export function AlynaScreen({ initialChat, onSendMessage }: AlynaScreenProps) {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>(initialChat);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);
    const reply = await onSendMessage(userMsg.message);
    if (reply) setMessages((prev) => [...prev, reply]);
    setSending(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.headerLabel,
            {
              color: theme.colors.textTertiary,
              fontFamily: theme.fonts.sansSemiBold,
              fontSize: theme.fontSize.xs,
            },
          ]}
        >
          Your Governed AI
        </Text>
        <Text
          style={[
            styles.headerTitle,
            {
              color: theme.colors.textPrimary,
              fontFamily: theme.fonts.displayBold,
              fontSize: theme.fontSize.h2,
            },
          ]}
        >
          Alyna
        </Text>
      </View>

      {/* Today's Interpretation */}
      <LinearGradient
        colors={['#00C2B2', '#0D1B2A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.interpretationCard}
      >
        <Text
          style={[
            styles.interpLabel,
            { color: 'rgba(255,255,255,0.70)', fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs },
          ]}
        >
          Today's Interpretation
        </Text>
        <View style={styles.interpRow}>
          <View style={[styles.sparkleCircle, { backgroundColor: 'rgba(255,255,255,0.20)' }]}>
            <Text style={{ fontSize: 16 }}>✨</Text>
          </View>
          <Text
            style={[
              styles.interpText,
              { color: '#FFFFFF', fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.sm },
            ]}
          >
            Calm body. Sharp mind window between 10:30 — 12:30. Use it well.
          </Text>
        </View>
      </LinearGradient>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messagesScroll}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubbleWrap,
              { justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' },
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                msg.sender === 'user'
                  ? {
                      backgroundColor: theme.colors.secondary,
                      borderBottomRightRadius: 4,
                    }
                  : {
                      backgroundColor: theme.colors.surfaceAlt,
                      borderBottomLeftRadius: 4,
                    },
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  {
                    color: msg.sender === 'user' ? '#FFFFFF' : theme.colors.textPrimary,
                    fontFamily: theme.fonts.sansRegular,
                    fontSize: theme.fontSize.sm,
                  },
                ]}
              >
                {msg.message}
              </Text>
            </View>
          </View>
        ))}
        {sending && (
          <View style={styles.messageBubbleWrap}>
            <View
              style={[
                styles.messageBubble,
                { backgroundColor: theme.colors.surfaceAlt, borderBottomLeftRadius: 4 },
              ]}
            >
              <TypingIndicator theme={theme} />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: theme.colors.surfaceAlt,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <TextInput
          style={[
            styles.textInput,
            { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansRegular },
          ]}
          placeholder="Ask Alyna..."
          placeholderTextColor={theme.colors.inputPlaceholder}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          multiline
        />
        <TouchableOpacity style={styles.micBtn} onPress={() => {}}>
          <Text style={{ fontSize: 18, color: theme.colors.textTertiary }}>🎙</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sendBtn,
            { backgroundColor: input.trim() && !sending ? theme.colors.primary : theme.colors.tealAlpha20 },
          ]}
          onPress={handleSend}
          disabled={!input.trim() || sending}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 14 }}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
