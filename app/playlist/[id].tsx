import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../../src/constants/Colors';
import { useTheme } from '@react-navigation/native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useLibraryStore } from '../../src/store/useLibraryStore';
import { usePlayerStore } from '../../src/store/playerStore';
import { TrackItem } from '../../src/components/TrackItem';
import { Track } from '../../src/services/api';
import { ChevronLeft, Play } from 'lucide-react-native';

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const router = useRouter();
  const { playlists, loadLibrary } = useLibraryStore();
  const { playTrack, setQueue } = usePlayerStore();

  const playlist = playlists.find(p => p.id === id);

  useEffect(() => {
    loadLibrary();
  }, []);

  if (!playlist) return null;

  const onTrackPress = (track: Track) => {
    setQueue(playlist.tracks);
    playTrack(track);
  };

  const playAll = () => {
    if (playlist.tracks.length > 0) {
      setQueue(playlist.tracks);
      playTrack(playlist.tracks[0]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: playlist.name,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft color={colors.text} size={28} />
            </TouchableOpacity>
          ),
          headerTransparent: true,
          headerBackground: () => (
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          ),
        }} 
      />
      
      <FlatList
        data={playlist.tracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrackItem track={item} onPress={onTrackPress} />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <Text style={[styles.name, { color: colors.text }]}>{playlist.name}</Text>
              <Text style={[styles.count, { color: '#B3B3B3' }]}>
                {playlist.tracks.length} tracks
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.playButton, { backgroundColor: colors.primary }]}
              onPress={playAll}
            >
              <Play color="#fff" fill="#fff" size={24} />
              <Text style={styles.playButtonText}>Play All</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.text + '60' }]}>
            No tracks in this playlist yet. Add tracks from the Search screen.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: 100, // For transparent header
    paddingBottom: 100,
  },
  backButton: {
    marginLeft: 8,
  },
  header: {
    flexDirection: 'row',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBg,
    marginHorizontal: 16,
    borderRadius: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 14,
    marginTop: 2,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: Colors.spotifyGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    paddingHorizontal: 32,
  },
});
