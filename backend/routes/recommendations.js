const express = require('express');
const { body, validationResult } = require('express-validator');
const RecommendationList = require('../models/RecommendationList');
const { asyncHandler } = require('../middleware/errorHandler');
const { protect, checkOwnership } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);
 
/**
 * @route   POST /api/recommendations
 * @desc    Create a new recommendation list
 * @access  Private
 */
router.post('/', [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('List name must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters'),
  
  body('isPrivate')
    .optional()
    .isBoolean()
    .withMessage('isPrivate must be a boolean'),
  
  body('password')
    .optional()
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters long'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], asyncHandler(async (req, res) => {
  console.log('POST /recommendations - Request body:', req.body);
  console.log('POST /recommendations - User:', req.user);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('POST /recommendations - Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { name, description, isPrivate, password, tags } = req.body;

  // Validate password for private lists
  if (isPrivate && !password) {
    console.log('POST /recommendations - Private list missing password');
    return res.status(400).json({
      success: false,
      message: 'Password is required for private lists'
    });
  }

  // For public lists, ensure isPrivate is explicitly false
  const listIsPrivate = isPrivate === true;

  // Create recommendation list
  console.log('POST /recommendations - Creating list with data:', {
    name, description, creator: req.user._id, isPrivate, password: !!password, tags
  });
  
  const recommendationList = await RecommendationList.create({
    name,
    description: description || '',
    creator: req.user._id,
    isPrivate: listIsPrivate,
    password: listIsPrivate ? password : undefined,
    tags: tags || []
  });
  
  console.log('POST /recommendations - List created:', recommendationList);

  res.status(201).json({
    success: true,
    message: 'Recommendation list created successfully',
    data: {
      list: recommendationList.getPublicData()
    }
  });
}));

/**
 * @route   GET /api/recommendations
 * @desc    Get user's recommendation lists
 * @access  Private
 */
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const lists = await RecommendationList.findByCreator(req.user._id, true)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);

  const total = await RecommendationList.countDocuments({ creator: req.user._id });

  res.json({
    success: true,
    data: {
      lists: lists.map(list => list.getPublicData()),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
}));

/**
 * @route   GET /api/recommendations/public
 * @desc    Get public recommendation lists (excluding user's own lists)
 * @access  Private
 */
router.get('/public', protect, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Exclude the current user's own lists from public lists
  const lists = await RecommendationList.find({ 
    isPrivate: false, 
    isActive: true,
    creator: { $ne: req.user._id }  // Exclude current user's lists
  })
    .populate('creator', 'name username profilePicture')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);

  const total = await RecommendationList.countDocuments({ 
    isPrivate: false, 
    isActive: true,
    creator: { $ne: req.user._id }  // Exclude current user's lists from count
  });

  res.json({
    success: true,
    data: {
      lists: lists.map(list => list.getPublicData()),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
}));

/**
 * @route   GET /api/recommendations/search
 * @desc    Search all recommendation lists (public and private from other users)
 * @access  Private
 */
router.get('/search', protect, asyncHandler(async (req, res) => {
  const { q: query, limit = 20 } = req.query;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  // Search both public and private lists from other users, including by creator name/username
  const lists = await RecommendationList.find({
    $and: [
      {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      },
      { creator: { $ne: req.user._id } }, // Exclude current user's lists
      { isActive: true }
    ]
  })
    .populate('creator', 'name username profilePicture')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  // Also search by creator name/username
  const User = require('../models/User');
  const usersByName = await User.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { username: { $regex: query, $options: 'i' } }
    ],
    _id: { $ne: req.user._id }
  }).select('_id');

  const userIds = usersByName.map(user => user._id);
  
  const listsByCreator = await RecommendationList.find({
    $and: [
      { creator: { $in: userIds } },
      { isActive: true }
    ]
  })
    .populate('creator', 'name username profilePicture')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  // Combine and deduplicate results
  const allLists = [...lists, ...listsByCreator];
  const uniqueLists = allLists.filter((list, index, self) => 
    index === self.findIndex(l => l._id.toString() === list._id.toString())
  ).slice(0, parseInt(limit));

  res.json({
    success: true,
    data: {
      lists: uniqueLists.map(list => list.getPublicData()),
      query
    }
  });
}));

