// screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../useTranslation';
import { API_URL } from '../config';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { t } = useTranslation();

  const register = async () => {
    if (!email || !password) {
      return Alert.alert(t('errorTitle'), t('registerFillFields'));
    }

    try {
      // Updated to /auth/register
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('registrationFailed'));
      }

      // Store token
      await AsyncStorage.setItem('token', data.accessToken);

      Alert.alert(t('registrationSuccessful'), t('welcomeUser').replace('{email}', data.user.email));

      // Go to the main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }]
      });
    } catch (err) {
      Alert.alert(t('registerError') || t('errorTitle'), err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('registerHeader')}</Text>

      <TextInput
        style={styles.input}
        placeholder={t('nameOptional')}
        onChangeText={setName}
        value={name}
      />
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

      <Button title={t('registerButton')} onPress={register} />

      <Text
        style={styles.link}
        onPress={() => navigation.navigate('Login')}
      >
        {t('registerLinkToLogin')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding:16,
    backgroundColor:'#fff',
    justifyContent:'center'
  },
  header: {
    fontSize:24,
    fontWeight:'bold',
    marginBottom:16,
    textAlign:'center'
  },
  input: {
    borderWidth:1,
    borderColor:'#ccc',
    marginBottom:12,
    borderRadius:6,
    paddingHorizontal:10,
    paddingVertical:8
  },
  link: {
    marginTop:16,
    color:'blue',
    textAlign:'center'
  }
});
