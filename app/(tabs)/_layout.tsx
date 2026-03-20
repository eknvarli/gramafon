import React from 'react';
import { Tabs } from 'expo-router';
import { Search, Heart, ListMusic, Settings } from 'lucide-react-native';
import { useTheme } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { FloatingPlayer } from '../../src/components/FloatingPlayer';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTitleStyle: {
            color: colors.text,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="playlists"
          options={{
            title: 'Playlists',
            tabBarIcon: ({ color, size }) => <ListMusic color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
          }}
        />
      </Tabs>
      <FloatingPlayer />
    </View>
  );
}
