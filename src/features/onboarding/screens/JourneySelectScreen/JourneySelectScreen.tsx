import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../contexts/ThemeContext';
import { ZayraLogo } from '../../../../components/ui/ZayraLogo';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList, JourneyType } from '../../../../types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'JourneySelect'>;

interface JourneyOption {
  id: JourneyType;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  dark?: boolean;
}

const JOURNEYS: JourneyOption[] = [
  {
    id: 'wellness',
    title: 'Zayra Wellness',
    subtitle: 'Body intelligence, daily.',
    description: 'For Zen wristband users — elegant baseline, recovery and women\'s health insight.',
    emoji: '🫀',
  },
  {
    id: 'care',
    title: 'Zayra Care',
    subtitle: 'Quiet cardiac vigilance.',
    description: 'Axiom ECG patch + Alyna AI with clinician validation — continuous heart awareness.',
    emoji: '⚡',
  },
  {
    id: 'evac',
    title: 'Zayra Evac',
    subtitle: 'Help, ready and routed.',
    description: 'Assisted escalation, hospital routing, family awareness — calm operational layer.',
    emoji: '🛡',
    dark: true,
  },
  {
    id: 'hospital',
    title: 'Zayra Hospital',
    subtitle: 'Continuity beyond discharge.',
    description: 'Monitored recovery for post-discharge patients with care team continuity.',
    emoji: '🏥',
  },
];

export function JourneySelectScreen({ navigation }: Props) {
  const { theme } = useTheme();

  return (
    <LinearGradient colors={theme.gradients.bg as [string, string, ...string[]]} style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
            <ZayraLogo size={40} showText={true} />
          </View>
            <Text style={[styles.title, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold }]}>
              Choose your journey.
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary, fontFamily: theme.fonts.sansRegular }]}>
              The app adapts its tone, navigation and intelligence to who you are.
            </Text>
          </View>

          {/* Journey cards */}
          <View style={styles.cards}>
            {JOURNEYS.map((j) => (
              <TouchableOpacity
                key={j.id}
                onPress={() => navigation.navigate('OnboardingName', { journey: j.id })}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={
                    j.id === 'evac'
                      ? (['rgba(13,27,42,0.90)', 'rgba(13,27,42,0.70)'] as [string, string])
                      : j.id === 'wellness'
                      ? (['rgba(125,221,213,0.40)', 'rgba(0,194,178,0.20)'] as [string, string])
                      : j.id === 'hospital'
                      ? (['rgba(224,247,245,1)', 'rgba(125,221,213,0.30)'] as [string, string])
                      : (['rgba(0,194,178,0.30)', 'rgba(13,27,42,0.10)'] as [string, string])
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.journeyCard}
                >
                  <View style={styles.journeyCardInner}>
                    <View style={[
                      styles.journeyIconWrap,
                      { backgroundColor: j.dark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.80)' },
                    ]}>
                      <Text style={styles.journeyEmoji}>{j.emoji}</Text>
                    </View>
                    <View style={styles.journeyTextWrap}>
                      <View style={styles.journeyTitleRow}>
                        <Text style={[
                          styles.journeyTitle,
                          { color: j.dark ? '#FFFFFF' : theme.colors.textPrimary, fontFamily: theme.fonts.displayBold },
                        ]}>
                          {j.title}
                        </Text>
                        <Text style={[styles.journeyArrow, { color: j.dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)' }]}>→</Text>
                      </View>
                      <Text style={[
                        styles.journeySubtitle,
                        { color: j.dark ? '#7DDDD5' : theme.colors.primary, fontFamily: theme.fonts.sansMedium },
                      ]}>
                        {j.subtitle}
                      </Text>
                      <Text style={[
                        styles.journeyDesc,
                        { color: j.dark ? 'rgba(255,255,255,0.70)' : theme.colors.textSecondary, fontFamily: theme.fonts.sansRegular },
                      ]}>
                        {j.description}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 8 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
  logoIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(0,194,178,0.15)', alignItems: 'center', justifyContent: 'center' },
  logoEmoji: { fontSize: 18 },
  logoText: { fontSize: 18, letterSpacing: -0.3 },
  title: { fontSize: 28, lineHeight: 34, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, lineHeight: 20, marginTop: 6, marginBottom: 4 },
  cards: { paddingHorizontal: 16, paddingBottom: 32, gap: 12, marginTop: 8 },
  journeyCard: { borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  journeyCardInner: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, padding: 18 },
  journeyIconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  journeyEmoji: { fontSize: 24 },
  journeyTextWrap: { flex: 1 },
  journeyTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  journeyTitle: { fontSize: 17, letterSpacing: -0.3 },
  journeyArrow: { fontSize: 16 },
  journeySubtitle: { fontSize: 13, marginTop: 2 },
  journeyDesc: { fontSize: 12.5, lineHeight: 18, marginTop: 6 },
});