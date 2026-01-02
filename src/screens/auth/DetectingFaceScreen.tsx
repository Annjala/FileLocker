import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useTheme } from '../../theme/ThemeContext';
import { Text } from '../../components/common/Text';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<AuthStackParamList, 'DetectingFace'>;

export const DetectingFaceScreen = ({ navigation }: Props) => {
  const { colors } = useTheme();

  const handlePress = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#E6D7FF' }]}>
      <TouchableOpacity 
        style={styles.pressableArea} 
        onPress={handlePress}
        activeOpacity={1}
      >
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#6B21A8" />
          <Text style={styles.title}>DETECTING FACE</Text>
          <Text style={styles.subtitle}>PLEASE WAIT FOR{'\n'}A MOMENT</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pressableArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 15,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
