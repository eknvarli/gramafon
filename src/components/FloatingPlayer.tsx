import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Play, Pause, SkipForward } from 'lucide-react-native';
import { usePlayerStore } from '../store/playerStore';
import { useRouter } from 'expo-router';

export const FloatingPlayer = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { currentTrack, isPlaying, togglePlayPause, next } = usePlayerStore();

  if (!currentTrack) return null;

  return (
    <Pressable 
      style={[styles.container, { backgroundColor: colors.card, borderTopColor: colors.border }]} 
      onPress={() => router.push('/player')}
    >
      <Image source={{ uri: currentTrack.thumbnail }} style={styles.thumbnail} />
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {currentTrack.title}
        </Text>
        <Text style={[styles.artist, { color: colors.text + '80' }]} numberOfLines={1}>
          {currentTrack.artist}
        </Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
          {isPlaying ? (
            <Pause color={colors.text} fill={colors.text} size={24} />
          ) : (
            <Play color={colors.text} fill={colors.text} size={24} />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={next} style={styles.controlButton}>
          <SkipForward color={colors.text} fill={colors.text} size={24} />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    height: 64,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 10,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  artist: {
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
  },
});
