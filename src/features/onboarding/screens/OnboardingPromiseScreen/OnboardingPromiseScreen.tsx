import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../contexts/ThemeContext';
import { ZayraLogo } from '../../../../components/ui/ZayraLogo';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../../../types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingPromise'> & {
  onComplete: (journey: string) => void;
};

const PROMISES = [
  "We'll begin learning your baseline.",
  "Alyna will adapt to your body, not an average.",
  "Your data stays yours — visible only as you choose.",
  "If something matters, we'll quietly tell you why.",
];

export function OnboardingPromiseScreen({ navigation, route, onComplete }: Props) {
  const { theme } = useTheme();
  const { journey } = route.params;

  return (
    <LinearGradient colors={theme.gradients.bg as [string, string, ...string[]]} style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <View style={styles.logoRow}>
            <View style={styles.logoIconWrap}><Text style={styles.logoEmoji}>💙</Text></View>
            <Text style={[styles.logoText, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold }]}>Zayra</Text>
          </View>
          <Text style={[styles.step, { color: theme.colors.textSecondary }]}>4 / 4</Text>
        </View>

        <View style={[styles.progressBg, { backgroundColor: theme.colors.border }]}>
          <LinearGradient colors={theme.gradients.aqua as [string, string]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.progressFill, { width: '100%' }]} />
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={[styles.title, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold }]}>Your body promise.</Text>

            <View style={styles.promiseList}>
              {PROMISES.map((text, i) => (
                <View key={i} style={[styles.promiseItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <LinearGradient
                    colors={theme.gradients.aqua as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.checkCircle}
                  >
                    <Text style={styles.checkMark}>✓</Text>
                  </LinearGradient>
                  <Text style={[styles.promiseText, { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansRegular }]}>
                    {text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={[styles.bottomBar, { borderTopColor: theme.colors.border }]}>
          <LinearGradient colors={theme.gradients.ink as [string, string]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaGrad}>
            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={() => onComplete(journey)}
              activeOpacity={0.85}
            >
              <Text style={[styles.ctaText, { fontFamily: theme.fonts.displayBold }]}>Enter Zayra</Text>
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
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 16 },
  title: { fontSize: 26, lineHeight: 32, letterSpacing: -0.5, marginBottom: 24 },
  promiseList: { gap: 12 },
  promiseItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderRadius: 16, borderWidth: 1, padding: 16 },
  checkCircle: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  checkMark: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  promiseText: { flex: 1, fontSize: 14, lineHeight: 20 },
  bottomBar: { borderTopWidth: 1, paddingHorizontal: 24, paddingVertical: 16 },
  ctaGrad: { borderRadius: 16, overflow: 'hidden' },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  ctaText: { color: '#FFFFFF', fontSize: 16 },
  ctaArrow: { color: '#FFFFFF', fontSize: 18 },
});