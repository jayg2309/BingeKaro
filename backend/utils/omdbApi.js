const axios = require('axios');

// OMDb API configuration
const OMDB_BASE_URL = process.env.OMDB_BASE_URL || 'http://www.omdbapi.com';
const OMDB_API_KEY = process.env.OMDB_API_KEY;

// Create axios instance for OMDb API
const omdbApi = axios.create({
  baseURL: OMDB_BASE_URL,
  timeout: 10000
});

/**
 * Search for movies, TV shows, and anime
 * @param {string} query - Search query
 * @param {string} mediaType - Type of media (movie, series, episode)
 * @param {number} page - Page number for pagination
 * @returns {object} Search results
 */
const searchMedia = async (query, mediaType = '', page = 1) => {
  try {
    const response = await omdbApi.get('', {
      params: {
        apikey: OMDB_API_KEY,
        s: query,
        type: mediaType,
        page: page,
        plot: 'short'
      }
    });

    if (response.data.Response === 'False') {
      throw new Error(response.data.Error || 'No results found');
    }

    return {
      results: response.data.Search || [],
      totalResults: response.data.totalResults || 0,
      page: page,
      totalPages: Math.ceil((response.data.totalResults || 0) / 10) // OMDb returns 10 results per page
    };
  } catch (error) {
    console.error('OMDb Search Error:', error.message);
    throw new Error('Failed to search media');
  }
};

/**
 * Get movie details by IMDB ID
 * @param {string} imdbId - IMDB ID
 * @returns {object} Movie details
 */
const getMovieDetails = async (imdbId) => {
  try {
    const response = await omdbApi.get('', {
      params: {
        apikey: OMDB_API_KEY,
        i: imdbId,
        plot: 'full'
      }
    });

    if (response.data.Response === 'False') {
      throw new Error(response.data.Error || 'Movie not found');
    }

    return response.data;
  } catch (error) {
    console.error('OMDb Movie Details Error:', error.message);
    throw new Error('Failed to fetch movie details');
  }
};

/**
 * Get TV show details by IMDB ID
 * @param {string} imdbId - IMDB ID
 * @returns {object} TV show details
 */
const getTVDetails = async (imdbId) => {
  try {
    const response = await omdbApi.get('', {
      params: {
        apikey: OMDB_API_KEY,
        i: imdbId,
        plot: 'full'
      }
    });

    if (response.data.Response === 'False') {
      throw new Error(response.data.Error || 'TV show not found');
    }

    return response.data;
  } catch (error) {
    console.error('OMDb TV Details Error:', error.message);
    throw new Error('Failed to fetch TV show details');
  }
};

/**
 * Get popular movies (using search with high ratings)
 * @param {number} page - Page number
 * @returns {object} Popular movies
 */
const getPopularMovies = async (page = 1) => {
  try {
    // Search for movies with high ratings
    const response = await omdbApi.get('', {
      params: {
        apikey: OMDB_API_KEY,
        s: 'movie',
        type: 'movie',
        page: page,
        plot: 'short'
      }
    });

    if (response.data.Response === 'False') {
      throw new Error(response.data.Error || 'No movies found');
    }

    return {
      results: response.data.Search || [],
      totalResults: response.data.totalResults || 0,
      page: page,
      totalPages: Math.ceil((response.data.totalResults || 0) / 10)
    };
  } catch (error) {
    console.error('OMDb Popular Movies Error:', error.message);
    throw new Error('Failed to fetch popular movies');
  }
};

/**
 * Get popular TV shows
 * @param {number} page - Page number
 * @returns {object} Popular TV shows
 */
const getPopularTVShows = async (page = 1) => {
  try {
    const response = await omdbApi.get('', {
      params: {
        apikey: OMDB_API_KEY,
        s: 'series',
        type: 'series',
        page: page,
        plot: 'short'
      }
    });

    if (response.data.Response === 'False') {
      throw new Error(response.data.Error || 'No TV shows found');
    }

    return {
      results: response.data.Search || [],
      totalResults: response.data.totalResults || 0,
      page: page,
      totalPages: Math.ceil((response.data.totalResults || 0) / 10)
    };
  } catch (error) {
    console.error('OMDb Popular TV Shows Error:', error.message);
    throw new Error('Failed to fetch popular TV shows');
  }
};

