// navigation/OnboardingStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingWelcome from '../screens/Onboarding/OnboardingWelcome';
import OnboardingGoals from '../screens/Onboarding/OnboardingGoals';
import OnboardingStats from '../screens/Onboarding/OnboardingStats';

const Stack = createNativeStackNavigator();

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingWelcome" component={OnboardingWelcome} />
      <Stack.Screen name="OnboardingGoals" component={OnboardingGoals} />
      <Stack.Screen name="OnboardingStats" component={OnboardingStats} />
    </Stack.Navigator>
  );
}
