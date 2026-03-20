export const Colors = {
  black: '#121212',
  darkGray: '#181818',
  lightGray: '#282828',
  white: '#FFFFFF',
  spotifyGreen: '#1DB954',
  grayText: '#B3B3B3',
  tabBar: '#121212',
  cardBg: 'rgba(255, 255, 255, 0.08)',
  glassBorder: 'rgba(255, 255, 255, 0.15)',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

import { Platform } from 'react-native';

export const SpotifyTheme = {
  dark: true,
  fonts: Platform.select({
    ios: {
      regular: { fontFamily: 'System', fontWeight: '400' },
      medium: { fontFamily: 'System', fontWeight: '500' },
      bold: { fontFamily: 'System', fontWeight: '700' },
      heavy: { fontFamily: 'System', fontWeight: '900' },
    },
    default: {
      regular: { fontFamily: 'sans-serif', fontWeight: 'normal' },
      medium: { fontFamily: 'sans-serif-medium', fontWeight: 'normal' },
      bold: { fontFamily: 'sans-serif', fontWeight: 'bold' },
      heavy: { fontFamily: 'sans-serif', fontWeight: '900' },
    },
  }) as any,
  colors: {
    primary: Colors.spotifyGreen,
    background: Colors.black,
    card: Colors.tabBar,
    text: Colors.white,
    border: Colors.lightGray,
    notification: Colors.spotifyGreen,
  },
};