/**
 * Get anime shows
 * @param {number} page - Page number
 * @returns {object} Anime shows
 */
const getAnime = async (page = 1) => {
  try {
    // Search for anime using common anime terms
    const response = await omdbApi.get('', {
      params: {
        apikey: OMDB_API_KEY,
        s: 'anime',
        type: 'series',
        page: page,
        plot: 'short'
      }
    });

    if (response.data.Response === 'False') {
      throw new Error(response.data.Error || 'No anime found');
    }

    return {
      results: response.data.Search || [],
      totalResults: response.data.totalResults || 0,
      page: page,
      totalPages: Math.ceil((response.data.totalResults || 0) / 10)
    };
  } catch (error) {
    console.error('OMDb Anime Error:', error.message);
    throw new Error('Failed to fetch anime');
  }
};

/**
 * Get recommendations for a specific media item
 * @param {string} mediaType - Type of media (movie, series)
 * @param {string} imdbId - IMDB ID
 * @param {number} page - Page number
 * @returns {object} Recommendations
 */
const getRecommendations = async (mediaType, imdbId, page = 1) => {
  try {
    // Get details first to extract genre information
    const details = await (mediaType === 'movie' ? getMovieDetails(imdbId) : getTVDetails(imdbId));
    
    if (!details.Genre) {
      throw new Error('No genre information available for recommendations');
    }

    // Search for similar content based on genre
    const genres = details.Genre.split(', ')[0]; // Use first genre
    const response = await omdbApi.get('', {
      params: {
        apikey: OMDB_API_KEY,
        s: genres,
        type: mediaType,
        page: page,
        plot: 'short'
      }
    });

    if (response.data.Response === 'False') {
      throw new Error(response.data.Error || 'No recommendations found');
    }

    return {
      results: response.data.Search || [],
      totalResults: response.data.totalResults || 0,
      page: page,
      totalPages: Math.ceil((response.data.totalResults || 0) / 10)
    };
  } catch (error) {
    console.error('OMDb Recommendations Error:', error.message);
    throw new Error('Failed to fetch recommendations');
  }
};

/**
 * Get genres for movies or TV shows
 * @param {string} mediaType - Type of media (movie, series)
 * @returns {object} Genres list
 */
