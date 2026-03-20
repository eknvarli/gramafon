import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { Play, Pause, SkipBack, SkipForward, Heart, ChevronDown, ListPlus } from 'lucide-react-native';
import { usePlayerStore } from '../src/store/playerStore';
import { useLibraryStore } from '../src/store/useLibraryStore';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Colors } from '../src/constants/Colors';

const { width } = Dimensions.get('window');

export default function PlayerScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { currentTrack, isPlaying, togglePlayPause, next, previous, position, duration, seek, isLoading } = usePlayerStore();
  const { playlists, addTrackToPlaylist, toggleFavorite, isFavorite } = useLibraryStore();

  if (!currentTrack) return null;

  const isFav = isFavorite(currentTrack.id);

  const handleAddTrack = () => {
    if (playlists.length === 0) {
      Alert.alert('No Playlists', 'Please create a playlist first in the Library tab.');
      return;
    }

    Alert.alert(
      'Add to Playlist',
      'Select a playlist',
      playlists.map(p => ({
        text: p.name,
        onPress: () => addTrackToPlaylist(p.id, currentTrack),
      })).concat([{ text: 'Cancel', style: 'cancel' } as any])
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronDown color="#FFF" size={32} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Now Playing</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.artContainer}>
            <Image source={{ uri: currentTrack.thumbnail }} style={styles.albumArt} />
          </View>
          
          <View style={styles.metaContainer}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={[styles.artist, { color: '#B3B3B3' }]} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(currentTrack)} style={styles.favoriteButton}>
              <Heart 
                color={isFav ? colors.primary : '#B3B3B3'} 
                fill={isFav ? colors.primary : 'transparent'} 
                size={28} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.progressContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor="rgba(255,255,255,0.1)"
              thumbTintColor="#FFF"
              onSlidingComplete={seek}
            />
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity onPress={previous} style={styles.secondaryControl}>
              <SkipBack color="#FFF" fill="#FFF" size={36} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={togglePlayPause} 
              style={[styles.playButton, { backgroundColor: '#FFF' }]}
              disabled={isLoading}
            >
              {isLoading ? (
                 <ActivityIndicator color="#000" size="small" />
              ) : isPlaying ? (
                <Pause color="#000" fill="#000" size={36} />
              ) : (
                <Play color="#000" fill="#000" size={36} />
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={next} style={styles.secondaryControl}>
              <SkipForward color="#FFF" fill="#FFF" size={36} />
            </TouchableOpacity>
          </View>

          <View style={styles.footerActions}>
            <TouchableOpacity style={[styles.playlistButton, { backgroundColor: Colors.cardBg, borderColor: Colors.glassBorder }]} onPress={handleAddTrack}>
              <ListPlus color="#FFF" size={24} />
              <Text style={styles.playlistButtonText}>Add to Playlist</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const formatTime = (millis: number) => {
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  artContainer: {
    width: width - 64,
    height: width - 64,
    borderRadius: 24,
    marginBottom: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  albumArt: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  artist: {
    fontSize: 18,
    marginTop: 6,
    fontWeight: '500',
  },
  favoriteButton: {
    padding: 4,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 40,
  },
  slider: {
    width: '100%',
    height: 40,
    marginHorizontal: -10,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  timeText: {
    color: '#B3B3B3',
    fontSize: 12,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 48,
  },
  secondaryControl: {
    padding: 10,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  footerActions: {
    alignItems: 'center',
  },
  playlistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 1,
  },
  playlistButtonText: {
    color: '#FFF',
    marginLeft: 10,
    fontWeight: '700',
    fontSize: 15,
  },
});
