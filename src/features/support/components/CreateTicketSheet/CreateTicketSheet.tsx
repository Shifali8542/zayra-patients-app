import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../../../contexts/ThemeContext';
import { api, ApiError } from '../../../../services/api';
import { createTicketStyles as styles } from './CreateTicketSheet.style';
import type { TicketCategory } from '../../../../types';

interface CreateTicketSheetProps {
  onClose: () => void;
  onCreated: (ticketId: number) => void;
}

const CATEGORIES: { value: TicketCategory; label: string; description: string }[] = [
  { value: 'device_sync',  label: 'Device issue',     description: 'Patch not syncing, LED errors' },
  { value: 'alyna_alert',  label: 'Alyna / AI',       description: 'Question about my AI analysis' },
  { value: 'billing',      label: 'Billing',           description: 'Charges, subscription, refund' },
  { value: 'onboarding',   label: 'Getting started',   description: 'Setup, account, profile help' },
  { value: 'evac_alert',   label: 'Evac / Emergency',  description: 'Emergency response question' },
  { value: 'other',        label: 'Other',             description: 'Something else' },
];

export function CreateTicketSheet({ onClose, onCreated }: CreateTicketSheetProps) {
  const { theme }                       = useTheme();
  const [title,    setTitle]            = useState('');
  const [desc,     setDesc]             = useState('');
  const [category, setCategory]         = useState<TicketCategory>('other');
  const [loading,  setLoading]          = useState(false);
  const [error,    setError]            = useState<string | null>(null);

  const isValid = title.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const ticket = await api.support.createTicket({
        title:       title.trim(),
        description: desc.trim(),
        category,
      });
      onCreated(ticket.id);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Failed to create ticket. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.overlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity activeOpacity={1}>
          <ScrollView
            style={[styles.sheet, { backgroundColor: theme.colors.card }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Handle + close */}
            <View style={styles.handleRow}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <View style={[styles.handle, { backgroundColor: theme.colors.divider }]} />
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.closeBtn, { backgroundColor: theme.colors.surfaceAlt }]}
                activeOpacity={0.8}
              >
                <Text style={[styles.closeBtnText, { color: theme.colors.textTertiary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold }]}>
              New Request
            </Text>
            <Text style={[styles.sheetTitle, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.xl }]}>
              Contact Support
            </Text>

            {/* Category */}
            <Text style={[styles.sheetLabel, { color: theme.colors.textSecondary, fontFamily: theme.fonts.sansSemiBold }]}>
              Category
            </Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map(cat => {
                const isActive = category === cat.value;
                return (
                  <TouchableOpacity
                    key={cat.value}
                    onPress={() => setCategory(cat.value)}
                    style={[styles.categoryBtn, {
                      backgroundColor: isActive ? theme.colors.tealAlpha10 : theme.colors.surfaceAlt,
                      borderColor: isActive ? theme.colors.primary : theme.colors.cardBorder,
                    }]}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.categoryLabel, {
                      color: isActive ? theme.colors.primary : theme.colors.textPrimary,
                      fontFamily: theme.fonts.sansSemiBold,
                    }]}>
                      {cat.label}
                    </Text>
                    <Text style={[styles.categorySub, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular }]}>
                      {cat.description}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Subject */}
            <Text style={[styles.inputLabel, { color: theme.colors.textSecondary, fontFamily: theme.fonts.sansSemiBold }]}>
              Subject
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Briefly describe your issue"
              placeholderTextColor={theme.colors.inputPlaceholder}
              maxLength={255}
              style={[styles.input, {
                backgroundColor: theme.colors.inputBg,
                borderColor: theme.colors.inputBorder,
                color: theme.colors.inputText,
                fontFamily: theme.fonts.sansRegular,
              }]}
            />

            {/* Description */}
            <Text style={[styles.inputLabel, { color: theme.colors.textSecondary, fontFamily: theme.fonts.sansSemiBold }]}>
              Details{' '}
              <Text style={{ color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, textTransform: 'none', letterSpacing: 0 }}>
                (optional)
              </Text>
            </Text>
            <TextInput
              value={desc}
              onChangeText={setDesc}
              placeholder="Tell us more so we can help you faster…"
              placeholderTextColor={theme.colors.inputPlaceholder}
              multiline
              numberOfLines={3}
              style={[styles.textarea, {
                backgroundColor: theme.colors.inputBg,
                borderColor: theme.colors.inputBorder,
                color: theme.colors.inputText,
                fontFamily: theme.fonts.sansRegular,
              }]}
            />

            {/* Error */}
            {error && (
              <View style={[styles.errorBox, { backgroundColor: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.20)' }]}>
                <Text>⚠️</Text>
                <Text style={[styles.errorText, { color: '#EF4444', fontFamily: theme.fonts.sansRegular }]}>
                  {error}
                </Text>
              </View>
            )}

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!isValid || loading}
              style={[styles.submitBtn, {
                backgroundColor: isValid && !loading ? theme.colors.primary : theme.colors.textTertiary,
                opacity: isValid && !loading ? 1 : 0.6,
              }]}
              activeOpacity={0.85}
            >
              {loading ? (
                <View style={styles.spinnerWrap}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={[styles.submitBtnText, { fontFamily: theme.fonts.sansSemiBold }]}>Sending…</Text>
                </View>
              ) : (
                <>
                  <Text style={{ fontSize: 14, color: '#FFFFFF' }}>↑</Text>
                  <Text style={[styles.submitBtnText, { fontFamily: theme.fonts.sansSemiBold }]}>Submit request</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
}