const getGenres = async (mediaType) => {
  try {
    // OMDb doesn't have a dedicated genres endpoint, so we'll return common genres
    const commonGenres = {
      movie: [
        { id: 'action', name: 'Action' },
        { id: 'adventure', name: 'Adventure' },
        { id: 'animation', name: 'Animation' },
        { id: 'biography', name: 'Biography' },
        { id: 'comedy', name: 'Comedy' },
        { id: 'crime', name: 'Crime' },
        { id: 'documentary', name: 'Documentary' },
        { id: 'drama', name: 'Drama' },
        { id: 'family', name: 'Family' },
        { id: 'fantasy', name: 'Fantasy' },
        { id: 'film-noir', name: 'Film-Noir' },
        { id: 'game-show', name: 'Game-Show' },
        { id: 'history', name: 'History' },
        { id: 'horror', name: 'Horror' },
        { id: 'music', name: 'Music' },
        { id: 'musical', name: 'Musical' },
        { id: 'mystery', name: 'Mystery' },
        { id: 'news', name: 'News' },
        { id: 'reality-tv', name: 'Reality-TV' },
        { id: 'romance', name: 'Romance' },
        { id: 'sci-fi', name: 'Sci-Fi' },
        { id: 'sport', name: 'Sport' },
        { id: 'talk-show', name: 'Talk-Show' },
        { id: 'thriller', name: 'Thriller' },
        { id: 'war', name: 'War' },
        { id: 'western', name: 'Western' }
      ],
      series: [
        { id: 'action', name: 'Action' },
        { id: 'adventure', name: 'Adventure' },
        { id: 'animation', name: 'Animation' },
        { id: 'biography', name: 'Biography' },
        { id: 'comedy', name: 'Comedy' },
        { id: 'crime', name: 'Crime' },
        { id: 'documentary', name: 'Documentary' },
        { id: 'drama', name: 'Drama' },
        { id: 'family', name: 'Family' },
        { id: 'fantasy', name: 'Fantasy' },
        { id: 'game-show', name: 'Game-Show' },
        { id: 'history', name: 'History' },
        { id: 'horror', name: 'Horror' },
        { id: 'music', name: 'Music' },
        { id: 'musical', name: 'Musical' },
        { id: 'mystery', name: 'Mystery' },
        { id: 'news', name: 'News' },
        { id: 'reality-tv', name: 'Reality-TV' },
        { id: 'romance', name: 'Romance' },
        { id: 'sci-fi', name: 'Sci-Fi' },
        { id: 'sport', name: 'Sport' },
        { id: 'talk-show', name: 'Talk-Show' },
        { id: 'thriller', name: 'Thriller' },
        { id: 'war', name: 'War' },
        { id: 'western', name: 'Western' }
      ]
    };

    return {
      genres: commonGenres[mediaType] || commonGenres.movie
    };
  } catch (error) {
    console.error('OMDb Genres Error:', error.message);
    throw new Error('Failed to fetch genres');
  }
};

/**
 * Get trending media (using search with popular terms)
 * @param {string} timeWindow - Time window (day, week) - not used in OMDb
 * @returns {object} Trending media
 */
const getTrending = async (timeWindow = 'week') => {
  try {
    // Search for popular movies and series
    const response = await omdbApi.get('', {
      params: {
        apikey: OMDB_API_KEY,
        s: 'popular',
        type: '',
        page: 1,
        plot: 'short'
      }
    });

    if (response.data.Response === 'False') {
      throw new Error(response.data.Error || 'No trending media found');
    }

    return {
      results: response.data.Search || [],
      totalResults: response.data.totalResults || 0,
      page: 1,
      totalPages: Math.ceil((response.data.totalResults || 0) / 10)
    };
  } catch (error) {
    console.error('OMDb Trending Error:', error.message);
    throw new Error('Failed to fetch trending media');
  }
};

/**
 * Format media data for consistent response
 * @param {object} media - Raw media data from OMDb
 * @param {string} mediaType - Type of media
 * @returns {object} Formatted media data
 */
const formatMediaData = (media, mediaType) => {
  return {
    imdbId: media.imdbID,
    title: media.Title,
    originalTitle: media.Title, // OMDb doesn't provide original title
    overview: media.Plot,
    posterPath: media.Poster !== 'N/A' ? media.Poster : null,
    backdropPath: null, // OMDb doesn't provide backdrop images
    genre: media.Genre ? media.Genre.split(', ') : [],
    mediaType: mediaType,
    releaseDate: media.Year ? `${media.Year}-01-01` : null, // OMDb only provides year
    rating: media.imdbRating ? parseFloat(media.imdbRating) : null,
    voteCount: null, // OMDb doesn't provide vote count
    popularity: null, // OMDb doesn't provide popularity score
    adult: false, // OMDb doesn't provide adult content flag
    // Additional OMDb specific fields
    director: media.Director,
    actors: media.Actors ? media.Actors.split(', ') : [],
    runtime: media.Runtime,
    language: media.Language,
    country: media.Country,
    awards: media.Awards,
    metascore: media.Metascore,
    type: media.Type
  };
};

module.exports = {
  searchMedia,
  getMovieDetails,
  getTVDetails,
  getPopularMovies,
  getPopularTVShows,
  getAnime,
  getRecommendations,
  getGenres,
  getTrending,
  formatMediaData
};
