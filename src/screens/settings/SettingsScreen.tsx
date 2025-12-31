import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Text } from '../../components/common/Text';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/MainStack';

export const SettingsScreen = () => {
  const { colors, isDark, themeMode, setThemeMode } = useTheme();
  const { user, signOut, setupBiometricAuth } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      const success = await setupBiometricAuth();
      if (success) {
        setBiometricEnabled(true);
        Alert.alert('Success', 'Biometric authentication enabled');
      }
    } else {
      setBiometricEnabled(false);
      Alert.alert('Disabled', 'Biometric authentication disabled');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const handleEncryptionKeyPress = () => {
    navigation.navigate('EncryptionKey');
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
    rightElement,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress && !rightElement}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement || (showArrow && (
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      ))}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ACCOUNT</Text>
          
          <SettingItem
            icon="person-outline"
            title="Profile"
            subtitle={user?.email || 'View your profile'}
            onPress={() => {}}
          />
          
          <SettingItem
            icon="key-outline"
            title="Change Password"
            subtitle="Update your password"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>SECURITY</Text>
          
          <SettingItem
            icon="finger-print"
            title="Biometric Authentication"
            subtitle={biometricEnabled ? 'Enabled' : 'Disabled'}
            showArrow={false}
            rightElement={
              <Switch
                value={biometricEnabled}
                onValueChange={handleBiometricToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            }
          />
          
          <SettingItem
            icon="shield-checkmark-outline"
            title="Encryption Key"
            subtitle="Manage your encryption key"
            onPress={handleEncryptionKeyPress}
          />
          
          <SettingItem
            icon="lock-closed-outline"
            title="Auto-Lock"
            subtitle="Lock app after inactivity"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PREFERENCES</Text>
          
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            subtitle={isDark ? 'Enabled' : 'Disabled'}
            showArrow={false}
            rightElement={
              <Switch
                value={isDark}
                onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            }
          />
          
          <SettingItem
            icon="notifications-outline"
            title="Notifications"
            subtitle={notificationsEnabled ? 'Enabled' : 'Disabled'}
            showArrow={false}
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>STORAGE</Text>
          
          <SettingItem
            icon="cloud-outline"
            title="Storage Usage"
            subtitle="View storage details"
            onPress={() => {}}
          />
          
          <SettingItem
            icon="trash-outline"
            title="Clear Cache"
            subtitle="Free up space"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ABOUT</Text>
          
          <SettingItem
            icon="information-circle-outline"
            title="About"
            subtitle="Version 1.0.0"
            onPress={() => {}}
          />
          
          <SettingItem
            icon="document-text-outline"
            title="Privacy Policy"
            onPress={() => {}}
          />
          
          <SettingItem
            icon="shield-outline"
            title="Terms of Service"
            onPress={() => {}}
          />
        </View>

        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: colors.danger }]}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
