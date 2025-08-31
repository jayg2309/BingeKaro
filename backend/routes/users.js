const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');
const { protect } = require('../middleware/auth');
const { uploadProfilePicture, handleUploadError, deleteFile, getFileUrl } = require('../middleware/upload');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.getPublicProfile()
    }
  });
}));

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-30 characters and contain only letters, numbers, and underscores'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot be more than 500 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { name, username, bio } = req.body;
  const updateFields = {};

  // Check if username is being updated and if it's available
  if (username && username !== req.user.username) {
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken'
      });
    }
    updateFields.username = username.toLowerCase();
  }

  if (name) updateFields.name = name;
  if (bio !== undefined) updateFields.bio = bio;

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    updateFields,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: updatedUser.getPublicProfile()
    }
  });
}));

/**
 * @route   PUT /api/users/password
 * @desc    Update user password
 * @access  Private
 */
router.put('/password', [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { currentPassword, newPassword } = req.body;

  // Get user with password for comparison
  const user = await User.findById(req.user._id).select('+password');
  
  // Check current password
  const isCurrentPasswordValid = await user.matchPassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
}));

/**
 * @route   POST /api/users/profile-picture
 * @desc    Upload profile picture
 * @access  Private
 */
router.post('/profile-picture', uploadProfilePicture, handleUploadError, asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  // Delete old profile picture if exists
  if (req.user.profilePicture) {
    deleteFile(req.user.profilePicture);
  }

  // Update user with new profile picture
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profilePicture: req.file.filename },
    { new: true }
  );

  res.json({
    success: true,
    message: 'Profile picture uploaded successfully',
    data: {
      profilePicture: getFileUrl(req.file.filename),
      user: user.getPublicProfile()
    }
  });
}));

/**
 * @route   DELETE /api/users/profile-picture
 * @desc    Remove profile picture
 * @access  Private
 */
router.delete('/profile-picture', asyncHandler(async (req, res) => {
  if (!req.user.profilePicture) {
    return res.status(400).json({
      success: false,
      message: 'No profile picture to remove'
    });
  }

  // Delete file from storage
  deleteFile(req.user.profilePicture);

  // Update user
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profilePicture: null },
    { new: true }
  );

  res.json({
    success: true,
    message: 'Profile picture removed successfully',
    data: {
      user: user.getPublicProfile()
    }
  });
}));

/**
 * @route   POST /api/users/favorites/movies
 * @desc    Add movie to favorites
 * @access  Private
 */
router.post('/favorites/movies', [
  body('tmdbId').isNumeric().withMessage('TMDB ID must be a number'),
  body('title').notEmpty().withMessage('Title is required'),
  body('posterPath').optional(),
  body('genre').isArray().withMessage('Genre must be an array')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { tmdbId, title, posterPath, genre } = req.body;

  // Check if movie already in favorites
  const existingMovie = req.user.favoriteMovies.find(movie => movie.tmdbId === tmdbId);
  if (existingMovie) {
    return res.status(400).json({
      success: false,
      message: 'Movie already in favorites'
    });
  }

  // Add movie to favorites
  req.user.favoriteMovies.push({
    tmdbId,
    title,
    posterPath,
    genre
  });

  await req.user.save();

  res.json({
    success: true,
    message: 'Movie added to favorites',
    data: {
      favorites: req.user.favoriteMovies
    }
  });
}));

/**
 * @route   DELETE /api/users/favorites/movies/:tmdbId
 * @desc    Remove movie from favorites
 * @access  Private
 */
router.delete('/favorites/movies/:tmdbId', asyncHandler(async (req, res) => {
  const { tmdbId } = req.params;

  const movieIndex = req.user.favoriteMovies.findIndex(movie => movie.tmdbId === parseInt(tmdbId));
  if (movieIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found in favorites'
    });
  }

  req.user.favoriteMovies.splice(movieIndex, 1);
  await req.user.save();

  res.json({
    success: true,
    message: 'Movie removed from favorites',
    data: {
      favorites: req.user.favoriteMovies
    }
  });
}));

/**
 * @route   POST /api/users/favorites/series
 * @desc    Add series to favorites
 * @access  Private
 */
router.post('/favorites/series', [
  body('tmdbId').isNumeric().withMessage('TMDB ID must be a number'),
  body('title').notEmpty().withMessage('Title is required'),
  body('posterPath').optional(),
  body('genre').isArray().withMessage('Genre must be an array')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { tmdbId, title, posterPath, genre } = req.body;

  // Check if series already in favorites
  const existingSeries = req.user.favoriteSeries.find(series => series.tmdbId === tmdbId);
  if (existingSeries) {
    return res.status(400).json({
      success: false,
      message: 'Series already in favorites'
    });
  }

  // Add series to favorites
  req.user.favoriteSeries.push({
    tmdbId,
    title,
    posterPath,
    genre
  });

  await req.user.save();

  res.json({
    success: true,
    message: 'Series added to favorites',
    data: {
      favorites: req.user.favoriteSeries
    }
  });
}));

/**
 * @route   DELETE /api/users/favorites/series/:tmdbId
 * @desc    Remove series from favorites
 * @access  Private
 */
router.delete('/favorites/series/:tmdbId', asyncHandler(async (req, res) => {
  const { tmdbId } = req.params;

  const seriesIndex = req.user.favoriteSeries.findIndex(series => series.tmdbId === parseInt(tmdbId));
  if (seriesIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Series not found in favorites'
    });
  }

  req.user.favoriteSeries.splice(seriesIndex, 1);
  await req.user.save();

  res.json({
    success: true,
    message: 'Series removed from favorites',
    data: {
      favorites: req.user.favoriteSeries
    }
  });
}));

/**
 * @route   POST /api/users/favorites/anime
 * @desc    Add anime to favorites
 * @access  Private
 */
router.post('/favorites/anime', [
  body('tmdbId').isNumeric().withMessage('TMDB ID must be a number'),
  body('title').notEmpty().withMessage('Title is required'),
  body('posterPath').optional(),
  body('genre').isArray().withMessage('Genre must be an array')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { tmdbId, title, posterPath, genre } = req.body;

  // Check if anime already in favorites
  const existingAnime = req.user.favoriteAnime.find(anime => anime.tmdbId === tmdbId);
  if (existingAnime) {
    return res.status(400).json({
      success: false,
      message: 'Anime already in favorites'
    });
  }

  // Add anime to favorites
  req.user.favoriteAnime.push({
    tmdbId,
    title,
    posterPath,
    genre
  });

  await req.user.save();

  res.json({
    success: true,
    message: 'Anime added to favorites',
    data: {
      favorites: req.user.favoriteAnime
    }
  });
}));

/**
 * @route   DELETE /api/users/favorites/anime/:tmdbId
 * @desc    Remove anime from favorites
 * @access  Private
 */
router.delete('/favorites/anime/:tmdbId', asyncHandler(async (req, res) => {
  const { tmdbId } = req.params;

  const animeIndex = req.user.favoriteAnime.findIndex(anime => anime.tmdbId === parseInt(tmdbId));
  if (animeIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Anime not found in favorites'
    });
  }

  req.user.favoriteAnime.splice(animeIndex, 1);
  await req.user.save();

  res.json({
    success: true,
    message: 'Anime removed from favorites',
    data: {
      favorites: req.user.favoriteAnime
    }
  });
}));

/**
 * @route   GET /api/users/favorites
 * @desc    Get all user favorites
 * @access  Private
 */
router.get('/favorites', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      movies: req.user.favoriteMovies,
      series: req.user.favoriteSeries,
      anime: req.user.favoriteAnime
    }
  });
}));

module.exports = router;
