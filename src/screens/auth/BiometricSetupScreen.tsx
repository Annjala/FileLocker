import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../components/common/Text';
import { Button } from '../../components/common/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';

type Props = NativeStackScreenProps<AuthStackParamList, 'BiometricSetup'>;

export const BiometricSetupScreen = ({ navigation, route }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');
  const { colors } = useTheme();
  const { setupBiometricAuth } = useAuth();

  useEffect(() => {
    checkBiometricType();
  }, []);

  const checkBiometricType = async () => {
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('Face ID');
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('Fingerprint');
      } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        setBiometricType('Iris');
      } else {
        setBiometricType('Biometric');
      }
    } catch (error) {
      console.error('Error checking biometric type:', error);
      setBiometricType('Biometric');
    }
  };

  const handleSetupBiometric = async () => {
    setIsLoading(true);
    try {
      const success = await setupBiometricAuth();
      if (success) {
        Alert.alert(
          'Success',
          'Biometric authentication has been set up successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigation will happen automatically via auth state
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to set up biometric authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Biometric Setup',
      'You can set up biometric authentication later in settings. Continue without biometric authentication?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => {
            // Navigation will happen automatically via auth state
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="finger-print" size={80} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Set Up {biometricType}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Use {biometricType.toLowerCase()} to quickly and securely access your vault
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark" size={24} color={colors.success} />
            <Text style={[styles.featureText, { color: colors.text }]}>
              Enhanced Security
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="flash" size={24} color={colors.warning} />
            <Text style={[styles.featureText, { color: colors.text }]}>
              Quick Access
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="lock-closed" size={24} color={colors.info} />
            <Text style={[styles.featureText, { color: colors.text }]}>
              No Password Needed
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={isLoading ? 'Setting Up...' : `Enable ${biometricType}`}
            onPress={handleSetupBiometric}
            disabled={isLoading}
            style={StyleSheet.flatten([styles.setupButton, { backgroundColor: colors.primary }])}
            textStyle={styles.setupButtonText}
          />

          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>
              Skip for Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  features: {
    marginTop: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  setupButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 16,
    alignItems: 'center',
    padding: 12,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
