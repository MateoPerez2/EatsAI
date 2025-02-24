import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../useTranslation';
import { API_URL } from '../config';

export default function ManualIntakeScreen({ navigation }) {
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fats, setFats] = useState('');

  const { t } = useTranslation();

  const handleSave = async () => {
    if (!calories || !carbs || !protein || !fats) {
      return Alert.alert(t('errorTitle'), t('macrosError'));
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return Alert.alert(t('notLoggedIn'), t('pleaseLoginFirst'));
      }

      const userTZ = await AsyncStorage.getItem('userTimeZone');
      const now = new Date();
      const localTimeString = now.toISOString();

      const body = {
        meal: mealName || t('untitledMeal') || "Untitled Meal",
        calories: parseInt(calories),
        macros: {
          carbs: parseInt(carbs),
          protein: parseInt(protein),
          fats: parseInt(fats)
        },
        clientTimestamp: localTimeString,
        userTZ
      };

      const response = await fetch(`${API_URL}/intakes`, {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t('failedSaveIntake'));
      }

      Alert.alert(t('saved'), t('mealSaved'));
      navigation.goBack();
    } catch (err) {
      Alert.alert(t('saveError') || t('errorTitle'), err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('manualHeader')}</Text>
      <Text>{t('mealNameOptional')}</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. My Breakfast"
        value={mealName}
        onChangeText={setMealName}
      />
      <Text>{t('caloriesLabel')}:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={calories}
        onChangeText={setCalories}
      />
      <Text>{t('carbsLabel')}:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={carbs}
        onChangeText={setCarbs}
      />
      <Text>{t('proteinLabel')}:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={protein}
        onChangeText={setProtein}
      />
      <Text>{t('fatsLabel')}:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={fats}
        onChangeText={setFats}
      />

      <Button title={t('saveMealButton') || "Save Meal"} onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor:'#fff' },
  header: { fontSize:20, fontWeight:'bold', marginBottom:12, textAlign:'center' },
  input: {
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:6,
    paddingHorizontal:8,
    marginBottom:8
  }
});
