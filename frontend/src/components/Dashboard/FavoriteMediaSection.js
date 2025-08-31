import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MediaSearchModal from './MediaSearchModal';
import { omdbService } from '../../services/omdbAPI';

const FavoriteMediaSection = () => {
  const { user, addToFavorites, removeFromFavorites } = useAuth();
  const [activeCategory, setActiveCategory] = useState('movies');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'movies', name: 'Movies', key: 'favoriteMovies' },
    { id: 'series', name: 'Series', key: 'favoriteSeries' },
    { id: 'anime', name: 'Anime', key: 'favoriteAnime' }
  ];

  const getCurrentFavorites = () => {
    const category = categories.find(cat => cat.id === activeCategory);
    return user?.[category.key] || [];
  };

  const handleAddToFavorites = async (mediaItem) => {
    try {
      setLoading(true);
      
      // Format the media item for our backend using OMDB service
      const formattedItem = omdbService.formatForBackend(mediaItem);

      await addToFavorites(activeCategory, formattedItem);
      setShowSearchModal(false);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (imdbId) => {
    if (!window.confirm('Remove this item from your favorites?')) return;

    try {
      setLoading(true);
      await removeFromFavorites(activeCategory, imdbId);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const favorites = getCurrentFavorites();

  return (
    <div>
      <h3 className="text-lg font-medium text-text-primary mb-6">Favorite Media</h3>
      
      {/* Category Tabs */}
      <div className="border-b border-dark-border mb-6">
        <nav className="-mb-px flex space-x-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeCategory === category.id
                  ? 'border-accent-primary text-accent-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-dark-border'
              }`}
            >
              {category.name} ({user?.[category.key]?.length || 0})
            </button>
          ))}
        </nav>
      </div>

      {/* Add Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowSearchModal(true)}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-primary hover:bg-accent-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add {categories.find(cat => cat.id === activeCategory)?.name.slice(0, -1)}
        </button>
      </div>

      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {favorites.map((item) => (
            <div key={item.tmdbId || item.imdbId} className="group relative">
              <div className="aspect-[2/3] bg-dark-primary rounded-lg overflow-hidden">
                {item.posterPath ? (
                  <img
                    src={item.posterPath}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-dark-primary">
                    <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V3a1 1 0 00-1 1v14a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1m-9 0V3a1 1 0 011-1h8a1 1 0 011 1v1" />
                    </svg>
                  </div>
                )}
                
                {/* Remove button */}
                <button
                  onClick={() => handleRemoveFavorite(item.imdbId)}
                  disabled={loading}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  title="Remove from favorites"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-2">
                <h4 className="text-sm font-medium text-text-primary truncate" title={item.title}>
                  {item.title}
                </h4>
                {item.genre && item.genre.length > 0 && (
                  <p className="text-xs text-text-muted truncate">
                    {Array.isArray(item.genre) ? item.genre.slice(0, 2).join(', ') : item.genre}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-text-primary">No favorites yet</h3>
          <p className="mt-1 text-sm text-text-secondary">
            Add your favorite {categories.find(cat => cat.id === activeCategory)?.name.toLowerCase()} to keep track of what you love.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowSearchModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-accent-primary hover:bg-accent-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add First Favorite
            </button>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <MediaSearchModal
          onClose={() => setShowSearchModal(false)}
          onSelect={handleAddToFavorites}
        />
      )}
    </div>
  );
};

export default FavoriteMediaSection;
