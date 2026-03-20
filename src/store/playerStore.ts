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
  sound: null,
  queue: [],
  position: 0,
  duration: 0,

  playTrack: async (track: Track) => {
    try {
      const { sound: existingSound } = get();
      
      if (existingSound) {
        await existingSound.unloadAsync().catch(() => {});
      }

      if (!track.id) {
        console.error('Cannot play track: ID is missing', track);
        return;
      }
      const streamUrl = await apiService.getStreamUrl(track.id);
      if (!streamUrl) {
        console.error('Could not get stream URL for track:', track.id);
        return;
      }
      console.log('Playing direct stream:', streamUrl);
      
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
          } else if (status.error) {
            console.error('Audio playback status error:', status.error);
          }
        }
      );

      set({ currentTrack: track, sound, isPlaying: true });
    } catch (error) {
      console.error('Failed to play track:', error);
      set({ isPlaying: false });
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
      console.error('Stop audio error:', error);
    }
  },

  next: async () => {
    try {
      const { queue, currentTrack } = get();
      if (queue.length === 0 || !currentTrack) return;
      
      const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % queue.length;
      await get().playTrack(queue[nextIndex]);
    } catch (error) {
      console.error('Next track error:', error);
    }
  },

  previous: async () => {
    try {
      const { queue, currentTrack } = get();
      if (queue.length === 0 || !currentTrack) return;
      
      const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
      const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
      await get().playTrack(queue[prevIndex]);
    } catch (error) {
      console.error('Previous track error:', error);
    }
  },

  seek: async (position: number) => {
    try {
      const { sound } = get();
      if (sound) {
        await sound.setPositionAsync(position);
      }
    } catch (error) {
      console.error('Seek error:', error);
    }
  },

  setQueue: (tracks: Track[]) => set({ queue: tracks }),
  updatePosition: (position: number) => set({ position }),
  updateDuration: (duration: number) => set({ duration }),
}));
