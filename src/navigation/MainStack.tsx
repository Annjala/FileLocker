import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/main/HomeScreen';
import { FileListScreen } from '../screens/files/FileListScreen';
import { FileDetailsScreen } from '../screens/files/FileDetailsScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { EncryptionKeyScreen } from '../screens/settings/EncryptionKeyScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

export type MainTabParamList = {
  Files: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  FileDetails: { fileId: string };
  Profile: undefined;
  EncryptionKey: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const MainTabs = () => {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'folder';

          if (route.name === 'Files') {
            iconName = focused ? 'folder' : 'folder-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Files" 
        component={HomeScreen} 
        options={{ title: 'Home' }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }} 
      />
    </Tab.Navigator>
  );
};

export const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen 
        name="FileDetails" 
        component={FileDetailsScreen} 
        options={{ 
          headerShown: true, 
          title: 'File Details',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          headerShown: true, 
          title: 'My Profile',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="EncryptionKey" 
        component={EncryptionKeyScreen} 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
    </Stack.Navigator>
  );
};
