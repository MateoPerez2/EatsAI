// components/DailyStreak.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '../useTranslation';

export default function DailyStreak({ streak = 0 }) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* "Logging Streak: X days" becomes something like:
          "Racha de Registro: X días" in Spanish */}
      <Text style={styles.streakText}>
        {t('loggingStreak')}: {streak} {t('days')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  streakText: { fontSize: 16, fontWeight: 'bold' }
});
