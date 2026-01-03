import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useTheme } from '../../theme/ThemeContext';
import { Text } from '../../components/common/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useFonts,
  Grandstander_700Bold,
  Grandstander_400Regular,
} from '@expo-google-fonts/grandstander';

// Color constants
const COLORS = {
  TEXT: '#483847',
  SCREEN_SKIN: '#EFD7ED',
  BUTTON: '#B378AF',
  PLACEHOLDER: '#6B7280',
};

// Custom Animated Loader Component
const CustomLoader = () => {
  const rotationAnim = new Animated.Value(0);
  
  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();
    
    return () => rotateAnimation.stop();
  }, []);

  const rotate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={loaderStyles.container}>
      <Animated.View style={[loaderStyles.circle, { transform: [{ rotate }] }]} />
    </View>
  );
};

const loaderStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: COLORS.TEXT,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
});

type Props = NativeStackScreenProps<AuthStackParamList, 'DetectingFace'>;

export const DetectingFaceScreen = ({ navigation }: Props) => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  
  let [fontsLoaded] = useFonts({
    Grandstander_700Bold,
    Grandstander_400Regular,
  });

  const handlePress = () => {
    setIsLoading(false);
    navigation.navigate('Register');
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.SCREEN_SKIN }]}>
      <TouchableOpacity 
        style={styles.pressableArea} 
        onPress={handlePress}
        activeOpacity={1}
      >
        <View style={styles.content}>
          <Text style={styles.title}>DETECTING FACE</Text>
          <View style={styles.loaderContainer}>
            <CustomLoader />
          </View>
          <Text style={styles.subtitle}>PLEASE WAIT FOR</Text>
          <Text style={styles.subtitle}>A MOMENT</Text>
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
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Grandstander_700Bold',
    color: COLORS.TEXT,
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 60,
  },
  loaderContainer: {
    marginBottom: 60,
  },
  subtitle: {
    fontSize: 28,
    fontFamily: 'Grandstander_700Bold',
    color: COLORS.TEXT,
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: 1.5,
  },
});
