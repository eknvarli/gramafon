export const API_BASE_URL = 'https://api.turkish.systems';
export const API_VERSION = '/api/v1';

export const ENDPOINTS = {
  SEARCH: `${API_VERSION}/search`,
  TRACKS: (id: string) => `${API_VERSION}/tracks/${id}`,
  STREAMS: (id: string) => `${API_VERSION}/streams/${id}`,
  PLAYLISTS: `${API_VERSION}/playlists/`,
  PLAYLIST_TRACKS: (id: string) => `${API_VERSION}/playlists/${id}/tracks`,
};

export const STORAGE_KEYS = {
  FAVORITES: 'gramafon_favorites',
  THEME: 'gramafon_theme',
  RECENT_SEARCHES: 'gramafon_recent_searches',
  PLAYLISTS: 'gramafon_local_playlists',
};
