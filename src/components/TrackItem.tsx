import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Track } from '../services/api';
import { useTheme } from '@react-navigation/native';
import { Play, Plus } from 'lucide-react-native';
import { useLibraryStore } from '../store/useLibraryStore';
import { Colors } from '../constants/Colors';

interface TrackItemProps {
  track: Track;
  onPress: (track: Track) => void;
}

export const TrackItem: React.FC<TrackItemProps> = ({ track, onPress }) => {
  const { colors } = useTheme();
  const { playlists, addTrackToPlaylist } = useLibraryStore();

  const handleAddTrack = () => {
    if (playlists.length === 0) {
      Alert.alert('No Playlists', 'Please create a playlist first in the Playlists tab.');
      return;
    }

    Alert.alert(
      'Add to Playlist',
      'Select a playlist',
      playlists.map(p => ({
        text: p.name,
        onPress: () => addTrackToPlaylist(p.id, track),
      })).concat([{ text: 'Cancel', style: 'cancel' } as any])
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: Colors.cardBg, borderColor: Colors.glassBorder },
      ]}
      onPress={() => onPress(track)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: track.thumbnail }} style={styles.thumbnail} />
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={[styles.artist, { color: '#B3B3B3' }]} numberOfLines={1}>
          {track.artist}
        </Text>
      </View>
      <View style={styles.playIconContainer}>
        <Play color={colors.primary} size={20} fill={colors.primary} opacity={0.8} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: 8,
    marginRight: 16,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  artist: {
    fontSize: 13,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
  },
  playIcon: {
    marginLeft: 8,
    opacity: 0.8,
  },
});
