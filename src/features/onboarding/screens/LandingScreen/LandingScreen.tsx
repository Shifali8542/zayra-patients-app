import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../contexts/ThemeContext';
import { ZayraLogo } from '../../../../components/ui/ZayraLogo';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../../../types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Landing'>;

export function LandingScreen({ navigation }: Props) {
  const { theme } = useTheme();
  return (
    <LinearGradient colors={theme.gradients.bg as [string, string, ...string[]]} style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Top logo */}
        <View style={styles.logoRow}>
            <ZayraLogo size={40} showText={true} />
          </View>

        {/* Center hero */}
        <View style={styles.heroCenter}>
         <View style={styles.heroPulseWrap}>
          <View style={[styles.heroPulseRing, { borderColor: theme.colors.tealAlpha20 }]} />
          <View style={[styles.heroPulseRing2, { borderColor: theme.colors.tealAlpha10 }]} />
          <ZayraLogo size={88} showText={false} variant="icon" />
        </View>
          <Text style={[styles.heroTitle, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold }]}>
            Know your body{'\n'}
            <Text style={{ color: theme.colors.primary }}>before it asks for help.</Text>
          </Text>
          <Text style={[styles.heroSub, { color: theme.colors.textSecondary, fontFamily: theme.fonts.sansRegular }]}>
            Governed-AI cardiac and physiological intelligence — calm, continuous, clinician-validated.
          </Text>
        </View>

        {/* Begin button */}
        <LinearGradient
          colors={theme.gradients.ink as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.beginBtnGrad}
        >
          <TouchableOpacity
            style={styles.beginBtn}
            onPress={() => navigation.navigate('JourneySelect')}
            activeOpacity={0.85}
          >
            <Text style={[styles.beginBtnText, { fontFamily: theme.fonts.displayBold }]}>Begin</Text>
            <Text style={styles.beginArrow}>→</Text>
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24, justifyContent: 'space-between' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroCenter: { alignItems: 'center', gap: 20 },
  heroPulseWrap: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center' },
  heroPulseRing: { position: 'absolute', width: 110, height: 110, borderRadius: 55, borderWidth: 1.5 },
  heroPulseRing2: { position: 'absolute', width: 130, height: 130, borderRadius: 65, borderWidth: 1 },
  heroIconCircle: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', shadowColor: '#00C2B2', shadowOpacity: 0.3, shadowRadius: 20, elevation: 8 },
  heroEmoji: { fontSize: 40 },
  heroTitle: { fontSize: 34, lineHeight: 40, textAlign: 'center', letterSpacing: -0.5 },
  heroSub: { fontSize: 15, lineHeight: 22, textAlign: 'center', maxWidth: 300 },
  beginBtnGrad: { borderRadius: 18, overflow: 'hidden' },
  beginBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 18 },
  beginBtnText: { color: '#FFFFFF', fontSize: 17 },
  beginArrow: { color: '#FFFFFF', fontSize: 20 },
});