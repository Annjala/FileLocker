import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../components/common/Text';

type Props = NativeStackScreenProps<AuthStackParamList, 'LoginInitial'>;

export const LoginInitialScreen = ({ navigation }: Props) => {
  const handleLoginPress = () => {
    navigation.navigate('LoginDetectingFace');
  };

  const handleBackPress = () => {
    navigation.navigate('LoginRegister');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#E6D7FF' }]}>
      <View style={styles.content}>
        <View style={styles.spacer} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleLoginPress}
          >
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.backButton]}
            onPress={handleBackPress}
          >
            <Text style={styles.buttonText}>BACK</Text>
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
  },
  spacer: {
    flex: 1,
  },
  buttonContainer: {
    paddingBottom: 100,
    paddingHorizontal: 40,
    gap: 30,
  },
  button: {
    backgroundColor: '#9F7AEA',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 2,
  },
  backButton: {
    backgroundColor: '#7C3AED',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
