import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../contexts/ThemeContext';
import { ZayraLogo } from '../../../../components/ui/ZayraLogo';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../../../types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingName'>;

export function OnboardingNameScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const { journey } = route.params;
  const [name, setName] = useState('');

  return (
    <LinearGradient colors={theme.gradients.bg as [string, string, ...string[]]} style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Sticky header */}
        <View style={styles.topBar}>
         <View style={styles.logoRow}>
            <ZayraLogo size={40} showText={true} />
          </View>
          <Text style={[styles.step, { color: theme.colors.textSecondary }]}>1 / 4</Text>
        </View>

        {/* Progress bar */}
        <View style={[styles.progressBg, { backgroundColor: theme.colors.border }]}>
          <LinearGradient
            colors={theme.gradients.aqua as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: '25%' }]}
          />
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold }]}>
            What should we call you?
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary, fontFamily: theme.fonts.sansRegular }]}>
            A first name is enough. You stay in control.
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your first name"
            placeholderTextColor={theme.colors.textTertiary}
            style={[styles.input, {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.textPrimary,
              fontFamily: theme.fonts.sansRegular,
            }]}
            autoFocus
          />
        </View>

        {/* Bottom CTA */}
        <View style={[styles.bottomBar, { borderTopColor: theme.colors.border }]}>
          <LinearGradient
            colors={theme.gradients.ink as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.ctaGrad, { opacity: name.trim() ? 1 : 0.4 }]}
          >
            <TouchableOpacity
              style={styles.ctaBtn}
              disabled={!name.trim()}
              onPress={() => navigation.navigate('OnboardingGoals', { journey, name: name.trim() })}
              activeOpacity={0.85}
            >
              <Text style={[styles.ctaText, { fontFamily: theme.fonts.displayBold }]}>Continue</Text>
              <Text style={styles.ctaArrow}>→</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 12 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(0,194,178,0.15)', alignItems: 'center', justifyContent: 'center' },
  logoEmoji: { fontSize: 18 },
  logoText: { fontSize: 18, letterSpacing: -0.3 },
  step: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 2.5 },
  progressBg: { height: 2, marginHorizontal: 6, borderRadius: 2 },
  progressFill: { height: 2, borderRadius: 2 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 28 },
  title: { fontSize: 26, lineHeight: 32, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, lineHeight: 20, marginTop: 6, marginBottom: 24 },
  input: { borderRadius: 16, borderWidth: 1.5, paddingHorizontal: 18, paddingVertical: 16, fontSize: 16 },
  bottomBar: { borderTopWidth: 1, paddingHorizontal: 24, paddingVertical: 16 },
  ctaGrad: { borderRadius: 16, overflow: 'hidden' },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  ctaText: { color: '#FFFFFF', fontSize: 16 },
  ctaArrow: { color: '#FFFFFF', fontSize: 18 },
});