// components/AnimatedCircularCaloriesSummary.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useTranslation } from '../useTranslation';
import { Colors, Typography, Spacing } from '../styles/design';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function AnimatedCircularCaloriesSummary({
  totalCalories = 0,
  goalCalories = 2000,
}) {
  const consumedCalories = totalCalories;
  const radius = 60;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(consumedCalories / goalCalories, 1);

  // Animated value for the gauge
  const animatedValue = useRef(new Animated.Value(0)).current;
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, circumference * (1 - progress)],
  });

  const { t } = useTranslation();

  useEffect(() => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [consumedCalories]);

  return (
    <View style={styles.container}>
      <Svg width={160} height={160}>
        <G rotation="-90" origin="80,80">
          {/* Gray background circle */}
          <Circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#e6e6e6"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Animated progress circle */}
          <AnimatedCircle
            cx="80"
            cy="80"
            r={radius}
            stroke={Colors.primary} // use dark navy
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>

      <View style={styles.textContainer}>
        <Text style={styles.caloriesText}>{consumedCalories}</Text>
        <Text style={styles.labelText}>{t('caloriesLabel')}</Text>
        <Text style={styles.goalText}>
          {t('goalLabel') || 'Goal'}: {goalCalories}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: Spacing.m,
  },
  textContainer: {
    position: 'absolute',
    top: '30%',
    alignItems: 'center',
  },
  caloriesText: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  labelText: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  goalText: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
