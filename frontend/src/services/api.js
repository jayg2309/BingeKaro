import axios from 'axios';

// Create axios instance
const baseURL = process.env.REACT_APP_API_URL || '/api';
console.log('API Base URL:', baseURL);
console.log('Environment:', process.env.NODE_ENV);

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      method: config.method
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      // Check if it's a password-required error for private lists
      const isPasswordRequired = error.response?.data?.requiresPassword || 
                                error.response?.data?.message?.includes('Password required');
      
      if (isPasswordRequired) {
        // Don't redirect for password-required errors, let component handle it
        console.log('API interceptor: Password required for private list, not redirecting');
        return Promise.reject(error);
      }
      
      console.log('API interceptor: 401 auth error, removing token and redirecting');
      localStorage.removeItem('token');
      // Don't auto-redirect on 401 during login attempts
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Register new user
  register: (userData) => api.post('/auth/register', userData),
  
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Logout user
  logout: () => api.post('/auth/logout'),
  
  // Get current user
  getCurrentUser: () => api.get('/auth/me'),
  
  // Check username availability
  checkUsername: (username) => api.post('/auth/check-username', { username }),
  
  // Check email availability
  checkEmail: (email) => api.post('/auth/check-email', { email }),
  
  // Update profile
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  
  // Update password
  updatePassword: (passwordData) => api.put('/users/password', passwordData),
  
  // Upload profile picture
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return api.post('/users/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Remove profile picture
  removeProfilePicture: () => api.delete('/users/profile-picture'),
  
  // Add to favorites
  addToFavorites: (type, mediaData) => api.post(`/users/favorites/${type}`, mediaData),
  
  // Remove from favorites
  removeFromFavorites: (type, imdbId) => api.delete(`/users/favorites/${type}/${imdbId}`),
  
  // Get all favorites
  getFavorites: () => api.get('/users/favorites'),
};

// Search API
export const searchAPI = {
  // Search media
  search: (query, type = 'multi', page = 1) => 
    api.get('/search', { params: { q: query, type, page } }),
  
  // Get movie details
  getMovieDetails: (id) => api.get(`/search/movies/${id}`),
  
  // Get TV show details
  getTVDetails: (id) => api.get(`/search/tv/${id}`),
  
  // Get popular movies
  getPopularMovies: (page = 1) => api.get('/search/popular/movies', { params: { page } }),
  
  // Get popular TV shows
  getPopularTVShows: (page = 1) => api.get('/search/popular/tv', { params: { page } }),
  
  // Get anime
  getAnime: (page = 1) => api.get('/search/anime', { params: { page } }),
  
  // Get trending media
  getTrending: (timeWindow = 'week', page = 1) => 
    api.get('/search/trending', { params: { timeWindow, page } }),
  
  // Get genres
  getGenres: (type) => api.get(`/search/genres/${type}`),
  
  // Get recommendations
  getRecommendations: (type, id, page = 1) => 
    api.get(`/search/recommendations/${type}/${id}`, { params: { page } }),
};

// Recommendations API
export const recommendationsAPI = {
  // Create recommendation list
  createList: (listData) => api.post('/recommendations', listData),
  
  // Get user's recommendation lists
  getUserLists: (page = 1, limit = 10) => 
    api.get('/recommendations', { params: { page, limit } }),
  
  // Get public recommendation lists
  getPublicLists: (page = 1, limit = 20) => 
    api.get('/recommendations/public', { params: { page, limit } }),
  
  // Search recommendation lists
  searchLists: (query, limit = 20) => 
    api.get('/recommendations/search', { params: { q: query, limit } }),
  
  // Get recommendation list by ID
  getListById: (id, password = null) => {
    const params = password ? { password } : {};
    return api.get(`/recommendations/${id}`, { params });
  },
  
  // Add item to recommendation list
  addItem: (id, itemData) => api.post(`/recommendations/${id}/items`, itemData),
  
  // Remove item from recommendation list
  removeItem: (id, imdbId, mediaType) => 
    api.delete(`/recommendations/${id}/items/${imdbId}/${mediaType}`),
  
  // Like recommendation list
  likeList: (id) => api.post(`/recommendations/${id}/like`),
  
  // Get user's lists by username
  getUserListsByUsername: (username) => api.get(`/recommendations/user/${username}`),
};

// Utility functions
export const apiUtils = {
  // Get image URL from OMDb (OMDb provides full URLs)
  getImageUrl: (path, size = 'w500') => {
    if (!path || path === 'N/A') return null;
    return path; // OMDb already provides full URLs
  },
  
  // Format date
  formatDate: (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },
  
  // Format runtime
  formatRuntime: (minutes) => {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  },
  
  // Format rating
  formatRating: (rating) => {
    if (!rating) return 'N/A';
    return rating.toFixed(1);
  },
  
  // Truncate text
  truncateText: (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },
  
  // Get genre names from IDs
  getGenreNames: (genreIds, genres) => {
    if (!genreIds || !genres) return [];
    return genreIds
      .map(id => genres.find(genre => genre.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3); // Limit to 3 genres
  },
};

export default api;
