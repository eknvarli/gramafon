import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Track } from '../services/api';
import { STORAGE_KEYS } from '../constants/Config';

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
}

interface LibraryState {
  favorites: Track[];
  playlists: Playlist[];
  
  toggleFavorite: (track: Track) => Promise<void>;
  isFavorite: (trackId: string) => boolean;
  
  createPlaylist: (name: string) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addTrackToPlaylist: (playlistId: string, track: Track) => Promise<void>;
  
  loadLibrary: () => Promise<void>;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  favorites: [],
  playlists: [],

  toggleFavorite: async (track: Track) => {
    const { favorites } = get();
    const isFav = favorites.some(t => t.id === track.id);
    let newFavorites;
    
    if (isFav) {
      newFavorites = favorites.filter(t => t.id !== track.id);
    } else {
      newFavorites = [...favorites, track];
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
    set({ favorites: newFavorites });
  },

  isFavorite: (trackId: string) => {
    return get().favorites.some(t => t.id === trackId);
  },

  createPlaylist: async (name: string) => {
    const { playlists } = get();
    const newPlaylist: Playlist = {
      id: Math.random().toString(36).substring(7),
      name,
      tracks: [],
    };
    const newPlaylists = [...playlists, newPlaylist];
    await AsyncStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(newPlaylists));
    set({ playlists: newPlaylists });
  },

  deletePlaylist: async (id: string) => {
    const newPlaylists = get().playlists.filter(p => p.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(newPlaylists));
    set({ playlists: newPlaylists });
  },

  addTrackToPlaylist: async (playlistId: string, track: Track) => {
    const newPlaylists = get().playlists.map(p => {
      if (p.id === playlistId && !p.tracks.some(t => t.id === track.id)) {
        return { ...p, tracks: [...p.tracks, track] };
      }
      return p;
    });
    await AsyncStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(newPlaylists));
    set({ playlists: newPlaylists });
  },

  loadLibrary: async () => {
    const [favsJson, playlistsJson] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.FAVORITES),
      AsyncStorage.getItem(STORAGE_KEYS.PLAYLISTS),
    ]);
    
    set({ 
      favorites: favsJson ? JSON.parse(favsJson) : [],
      playlists: playlistsJson ? JSON.parse(playlistsJson) : [],
    });
  },
}));
