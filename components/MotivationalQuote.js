// components/MotivationalQuote.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../styles/designSystem';

export default function MotivationalQuote({ text }) {
  return (
    <View style={styles.quoteContainer}>
      <Text style={styles.quoteText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  quoteContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.m,
    marginBottom: Spacing.l,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
  },
  quoteText: {
    fontStyle: 'italic',
    fontSize: Typography.body.fontSize,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});
