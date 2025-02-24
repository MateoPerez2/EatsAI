// screens/onboarding/OnboardingWelcome.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function OnboardingWelcome({ navigation }) {

  const handleNext = () => {
    navigation.navigate('OnboardingGoals');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to NutriBlendAI</Text>
      <Text style={styles.subtitle}>
        We’ll guide you through a few questions to tailor your experience!
      </Text>
      <Button title="Get Started" onPress={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:16 },
  title: { fontSize:22, fontWeight:'bold', marginBottom:10 },
  subtitle: { fontSize:16, textAlign:'center', marginBottom:20 }
});
