import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LandingScreen } from '../features/onboarding/screens/LandingScreen/LandingScreen';
import { JourneySelectScreen } from '../features/onboarding/screens/JourneySelectScreen/JourneySelectScreen';
import { OnboardingNameScreen } from '../features/onboarding/screens/OnboardingNameScreen/OnboardingNameScreen';
import { OnboardingGoalsScreen } from '../features/onboarding/screens/OnboardingGoalsScreen/OnboardingGoalsScreen';
import { OnboardingBaselineScreen } from '../features/onboarding/screens/OnboardingBaselineScreen/OnboardingBaselineScreen';
import { OnboardingPromiseScreen } from '../features/onboarding/screens/OnboardingPromiseScreen/OnboardingPromiseScreen';
import type { OnboardingStackParamList } from '../types';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

interface OnboardingNavigatorProps {
  onComplete: (journey: string) => void;
}

export function OnboardingNavigator({ onComplete }: OnboardingNavigatorProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="JourneySelect" component={JourneySelectScreen} />
      <Stack.Screen name="OnboardingName" component={OnboardingNameScreen} />
      <Stack.Screen name="OnboardingGoals" component={OnboardingGoalsScreen} />
      <Stack.Screen name="OnboardingBaseline" component={OnboardingBaselineScreen} />
      <Stack.Screen
        name="OnboardingPromise"
        children={(props) => (
          <OnboardingPromiseScreen {...props} onComplete={onComplete} />
        )}
      />
    </Stack.Navigator>
  );
}