import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Play, Pause, SkipForward } from 'lucide-react-native';
import { usePlayerStore } from '../store/playerStore';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

const FloatingPlayer = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { currentTrack, isPlaying, togglePlayPause, next } = usePlayerStore();

  if (!currentTrack) return null;

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.pressable}
        onPress={() => router.push('/player')}
      >
        <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
          <Image source={{ uri: currentTrack.thumbnail }} style={styles.thumbnail} />
          <View style={styles.info}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={[styles.artist, { color: '#B3B3B3' }]} numberOfLines={1}>
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
        </BlurView>
      </Pressable>
    </View>
  );
};

export { FloatingPlayer };

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  pressable: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  blurContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    height: 64,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
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
