import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboard } from '../../features/dashboard/hooks/useDashboard';
import { HomeScreen } from '../../features/dashboard/screens/HomeScreen/HomeScreen';
import { AlynaScreen } from '../../features/dashboard/screens/AlynaScreen/AlynaScreen';
import { RhythmScreen } from '../../features/dashboard/screens/RhythmScreen/RhythmScreen';
import { CircleScreen } from '../../features/dashboard/screens/CircleScreen/CircleScreen';
import { StoriesScreen } from '../../features/dashboard/screens/StoriesScreen/StoriesScreen';
import { ProfileScreen } from '../../features/dashboard/screens/ProfileScreen/ProfileScreen';
import { SupportListScreen } from '../../features/support/screens/SupportListScreen/SupportListScreen';
import { TicketChatScreen } from '../../features/support/screens/TicketChatScreen/TicketChatScreen';
import { appNavigatorStyles as styles } from './AppNavigator.style';
import type { TabParamList, JourneyType } from '../../types';

const Tab = createBottomTabNavigator<TabParamList>();

// Tab order: Home | Alyna | Rhythm | Circle | Stories | Profile
const TAB_ICONS: Record<string, string> = {
  Home: '🏠',
  Alyna: '✨',
  Rhythm: '🔥',
  Circle: '👥',
  Stories: '📖',
  Profile: '👤',
};

// ─── Custom tab bar 
function CustomTabBar({ state, descriptors, navigation, isDark }: any) {
  const { theme } = useTheme();
  return (
    <SafeAreaView
      edges={['bottom']}
      style={[
        styles.safeArea,
        {
          backgroundColor: isDark ? 'transparent' : theme.colors.navBackground,
          borderTopColor: isDark ? 'rgba(255,255,255,0.10)' : theme.colors.navBorder,
        },
      ]}
    >
      <View style={[
        styles.barContainer,
        {
          backgroundColor: isDark ? 'rgba(13,27,42,0.60)' : 'rgba(255,255,255,0.72)',
          borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)',
        },
      ]}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const icon = TAB_ICONS[route.name] ?? '●';
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabItem} activeOpacity={0.7}>
              <View style={[
                styles.tabIconWrap,
                isFocused && {
                  backgroundColor: isDark ? 'rgba(0,194,178,0.15)' : 'rgba(0,194,178,0.12)',
                },
              ]}>
                <Text style={[styles.tabIcon, { opacity: isFocused ? 1 : 0.45 }]}>{icon}</Text>
              </View>
              <Text style={[styles.tabLabel, {
                color: isFocused
                  ? (isDark ? '#7DDDD5' : theme.colors.navActive)
                  : (isDark ? 'rgba(255,255,255,0.50)' : theme.colors.navInactive),
                fontFamily: isFocused ? theme.fonts.sansSemiBold : theme.fonts.sansRegular,
                fontSize: theme.fontSize.xxs,
              }]}>
                {route.name}
              </Text>
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

// Dashboard wrapper
interface DashboardWrapperProps {
  selectedJourney: JourneyType;
  onJourneySwitch: (journey: JourneyType) => void;
}

function DashboardWrapper({ selectedJourney, onJourneySwitch }: DashboardWrapperProps) {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const dashboard = useDashboard();
  const isEvacJourney = selectedJourney === 'evac';

  // Support navigation state — drives profile tab sub-screens
  const [supportView, setSupportView] = React.useState<
    { screen: 'list' } | { screen: 'chat'; ticketId: number } | null
  >(null);

  if (dashboard.loading) return <LoadingScreen />;
  if (dashboard.error) return <ErrorScreen message={dashboard.error} onRetry={dashboard.reload} />;
  if (dashboard.noPatientProfile) return <NoProfileScreen onSignOut={logout} />;

  const wrap = (children: React.ReactNode) => (
    <LinearGradient
      colors={(isEvacJourney ? theme.gradients.evac : theme.gradients.bg) as [string, string, ...string[]]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} isDark={isEvacJourney} />}
      screenOptions={{ headerShown: false }}
    >

      {/* 1. Home */}
      <Tab.Screen name="Home">
        {() => wrap(
          <HomeScreen
            metrics={dashboard.metrics}
            timeline={dashboard.timeline}
            interpretation={dashboard.interpretation}
            stResult={dashboard.stResult}
            journey={selectedJourney}
          />
        )}
      </Tab.Screen>

      {/* 2. Alyna */}
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
            supportView?.screen === 'chat' ? (
              <TicketChatScreen
                ticketId={supportView.ticketId}
                onBack={() => setSupportView({ screen: 'list' })}
              />
            ) : supportView?.screen === 'list' ? (
              <SupportListScreen
                onOpenTicket={(id) => setSupportView({ screen: 'chat', ticketId: id })}
                onBack={() => setSupportView(null)}
              />
            ) : (
              <ProfileScreen
                user={user}
                onLogout={logout}
                clinicalInfo={dashboard.clinicalInfo}
                onOpenSupport={() => setSupportView({ screen: 'list' })}
                selectedJourney={selectedJourney}
                onJourneySwitch={onJourneySwitch}
              />
            )
          ) : null
        )}
      </Tab.Screen>

    </Tab.Navigator>
  );
}

interface AppNavigatorProps {
  selectedJourney: JourneyType;
  onJourneySwitch: (journey: JourneyType) => void;
}

export function AppNavigator({ selectedJourney, onJourneySwitch }: AppNavigatorProps) {
  return <DashboardWrapper selectedJourney={selectedJourney} onJourneySwitch={onJourneySwitch} />;
}