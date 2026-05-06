import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../../../contexts/ThemeContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { ZayraLogo } from '../../../../components/ui/ZayraLogo';
import { PulsingDot } from '../../../../components/ui/PulsingDot';
import { loginStyles as styles } from './LoginScreen.style';
import type { AuthStackParamList } from '../../../../types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
  const { theme } = useTheme();
  const { login, skipAuth, loading, error } = useAuth();
  const navigation = useNavigation<Nav>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    await login(email, password);
  };

  return (
    <LinearGradient
      colors={['#D6F3F0', '#C8EEE9', '#D8F2EF', '#E4F7F5']}
      locations={[0, 0.3, 0.6, 1]}
      style={styles.flex}
    >
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={styles.header}>
            <ZayraLogo size={44} />
            <TouchableOpacity
              style={[styles.themeBtn, { backgroundColor: 'rgba(255,255,255,0.50)' }]}
              onPress={() => {}}
            >
              <Text style={{ fontSize: 16 }}>☀️</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Badge */}
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: 'rgba(255,255,255,0.60)',
                  borderColor: 'rgba(255,255,255,0.80)',
                },
              ]}
            >
              <PulsingDot size={8} />
              <Text
                style={[
                  styles.badgeText,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: theme.fonts.sansSemiBold,
                    fontSize: theme.fontSize.xs,
                  },
                ]}
              >
                Adaptive Health OS · Iteration 1
              </Text>
            </View>

            {/* Headline */}
            <Text
              style={[
                styles.headline,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: theme.fonts.displayExtraBold,
                  fontSize: theme.fontSize.giant,
                },
              ]}
            >
              Welcome back.
            </Text>
            <Text
              style={[
                styles.subtext,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.fonts.sansRegular,
                  fontSize: theme.fontSize.base,
                },
              ]}
            >
              Your body has been keeping your baseline.
            </Text>

            {/* Email */}
            <View style={styles.fieldWrap}>
              <Text
                style={[
                  styles.fieldLabel,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: theme.fonts.sansMedium,
                    fontSize: theme.fontSize.sm,
                  },
                ]}
              >
                Email
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.inputBg,
                    borderColor: theme.colors.inputBorder,
                    color: theme.colors.inputText,
                    fontFamily: theme.fonts.sansRegular,
                  },
                ]}
                placeholder="you@example.com"
                placeholderTextColor={theme.colors.inputPlaceholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password */}
            <View style={styles.fieldWrap}>
              <Text
                style={[
                  styles.fieldLabel,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: theme.fonts.sansMedium,
                    fontSize: theme.fontSize.sm,
                  },
                ]}
              >
                Password
              </Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.inputBg,
                      borderColor: theme.colors.inputBorder,
                      color: theme.colors.inputText,
                      fontFamily: theme.fonts.sansRegular,
                      paddingRight: 48,
                    },
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.inputPlaceholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword((p) => !p)}
                >
                  <Text style={{ fontSize: 18, color: theme.colors.textTertiary }}>
                    {showPassword ? '🙈' : '👁'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {error && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
            )}

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: theme.colors.secondary }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text
                    style={[
                      styles.submitText,
                      { color: '#FFFFFF', fontFamily: theme.fonts.sansSemiBold },
                    ]}
                  >
                    Sign in
                  </Text>
                  <Text style={{ color: '#FFFFFF', fontSize: 16 }}>→</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Skip Button */}
            <TouchableOpacity
              style={[
                styles.skipBtn,
                {
                  borderColor: 'rgba(255,255,255,0.60)',
                  backgroundColor: 'rgba(255,255,255,0.40)',
                },
              ]}
              onPress={skipAuth}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.skipText,
                  { color: theme.colors.textSecondary, fontFamily: theme.fonts.sansMedium },
                ]}
              >
                Skip for now →
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.divider, { backgroundColor: 'rgba(156,163,175,0.4)' }]} />
              <Text
                style={[
                  styles.dividerText,
                  { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular },
                ]}
              >
                or
              </Text>
              <View style={[styles.divider, { backgroundColor: 'rgba(156,163,175,0.4)' }]} />
            </View>

            {/* Footer nav */}
            <View style={styles.footerRow}>
              <Text
                style={[
                  styles.footerText,
                  { color: theme.colors.textSecondary, fontFamily: theme.fonts.sansRegular },
                ]}
              >
                New to Zayra?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text
                  style={[
                    styles.footerLink,
                    { color: theme.colors.primary, fontFamily: theme.fonts.sansSemiBold },
                  ]}
                >
                  Create your profile
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={[
                styles.legalText,
                { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular },
              ]}
            >
              Calm vigilance. Clinician-validated. © Zayra Health.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
