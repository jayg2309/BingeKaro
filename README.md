# BingeKaro

A full-stack MERN application for personalized movie, series, and anime recommendations. Create and share your favorite lists with the world!

## 🌟 Features

### 🔐 User Authentication & Dashboard
- Secure user registration and login with JWT tokens
- Password hashing with bcrypt
- **New Dashboard-based UI** with intuitive sidebar navigation
- After login, users are taken directly to their personalized dashboard

### 👤 User Profile Management
- Upload and manage profile pictures with drag & drop
- Edit personal information (name, username, bio)
- Change passwords securely
- **Enhanced Favorite Media Management** - organize movies, series, and anime separately
- Username availability checking in real-time

### 🔍 Enhanced Search & Discovery
- **OMDB API Integration** for comprehensive movie and TV show data
- Real-time search with instant results
- High-quality posters and detailed metadata
- Genre-based categorization and IMDB ratings

### 📄 Advanced Recommendation Lists
- **Intuitive List Management** - create lists with public/private visibility
- **Password-protected Private Lists** for exclusive sharing
- **Visual Media Cards** with posters, ratings, and genre tags
- **Smooth Add/Remove Flow** with OMDB search integration
- **Explore Public Lists** created by other users
- View counts and engagement metrics

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

### External APIs
- **OMDB API** - Comprehensive movie, TV show, and anime data with high-quality images

## 📁 Project Structure

```
BingeKaro/
├── backend/                 # Backend server
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── uploads/            # File uploads
│   └── server.js           # Main server file
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── App.js          # Main app component
│   └── public/             # Static files
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- OMDB API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BingeKaro
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**

   Create `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/bingekaro
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   
   # OMDB API Configuration
   OMDB_API_KEY=your_omdb_api_key_here
   OMDB_BASE_URL=http://www.omdbapi.com
   
   # File Upload Configuration
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Get OMDB API Key**
   - Visit [OMDB](http://www.omdbapi.com/apikey.aspx)
   - Create an account and request an API key
   - Add the API key to your backend `.env` file
   
   Create `.env` file in the frontend directory:
   ```env
   # OMDB API Configuration
   REACT_APP_OMDB_API_KEY=your_omdb_api_key_here
   
   # Backend API URL (if different from default)
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start the application**
   ```bash
   # From the root directory
   npm run dev
   
   # Or start separately:
   # Backend (from backend directory)
   npm run dev
   
   # Frontend (from frontend directory)
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Change password
- `POST /api/users/profile-picture` - Upload profile picture
- `DELETE /api/users/profile-picture` - Remove profile picture

### Search Endpoints
- `GET /api/search` - Search media
- `GET /api/search/movies/:id` - Get movie details
- `GET /api/search/tv/:id` - Get TV show details
- `GET /api/search/popular/movies` - Get popular movies
- `GET /api/search/popular/tv` - Get popular TV shows
- `GET /api/search/anime` - Get anime

### Recommendations Endpoints
- `POST /api/recommendations` - Create recommendation list
- `GET /api/recommendations` - Get user's lists
- `GET /api/recommendations/public` - Get public lists
- `GET /api/recommendations/:id` - Get list by ID
- `PUT /api/recommendations/:id` - Update list
- `DELETE /api/recommendations/:id` - Delete list

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon
```

### Frontend Development
```bash
cd frontend
npm start    # Start development server
```

### Database
The application uses MongoDB. Make sure MongoDB is running locally or update the connection string in the `.env` file.

## 🚀 Deployment

### Backend Deployment
1. Set up a MongoDB database (Atlas recommended)
2. Deploy to your preferred platform (Heroku, Vercel, etc.)
3. Set environment variables
4. Ensure file upload directory is writable

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `build` folder to your hosting platform
3. Update API base URL in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [OMDB API](http://www.omdbapi.com/) for providing the movie and TV show data
- [Lucide](https://lucide.dev/) for the beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ for the movie and TV show community!
