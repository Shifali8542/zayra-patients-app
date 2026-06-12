import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator/AppNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import type { RootStackParamList, JourneyType } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const ONBOARDING_KEY = 'zayra_onboarding_complete';
const JOURNEY_KEY = 'zayra_selected_journey';

export function RootNavigator() {
  const { isAuthenticated, loading, user } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [selectedJourney, setSelectedJourney] = useState<JourneyType>('care');

  // Load persisted onboarding state when user is known
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setOnboardingComplete(null);
      return;
    }
    const key = `${ONBOARDING_KEY}_${user.id}`;
    const journeyKey = `${JOURNEY_KEY}_${user.id}`;
    AsyncStorage.multiGet([key, journeyKey]).then(([onboardingResult, journeyResult]) => {
      const done = onboardingResult[1] === 'true';
      const journey = (journeyResult[1] as JourneyType) ?? 'care';
      setOnboardingComplete(done);
      if (done) setSelectedJourney(journey);
    });
  }, [isAuthenticated, user?.id]);

  const handleOnboardingComplete = async (journey: string) => {
    const j = journey as JourneyType;
    if (user) {
      await AsyncStorage.multiSet([
        [`${ONBOARDING_KEY}_${user.id}`, 'true'],
        [`${JOURNEY_KEY}_${user.id}`, j],
      ]);
    }
    setSelectedJourney(j);
    setOnboardingComplete(true);
  };

  const handleJourneySwitch = async (journey: JourneyType) => {
    if (user) {
      await AsyncStorage.setItem(`${JOURNEY_KEY}_${user.id}`, journey);
    }
    setSelectedJourney(journey);
  };

  // Loading: auth OR onboarding state not yet read
  if (loading || (isAuthenticated && onboardingComplete === null)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E4F7F5' }}>
        <ActivityIndicator size="large" color="#00C2B2" />
      </View>
    );
  }

  if (isAuthenticated && !onboardingComplete) {
    return <OnboardingNavigator onComplete={handleOnboardingComplete} />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {isAuthenticated ? (
        <Stack.Screen name="App">
          {() => (
            <AppNavigator
              selectedJourney={selectedJourney}
              onJourneySwitch={handleJourneySwitch}
            />
          )}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}