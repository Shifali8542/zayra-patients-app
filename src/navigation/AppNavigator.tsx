import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../features/dashboard/hooks/useDashboard';

import { HomeScreen } from '../features/dashboard/screens/HomeScreen/HomeScreen';
import { AlynaScreen } from '../features/dashboard/screens/AlynaScreen/AlynaScreen';
import { CircleScreen } from '../features/dashboard/screens/CircleScreen/CircleScreen';
import { RhythmScreen } from '../features/dashboard/screens/RhythmScreen/RhythmScreen';
import { StoriesScreen } from '../features/dashboard/screens/StoriesScreen/StoriesScreen';
import { ProfileScreen } from '../features/dashboard/screens/ProfileScreen/ProfileScreen';

import type { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<string, string> = {
  Home: '🏠',
  Alyna: '✨',
  Circle: '👥',
  Rhythm: '🔥',
  Stories: '📖',
  Profile: '👤',
};

// Custom tab bar component
function CustomTabBar({ state, descriptors, navigation }: any) {
  const { theme } = useTheme();

  return (
    <SafeAreaView edges={['bottom']} style={[tabStyles.safeArea, { backgroundColor: theme.colors.navBackground, borderTopColor: theme.colors.navBorder }]}>
      <View style={tabStyles.bar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label = route.name;
          const icon = TAB_ICONS[label] ?? '●';

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={tabStyles.tabItem}
              activeOpacity={0.7}
            >
              <Text style={[tabStyles.icon, { opacity: isFocused ? 1 : 0.45 }]}>{icon}</Text>
              <Text
                style={[
                  tabStyles.label,
                  {
                    color: isFocused ? theme.colors.navActive : theme.colors.navInactive,
                    fontFamily: isFocused ? theme.fonts.sansSemiBold : theme.fonts.sansRegular,
                    fontSize: theme.fontSize.xxs,
                  },
                ]}
              >
                {label}
              </Text>
              {isFocused && (
                <View style={[tabStyles.activeIndicator, { backgroundColor: theme.colors.primary }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const tabStyles = StyleSheet.create({
  safeArea: {
    borderTopWidth: 1,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  icon: {
    fontSize: 20,
    marginBottom: 2,
  },
  label: {
    letterSpacing: 0.3,
  },
  activeIndicator: {
    position: 'absolute',
    top: -6,
    width: 20,
    height: 2,
    borderRadius: 1,
  },
});

// Dashboard data wrapper — loads all data once, passes to tabs
function DashboardWrapper() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const dashboard = useDashboard();

  if (dashboard.loading) {
    return (
      <LinearGradient colors={theme.gradients.bg as [string, string, ...string[]]} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.textTertiary, marginTop: 12, fontFamily: theme.fonts.sansRegular, fontSize: 14 }}>
          Loading your health data...
        </Text>
      </LinearGradient>
    );
  }

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home">
        {() => (
          <LinearGradient colors={theme.gradients.bg as [string, string, ...string[]]} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
              <HomeScreen metrics={dashboard.metrics} timeline={dashboard.timeline} />
            </SafeAreaView>
          </LinearGradient>
        )}
      </Tab.Screen>

      <Tab.Screen name="Alyna">
        {() => (
          <LinearGradient colors={theme.gradients.bg as [string, string, ...string[]]} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
              <AlynaScreen
                initialChat={dashboard.alynaChat}
                onSendMessage={dashboard.sendAlynaMessage}
              />
            </SafeAreaView>
          </LinearGradient>
        )}
      </Tab.Screen>

      <Tab.Screen name="Circle">
        {() => (
          <LinearGradient colors={theme.gradients.bg as [string, string, ...string[]]} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
              <CircleScreen members={dashboard.members} journeys={dashboard.journeys} />
            </SafeAreaView>
          </LinearGradient>
        )}
      </Tab.Screen>

      <Tab.Screen name="Rhythm">
        {() => (
          <LinearGradient colors={theme.gradients.bg as [string, string, ...string[]]} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
              <RhythmScreen streak={dashboard.streak} />
            </SafeAreaView>
          </LinearGradient>
        )}
      </Tab.Screen>

      <Tab.Screen name="Stories">
        {() => (
          <LinearGradient colors={theme.gradients.bg as [string, string, ...string[]]} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
              <StoriesScreen stories={dashboard.stories} />
            </SafeAreaView>
          </LinearGradient>
        )}
      </Tab.Screen>

      <Tab.Screen name="Profile">
        {() => (
          <LinearGradient colors={theme.gradients.bg as [string, string, ...string[]]} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
              {user && <ProfileScreen user={user} onLogout={logout} />}
            </SafeAreaView>
          </LinearGradient>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return <DashboardWrapper />;
}
