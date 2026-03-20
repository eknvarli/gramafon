import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/Config';
import { Appearance } from 'react-native';

interface SettingsState {
  theme: 'dark';
  setTheme: (theme: 'dark') => Promise<void>;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'dark',

  setTheme: async (theme) => {
    // Keep for potential future needs but skip storage for now if we force it
    set({ theme });
  },

  loadSettings: async () => {
    set({ theme: 'dark' });
  },
}));
