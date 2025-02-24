// components/WeightProgressBar.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '../useTranslation';

export default function WeightProgressBar({ currentWeight=80, goalWeight=70 }) {
  const { t } = useTranslation();

  // If user wants to lose from 80 to 70, total = 10, donePercent depends on how far from 70 you are
  // This is a naive example
  const diff = Math.abs(currentWeight - goalWeight);
  const total = diff || 1; // avoid divide by zero
  const progress = currentWeight > goalWeight
    ? (goalWeight / currentWeight)
    : (currentWeight / goalWeight);
  const donePercent = Math.min(100, Math.round(progress * 100));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('weightProgress')}</Text>
      <View style={styles.bar}>
        <View style={[styles.filled, { width: `${donePercent}%` }]} />
      </View>

      {/* e.g. "80 kg / Goal 70 kg" might be replaced with a localized string:
          "80 kg / Meta 70 kg" in Spanish, or using {t('currentWeightGoal')}.replace(...) */}
      <Text>
        {
          t('currentWeightGoal')
            .replace('{current}', currentWeight)
            .replace('{goal}', goalWeight)
        }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontWeight:'bold', marginBottom:4 },
  bar: {
    height:10,
    backgroundColor:'#ccc',
    borderRadius:5,
    overflow:'hidden'
  },
  filled: {
    height:10,
    backgroundColor:'#007AFF'
  }
});
