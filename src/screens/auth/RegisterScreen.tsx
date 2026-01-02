import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../components/common/Text';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { colors } = useTheme();
  const { signUp } = useAuth();

  const validateForm = (): boolean => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!pin.trim()) {
      Alert.alert('Error', 'Please enter your PIN');
      return false;
    }
    
    if (pin.length < 6) {
      Alert.alert('Error', 'PIN must be at least 6 characters');
      return false;
    }
    
    if (pin !== confirmPin) {
      Alert.alert('Error', 'PINs do not match');
      return false;
    }
    
    if (!termsAccepted) {
      Alert.alert('Error', 'You must accept the terms and conditions');
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await signUp(username, pin);
      // After successful registration, navigate back to LoginRegister screen
      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('LoginRegister')
        }
      ]);
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#E6D7FF' }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username (Mail id)"
            placeholderTextColor="#6B7280"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter PIN (min 6 characters)"
            placeholderTextColor="#6B7280"
            value={pin}
            onChangeText={setPin}
            secureTextEntry
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm PIN"
            placeholderTextColor="#6B7280"
            value={confirmPin}
            onChangeText={setConfirmPin}
            secureTextEntry
            keyboardType="numeric"
          />

          <View style={styles.termsContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, termsAccepted && { backgroundColor: '#9F7AEA' }]} 
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              {termsAccepted && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </TouchableOpacity>
            <Text style={[styles.termsText, { color: '#6B7280' }]}>
              I agree to the{' '}
              <Text style={{ color: '#9F7AEA' }}>Terms</Text>
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? 'CREATING ACCOUNT...' : 'REGISTER'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 30,
    justifyContent: 'center',
  },
  formContainer: {
    gap: 15,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    fontSize: 13,
  },
  registerButton: {
    backgroundColor: '#9F7AEA',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
