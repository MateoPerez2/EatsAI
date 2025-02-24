// screens/ResetPasswordScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { API_URL } from '../config';
import { useTranslation } from '../useTranslation';
import { Colors, Typography, Spacing } from '../styles/design';

export default function ResetPasswordScreen({ route, navigation }) {
  const { t } = useTranslation();
  const [tokenInput, setTokenInput] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (route.params?.resetToken) {
      setTokenInput(route.params.resetToken);
    }
  }, [route.params]);

  const handleResetPassword = async () => {
    if (!tokenInput || !newPassword) {
      return Alert.alert(t('errorTitle'), t('tokenAndPasswordRequired') || 'Token and new password are required.');
    }
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenInput, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Password reset failed.');
      }
      Alert.alert(t('passwordResetSuccess') || 'Password updated successfully');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert(t('errorTitle'), error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('resetPassword') || 'Reset Password'}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('enterResetToken') || 'Enter reset token'}
        value={tokenInput}
        onChangeText={setTokenInput}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder={t('enterNewPassword') || 'Enter new password'}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Button title={t('resetPasswordButton') || 'Reset Password'} onPress={handleResetPassword} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.m,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  header: {
    ...Typography.h1,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    padding: Spacing.s,
    marginBottom: Spacing.m,
  },
});
