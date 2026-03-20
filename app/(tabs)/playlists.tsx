import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useLibraryStore, Playlist } from '../../src/store/useLibraryStore';
import { Plus, ListMusic, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { Colors } from '../../src/constants/Colors';
import { BlurView } from 'expo-blur';

export default function PlaylistsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { playlists, createPlaylist, deletePlaylist, loadLibrary } = useLibraryStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    loadLibrary();
  }, []);

  const handleCreate = () => {
    if (newPlaylistName) {
      createPlaylist(newPlaylistName);
      setNewPlaylistName('');
      setModalVisible(false);
    }
  };

  const confirmDelete = (id: string, name: string) => {
    Alert.alert('Delete Playlist', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deletePlaylist(id) },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Your Library</Text>
        <TouchableOpacity 
          style={[styles.createButton, { backgroundColor: Colors.cardBg, borderColor: Colors.glassBorder }]} 
          onPress={() => setModalVisible(true)}
        >
          <Plus color={colors.primary} size={20} />
          <Text style={[styles.createButtonText, { color: colors.text }]}>New Playlist</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const firstTrackCover = item.tracks.length > 0 ? item.tracks[0].thumbnail : null;
          return (
            <TouchableOpacity 
              style={[styles.playlistItem, { backgroundColor: Colors.cardBg, borderColor: Colors.glassBorder }]}
              onPress={() => router.push(`/playlist/${item.id}`)}
            >
              <View style={[styles.playlistIcon, { backgroundColor: colors.primary + '20' }]}>
                {firstTrackCover ? (
                  <Image source={{ uri: firstTrackCover }} style={styles.coverImage} />
                ) : (
                  <ListMusic color={colors.primary} size={32} />
                )}
              </View>
              <View style={styles.playlistInfo}>
                <Text style={[styles.playlistName, { color: colors.text }]}>{item.name}</Text>
                <Text style={styles.playlistCount}>{item.tracks.length} tracks</Text>
              </View>
              <TouchableOpacity onPress={() => confirmDelete(item.id, item.name)} style={styles.deleteButton}>
                <Trash2 color="#B3B3B3" size={20} />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ListMusic color="#282828" size={64} />
            <Text style={styles.emptyText}>Create your first playlist to get started</Text>
          </View>
        }
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={90} tint="dark" style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>New Playlist</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: Colors.glassBorder }]}
              placeholder="Playlist name"
              placeholderTextColor="#777"
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                <Text style={{ color: '#B3B3B3' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreate} style={[styles.modalButton, styles.primaryModalButton]}>
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Create</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>
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
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  createButtonText: {
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 13,
  },
  listContent: {
    paddingBottom: 120,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  playlistIcon: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  playlistInfo: {
    flex: 1,
    marginLeft: 16,
  },
  playlistName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  playlistCount: {
    color: '#B3B3B3',
    fontSize: 13,
  },
  deleteButton: {
    padding: 12,
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
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    padding: 24,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 56,
    borderBottomWidth: 1,
    fontSize: 18,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginLeft: 12,
  },
});
