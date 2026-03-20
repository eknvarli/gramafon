import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Play, Pause, SkipBack, SkipForward, Heart } from 'lucide-react-native';
import { usePlayerStore } from '../src/store/playerStore';
import { useLibraryStore } from '../src/store/useLibraryStore';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

export default function PlayerScreen() {
  const { colors } = useTheme();
  const { currentTrack, isPlaying, togglePlayPause, next, previous, position, duration, seek } = usePlayerStore();
  const { toggleFavorite, isFavorite } = useLibraryStore();

  if (!currentTrack) return null;

  const isFav = isFavorite(currentTrack.id);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={{ uri: currentTrack.thumbnail }} style={styles.albumArt} />
      
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={[styles.artist, { color: colors.text + '80' }]}>
            {currentTrack.artist}
          </Text>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(currentTrack)}>
          <Heart 
            color={isFav ? '#e91e63' : colors.text} 
            fill={isFav ? '#e91e63' : 'transparent'} 
            size={28} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primary}
          onSlidingComplete={seek}
        />
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, { color: colors.text + '60' }]}>
            {formatTime(position)}
          </Text>
          <Text style={[styles.timeText, { color: colors.text + '60' }]}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={previous}>
          <SkipBack color={colors.text} fill={colors.text} size={40} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={togglePlayPause} style={[styles.playButton, { backgroundColor: colors.text }]}>
          {isPlaying ? (
            <Pause color={colors.background} fill={colors.background} size={32} />
          ) : (
            <Play color={colors.background} fill={colors.background} size={32} />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={next}>
          <SkipForward color={colors.text} fill={colors.text} size={40} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const formatTime = (millis: number) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumArt: {
    width: width - 48,
    height: width - 48,
    borderRadius: 16,
    marginBottom: 40,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 18,
    marginTop: 4,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 40,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    width: '100%',
  },
  progressIndicator: {
    height: 4,
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
