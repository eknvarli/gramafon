import React from 'react';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Search, Heart, ListMusic, Settings } from 'lucide-react-native';
import { useTheme } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FloatingPlayer } from '../../src/components/FloatingPlayer';
import { LoadingOverlay } from '../../src/components/LoadingOverlay';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: '#B3B3B3',
          tabBarStyle: {
            position: 'absolute',
            borderTopWidth: 0,
            elevation: 0,
            backgroundColor: 'transparent',
            height: 60,
            paddingBottom: 8,
          },
          tabBarBackground: () => (
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          ),
          headerStyle: {
            backgroundColor: colors.background,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            color: colors.text,
            fontWeight: 'bold',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Search',
            tabBarIcon: ({ color }) => <Search color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color }) => <Heart color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="playlists"
          options={{
            title: 'Library',
            tabBarIcon: ({ color }) => <ListMusic color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <Settings color={color} size={24} />,
          }}
        />
      </Tabs>
      <View style={styles.playerWrapper}>
        <FloatingPlayer />
      </View>
      <LoadingOverlay />
    </View>
  );
}

const styles = StyleSheet.create({
  playerWrapper: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    height: 64,
  },
});
