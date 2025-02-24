// components/BottomNavBar.js
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from '../useTranslation';
import { Colors, Typography, Spacing } from '../styles/design';

export default function BottomNavBar({
  onHomePress,
  onAnalyzePress,
  onManualPress,
  onCoachPress,
  onAnalyticsPress,
}) {
  const { t } = useTranslation();
  // if you want to track which tab is active:
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = [
    { label: t('home') || 'Home', icon: 'home-outline', onPress: onHomePress },
    { label: t('analyzeAI') || 'AI', icon: 'camera-outline', onPress: onAnalyzePress },
    { label: t('manual') || 'Manual', icon: 'create-outline', onPress: onManualPress },
    { label: t('coach') || 'Coach', icon: 'chatbubbles-outline', onPress: onCoachPress },
    { label: t('stats') || 'Stats', icon: 'stats-chart-outline', onPress: onAnalyticsPress },
  ];

  const handlePress = (item, index) => {
    setActiveIndex(index);
    item.onPress && item.onPress();
  };

  return (
    <View style={styles.container}>
      {navItems.map((item, index) => {
        const isActive = activeIndex === index;
        // If you want different icons or icon colors when active, do so here
        return (
          <TouchableOpacity
            key={index}
            style={styles.navButton}
            onPress={() => handlePress(item, index)}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={item.icon} 
              size={22} 
              color={isActive ? Colors.accent : Colors.white} 
            />
            <Text
              style={[
                styles.navLabel,
                { color: isActive ? Colors.accent : Colors.white },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: Colors.primary, // dark navy
    justifyContent: 'space-around',
    alignItems: 'center',
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    // zIndex: 999,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    ...Typography.small,
    marginTop: 2,
  },
});
