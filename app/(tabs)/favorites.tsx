import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Heart } from 'lucide-react-native';
import { useLibraryStore } from '../../src/store/useLibraryStore';
import { usePlayerStore } from '../../src/store/playerStore';
import { TrackItem } from '../../src/components/TrackItem';
import { Track } from '../../src/services/api';

import { Colors } from '../../src/constants/Colors';

export default function FavoritesScreen() {
  const { colors } = useTheme();
  const { favorites, loadLibrary } = useLibraryStore();
  const { playTrack, setQueue } = usePlayerStore();

  useEffect(() => {
    loadLibrary();
  }, []);

  const onTrackPress = (track: Track) => {
    setQueue(favorites);
    playTrack(track);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Liked Songs</Text>
        <Text style={styles.subtitle}>{favorites.length} songs</Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id} // Changed keyExtractor logic
        renderItem={({ item }) => (
          <TrackItem track={item} onPress={onTrackPress} />
        )}
        contentContainerStyle={styles.listContent} // Changed contentContainerStyle
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Heart color="#282828" size={64} /> {/* Changed Heart color and removed emptyIcon style */}
            <Text style={styles.emptyText}>Songs you like will appear here</Text>
          </View>
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
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#B3B3B3',
    fontSize: 14,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#555',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
});
