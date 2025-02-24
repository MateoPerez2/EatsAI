// navigation/HomeStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Colors } from '../styles/design';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, TouchableOpacity } from 'react-native';
import DebugTestScreen from '../screens/DebugTestScreen';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Ai Eats',
          headerStyle: { backgroundColor: Colors.primary },
          headerTitleStyle: { color: Colors.white },
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight:10, zIndex: 9999 }}>
              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPressIn={() => {
                  console.log('Settings icon tapped');
                  navigation.navigate('Settings');
                }}
              >
                <Ionicons name="settings-outline" size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: 'Settings',
          headerStyle: { backgroundColor: Colors.primary },
          headerTitleStyle: { color: Colors.white },
        }}
      />
    
    </Stack.Navigator>
  );
}
// A separate small component for clarity:
function HeaderDebugIcon() {
    return (
      <View style={{ marginRight: 10, backgroundColor: 'red' }}>
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => {
            console.log('DEBUG ICON TAPPED');
          }}
        >
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }
