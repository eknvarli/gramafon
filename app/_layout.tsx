import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from '@react-navigation/native';
import { useSettingsStore } from '../src/store/useSettingsStore';
import { useEffect } from 'react';
import { Audio } from 'expo-av';
import { SpotifyTheme } from '../src/constants/Colors';

export default function RootLayout() {
  const { theme, loadSettings } = useSettingsStore();

  useEffect(() => {
    loadSettings();
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: 1, // InterruptionModeIOS.DoNotMix
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: 1, // InterruptionModeAndroid.DoNotMix
      playThroughEarpieceAndroid: false,
    });
  }, []);

  return (
    <ThemeProvider value={SpotifyTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="player" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
