// screens/onboarding/OnboardingStats.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// If you store language in a context, you can import it. 
// e.g. import { AppContext } from '../../AppContext';

export default function OnboardingStats({ route, navigation }) {
  const { goal } = route.params || {};
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('sedentary');

  // If you have a global language from context, you might do:
  // const { language } = useContext(AppContext);

  const handleFinish = async () => {
    // 1) Save user preferences to AsyncStorage
    const userProfile = {
      goal,
      weight,
      activity,
      // language, // if using context for language, you could store it here
    };
    await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));

    // 2) Mark onboarding as done
    await AsyncStorage.setItem('hasOnboarded', 'true');

    // 3) Reset navigation so RootNavigation re-checks 
    //    (since user is not yet logged in, it will show AuthStack).
    navigation.reset({
      index: 0,
      routes: [{ name: 'RootNavigation' }], 
      // or if your root file is "OnboardingFlow" in the root, 
      // but commonly we do:
      // routes: [{ name: 'AuthStack' }],
      // Depending on your RootNavigator route names. 
      // If you DO have a route named 'RootNavigation', use that. 
      // Otherwise "AuthStack" is enough to push the user to the login flow.
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Stats</Text>
      <Text>Goal: {goal}</Text>

      <TextInput
        style={styles.input}
        placeholder="Current weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      {/* Activity level placeholder */}
      <Button title="Sedentary" onPress={() => setActivity('sedentary')} />
      <Button title="Moderate" onPress={() => setActivity('moderate')} />
      <Button title="Athlete" onPress={() => setActivity('athlete')} />

      <View style={{ marginTop: 20 }}>
        <Button title="Finish Onboarding" onPress={handleFinish} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    width: '80%',
    padding: 8,
    marginBottom: 12
  }
});
