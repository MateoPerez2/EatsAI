// navigation/MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from '../useTranslation';

// Stacks / Screens
import HomeStack from './HomeStack'; // This is the new stack
import AnalyzeScreen from '../screens/AnalyzeScreen';
import ManualIntakeScreen from '../screens/ManualIntakeScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';

// Design
import { Colors, Typography, Spacing } from '../styles/design';

const Tab = createBottomTabNavigator();

// Custom tab bar
function CustomTabBar({ state, descriptors, navigation }) {
  const { t } = useTranslation();

  return (
    <View style={styles.barContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { key, name } = route;
        let labelKey;
        switch (name) {
          case 'HomeStack':
            labelKey = 'home';
            break;
          case 'Analyze':
            labelKey = 'analyzeAI';
            break;
          case 'ManualIntake':
            labelKey = 'manual';
            break;
          case 'Analytics':
            labelKey = 'stats';
            break;
          default:
            labelKey = 'home';
        }
        const label = t(labelKey);

        let iconName;
        switch (name) {
          case 'HomeStack':
            iconName = 'home-outline';
            break;
          case 'Analyze':
            iconName = 'camera-outline';
            break;
          case 'ManualIntake':
            iconName = 'create-outline';
            break;
          case 'Analytics':
            iconName = 'stats-chart-outline';
            break;
          default:
            iconName = 'ellipse-outline';
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: key,
            canPreventDefault: true,
          });
          if (!event.defaultPrevented) {
            navigation.navigate(name);
          }
        };

        const iconColor = isFocused ? Colors.accent : Colors.white;
        const textColor = isFocused ? Colors.accent : Colors.white;

        return (
          <TouchableOpacity
            key={key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.85}
          >
            <Ionicons name={iconName} size={22} color={iconColor} />
            <Text style={[styles.tabLabel, { color: textColor }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      {/* The "HomeStack" is now the route for the "Home" tab */}
      <Tab.Screen 
        name="HomeStack" 
        component={HomeStack} 
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen name="Analyze" component={AnalyzeScreen} />
      <Tab.Screen name="ManualIntake" component={ManualIntakeScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: Colors.primary,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    ...Typography.small,
    marginTop: Spacing.xs,
  },
});
