// screens/HomeScreen.js

import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Alert, ScrollView, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';
import { useFocusEffect } from '@react-navigation/native';
import CaloriesSummary from '../components/CaloriesSummary';
import MacrosSection from '../components/MacrosSection';
import MealsList from '../components/MealsList';
import CalendarStrip from '../components/CalendarStrip';
import { useTranslation } from '../useTranslation';
import { Colors, Typography, Spacing } from '../styles/design';

export default function HomeScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todayCalories, setTodayCalories] = useState(0);
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fats: 0 });
  const [recentMeals, setRecentMeals] = useState([]);

  const { t } = useTranslation();

  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date);
    fetchData(date);
  }, []);

  const fetchData = async (dateArg) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('AuthLanding');
        return;
      }

      // Format date
      const y = dateArg.getFullYear();
      const m = String(dateArg.getMonth() + 1).padStart(2, '0');
      const d = String(dateArg.getDate()).padStart(2, '0');
      const dateParam = `${y}-${m}-${d}`;

      // 1) stats
      const statsRes = await fetch(`${API_URL}/intakes/stats?date=${dateParam}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes.status === 401) {
        await AsyncStorage.removeItem('token');
        navigation.replace('AuthLanding');
        return;
      }
      const statsJson = await statsRes.json();
      if (!statsRes.ok) {
        throw new Error(statsJson.error || t('homeDataError'));
      }
      setTodayCalories(statsJson.totalCalories || 0);

      // 2) meals
      const mealsRes = await fetch(`${API_URL}/intakes?date=${dateParam}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (mealsRes.status === 401) {
        await AsyncStorage.removeItem('token');
        navigation.replace('AuthLanding');
        return;
      }
      const mealsJson = await mealsRes.json();
      if (!mealsRes.ok) {
        throw new Error(mealsJson.error || t('errorLoadingIntakes'));
      }
      let totalProtein = 0, totalCarbs = 0, totalFats = 0;
      mealsJson.forEach((item) => {
        if (item.macros) {
          totalProtein += (item.macros.protein || 0);
          totalCarbs   += (item.macros.carbs   || 0);
          totalFats    += (item.macros.fats    || 0);
        }
      });
      setMacros({ protein: totalProtein, carbs: totalCarbs, fats: totalFats });
      setRecentMeals(mealsJson);

    } catch (err) {
      Alert.alert(t('homeDataError'), err.message);
    }
  };

  
  // If you still want an initial fetch on mount

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData(selectedDate);
    });
    return unsubscribe;
  }, [navigation, selectedDate]);
  

  return (
    <View style={styles.container}>
      <CalendarStrip onDateSelect={handleDateSelect} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>
            {t('caloriesLabel')} {t('summary') || 'Summary'}
          </Text>
          <CaloriesSummary totalCalories={todayCalories} />
        
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>
            {t('macrosLabel') || 'Macros'}
          </Text>
          <MacrosSection
            protein={macros.protein}
            carbs={macros.carbs}
            fats={macros.fats}
          />
        </View>

        <View style={styles.mealsContainer}>
          <Text style={styles.cardTitle}>
            {t('recentMeals') || 'Recent Meals'}
          </Text>
          <MealsList meals={recentMeals} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: Spacing.l },
  summaryCard: {
    marginHorizontal: Spacing.m,
    marginTop: Spacing.m,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.m,
    shadowColor: '#000',
    shadowOffset: { width:0, height:2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  cardTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.s,
  },
  mealsContainer: {
    marginHorizontal: Spacing.m,
    marginTop: Spacing.m,
  },
});
