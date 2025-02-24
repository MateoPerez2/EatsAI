// screens/onboarding/OnboardingGoals.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function OnboardingGoals({ navigation }) {
  const [goal, setGoal] = useState('lose'); // or 'maintain', 'gain'

  const handleNext = () => {
    // pass 'goal' to next screen
    navigation.navigate('OnboardingStats', { goal });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What’s Your Goal?</Text>
      {/* simple placeholders */}
      <Button title="Lose Weight" onPress={() => setGoal('lose')} />
      <Button title="Maintain Weight" onPress={() => setGoal('maintain')} />
      <Button title="Gain Weight" onPress={() => setGoal('gain')} />

      <View style={{ marginTop:20 }}>
        <Button title="Next" onPress={handleNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:16 },
  title: { fontSize:22, fontWeight:'bold', marginBottom:10 }
});
