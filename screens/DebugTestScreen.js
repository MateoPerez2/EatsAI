// screens/DebugTestScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function DebugTestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>This is a minimal debug screen. Tap the gear icon at the top-right!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#fff',
  },
  infoText: {
    fontSize:16,
    textAlign:'center',
    marginHorizontal:20,
  },
});
