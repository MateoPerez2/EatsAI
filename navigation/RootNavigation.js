// RootNavigation.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

// Flows / Stacks
import OnboardingStack from './OnboardingStack';
import AuthStack from '../screens/AuthStack';
import MainTabs from './MainTabs'; // The tab navigator
import AuthLandingScreen from '../screens/AuthLandingScreen'; 
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
// ^ Some screen for your “AuthLanding”

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  const [hasOnboarded, setHasOnboarded] = useState(null);
  const [checkingToken, setCheckingToken] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      // 1) Check if user completed onboarding
      const onboardVal = await AsyncStorage.getItem('hasOnboarded');
      setHasOnboarded(onboardVal === 'true');

      // 2) Check if user is logged in (has valid token)
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
        setCheckingToken(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          await AsyncStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.warn('Token check error:', err.message);
        setIsLoggedIn(false);
      }
      setCheckingToken(false);
    })();
  }, []);

  if (checkingToken || hasOnboarded === null) {
    // Show a loading or splash screen
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* If user hasn't onboarded, show OnboardingFlow */}
        {!hasOnboarded ? (
          <Stack.Screen name="OnboardingFlow" component={OnboardingStack} />
        ) : (
          // If user finished onboarding, check login status
          !isLoggedIn ? (
            <Stack.Screen name="AuthStack" component={AuthStack} />
          ) : (
            <Stack.Screen name="MainTabs" component={MainTabs} />
          )
        )}

        {/* 
          Make sure AuthLanding is defined here 
          so you can do navigation.replace('AuthLanding') from anywhere 
        */}
        <Stack.Screen name="AuthLanding" component={AuthLandingScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
