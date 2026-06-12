import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../contexts/ThemeContext';
import { ZayraLogo } from '../../../../components/ui/ZayraLogo';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../../../types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingGoals'>;

const GOAL_OPTIONS = [
  'Better wellbeing', 'Stress awareness', 'Heart awareness',
  'Family protection', 'Pregnancy planning', 'Recovery & post-discharge',
  'Executive / travel', 'Mission readiness',
];

export function OnboardingGoalsScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const { journey, name } = route.params;
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (g: string) => {
    setSelectedGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  return (
    <LinearGradient colors={theme.gradients.bg as [string, string, ...string[]]} style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <View style={styles.logoRow}>
            <View style={styles.logoIconWrap}><Text style={styles.logoEmoji}>💙</Text></View>
            <Text style={[styles.logoText, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold }]}>Zayra</Text>
          </View>
          <Text style={[styles.step, { color: theme.colors.textSecondary }]}>2 / 4</Text>
        </View>

        <View style={[styles.progressBg, { backgroundColor: theme.colors.border }]}>
          <LinearGradient colors={theme.gradients.aqua as [string, string]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.progressFill, { width: '50%' }]} />
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={[styles.title, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold }]}>What brings you here?</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary, fontFamily: theme.fonts.sansRegular }]}>Pick anything that resonates. We'll adapt.</Text>

            <View style={styles.goalsWrap}>
              {GOAL_OPTIONS.map((g) => {
                const selected = selectedGoals.includes(g);
                return selected ? (
                  <LinearGradient
                    key={g}
                    colors={theme.gradients.ink as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.goalChipGrad}
                  >
                    <TouchableOpacity onPress={() => toggleGoal(g)} style={styles.goalChipBtn} activeOpacity={0.8}>
                      <Text style={[styles.goalChipText, { color: '#FFFFFF', fontFamily: theme.fonts.sansMedium }]}>✓ {g}</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                ) : (
                  <TouchableOpacity
                    key={g}
                    onPress={() => toggleGoal(g)}
                    style={[styles.goalChip, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.goalChipText, { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansRegular }]}>{g}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View style={[styles.bottomBar, { borderTopColor: theme.colors.border }]}>
          <LinearGradient
            colors={theme.gradients.ink as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.ctaGrad, { opacity: selectedGoals.length > 0 ? 1 : 0.4 }]}
          >
            <TouchableOpacity
              style={styles.ctaBtn}
              disabled={selectedGoals.length === 0}
              onPress={() => navigation.navigate('OnboardingBaseline', { journey, name, goals: selectedGoals })}
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
  goalsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  goalChipGrad: { borderRadius: 999, overflow: 'hidden' },
  goalChipBtn: { paddingHorizontal: 16, paddingVertical: 10 },
  goalChip: { borderRadius: 999, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10 },
  goalChipText: { fontSize: 13 },
  bottomBar: { borderTopWidth: 1, paddingHorizontal: 24, paddingVertical: 16 },
  ctaGrad: { borderRadius: 16, overflow: 'hidden' },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  ctaText: { color: '#FFFFFF', fontSize: 16 },
  ctaArrow: { color: '#FFFFFF', fontSize: 18 },
});