/**
 * @route   GET /api/recommendations/user/:username
 * @desc    Get all lists by username (public and private)
 * @access  Private
 */
router.get('/user/:username', protect, asyncHandler(async (req, res) => {
  const { username } = req.params;
  
  // Find user by username
  const User = require('../models/User');
  const targetUser = await User.findOne({ username }).select('_id name username profilePicture');
  
  if (!targetUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Get all lists by this user
  const lists = await RecommendationList.find({
    creator: targetUser._id,
    isActive: true
  })
    .populate('creator', 'name username profilePicture')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: {
      user: targetUser,
      lists: lists.map(list => list.getPublicData())
    }
  });
}));

/**
 * @route   GET /api/recommendations/:id
 * @desc    Get recommendation list by ID (with password support for private lists)
 * @access  Private
 */
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const { password } = req.query;
  
  console.log('GET /recommendations/:id - Request params:', req.params);
  console.log('GET /recommendations/:id - Query password:', password ? `[PASSWORD: ${password}]` : '[NO PASSWORD]');
  console.log('GET /recommendations/:id - User ID:', req.user._id);
  
  const list = await RecommendationList.findById(req.params.id)
    .select('+password') // Include password field for comparison
    .populate('creator', 'name username profilePicture')
    .populate('items.addedBy', 'name username');

  if (!list) {
    console.log('GET /recommendations/:id - List not found');
    return res.status(404).json({
      success: false,
      message: 'Recommendation list not found'
    });
  }

  console.log('GET /recommendations/:id - Found list:', {
    id: list._id,
    name: list.name,
    isPrivate: list.isPrivate,
    creator: list.creator._id,
    hasPassword: !!list.password
  });

  // Check if user is the creator
  const isCreator = list.creator._id.toString() === req.user._id.toString();
  console.log('GET /recommendations/:id - Is creator:', isCreator);

  // If it's a private list and user is not the creator
  if (list.isPrivate && !isCreator) {
    console.log('GET /recommendations/:id - Private list, checking password');
    console.log('GET /recommendations/:id - Has stored password:', !!list.password);
    console.log('GET /recommendations/:id - Provided password:', password ? '[PROVIDED]' : '[MISSING]');
    
    // Check if password is provided
    if (!password) {
      console.log('GET /recommendations/:id - No password provided');
      return res.status(401).json({
        success: false,
        message: 'Password required for private list',
        requiresPassword: true
      });
    }
    
    // Use the checkPassword method to compare hashed password
    const isPasswordValid = await list.checkPassword(password);
    console.log('GET /recommendations/:id - Password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('GET /recommendations/:id - Password validation failed');
      return res.status(401).json({
        success: false,
        message: 'Password required for private list',
        requiresPassword: true
      });
    }
    console.log('GET /recommendations/:id - Password correct, granting access');
  }

  // Increment view count if user is not the creator
  if (!isCreator) {
    list.viewCount += 1;
    await list.save();
  }

  res.json({
    success: true,
    data: {
      list: list.getPublicData()
    }
  });
}));

/**
 * @route   PUT /api/recommendations/:id
 * @desc    Update recommendation list
 * @access  Private (owner only)
 */
router.put('/:id', checkOwnership(RecommendationList), [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('List name must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters'),
  
  body('isPrivate')
    .optional()
    .isBoolean()
    .withMessage('isPrivate must be a boolean'),
  
  body('password')
    .optional()
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters long'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { name, description, isPrivate, password, tags } = req.body;
  const updateFields = {};

  if (name !== undefined) updateFields.name = name;
  if (description !== undefined) updateFields.description = description;
  if (isPrivate !== undefined) updateFields.isPrivate = isPrivate;
  if (tags !== undefined) updateFields.tags = tags;

  // Handle password for private lists
  if (isPrivate && password) {
    updateFields.password = password;
  } else if (isPrivate && !password && req.resource.isPrivate) {
    // Keep existing password if list is already private and no new password provided
  } else if (isPrivate && !password) {
    return res.status(400).json({
      success: false,
      message: 'Password is required for private lists'
    });
  }

  const updatedList = await RecommendationList.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { new: true, runValidators: true }
  ).populate('creator', 'name username profilePicture');

  res.json({
    success: true,
    message: 'Recommendation list updated successfully',
    data: {
      list: updatedList.getPublicData()
    }
  });
}));

