// screens/AuthLandingScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../useTranslation';
import { API_URL } from '../config';

export default function AuthLandingScreen({ navigation }) {
  const [checkingToken, setCheckingToken] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setCheckingToken(false);
          return;
        }
        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          navigation.replace('MainTabs');
          return;
        } else {
          await AsyncStorage.removeItem('token');
          setCheckingToken(false);
        }
      } catch (err) {
        await AsyncStorage.removeItem('token');
        setCheckingToken(false);
      }
    };
    checkToken();
  }, [navigation]);

  if (checkingToken) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
        <Text>{t('checkingLoginStatus')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('welcomeAppTitle')}</Text>
      <Text style={styles.subtitle}>{t('pleaseLoginOrRegister')}</Text>

      <Button
        title="Login"
        onPress={() => navigation.navigate('Login')}
      />
      <View style={{ marginVertical: 10 }} />
      <Button
        title="Register"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding:16
  },
  title: {
    fontSize:22,
    fontWeight:'bold',
    marginBottom:10
  },
  subtitle: {
    fontSize:16,
    marginBottom:20
  }
});
