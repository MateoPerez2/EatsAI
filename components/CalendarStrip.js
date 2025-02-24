// components/CalendarStrip.js
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useTranslation } from '../useTranslation';
import { Colors, Typography, Spacing } from '../styles/design';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 50;

function PulseCircle({ isActive }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.setValue(1);
      pulseAnim.stopAnimation();
    }
  }, [isActive, pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.pulseCircle,
        { transform: [{ scale: pulseAnim }] },
      ]}
    />
  );
}

export default function CalendarStrip({ onDateSelect }) {
  const today = new Date();
  const totalDays = 17; // 10 before, 10 after
  const centerIndex = 15;
  const days = Array.from({ length: totalDays }, (_, i) => {
    const offset = i - centerIndex;
    const d = new Date();
    d.setDate(today.getDate() + offset);
    return d;
  });

  const [selectedDate, setSelectedDate] = useState(today.toDateString());

  const scaleValues = useRef(days.map(() => new Animated.Value(1))).current;
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      const initialOffset =
        centerIndex * ITEM_WIDTH - (width / 2 - ITEM_WIDTH / 2);
      scrollViewRef.current.scrollTo({ x: initialOffset, animated: true });
    }
  }, []);

  const handleSelect = (date, index) => {
    setSelectedDate(date.toDateString());
    scaleValues.forEach((val, i) => {
      Animated.timing(val, {
        toValue: i === index ? 1.3 : 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContainer}
      >
        {days.map((date, index) => {
          const isToday = date.toDateString() === today.toDateString();
          const isSelected = date.toDateString() === selectedDate;
          const weekdayInitial = date
            .toLocaleDateString('en-US', { weekday: 'short' })
            .charAt(0);

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelect(date, index)}
            >
              <Animated.View
                style={[
                  styles.dayItem,
                  { transform: [{ scale: scaleValues[index] }] },
                ]}
              >
                <Text style={styles.weekdayTitle}>{weekdayInitial}</Text>
                <View style={styles.circleWrapper}>
                  {isSelected && <PulseCircle isActive={isSelected} />}
                  <View
                    style={[
                      styles.dayCircle,
                      isToday && styles.todayBorder,
                      isSelected && styles.selectedCircle,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNumber,
                        isSelected && styles.selectedText,
                      ]}
                    >
                      {date.getDate()}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    marginVertical: 0,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.s,
  },
  dayItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  weekdayTitle: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  circleWrapper: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 30,
    height: 30,
    borderRadius: 18,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    zIndex: 2,
  },
  todayBorder: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  selectedCircle: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayNumber: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  selectedText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  pulseCircle: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    opacity: 0.15,
    zIndex: 1,
  },
});
