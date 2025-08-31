const express = require('express');
const { query, validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');
const { optionalAuth } = require('../middleware/auth');
const {
  searchMedia,
  getMovieDetails,
  getTVDetails,
  getPopularMovies,
  getPopularTVShows,
  getAnime,
  getTrending,
  getGenres,
  formatMediaData
} = require('../utils/omdbApi');

const router = express.Router();

// Apply optional authentication middleware to all routes
router.use(optionalAuth);

/**
 * @route   GET /api/search
 * @desc    Search for movies, TV shows, and anime
 * @access  Public
 */
router.get('/', [
  query('q')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search query is required'),
  
  query('type')
    .optional()
    .isIn(['movie', 'series', 'episode', ''])
    .withMessage('Type must be movie, series, episode, or empty for all'),
  
  query('page')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Page must be a positive integer between 1 and 1000')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { q: query, type = '', page = 1 } = req.query;

  try {
    const searchResults = await searchMedia(query, type, parseInt(page));
    
    // Format results for consistent response
    const formattedResults = searchResults.results.map(item => {
      let mediaType = item.Type === 'movie' ? 'movie' : 'series';
      return formatMediaData(item, mediaType);
    });

    res.json({
      success: true,
      data: {
        results: formattedResults,
        page: searchResults.page,
        totalPages: searchResults.totalPages,
        totalResults: searchResults.totalResults
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search media'
    });
  }
}));

/**
 * @route   GET /api/search/movies/:id
 * @desc    Get movie details by IMDB ID
 * @access  Public
 */
router.get('/movies/:id', [
  query('id')
    .isLength({ min: 1 })
    .withMessage('IMDB ID is required')
], asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const movieDetails = await getMovieDetails(id);
    
    res.json({
      success: true,
      data: {
        ...formatMediaData(movieDetails, 'movie'),
        runtime: movieDetails.Runtime,
        director: movieDetails.Director,
        actors: movieDetails.Actors ? movieDetails.Actors.split(', ') : [],
        language: movieDetails.Language,
        country: movieDetails.Country,
        awards: movieDetails.Awards,
        metascore: movieDetails.Metascore,
        boxOffice: movieDetails.BoxOffice,
        production: movieDetails.Production,
        website: movieDetails.Website
      }
    });
  } catch (error) {
    console.error('Movie details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movie details'
    });
  }
}));

/**
 * @route   GET /api/search/tv/:id
 * @desc    Get TV show details by IMDB ID
 * @access  Public
 */
router.get('/tv/:id', [
  query('id')
    .isLength({ min: 1 })
    .withMessage('IMDB ID is required')
], asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const tvDetails = await getTVDetails(id);
    
    res.json({
      success: true,
      data: {
        ...formatMediaData(tvDetails, 'series'),
        director: tvDetails.Director,
        actors: tvDetails.Actors ? tvDetails.Actors.split(', ') : [],
        language: tvDetails.Language,
        country: tvDetails.Country,
        awards: tvDetails.Awards,
        metascore: tvDetails.Metascore,
        totalSeasons: tvDetails.totalSeasons,
        production: tvDetails.Production,
        website: tvDetails.Website
      }
    });
  } catch (error) {
    console.error('TV details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch TV show details'
    });
  }
}));

/**
 * @route   GET /api/search/popular/movies
 * @desc    Get popular movies
 * @access  Public
 */
router.get('/popular/movies', [
  query('page')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Page must be a positive integer between 1 and 1000')
], asyncHandler(async (req, res) => {
  const { page = 1 } = req.query;

  try {
    const popularMovies = await getPopularMovies(parseInt(page));
    
    const formattedResults = popularMovies.results.map(item => 
      formatMediaData(item, 'movie')
    );

    res.json({
      success: true,
      data: {
        results: formattedResults,
        page: popularMovies.page,
        totalPages: popularMovies.totalPages,
        totalResults: popularMovies.totalResults
      }
    });
  } catch (error) {
    console.error('Popular movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular movies'
    });
  }
}));

