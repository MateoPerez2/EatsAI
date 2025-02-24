// screens/AnalyticsScreen.js
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../useTranslation';
import { API_URL } from '../config';

// Import chart components
import DailyCaloriesChart from '../components/charts/DailyCaloriesChart';
import Past30DaysChart from '../components/charts/Past30DaysChart';
import MonthlyMacrosChart from '../components/charts/MonthlyMacrosChart';
import WeightHistoryChart from '../components/charts/WeightHistoryChart';

// optional design system references
import { Colors, Typography, Spacing } from '../styles/design';

export default function AnalyticsScreen({ navigation }) {
  const { t } = useTranslation();

  // Loading & data states
  const [loading, setLoading] = useState(true);

  // daily-calories -> array of { date, calories }
  const [dailyCaloriesData, setDailyCaloriesData] = useState([]);

  // past-30-days -> array of { date, totalCalories, totalCarbs, totalProtein, totalFats }
  const [past30Macros, setPast30Macros] = useState([]);

  // monthly macros -> array of { month, totalCalories, totalCarbs, totalProtein, totalFats }
  const [monthlyMacros, setMonthlyMacros] = useState([]);

  // weight history -> array of { date, weight }
  const [weightHistory, setWeightHistory] = useState([]);

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  // Fetch all analytics data in parallel (or sequentially)
  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('AuthLanding');
        return;
      }

      // 1) daily calories
      let res = await fetch(`${API_URL}/analytics/daily-calories`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) {
        await AsyncStorage.removeItem('token');
        navigation.replace('AuthLanding');
        return;
      }
      let json = await res.json();
      setDailyCaloriesData(json || []);

      // 2) past 30 days macros
      res = await fetch(`${API_URL}/analytics/past-30-days-macros`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      json = await res.json();
      setPast30Macros(json || []);

      // 3) monthly macros
      const currentYear = new Date().getFullYear();
      res = await fetch(`${API_URL}/analytics/monthly-macros?year=${currentYear}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      json = await res.json();
      setMonthlyMacros(json || []);

      // 4) weight history (last 30 days)
      res = await fetch(`${API_URL}/analytics/weight-history?days=30`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      json = await res.json();
      setWeightHistory(json || []);

    } catch (err) {
      console.error("Analytics Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary || '#000'} />
        <Text style={styles.loadingText}>{t('analyticsLoading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {t('analyticsTitle') || 'Analytics'}
      </Text>

      {/* 1) Daily Calories */}
      <Text style={styles.sectionTitle}>Daily Calories</Text>
      {dailyCaloriesData.length > 0 ? (
        <DailyCaloriesChart data={dailyCaloriesData} />
      ) : (
        <Text style={styles.noDataText}>No daily data available.</Text>
      )}

      {/* 2) Past 30 Days Macros */}
      <Text style={styles.sectionTitle}>Past 30 Days Macros</Text>
      {past30Macros.length > 0 ? (
        <Past30DaysChart data={past30Macros} />
      ) : (
        <Text style={styles.noDataText}>No macros data for the last 30 days.</Text>
      )}

      {/* 3) Monthly Macros */}
      <Text style={styles.sectionTitle}>Monthly Macros</Text>
      {monthlyMacros.length > 0 ? (
        <MonthlyMacrosChart data={monthlyMacros} type="totalCalories" />
      ) : (
        <Text style={styles.noDataText}>No monthly data available.</Text>
      )}

      {/* 4) Weight History */}
      <Text style={styles.sectionTitle}>Weight History</Text>
      {weightHistory.length > 0 ? (
        <WeightHistoryChart data={weightHistory} />
      ) : (
        <Text style={styles.noDataText}>No weight logs.</Text>
      )}

      {/* Add more sections or expansions as needed */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  loadingText: {
    marginTop: Spacing.m,
    ...Typography.body,
    color: Colors.textPrimary
  },
  container: {
    padding: Spacing.m,
    backgroundColor: Colors.background,
    alignItems: 'center'
  },
  title: {
    ...Typography.h1,
    marginBottom: Spacing.l,
    color: Colors.textPrimary
  },
  sectionTitle: {
    ...Typography.h2,
    alignSelf: 'flex-start',
    marginTop: Spacing.m,
    color: Colors.textPrimary
  },
  noDataText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.s
  }
});
