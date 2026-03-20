import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/Config';
import { Appearance } from 'react-native';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'system',

  setTheme: async (theme) => {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    set({ theme });
  },

  loadSettings: async () => {
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark' | 'system';
    if (theme) {
      set({ theme });
    }
  },
}));
