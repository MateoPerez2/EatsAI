// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../useTranslation';
import { API_URL } from '../config';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();

  const login = async () => {
    if (!email || !password) {
      return Alert.alert(t('errorTitle'), t('loginFillFields'));
    }

    try {
      // Updated to /auth/login
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('loginFailed'));
      }

      // Save token
      await AsyncStorage.setItem('token', data.accessToken);

      Alert.alert(t('loginSuccessful'), t('welcomeUser').replace('{email}', data.user.email));

      // Force root navigation to show "MainTabs" route
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }]
      });
    } catch (err) {
      Alert.alert(t('loginError') || t('errorTitle'), err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('loginHeader')}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder={t('passwordPlaceholder') || "Password"}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <Button title={t('loginButton')} onPress={login} />

      <Text
        style={styles.link}
        onPress={() => navigation.navigate('Register')}
      >
        {t('loginLinkToRegister')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  link: {
    marginTop: 16,
    color: 'blue',
    textAlign: 'center'
  }
});
