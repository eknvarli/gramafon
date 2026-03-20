import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Search as SearchIcon } from 'lucide-react-native';
import { apiService, Track } from '../../src/services/api';
import { TrackItem } from '../../src/components/TrackItem';
import { usePlayerStore } from '../../src/store/playerStore';

export default function SearchScreen() {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const setQueue = usePlayerStore((state) => state.setQueue);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length < 2) {
      setTracks([]);
      return;
    }

    setLoading(true);
    try {
      const results = await apiService.search(text);
      if (results) {
        setTracks(results);
      }
    } catch (error) {
      console.error('Search UI error:', error);
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
      <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SearchIcon color={colors.text + '80'} size={20} style={styles.icon} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Artists, songs, or podcasts"
          placeholderTextColor={colors.text + '80'}
          value={query}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} size="large" />
      ) : (
        <FlatList
          data={tracks}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item }) => (
            <TrackItem track={item} onPress={onTrackPress} />
          )}
          ListEmptyComponent={
            query.length > 1 ? (
              <Text style={[styles.empty, { color: colors.text + '80' }]}>No results found</Text>
            ) : null
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  loader: {
    marginTop: 40,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
