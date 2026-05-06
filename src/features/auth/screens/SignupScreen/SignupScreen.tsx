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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../../../../contexts/ThemeContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { ZayraLogo } from '../../../../components/ui/ZayraLogo';
import { PulsingDot } from '../../../../components/ui/PulsingDot';
import { signupStyles as styles } from './SignupScreen.style';
import type { AuthStackParamList } from '../../../../types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

const PROMISES = [
  "We'll begin learning your baseline.",
  'Alyna will adapt to your body, not an average.',
  'Your data stays yours — visible only as you choose.',
];

export function SignupScreen() {
  const { theme } = useTheme();
  const { signup, loading, error } = useAuth();
  const navigation = useNavigation<Nav>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    await signup(name, email, password);
  };

  const renderInput = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    opts: {
      placeholder: string;
      type?: 'email' | 'password' | 'text';
    }
  ) => (
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
        {label}
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
              paddingRight: opts.type === 'password' ? 48 : 16,
            },
          ]}
          placeholder={opts.placeholder}
          placeholderTextColor={theme.colors.inputPlaceholder}
          value={value}
          onChangeText={onChange}
          secureTextEntry={opts.type === 'password' ? !showPassword : false}
          keyboardType={opts.type === 'email' ? 'email-address' : 'default'}
          autoCapitalize={opts.type === 'email' || opts.type === 'password' ? 'none' : 'words'}
          autoCorrect={false}
        />
        {opts.type === 'password' && (
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPassword((p) => !p)}
          >
            <Text style={{ fontSize: 18, color: theme.colors.textTertiary }}>
              {showPassword ? '🙈' : '👁'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

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
          <View style={styles.header}>
            <ZayraLogo size={44} />
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
              Know your body.
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
              Create your Zayra profile. Your baseline starts here.
            </Text>

            {renderInput('First name', name, setName, { placeholder: 'Your first name', type: 'text' })}
            {renderInput('Email', email, setEmail, { placeholder: 'you@example.com', type: 'email' })}
            {renderInput('Password', password, setPassword, { placeholder: 'Min. 8 characters', type: 'password' })}

            {error && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
            )}

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: theme.colors.secondary }]}
              onPress={handleSignup}
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
                    Begin my journey
                  </Text>
                  <Text style={{ color: '#FFFFFF', fontSize: 16 }}>→</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Promises */}
            <View style={styles.promisesWrap}>
              {PROMISES.map((promise, i) => (
                <View key={i} style={styles.promiseRow}>
                  <View
                    style={[
                      styles.checkCircle,
                      { backgroundColor: theme.colors.tealAlpha20 },
                    ]}
                  >
                    <Text style={{ color: theme.colors.primary, fontSize: 10 }}>✓</Text>
                  </View>
                  <Text
                    style={[
                      styles.promiseText,
                      {
                        color: theme.colors.textSecondary,
                        fontFamily: theme.fonts.sansRegular,
                      },
                    ]}
                  >
                    {promise}
                  </Text>
                </View>
              ))}
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.divider, { backgroundColor: 'rgba(156,163,175,0.4)' }]} />
              <Text style={[styles.dividerText, { color: theme.colors.textTertiary }]}>or</Text>
              <View style={[styles.divider, { backgroundColor: 'rgba(156,163,175,0.4)' }]} />
            </View>

            <View style={styles.footerRow}>
              <Text
                style={[
                  styles.footerText,
                  { color: theme.colors.textSecondary, fontFamily: theme.fonts.sansRegular },
                ]}
              >
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text
                  style={[
                    styles.footerLink,
                    { color: theme.colors.primary, fontFamily: theme.fonts.sansSemiBold },
                  ]}
                >
                  Sign in
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
