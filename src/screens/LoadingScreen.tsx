import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Text } from '../components/common/Text';
import { Ionicons } from '@expo/vector-icons';

export const LoadingScreen = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Ionicons name="lock-closed" size={60} color={colors.primary} />
      <Text style={[styles.title, { color: colors.text }]}>Secure Vault</Text>
      <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Loading your secure vault...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  loader: {
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});
