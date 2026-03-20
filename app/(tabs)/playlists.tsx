import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useLibraryStore, Playlist } from '../../src/store/useLibraryStore';
import { Plus, Music2, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function PlaylistsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { playlists, createPlaylist, deletePlaylist, loadLibrary } = useLibraryStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    loadLibrary();
  }, []);

  const handleCreate = async () => {
    if (!newPlaylistName.trim()) return;
    await createPlaylist(newPlaylistName);
    setNewPlaylistName('');
    setModalVisible(false);
  };

  const confirmDelete = (id: string, name: string) => {
    Alert.alert('Delete Playlist', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deletePlaylist(id) },
    ]);
  };

  const renderPlaylist = ({ item }: { item: Playlist }) => (
    <TouchableOpacity 
      style={[styles.playlistItem, { borderBottomColor: colors.border }]}
      onPress={() => router.push(`/playlist/${item.id}`)}
    >
      <View style={[styles.playlistIcon, { backgroundColor: colors.card }]}>
        <Music2 color={colors.primary} size={24} />
      </View>
      <View style={styles.playlistInfo}>
        <Text style={[styles.playlistName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.playlistTracks, { color: colors.text + '80' }]}>
          {item.tracks.length} tracks
        </Text>
      </View>
      <TouchableOpacity onPress={() => confirmDelete(item.id, item.name)} style={styles.deleteButton}>
        <Trash2 color={colors.text + '40'} size={20} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={renderPlaylist}
        ListHeaderComponent={
          <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
            <Plus color={colors.primary} size={24} />
            <Text style={[styles.createButtonText, { color: colors.primary }]}>Create Playlist</Text>
          </TouchableOpacity>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>New Playlist</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Name"
              placeholderTextColor={colors.text + '40'}
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: colors.text + '80', padding: 12 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreate}>
                <Text style={{ color: colors.primary, fontWeight: 'bold', padding: 12 }}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', // Will use theme border if needed
  },
  createButtonText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  playlistIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: '600',
  },
  playlistTracks: {
    fontSize: 14,
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 32,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
