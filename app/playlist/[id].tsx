import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useLibraryStore } from '../../src/store/useLibraryStore';
import { usePlayerStore } from '../../src/store/playerStore';
import { TrackItem } from '../../src/components/TrackItem';
import { Track } from '../../src/services/api';
import { Play } from 'lucide-react-native';

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
      <Stack.Screen options={{ title: playlist.name }} />
      
      <FlatList
        data={playlist.tracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrackItem track={item} onPress={onTrackPress} />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.name, { color: colors.text }]}>{playlist.name}</Text>
            <Text style={[styles.count, { color: colors.text + '80' }]}>
              {playlist.tracks.length} tracks
            </Text>
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
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 20,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    paddingHorizontal: 32,
  },
});
