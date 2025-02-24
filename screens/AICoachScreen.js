// screens/AiCoachScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '../useTranslation'; // import the translation hook

export default function AiCoachScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('aiCoachTitle')}</Text>
      <Text>{t('aiCoachUnderConstruction')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:16 },
  title: { fontSize:20, fontWeight:'bold', marginBottom:8 }
});
