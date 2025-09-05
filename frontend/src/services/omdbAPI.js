import axios from 'axios';

// OMDB API configuration
const OMDB_BASE_URL = 'https://www.omdbapi.com';
const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY || 'your_omdb_api_key_here';

console.log('OMDb API Key configured:', OMDB_API_KEY ? 'Yes' : 'No');
console.log('OMDb Base URL:', OMDB_BASE_URL);

// Create OMDB axios instance
const omdbAPI = axios.create({
  baseURL: OMDB_BASE_URL,
  timeout: 10000,
});

// OMDB API functions
export const omdbService = {
  // Search movies and TV shows
  search: async (query, type = '', page = 1) => {
    try {
      console.log('OMDb Search Request:', { query, type, page, apiKey: OMDB_API_KEY ? 'Set' : 'Not Set' });
      
      const response = await omdbAPI.get('/', {
        params: {
          apikey: OMDB_API_KEY,
          s: query,
          type: type, // 'movie', 'series', or '' for all
          page: page
        }
      });
      
      console.log('OMDb Search Response:', response.data);
      
      if (response.data.Response === 'True') {
        return {
          results: response.data.Search.map(item => ({
            imdbID: item.imdbID,
            title: item.Title,
            year: item.Year,
            type: item.Type,
            poster: item.Poster !== 'N/A' ? item.Poster : null,
            // Format for compatibility with existing components
            id: item.imdbID,
            name: item.Title,
            release_date: item.Year,
            first_air_date: item.Year,
            media_type: item.Type === 'movie' ? 'movie' : 'tv',
            poster_path: item.Poster !== 'N/A' ? item.Poster : null
          })),
          total_results: parseInt(response.data.totalResults) || 0,
          total_pages: Math.ceil((parseInt(response.data.totalResults) || 0) / 10)
        };
      } else {
        console.error('OMDb API Error:', response.data.Error);
        return {
          results: [],
          total_results: 0,
          total_pages: 0,
          error: response.data.Error
        };
      }
    } catch (error) {
      console.error('OMDb API Request Error:', error);
      return {
        results: [],
        total_results: 0,
        total_pages: 0,
        error: error.message
      };
    }
  },

  // Search movies specifically
  searchMovies: async (query, page = 1) => {
    return await omdbService.search(query, 'movie', page);
  },

  // Search TV shows
  searchTV: async (query, page = 1) => {
    return await omdbService.search(query, 'series', page);
  },

  // Get detailed information about a movie/show by IMDB ID
  getDetails: async (imdbId) => {
    try {
      const response = await omdbAPI.get('/', {
        params: {
          apikey: OMDB_API_KEY,
          i: imdbId,
          plot: 'full'
        }
      });
      
      if (response.data.Response === 'True') {
        const item = response.data;
        return {
          imdbID: item.imdbID,
          title: item.Title,
          year: item.Year,
          rated: item.Rated,
          released: item.Released,
          runtime: item.Runtime,
          genre: item.Genre,
          director: item.Director,
          writer: item.Writer,
          actors: item.Actors,
          plot: item.Plot,
          language: item.Language,
          country: item.Country,
          awards: item.Awards,
          poster: item.Poster !== 'N/A' ? item.Poster : null,
          ratings: item.Ratings,
          metascore: item.Metascore,
          imdbRating: item.imdbRating,
          imdbVotes: item.imdbVotes,
          type: item.Type,
          totalSeasons: item.totalSeasons,
          // Format for compatibility
          id: item.imdbID,
          name: item.Title,
          overview: item.Plot,
          poster_path: item.Poster !== 'N/A' ? item.Poster : null,
          vote_average: parseFloat(item.imdbRating) || 0,
          genres: item.Genre ? item.Genre.split(', ').map(g => ({ name: g })) : [],
          media_type: item.Type === 'movie' ? 'movie' : 'tv'
        };
      } else {
        throw new Error(response.data.Error || 'Movie not found');
      }
    } catch (error) {
      console.error('OMDB details error:', error);
      throw error;
    }
  },

  // Format media item for backend compatibility
  formatForBackend: (item) => {
    console.log('OMDB formatForBackend - Input item:', item);
    
    // Extract IMDB ID from various possible fields
    const imdbId = item.imdbID || item.id || item.imdbId;
    console.log('OMDB formatForBackend - Extracted imdbId:', imdbId);
    
    if (!imdbId) {
      console.error('OMDB formatForBackend - No IMDB ID found in item:', item);
      throw new Error('IMDB ID is required but not found in media item');
    }
    
    const formatted = {
      imdbId: imdbId,
      title: item.title || item.Title || item.name || 'Unknown Title',
      year: item.year || item.Year || (item.release_date ? new Date(item.release_date).getFullYear() : null),
      type: item.type || item.Type || (item.media_type === 'tv' ? 'series' : item.media_type) || 'movie',
      poster: item.poster || item.Poster || item.poster_path || '',
      genre: item.genre || (item.genres ? item.genres.map(g => g.name).join(', ') : '') || '',
      plot: item.plot || item.Plot || item.overview || '',
      imdbRating: parseFloat(item.imdbRating || item.vote_average || 0)
    };
    
    console.log('OMDB formatForBackend - Formatted item:', formatted);
    return formatted;
  },

  // Get image URL (OMDB provides full URLs)
  getImageUrl: (posterPath, size = 'w500') => {
    if (!posterPath || posterPath === 'N/A') return null;
    return posterPath; // OMDB provides full URLs
  },

  // Format genres for display
  formatGenres: (genreString) => {
    if (!genreString) return [];
    return genreString.split(', ').map(genre => ({ name: genre.trim() }));
  }
};

export default omdbService;
