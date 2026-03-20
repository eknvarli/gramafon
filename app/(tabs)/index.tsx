import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Search as SearchIcon } from 'lucide-react-native';
import { apiService, Track } from '../../src/services/api';
import { TrackItem } from '../../src/components/TrackItem';
import { usePlayerStore } from '../../src/store/playerStore';

import { Colors } from '../../src/constants/Colors';

export default function SearchScreen() {
  const { colors } = useTheme();
  const [search, setSearch] = React.useState('');
  const [tracks, setTracks] = React.useState<Track[]>([]);
  const [loading, setLoading] = React.useState(false);
  const { playTrack, setQueue } = usePlayerStore();

  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    try {
      const results = await apiService.search(search); // Changed from api.searchTracks to apiService.search to match original import
      setTracks(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onTrackPress = (track: Track) => {
    setQueue(tracks);
    playTrack(track);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Search</Text>
        <View style={[styles.searchContainer, { backgroundColor: Colors.cardBg, borderColor: Colors.glassBorder }]}>
          <SearchIcon color="#B3B3B3" size={20} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Songs, artists, or podcasts"
            placeholderTextColor="#777"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} size="large" />
      ) : (
        <FlatList
          data={tracks}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={({ item }) => (
            <TrackItem track={item} onPress={onTrackPress} />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            search ? null : (
              <View style={styles.emptyContainer}>
                <SearchIcon color="#282828" size={64} />
                <Text style={styles.emptyText}>Find your favorite music</Text>
              </View>
            )
          }
        />
      )}
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
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  loader: {
    flex: 1,
    marginTop: 100,
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
