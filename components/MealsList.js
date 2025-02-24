// components/MealsList.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTranslation } from '../useTranslation';
import { Colors, Spacing, Typography } from '../styles/design';

export default function MealsList({ meals = [] }) {
  const { t } = useTranslation();

  if (!meals.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('noMealsYet')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {meals.map((meal, index) => {
        // Example: If each meal has an `image` prop, or fallback to a placeholder
        const mealImage = meal.image || 'https://via.placeholder.com/60'; 

        return (
          <View key={index} style={styles.card}>
            {/* Image on the left */}
            <Image 
              source={{ uri: mealImage }} 
              style={styles.mealImage} 
              resizeMode="cover"
            />

            {/* Text on the right */}
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>
                {meal.meal || t('untitledMeal')}
              </Text>
              {/* Show Calories & Macros */}
              <Text style={styles.mealCals}>
                {meal.calories} {t('caloriesLabel') || 'cals'}
              </Text>

              {meal.macros && (
                <View style={styles.macrosRow}>
                  <Text style={styles.macroText}>
                    P: {meal.macros.protein}g
                  </Text>
                  <Text style={styles.macroText}>
                    C: {meal.macros.carbs}g
                  </Text>
                  <Text style={styles.macroText}>
                    F: {meal.macros.fats}g
                  </Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    padding: Spacing.m,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  container: {
    // padding:16 was inside, let's unify with design
    padding: Spacing.m,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 8,
    elevation: 2,
    marginBottom: Spacing.s,
    padding: Spacing.s,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    // border if you want
    // borderWidth: 1,
    // borderColor: Colors.border,
  },
  mealImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: Spacing.s,
  },
  mealInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  mealName: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  mealCals: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  macroText: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginRight: Spacing.m,
  },
});
