import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { usePlayerStore } from '../store/playerStore';

export const LoadingOverlay = () => {
  const isLoading = usePlayerStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <Modal transparent animationType="fade" visible={isLoading}>
      <View style={styles.container}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color="#1DB954" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#282828',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
});
