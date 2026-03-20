import { create } from 'zustand';
import { Audio } from 'expo-av';
import { Track, apiService } from '../services/api';

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  sound: Audio.Sound | null;
  queue: Track[];
  position: number;
  duration: number;
  
  // Actions
  playTrack: (track: Track) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  stop: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  setQueue: (tracks: Track[]) => void;
  updatePosition: (position: number) => void;
  updateDuration: (duration: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  isLoading: false,
  sound: null,
  queue: [],
  position: 0,
  duration: 0,

  playTrack: async (track: Track) => {
    const { sound: existingSound, isLoading } = get();
    if (isLoading) return; // Prevent concurrent loading

    set({ isLoading: true });
    
    try {
      if (existingSound) {
        await existingSound.unloadAsync().catch(() => {});
        set({ sound: null });
      }

      const streamUrl = await apiService.getStreamUrl(track.id);
      if (!streamUrl) {
        set({ isLoading: false });
        return;
      }
      
      const { sound } = await Audio.Sound.createAsync(
        { uri: streamUrl },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            set({ 
              position: status.positionMillis, 
              duration: status.durationMillis || 0,
              isPlaying: status.isPlaying,
            });
            if (status.didJustFinish) {
              get().next().catch(console.error);
            }
          }
        }
      );

      set({ currentTrack: track, sound, isPlaying: true, isLoading: false });
    } catch (error) {
      console.error('Playback error:', error);
      set({ isLoading: false, isPlaying: false });
    }
  },

  togglePlayPause: async () => {
    try {
      const { sound, isPlaying } = get();
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
        set({ isPlaying: !isPlaying });
      }
    } catch (error) {
      console.error('Toggle play/pause error:', error);
    }
  },

  stop: async () => {
    try {
      const { sound } = get();
      if (sound) {
        await sound.stopAsync().catch(() => {});
        await sound.unloadAsync().catch(() => {});
      }
      set({ sound: null, isPlaying: false, currentTrack: null });
    } catch (error) {
      console.error('Stop error:', error);
    }
  },

  next: async () => {
    const { queue, currentTrack, isLoading } = get();
    if (queue.length === 0 || !currentTrack || isLoading) return;
    
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    await get().playTrack(queue[nextIndex]);
  },

  previous: async () => {
    const { queue, currentTrack, isLoading } = get();
    if (queue.length === 0 || !currentTrack || isLoading) return;
    
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    await get().playTrack(queue[prevIndex]);
  },

  seek: async (position: number) => {
    const { sound } = get();
    if (sound) {
      await sound.setPositionAsync(position);
    }
  },

  setQueue: (tracks: Track[]) => set({ queue: tracks }),
  updatePosition: (position: number) => set({ position }),
  updateDuration: (duration: number) => set({ duration }),
}));
