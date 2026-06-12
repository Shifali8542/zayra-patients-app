import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../contexts/ThemeContext';
import { ZayraLogo } from '../../../../components/ui/ZayraLogo';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../../../types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingBaseline'>;

const BASELINE_FIELDS = [
  { label: 'Lifestyle', val: 'Balanced' },
  { label: 'Sleep pattern', val: 'Balanced' },
  { label: 'Stress level', val: 'Balanced' },
  { label: 'Activity', val: 'Balanced' },
];

export function OnboardingBaselineScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const { journey, name, goals } = route.params;
  const [age, setAge] = useState(32);

  return (
    <LinearGradient colors={theme.gradients.bg as [string, string, ...string[]]} style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.logoRow}>
            <ZayraLogo size={40} showText={true} />
          </View>

        <View style={[styles.progressBg, { backgroundColor: theme.colors.border }]}>
          <LinearGradient colors={theme.gradients.aqua as [string, string]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.progressFill, { width: '75%' }]} />
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={[styles.title, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold }]}>A gentle baseline.</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary, fontFamily: theme.fonts.sansRegular }]}>Alyna will adapt to your body — not an average.</Text>

            <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={styles.ageRow}>
                <Text style={[styles.ageLabel, { color: theme.colors.textSecondary }]}>Age</Text>
                <Text style={[styles.ageValue, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold }]}>{age}</Text>
              </View>
              <Slider
                value={age}
                minimumValue={16}
                maximumValue={85}
                step={1}
                onValueChange={(v) => setAge(Math.round(v))}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.border}
                thumbTintColor={theme.colors.primary}
                style={styles.slider}
              />
              <View style={styles.baselineGrid}>
                {BASELINE_FIELDS.map((f) => (
                  <View key={f.label} style={[styles.baselineCell, { backgroundColor: 'rgba(224,247,245,0.60)', borderColor: theme.colors.border }]}>
                    <Text style={[styles.baselineCellLabel, { color: theme.colors.textSecondary }]}>{f.label}</Text>
                    <Text style={[styles.baselineCellVal, { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansMedium }]}>{f.val}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.bottomBar, { borderTopColor: theme.colors.border }]}>
          <LinearGradient colors={theme.gradients.ink as [string, string]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaGrad}>
            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={() => navigation.navigate('OnboardingPromise', { journey, name, goals, age })}
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
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 16 },
  title: { fontSize: 26, lineHeight: 32, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, lineHeight: 20, marginTop: 6, marginBottom: 24 },
  card: { borderRadius: 20, borderWidth: 1, padding: 20 },
  ageRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  ageLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 2 },
  ageValue: { fontSize: 32, letterSpacing: -0.5 },
  slider: { marginTop: 12, marginBottom: 4 },
  baselineGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
  baselineCell: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, width: '47%' },
  baselineCellLabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 2 },
  baselineCellVal: { fontSize: 13, marginTop: 2 },
  bottomBar: { borderTopWidth: 1, paddingHorizontal: 24, paddingVertical: 16 },
  ctaGrad: { borderRadius: 16, overflow: 'hidden' },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  ctaText: { color: '#FFFFFF', fontSize: 16 },
  ctaArrow: { color: '#FFFFFF', fontSize: 18 },
});