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
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl">
          Discover & Share Your Favorite
          <span className="block text-indigo-400 mt-2">Movies & TV Shows</span>
        </h1>
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

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-indigo-400">10K+</div>
            <div className="text-gray-400">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-400">50K+</div>
            <div className="text-gray-400">Watchlists</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-400">1M+</div>
            <div className="text-gray-400">Recommendations</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-400">24/7</div>
            <div className="text-gray-400">Community Support</div>
          </div>
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
      </div>
    </div>
  );
};

export default Home;
