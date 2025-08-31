import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, Star, Play, Tv, Film } from 'lucide-react';
import Layout from '../components/Layout/Layout';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleExploreClick = (e) => {
    e.preventDefault();
    if (!user) {
      // Store the intended destination before redirecting to login
      sessionStorage.setItem('redirectAfterLogin', '/explore');
      navigate('/login');
    } else {
      navigate('/explore');
    }
  };

  const handleGetStartedClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header with Auth Buttons */}
      <header className="absolute top-0 right-0 p-6 z-10">
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
              >
                Sign up
              </Link>
            </>
          ) : (
            <Link
              to="/dashboard"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </header>

      {/* Project Name */}
      <div className="pt-12 text-center">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          BingeKaro
        </h1>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl">
          Discover & Share Your Favorite
          <span className="block text-indigo-400 mt-2">Movies & TV Shows</span>
        </h2>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl">
          Create, explore, and share personalized watchlists with the BingeKaro community.
          Find your next binge-worthy obsession today!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleGetStartedClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Get started free
          </button>
          <button
            onClick={handleExploreClick}
            className="bg-transparent hover:bg-gray-800 text-white font-semibold py-3 px-8 border border-gray-600 rounded-lg transition-colors duration-200"
          >
            Explore lists
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Features Section */}
        <div className="py-16 bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose BingeKaro?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Smart Discovery
                </h3>
                <p className="text-gray-300">
                  Find your next favorite movie, series, or anime with our intelligent search and recommendation system.
                </p>
              </div>
              
              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Personalized Lists
                </h3>
                <p className="text-gray-300">
                  Create and share your own recommendation lists. Make them public or keep them private with password protection.
                </p>
              </div>
              
              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <Tv className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Community Driven
                </h3>
                <p className="text-gray-300">
                  Discover recommendations from other users and share your favorites with the BingeKaro community.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">1</div>
                <div className="bg-gray-800 p-6 rounded-lg h-full border-l-4 border-indigo-500">
                  <h3 className="text-xl font-semibold mb-3">Create an Account</h3>
                  <p className="text-gray-300">
                    Sign up for free and join our growing community of entertainment enthusiasts.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">2</div>
                <div className="bg-gray-800 p-6 rounded-lg h-full border-l-4 border-indigo-500">
                  <h3 className="text-xl font-semibold mb-3">Build Your Watchlist</h3>
                  <p className="text-gray-300">
                    Add movies and shows you love or want to watch to your personal collection.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">3</div>
                <div className="bg-gray-800 p-6 rounded-lg h-full border-l-4 border-indigo-500">
                  <h3 className="text-xl font-semibold mb-3">Share & Discover</h3>
                  <p className="text-gray-300">
                    Share your lists with friends and discover new content from the community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
