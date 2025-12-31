import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Text } from '../../components/common/Text';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ProfileScreen = () => {
  const { colors } = useTheme();
  const { user } = useAuth();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={[styles.email, { color: colors.text }]}>{user?.email}</Text>
          <Text style={[styles.userId, { color: colors.textSecondary }]}>
            User ID: {user?.id.substring(0, 8)}...
          </Text>
        </View>

        <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Ionicons name="document" size={32} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>0</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Files</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="cloud" size={32} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>0 MB</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Used</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="shield-checkmark" size={32} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.text }]}>100%</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Secure</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 12,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  userId: {
    fontSize: 14,
  },
  statsCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 12,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
});
