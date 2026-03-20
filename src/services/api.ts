import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../constants/Config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: number;
  url?: string;
}

export const apiService = {
  search: async (query: string): Promise<Track[]> => {
    try {
      const response = await apiClient.get(ENDPOINTS.SEARCH, {
        params: { q: query },
      });
      console.log('Raw search results length:', Array.isArray(response.data) ? response.data.length : 'not an array');
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log('First search result sample:', JSON.stringify(response.data[0], null, 2));
      }
      
      const items = Array.isArray(response.data) ? response.data : [];
      return items.map((item: any) => ({
        id: item.videoId || item.video_id || item.id || '',
        title: item.title || 'Unknown Title',
        artist: item.artist || item.author || 'Unknown Artist',
        thumbnail: item.thumbnail_url || item.thumbnail || (Array.isArray(item.thumbnails) ? item.thumbnails[0]?.url : ''),
        duration: item.duration || 0,
      }));
    } catch (error) {
      console.error('Search API error:', error);
      return [];
    }
  },

  getTrack: async (id: string): Promise<Track> => {
    try {
      const response = await apiClient.get(ENDPOINTS.TRACKS(id));
      return response.data;
    } catch (error) {
      console.error('Get track error:', error);
      throw error;
    }
  },

  getStreamUrl: async (id: string): Promise<string> => {
    try {
      const response = await apiClient.get(ENDPOINTS.STREAMS(id));
      return response.data.stream_url || '';
    } catch (error) {
      console.error('Get stream URL error:', error);
      return '';
    }
  },

  getPlaylists: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.PLAYLISTS);
      return response.data;
    } catch (error) {
      console.error('Get playlists error:', error);
      throw error;
    }
  },

  addTrackToPlaylist: async (playlistId: string, trackId: string) => {
    try {
      const response = await apiClient.post(ENDPOINTS.PLAYLIST_TRACKS(playlistId), {
        track_id: trackId,
      });
      return response.data;
    } catch (error) {
      console.error('Add track to playlist error:', error);
      throw error;
    }
  },
};
