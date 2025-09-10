const mongoose = require('mongoose');

const recommendationListSchema = new mongoose.Schema({
  // Basic list information
  name: {
    type: String,
    required: [true, 'List name is required'],
    trim: true,
    maxlength: [100, 'List name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
    default: ''
  },
  
  // Creator information
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Privacy settings
  isPrivate: {
    type: Boolean,
    default: false
  }, 
  password: {
    type: String,
    required: function() {
      return this.isPrivate;
    },
    select: false // Don't include password in queries by default
  },
  
  // List items (movies, series, anime)
  items: [{
    imdbId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    year: String,
    type: {
      type: String,
      enum: ['movie', 'series', 'anime'],
      required: true
    },
    poster: String,
    genre: String,
    plot: String,
    imdbRating: Number,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    notes: {
      type: String,
      maxlength: [200, 'Notes cannot be more than 200 characters']
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // List metadata
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot be more than 20 characters']
  }],
  
  // Statistics
  viewCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Indexes for better query performance
recommendationListSchema.index({ creator: 1 });
recommendationListSchema.index({ isPrivate: 1 });
recommendationListSchema.index({ 'items.imdbId': 1 });
recommendationListSchema.index({ 'items.type': 1 });
recommendationListSchema.index({ tags: 1 });
recommendationListSchema.index({ createdAt: -1 });
recommendationListSchema.index({ viewCount: -1 });
recommendationListSchema.index({ likeCount: -1 });

// Text index for search functionality
recommendationListSchema.index({
  name: 'text',
  description: 'text',
  'items.title': 'text',
  tags: 'text'
});

// Pre-save middleware to hash password if list is private
recommendationListSchema.pre('save', async function(next) {
  if (this.isPrivate && this.isModified('password')) {
    const bcrypt = require('bcryptjs');
    try {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Instance method to check password for private lists
recommendationListSchema.methods.checkPassword = async function(enteredPassword) {
  if (!this.isPrivate) return true;
  
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to add item to list
recommendationListSchema.methods.addItem = function(itemData, userId) {
  const newItem = {
    ...itemData,
    addedBy: userId,
    addedAt: new Date()
  };
  
  this.items.push(newItem);
  return this.save();
};

// Instance method to remove item from list by item ID
recommendationListSchema.methods.removeItem = function(itemId) {
  console.log('RecommendationList.removeItem - Before removal:', this.items.length, 'items');
  console.log('RecommendationList.removeItem - Removing item with ID:', itemId);
  
  const itemToRemove = this.items.find(item => item._id.toString() === itemId.toString());
  if (itemToRemove) {
    console.log('RecommendationList.removeItem - Found item to remove:', { 
      id: itemToRemove._id, 
      imdbId: itemToRemove.imdbId, 
      type: itemToRemove.type, 
      title: itemToRemove.title 
    });
  }
  
  this.items = this.items.filter(item => item._id.toString() !== itemId.toString());
  
  console.log('RecommendationList.removeItem - After removal:', this.items.length, 'items');
  return this.save();
};

// Instance method to get public list data (without sensitive information)
recommendationListSchema.methods.getPublicData = function() {
  const listObject = this.toObject();
  
  if (this.isPrivate) {
    delete listObject.password;
  }
  
  delete listObject.__v;
  return listObject;
};

// Static method to find lists by creator
recommendationListSchema.statics.findByCreator = function(creatorId, includePrivate = false) {
  const query = { creator: creatorId, isActive: true };
  
  if (!includePrivate) {
    query.isPrivate = false;
  }
  
  return this.find(query).populate('creator', 'name username profilePicture');
};

// Static method to find public lists
recommendationListSchema.statics.findPublic = function(limit = 20, skip = 0) {
  return this.find({ 
    isPrivate: false, 
    isActive: true 
  })
  .populate('creator', 'name username profilePicture')
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip);
};

// Static method to search lists
recommendationListSchema.statics.search = function(searchTerm, limit = 20) {
  return this.find({
    $text: { $search: searchTerm },
    isPrivate: false,
    isActive: true
  })
  .populate('creator', 'name username profilePicture')
  .sort({ score: { $meta: 'textScore' } })
  .limit(limit);
};

module.exports = mongoose.model('RecommendationList', recommendationListSchema);
