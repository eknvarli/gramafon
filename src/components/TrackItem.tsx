import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Track } from '../services/api';
import { useTheme } from '@react-navigation/native';
import { Play, Plus } from 'lucide-react-native';
import { useLibraryStore } from '../store/useLibraryStore';

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
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <TouchableOpacity style={styles.content} onPress={() => onPress(track)}>
        <Image source={{ uri: track.thumbnail }} style={styles.thumbnail} />
        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={[styles.artist, { color: colors.text + '80' }]} numberOfLines={1}>
            {track.artist}
          </Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleAddTrack} style={styles.actionButton}>
          <Plus color={colors.text + '60'} size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPress(track)} style={styles.actionButton}>
          <Play color={colors.primary} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  artist: {
    fontSize: 14,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
});