/**
 * @route   DELETE /api/recommendations/:id
 * @desc    Delete recommendation list
 * @access  Private (owner only)
 */
router.delete('/:id', checkOwnership(RecommendationList), asyncHandler(async (req, res) => {
  await RecommendationList.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Recommendation list deleted successfully'
  });
}));

/**
 * @route   POST /api/recommendations/:id/items
 * @desc    Add item to recommendation list
 * @access  Private (owner only)
 */
router.post('/:id/items', checkOwnership(RecommendationList), [
  body('imdbId')
    .notEmpty()
    .withMessage('IMDB ID is required'),
  
  body('title')
    .notEmpty()
    .withMessage('Title is required'),
  
  body('type')
    .optional()
    .isIn(['movie', 'series', 'episode'])
    .withMessage('Type must be movie, series, or episode'),
  
  body('poster')
    .optional(),
  
  body('year')
    .optional(),
  
  body('plot')
    .optional(),
  
  body('genre')
    .optional(),
  
  body('imdbRating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be between 0 and 10'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Notes cannot be more than 200 characters')
], asyncHandler(async (req, res) => {
  console.log('POST /recommendations/:id/items - Request body:', req.body);
  console.log('POST /recommendations/:id/items - User:', req.user);
  console.log('POST /recommendations/:id/items - List ID:', req.params.id);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('POST /recommendations/:id/items - Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const itemData = {
    ...req.body,
    addedBy: req.user._id
  };

  console.log('POST /recommendations/:id/items - Adding item data:', itemData);
  
  try {
    await req.resource.addItem(itemData, req.user._id);
    console.log('POST /recommendations/:id/items - Item added successfully');

    const updatedList = await RecommendationList.findById(req.params.id)
      .populate('creator', 'name username profilePicture')
      .populate('items.addedBy', 'name username');

    res.json({
      success: true,
      message: 'Item added to recommendation list',
      data: {
        list: updatedList.getPublicData()
      }
    });
  } catch (error) {
    console.error('POST /recommendations/:id/items - Error adding item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to list',
      error: error.message
    });
  }
}));

/**
 * @route   DELETE /api/recommendations/:id/items/:itemId
 * @desc    Remove item from recommendation list
 * @access  Private (owner only)
 */
router.delete('/:id/items/:itemId', checkOwnership(RecommendationList), asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  console.log('DELETE /recommendations/:id/items/:itemId - Removing item with ID:', itemId);
  
  await req.resource.removeItem(itemId);

  const updatedList = await RecommendationList.findById(req.params.id)
    .populate('creator', 'name username profilePicture')
    .populate('items.addedBy', 'name username');

  res.json({
    success: true,
    message: 'Item removed from recommendation list',
    data: {
      list: updatedList.getPublicData()
    }
  });
}));

/**
 * @route   POST /api/recommendations/:id/like
 * @desc    Like a recommendation list
 * @access  Private
 */
router.post('/:id/like', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const list = await RecommendationList.findById(id);
  if (!list) {
    return res.status(404).json({
      success: false,
      message: 'Recommendation list not found'
    });
  }

  if (!list.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Recommendation list not found'
    });
  }

  // Check if user is not the creator
  if (list.creator.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot like your own list'
    });
  }

  // Increment like count
  list.likeCount += 1;
  await list.save();

  res.json({
    success: true,
    message: 'List liked successfully',
    data: {
      likeCount: list.likeCount
    }
  });
}));

module.exports = router;
