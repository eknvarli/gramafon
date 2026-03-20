import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useLibraryStore } from '../../src/store/useLibraryStore';
import { usePlayerStore } from '../../src/store/playerStore';
import { TrackItem } from '../../src/components/TrackItem';
import { Track } from '../../src/services/api';

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
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrackItem track={item} onPress={onTrackPress} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text + '80' }]}>
              Your favorite tracks will appear here
            </Text>
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
  emptyContainer: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
