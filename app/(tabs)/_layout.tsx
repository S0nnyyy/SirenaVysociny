import React from 'react';
import { Tabs } from 'expo-router';
import { Home, BarChart2, Settings, Info } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { NotificationBadge } from '@/components/NotificationBadge';
import { useEmergencyStore } from '@/store/emergency-store';
import { useThemeStore } from '@/store/theme-store';
import { View } from 'react-native';

export default function TabLayout() {
  const colors = useThemeColors();
  const { theme } = useThemeStore();
  const getUnreadNotificationsCount = useEmergencyStore(state => state.getUnreadNotificationsCount);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBackground,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Výjezdy',
          tabBarLabel: 'Domů',
          tabBarIcon: ({ color, size }) => (
            <View>
              <Home size={size} color={color} />
              <NotificationBadge count={getUnreadNotificationsCount()} />
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistiky',
          tabBarLabel: 'Statistiky',
          tabBarIcon: ({ color, size }) => (
            <BarChart2 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Nastavení',
          tabBarLabel: 'Nastavení',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'O aplikaci',
          tabBarLabel: 'O aplikaci',
          tabBarIcon: ({ color, size }) => (
            <Info size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}