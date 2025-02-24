// components/MacrosSection.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from '../useTranslation';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function MacroDonut({ label, value = 0, goal = 100, icon, iconSize = 24 }) {
  const radius = 30;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;

  const { t } = useTranslation();

  // For the animated progress
  const progress = Math.min(value / goal, 1);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, circumference * (1 - progress)],
  });

  useEffect(() => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [value]);

  return (
    <View style={styles.donutContainer}>
      {/* Icon & Donut */}
      <View style={styles.donutContainer}>
        <View style={styles.iconContainer}>
          {icon && <Ionicons name={icon} size={iconSize} color="#000" />}
        </View>
        <Svg width={80} height={80}>
          <G rotation="-90" origin="40,40">
            {/* The background circle */}
            <Circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#ccc"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* The animated foreground circle */}
            <AnimatedCircle
              cx="40"
              cy="40"
              r={radius}
              stroke="#000"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>
      </View>

      <Text style={styles.donutLabel}>{label}</Text>
      <Text style={styles.donutValue}>{value}g</Text>
    </View>
  );
}

export default function MacrosSectionDonutsBW({ 
  protein = 0, carbs = 0, fats = 0, 
  proteinGoal = 150, carbsGoal = 250, fatsGoal = 70 
}) {
  const { t } = useTranslation();

  // We'll pass in localized labels:
  return (
    <View style={styles.container}>
      <MacroDonut
        label={t('proteinLabel')}
        value={protein}
        goal={proteinGoal}
        icon="barbell-outline"
      />
      <MacroDonut
        label={t('carbsLabel')}
        value={carbs}
        goal={carbsGoal}
        icon="fast-food-outline"
      />
      <MacroDonut
        label={t('fatsLabel')}
        value={fats}
        goal={fatsGoal}
        icon="water-outline"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    justifyContent:'space-around',
    marginVertical:0,
    paddingHorizontal:16,
  },
  donutContainer: {
    alignItems:'center',
    justifyContent:'center',
  },
  iconContainer: {
    position:'absolute',
    zIndex:1,
    backgroundColor:'#fff',
    paddingHorizontal:4,
    borderRadius:20,
  },
  donutLabel: {
    marginTop:8,
    fontSize:14,
    fontWeight:'600',
    color:'#000',
  },
  donutValue: {
    fontSize:16,
    fontWeight:'bold',
    color:'#000',
  },
});
