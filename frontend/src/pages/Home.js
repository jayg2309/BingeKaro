import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { searchAPI, apiUtils } from '../services/api';
import { 
  Search, 
  Heart, 
  Star, 
  Play, 
  ArrowRight,
  Film,
  Tv,
  Zap
} from 'lucide-react';
import Layout from '../components/Layout/Layout';

const Home = () => {
  const { user } = useAuth();

  // Fetch trending content
  const { data: trendingData, isLoading: trendingLoading } = useQuery(
    ['trending'],
    () => searchAPI.getTrending('week', 1),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Fetch popular movies
  const { data: moviesData, isLoading: moviesLoading } = useQuery(
    ['popular-movies'],
    () => searchAPI.getPopularMovies(1),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch popular TV shows
  const { data: tvData, isLoading: tvLoading } = useQuery(
    ['popular-tv'],
    () => searchAPI.getPopularTVShows(1),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  const MediaCard = ({ media, type }) => (
    <Link
      to={`/media/${type}/${media.imdbId}`}
      className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="aspect-[2/3] relative">
        {media.posterPath ? (
          <img
            src={apiUtils.getImageUrl(media.posterPath, 'w342')}
            alt={media.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-secondary-200 flex items-center justify-center">
            <Film className="w-12 h-12 text-secondary-400" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Play className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Rating */}
        {media.rating && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{apiUtils.formatRating(media.rating)}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-2">
          {media.title}
        </h3>
        {media.releaseDate && (
          <p className="text-sm text-secondary-600 mt-1">
            {apiUtils.formatDate(media.releaseDate)}
          </p>
        )}
      </div>
    </Link>
  );

  const MediaSection = ({ title, data, loading, type, icon: Icon }) => {
    if (loading) {
      return (
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Icon className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-secondary-900">{title}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-secondary-200 rounded-lg mb-2"></div>
                <div className="h-4 bg-secondary-200 rounded mb-1"></div>
                <div className="h-3 bg-secondary-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-secondary-900">{title}</h2>
          </div>
          <Link
            to={`/search?type=${type}`}
            className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                     {data?.results?.slice(0, 6).map((media) => (
             <MediaCard key={media.imdbId} media={media} type={type} />
           ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Next
              <span className="block text-accent-300">Binge-Worthy</span>
              Entertainment
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Personalized movie, series, and anime recommendations tailored just for you.
              Create and share your favorite lists with the world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="inline-flex items-center justify-center space-x-2 bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                <Search className="w-5 h-5" />
                <span>Start Exploring</span>
              </Link>
              
              {!user && (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center space-x-2 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span>Join BingeKaro</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trending Now */}
        <MediaSection
          title="Trending Now"
          data={trendingData}
          loading={trendingLoading}
          type="movie"
          icon={Zap}
        />

        {/* Popular Movies */}
        <MediaSection
          title="Popular Movies"
          data={moviesData}
          loading={moviesLoading}
          type="movie"
          icon={Film}
        />

        {/* Popular TV Shows */}
        <MediaSection
          title="Popular TV Shows"
          data={tvData}
          loading={tvLoading}
          type="tv"
          icon={Tv}
        />

        {/* Features Section */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
            Why Choose BingeKaro?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Smart Discovery
              </h3>
              <p className="text-secondary-600">
                Find your next favorite movie, series, or anime with our intelligent search and recommendation system.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Personalized Lists
              </h3>
              <p className="text-secondary-600">
                Create and share your own recommendation lists. Make them public or keep them private with password protection.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Community Driven
              </h3>
              <p className="text-secondary-600">
                Discover recommendations from other users and share your favorites with the BingeKaro community.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!user && (
          <section className="mt-20 bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already discovering amazing content on BingeKaro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center space-x-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center space-x-2 border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                <span>Sign In</span>
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
