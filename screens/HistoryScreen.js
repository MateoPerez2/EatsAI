// screens/HistoryScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WeightProgressBar from '../components/WeightProgressBar';
import DailyStreak from '../components/DailyStreak';
import { useTranslation } from '../useTranslation';
import { API_URL } from '../config';

export default function HistoryScreen({ navigation }) {
  const [intakes, setIntakes] = useState([]);
  const { t } = useTranslation();

  const loadHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return Alert.alert(t('notLoggedIn'), t('pleaseLoginFirst'));
      }

      const response = await fetch(`${API_URL}/intakes`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t('errorLoadingIntakes'));
      }

      setIntakes(data);
    } catch (err) {
      Alert.alert(t('historyError') || t('errorTitle'), err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadHistory);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.mealName}>{item.meal}</Text>
      <Text style={styles.calories}>{t('caloriesLabel')}: {item.calories}</Text>
      <Text>
        {t('carbsLabel')}: {item.macros?.carbs}, 
        {t('proteinLabel')}: {item.macros?.protein}, 
        {t('fatsLabel')}: {item.macros?.fats}
      </Text>
      {/* Some placeholders for weight or streak */}
      <WeightProgressBar currentWeight={80} goalWeight={70} />
      <DailyStreak streak={3} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('yourMealHistory')}</Text>
      <FlatList
        data={intakes}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>{t('noMealsLoggedYet')}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor:'#fff' },
  title: { fontSize:20, fontWeight:'bold', marginBottom:10, textAlign:'center' },
  itemContainer: {
    borderWidth:1,
    borderColor:'#ddd',
    padding:12,
    borderRadius:8,
    marginBottom:10,
    backgroundColor:'#f9f9f9'
  },
  mealName: { fontWeight:'bold', marginBottom:4 },
  calories: { color:'green', marginBottom:4 }
});
