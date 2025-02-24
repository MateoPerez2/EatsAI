// screens/ForgotPasswordScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { API_URL } from '../config';
import { useTranslation } from '../useTranslation';
import { Colors, Typography, Spacing } from '../styles/design';

export default function ForgotPasswordScreen({ navigation }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleRequestReset = async () => {
    if (!email) {
      return Alert.alert(t('errorTitle'), t('emailRequired') || 'Email is required');
    }
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to request reset');
      }
      setResetToken(data.resetToken);
      Alert.alert(
        t('resetLinkSent') || 'Reset link sent',
        t('checkEmailOrToken') || 'Please check your email or use the token below.'
      );
    } catch (error) {
      Alert.alert(t('errorTitle'), error.message);
    }
  };

  const goToResetPassword = () => {
    navigation.navigate('ResetPassword', { resetToken });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('forgotPassword') || 'Forgot Password'}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('enterEmail') || 'Enter your email'}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Button
        title={t('requestReset') || 'Request Password Reset'}
        onPress={handleRequestReset}
      />
      {resetToken ? (
        <>
          <Text style={styles.tokenText}>
            {t('resetToken') || 'Reset Token'}: {resetToken}
          </Text>
          <Button
            title={t('proceedReset') || 'Proceed to Reset Password'}
            onPress={goToResetPassword}
          />
        </>
      ) : null}
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
  tokenText: {
    marginVertical: Spacing.m,
    textAlign: 'center',
    ...Typography.body,
    color: Colors.textPrimary,
  },
});
