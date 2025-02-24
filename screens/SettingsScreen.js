// screens/SettingsScreen.js
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../AppContext'; // context
import { useTranslation } from '../useTranslation';

export default function SettingsScreen({ navigation }) {
  const { language, setLanguage } = useContext(AppContext);
  const { t } = useTranslation();

  // The rest of your timezone, goal, weight, etc. logic
  const [timezone, setTimezone] = useState('');
  const [goal, setGoal] = useState('lose');
  const [weight, setWeight] = useState('70');
  const [activity, setActivity] = useState('sedentary');

  useEffect(() => {
    // load or do what you had before
    // note: language is no longer from local state; it’s from context
    // so we don't do setLanguage from local. 
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // time zone
      const storedTZ = await AsyncStorage.getItem('userTimeZone');
      if (storedTZ) {
        setTimezone(storedTZ);
      } else {
        // auto detect
        let detectedTZ = 'UTC';
        try {
          const resolved = Intl.DateTimeFormat().resolvedOptions();
          if (resolved?.timeZone) {
            detectedTZ = resolved.timeZone;
          }
        } catch (err) {
          console.log("Auto-detect TZ error", err);
        }
        setTimezone(detectedTZ);
      }
      // userProfile
      const storedProfile = await AsyncStorage.getItem('userProfile');
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        if (parsed.goal) setGoal(parsed.goal);
        if (parsed.weight) setWeight(String(parsed.weight));
        if (parsed.activity) setActivity(parsed.activity);
      }
    } catch (err) {
      console.log("Error loading settings:", err);
    }
  };

  const handleSave = async () => {
    try {
      // Save timezone
      await AsyncStorage.setItem('userTimeZone', timezone);

      // Save userProfile
      const newProfile = { goal, weight, activity };
      await AsyncStorage.setItem('userProfile', JSON.stringify(newProfile));

      Alert.alert("Saved", "Settings updated successfully.");
    } catch (err) {
      Alert.alert("Error", "Failed to save settings");
    }
  };
  
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      Alert.alert(t('loggedOut'), t('youHaveLoggedOut'));
  
      navigation.replace('AuthLanding');

    } catch (err) {
      Alert.alert(t('errorTitle'), err.message);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('settingsTitle')}</Text>

      {/* TIME ZONE */}
      <Text style={styles.label}>{t('timeZoneLabel')}</Text>
      <TextInput
        style={styles.input}
        value={timezone}
        onChangeText={setTimezone}
        autoCapitalize="none"
      />

      {/* GOAL */}
      <Text style={styles.label}>{t('goalLabel')}</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={goal}
          style={styles.picker}
          onValueChange={(itemValue) => setGoal(itemValue)}
        >
          <Picker.Item label={t('loseWeight')} value="lose" />
          <Picker.Item label={t('maintainWeight')} value="maintain" />
          <Picker.Item label={t('gainWeight')} value="gain" />
        </Picker>
      </View>

      {/* WEIGHT */}
      <Text style={styles.label}>{t('weightLabel')}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(weight)}
        onChangeText={setWeight}
      />

      {/* ACTIVITY */}
      <Text style={styles.label}>{t('activityLabel')}</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={activity}
          style={styles.picker}
          onValueChange={(val) => setActivity(val)}
        >
          <Picker.Item label={t('sedentary')} value="sedentary" />
          <Picker.Item label={t('moderate')} value="moderate" />
          <Picker.Item label={t('athlete')} value="athlete" />
        </Picker>
      </View>

      {/* LANGUAGE */}
      <Text style={styles.label}>{t('languageLabel')}</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={language}  // from context
          style={styles.picker}
          onValueChange={(val) => setLanguage(val)} // call context
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Spanish" value="es" />
          <Picker.Item label="French" value="fr" />
        </Picker>
      </View>

      {/* SAVE BUTTON */}
      <Button title={t('saveSettings')} onPress={handleSave} />
      <Button title={t('logoutButton')} onPress={handleLogout} />
      <Button
        title={t('forgotPasswordButton') || 'Forgot Password'}
        onPress={() => navigation.navigate('ForgotPassword')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor:'#fff' },
  header: { fontSize:20, fontWeight:'bold', marginBottom:16 },
  label: { fontSize:16, marginTop:16, marginBottom:8 },
  input: {
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:6,
    padding:8
  },
  pickerWrapper: {
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:6
  },
  picker: {
    height: 44
  }
});