/**
 * @route   GET /api/search/popular/tv
 * @desc    Get popular TV shows
 * @access  Public
 */
router.get('/popular/tv', [
  query('page')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Page must be a positive integer between 1 and 1000')
], asyncHandler(async (req, res) => {
  const { page = 1 } = req.query;

  try {
    const popularTV = await getPopularTVShows(parseInt(page));
    
    const formattedResults = popularTV.results.map(item => 
      formatMediaData(item, 'tv')
    );

    res.json({
      success: true,
      data: {
        results: formattedResults,
        page: popularTV.page,
        totalPages: popularTV.totalPages,
        totalResults: popularTV.totalResults
      }
    });
  } catch (error) {
    console.error('Popular TV error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular TV shows'
    });
  }
}));

/**
 * @route   GET /api/search/anime
 * @desc    Get anime shows
 * @access  Public
 */
router.get('/anime', [
  query('page')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Page must be a positive integer between 1 and 1000')
], asyncHandler(async (req, res) => {
  const { page = 1 } = req.query;

  try {
    const animeResults = await getAnime(parseInt(page));
    
    const formattedResults = animeResults.results.map(item => 
      formatMediaData(item, 'anime')
    );

    res.json({
      success: true,
      data: {
        results: formattedResults,
        page: animeResults.page,
        totalPages: animeResults.totalPages,
        totalResults: animeResults.totalResults
      }
    });
  } catch (error) {
    console.error('Anime error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch anime'
    });
  }
}));

/**
 * @route   GET /api/search/trending
 * @desc    Get trending media
 * @access  Public
 */
router.get('/trending', [
  query('timeWindow')
    .optional()
    .isIn(['day', 'week'])
    .withMessage('Time window must be day or week'),
  
  query('page')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Page must be a positive integer between 1 and 1000')
], asyncHandler(async (req, res) => {
  const { timeWindow = 'week', page = 1 } = req.query;

  try {
    const trendingResults = await getTrending(timeWindow);
    
    const formattedResults = trendingResults.results.map(item => {
      let mediaType = item.Type === 'movie' ? 'movie' : 'series';
      return formatMediaData(item, mediaType);
    });

    res.json({
      success: true,
      data: {
        results: formattedResults,
        page: trendingResults.page,
        totalPages: trendingResults.totalPages,
        totalResults: trendingResults.totalResults
      }
    });
  } catch (error) {
    console.error('Trending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending media'
    });
  }
}));

/**
 * @route   GET /api/search/genres/:type
 * @desc    Get genres for movies or TV shows
 * @access  Public
 */
router.get('/genres/:type', [
  query('type')
    .isIn(['movie', 'series'])
    .withMessage('Type must be movie or series')
], asyncHandler(async (req, res) => {
  const { type } = req.params;

  try {
    const genres = await getGenres(type);
    
    res.json({
      success: true,
      data: {
        genres: genres.genres
      }
    });
  } catch (error) {
    console.error('Genres error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch genres'
    });
  }
}));

/**
 * @route   GET /api/search/recommendations/:type/:id
 * @desc    Get recommendations for a specific media item
 * @access  Public
 */
router.get('/recommendations/:type/:id', [
  query('type')
    .isIn(['movie', 'series'])
    .withMessage('Type must be movie or series'),
  
  query('id')
    .isLength({ min: 1 })
    .withMessage('IMDB ID is required'),
  
  query('page')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Page must be a positive integer between 1 and 1000')
], asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  const { page = 1 } = req.query;

  try {
    const recommendations = await getRecommendations(type, id, parseInt(page));
    
    const formattedResults = recommendations.results.map(item => 
      formatMediaData(item, type)
    );

    res.json({
      success: true,
      data: {
        results: formattedResults,
        page: recommendations.page,
        totalPages: recommendations.totalPages,
        totalResults: recommendations.totalResults
      }
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations'
    });
  }
}));

module.exports = router;
