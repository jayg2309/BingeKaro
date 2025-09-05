const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const searchRoutes = require('./routes/search');
const recommendationRoutes = require('./routes/recommendations');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Define allowed origins for both production and development
    const productionOrigins = [
      'https://binge-karo.vercel.app',
      'https://www.binge-karo.vercel.app',
      'https://binge-karo-git-main.vercel.app',
      'https://binge-karo-git-develop.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    const developmentOrigins = ['http://localhost:3000'];
    
    // Check if we're in production (either NODE_ENV=production or if we're on Render)
    const isProduction = process.env.NODE_ENV === 'production' || 
                        process.env.RENDER || 
                        process.env.NODE_ENV === 'development' && origin?.includes('vercel.app');
    
    const allowedOrigins = isProduction ? productionOrigins : developmentOrigins;
    
    console.log('CORS Origin check:', { 
      origin, 
      allowedOrigins, 
      isProduction,
      NODE_ENV: process.env.NODE_ENV,
      RENDER: process.env.RENDER
    });
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// If you're still having CORS issues, temporarily use this more permissive configuration:
// Uncomment the lines below and comment out the corsOptions above to use this:
/*
const corsOptions = {
  origin: true, // Allow all origins temporarily for debugging
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};
*/

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, {
    origin: req.get('origin'),
    userAgent: req.get('user-agent'),
    headers: req.headers
  });
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'BingeKaro API is running',
    timestamp: new Date().toISOString(),
    origin: req.get('origin'),
    headers: req.headers
  });
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    message: 'Test endpoint working',
    origin: req.get('origin'),
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 BingeKaro server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();

module.exports = app;
