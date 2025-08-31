const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic user information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot be more than 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  
  // Profile information
  profilePicture: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters'],
    default: ''
  },
  
  // Favorite media preferences
  favoriteMovies: [{
    imdbId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    year: String,
    poster: String,
    genre: String,
    imdbRating: Number,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  favoriteSeries: [{
    imdbId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    year: String,
    poster: String,
    genre: String,
    imdbRating: Number,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  favoriteAnime: [{
    imdbId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    year: String,
    poster: String,
    genre: String,
    imdbRating: Number,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Account status and verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Timestamps
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Index for better query performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ 'favoriteMovies.imdbId': 1 });
userSchema.index({ 'favoriteSeries.imdbId': 1 });
userSchema.index({ 'favoriteAnime.imdbId': 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  
  delete userObject.password;
  delete userObject.__v;
  
  return userObject;
};

// Static method to find user by username or email
userSchema.statics.findByUsernameOrEmail = function(identifier) {
  return this.findOne({
    $or: [
      { username: identifier.toLowerCase() },
      { email: identifier.toLowerCase() }
    ]
  });
};

module.exports = mongoose.model('User', userSchema);
