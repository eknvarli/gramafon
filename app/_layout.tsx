import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useSettingsStore } from '../src/store/useSettingsStore';
import { useEffect } from 'react';
import { Audio } from 'expo-av';

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
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

  const colorScheme = theme === 'system' ? systemColorScheme : theme;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="player" options={{ presentation: 'modal', title: 'Now Playing' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
