import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboard } from '../../features/dashboard/hooks/useDashboard';

import { HomeScreen }    from '../../features/dashboard/screens/HomeScreen/HomeScreen';
import { ECGScreen }     from '../../features/dashboard/screens/ECGScreen/ECGScreen';
import { AlynaScreen }   from '../../features/dashboard/screens/AlynaScreen/AlynaScreen';
import { RhythmScreen }  from '../../features/dashboard/screens/RhythmScreen/RhythmScreen';
import { CircleScreen }  from '../../features/dashboard/screens/CircleScreen/CircleScreen';
import { StoriesScreen } from '../../features/dashboard/screens/StoriesScreen/StoriesScreen';
import { ProfileScreen } from '../../features/dashboard/screens/ProfileScreen/ProfileScreen';

import { appNavigatorStyles as styles } from './AppNavigator.style';
import type { TabParamList } from '../../types';

const Tab = createBottomTabNavigator<TabParamList>();

// Tab order: Home | ECG | Alyna | Rhythm | Circle | Stories | Profile
const TAB_ICONS: Record<string, string> = {
  Home:    '🏠',
  ECG:     '❤️',
  Alyna:   '✨',
  Rhythm:  '🔥',
  Circle:  '👥',
  Stories: '📖',
  Profile: '👤',
};

// ─── Custom tab bar ────────────────────────────────────────────────────────────

function CustomTabBar({ state, descriptors, navigation }: any) {
  const { theme } = useTheme();
  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.safeArea, { backgroundColor: theme.colors.navBackground, borderTopColor: theme.colors.navBorder }]}
    >
      <View style={styles.bar}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const icon = TAB_ICONS[route.name] ?? '●';
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabItem} activeOpacity={0.7}>
              <Text style={[styles.tabIcon, { opacity: isFocused ? 1 : 0.45 }]}>{icon}</Text>
              <Text style={[styles.tabLabel, {
                color: isFocused ? theme.colors.navActive : theme.colors.navInactive,
                fontFamily: isFocused ? theme.fonts.sansSemiBold : theme.fonts.sansRegular,
                fontSize: theme.fontSize.xxs,
              }]}>
                {route.name}
              </Text>
              {isFocused && <View style={[styles.activeIndicator, { backgroundColor: theme.colors.primary }]} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// ─── State screens (loading / error / no profile) ─────────────────────────────

function LoadingScreen() {
  const { theme } = useTheme();
  return (
    <LinearGradient colors={theme.gradients.bg as [string, string, ...string[]]} style={styles.stateScreen}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.stateLoadingText, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.sm }]}>
        Loading your health data...
      </Text>
    </LinearGradient>
  );
}

function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  const { theme } = useTheme();
  return (
    <LinearGradient colors={theme.gradients.bg as [string, string, ...string[]]} style={styles.stateScreen}>
      <Text style={styles.stateIcon}>⚠️</Text>
      <Text style={[styles.stateTitle, { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.base }]}>
        {message}
      </Text>
      <TouchableOpacity style={[styles.retryBtn, { backgroundColor: theme.colors.primary }]} onPress={onRetry}>
        <Text style={[styles.retryBtnText, { fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.sm }]}>Retry</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

function NoProfileScreen({ onSignOut }: { onSignOut: () => void }) {
  const { theme } = useTheme();
  return (
    <LinearGradient colors={theme.gradients.bg as [string, string, ...string[]]} style={styles.stateScreen}>
      <Text style={styles.stateIcon}>🏥</Text>
      <Text style={[styles.stateTitle, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.h2 }]}>
        Profile not yet linked
      </Text>
      <Text style={[styles.stateSubtext, { color: theme.colors.textSecondary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.sm }]}>
        Your account is not yet linked to an ECG profile. Please contact your healthcare provider to complete setup.
      </Text>
      <TouchableOpacity style={[styles.signOutBtn, { borderColor: 'rgba(239,68,68,0.20)' }]} onPress={onSignOut}>
        <Text style={[styles.signOutBtnText, { fontFamily: theme.fonts.sansMedium, fontSize: theme.fontSize.sm }]}>Sign out</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

// ─── Dashboard wrapper ────────────────────────────────────────────────────────

function DashboardWrapper() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const dashboard = useDashboard();

  if (dashboard.loading) return <LoadingScreen />;
  if (dashboard.error) return <ErrorScreen message={dashboard.error} onRetry={dashboard.reload} />;
  if (dashboard.noPatientProfile) return <NoProfileScreen onSignOut={logout} />;

  const wrap = (children: React.ReactNode) => (
    <LinearGradient colors={theme.gradients.bg as [string, string, ...string[]]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );

  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>

      {/* 1. Home */}
      <Tab.Screen name="Home">
        {() => wrap(
          <HomeScreen
            metrics={dashboard.metrics}
            timeline={dashboard.timeline}
            interpretation={dashboard.interpretation}
            stResult={dashboard.stResult}
          />
        )}
      </Tab.Screen>

      {/* 2. ECG — new tab */}
      <Tab.Screen name="ECG">
        {() => wrap(
          <ECGScreen
            patientMe={dashboard.patientMe}
            getWaveform={dashboard.getWaveform}
            getHeartReport={dashboard.getHeartReport}
          />
        )}
      </Tab.Screen>

      {/* 3. Alyna */}
      <Tab.Screen name="Alyna">
        {() => wrap(
          <AlynaScreen
            initialChat={dashboard.alynaChat}
            onSendMessage={dashboard.sendAlynaMessage}
            interpretation={dashboard.interpretation}
            riskLevel={dashboard.riskLevel}
            findings={dashboard.findings}
            recommendation={dashboard.recommendation}
          />
        )}
      </Tab.Screen>

      {/* 4. Rhythm */}
      <Tab.Screen name="Rhythm">
        {() => wrap(
          <RhythmScreen
            streak={dashboard.streak}
            consistencyAreas={dashboard.consistencyAreas}
            clinicalInfo={dashboard.clinicalInfo}
          />
        )}
      </Tab.Screen>

      {/* 5. Circle */}
      <Tab.Screen name="Circle">
        {() => wrap(
          <CircleScreen
            members={dashboard.members}
            journeys={dashboard.journeys}
            user={user}
          />
        )}
      </Tab.Screen>

      {/* 6. Stories */}
      <Tab.Screen name="Stories">
        {() => wrap(
          <StoriesScreen stories={dashboard.stories} />
        )}
      </Tab.Screen>

      {/* 7. Profile */}
      <Tab.Screen name="Profile">
        {() => wrap(
          user ? (
            <ProfileScreen
              user={user}
              onLogout={logout}
              clinicalInfo={dashboard.clinicalInfo}
            />
          ) : null
        )}
      </Tab.Screen>

    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return <DashboardWrapper />;
}