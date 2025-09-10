import React, { useState, useEffect } from 'react';
import { omdbService } from '../../services/omdbAPI';

const MediaSearchModal = ({ onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('multi');
  const [genres, setGenres] = useState({ movie: [], tv: [] });

  useEffect(() => {
    // Load genres on component mount
    loadGenres();
  }, []);

  const loadGenres = async () => {
    // OMDB doesn't have separate genre endpoints, genres come with search results
    // We'll handle genres in the search results display
  };

  const searchMedia = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      let results;
      switch (selectedType) {
        case 'movie':
          results = await omdbService.searchMovies(searchQuery);
          break;
        case 'series':
          results = await omdbService.searchTV(searchQuery);
          break;
        default:
          results = await omdbService.search(searchQuery);
      }
      
      setSearchResults(results.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchMedia();
    }
  };

  const getMediaTypeLabel = (item) => {
    switch (item.type || item.Type) {
      case 'movie': return 'Movie';
      case 'series': return 'TV Series';
      case 'person': return 'Person';
      default: return 'Unknown';
    }
  };

  const handleSelectItem = (item) => {
    if (item.Type === 'person') return; // Don't allow selecting people
    
    console.log('MediaSearchModal: Selected item:', item);
    console.log('MediaSearchModal: Item imdbID:', item.imdbID);
    
    try {
      const formattedItem = omdbService.formatForBackend(item);
      console.log('MediaSearchModal: Formatted item:', formattedItem);
      onSelect(formattedItem);
    } catch (error) {
      console.error('MediaSearchModal: Error formatting item:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-black bg-opacity-80 transition-opacity" onClick={onClose}></div>
        
        <div className="relative transform overflow-hidden rounded-xl bg-gray-900 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl border border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900 to-blue-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold leading-6 text-white">
                Add Movie/Series/Anime
              </h3>
              <button
                type="button"
                className="rounded-md bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 p-2 transition-colors"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Controls */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search for movies, TV shows, anime..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="block w-full rounded-lg bg-gray-800 border-gray-600 text-white placeholder-gray-400 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm transition-colors"
                  />
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="rounded-lg bg-gray-800 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm transition-colors"
                >
                  <option value="multi">All</option>
                  <option value="movie">Movies</option>
                  <option value="series">TV Shows</option>
                </select>
                <button
                  onClick={() => searchMedia()}
                  disabled={loading || !searchQuery.trim()}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="px-4 pb-4 sm:px-6 sm:pb-6 bg-gray-900">
            {searchResults.length > 0 ? (
              <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <div className="grid grid-cols-1 gap-3">
                  {searchResults.map((item) => {
                    const isPerson = (item.type || item.Type) === 'person';
                    
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center space-x-4 p-4 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-750 hover:border-purple-500 transition-all duration-200 ${
                          isPerson ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'
                        }`}
                        onClick={() => !isPerson && handleSelectItem(item)}
                      >
                        {/* Poster */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-24 bg-gray-700 rounded-lg overflow-hidden shadow-md">
                            {item.poster_path ? (
                              <img
                                src={omdbService.getImageUrl(item.poster_path)}
                                alt={item.title || item.name}
                                className="w-16 h-24 object-cover rounded"
                                onError={(e) => {
                                  e.target.src = '/placeholder-poster.jpg';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V3a1 1 0 00-1 1v14a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1m-9 0V3a1 1 0 011-1h8a1 1 0 011 1v1" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-white truncate">
                                {item.title || item.name}
                              </h4>
                              <div className="mt-1 flex items-center space-x-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900 bg-opacity-50 text-blue-300">
                                  {getMediaTypeLabel(item)}
                                </span>
                                {item.year && (
                                  <span className="text-xs text-gray-400">
                                    {item.year}
                                  </span>
                                )}
                                {item.imdbRating && item.imdbRating !== 'N/A' && (
                                  <span className="text-xs text-yellow-400">
                                    ⭐ {item.imdbRating}
                                  </span>
                                )}
                              </div>
                              
                              {/* Genres */}
                              {item.genre && !isPerson && (
                                <div className="mt-1">
                                  <div className="flex flex-wrap gap-1">
                                    {omdbService.formatGenres(item.genre).map((genre, index) => (
                                      <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-900 bg-opacity-50 text-purple-300"
                                      >
                                        {genre.name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Overview */}
                              {item.overview && (
                                <p className="mt-2 text-xs text-gray-300 line-clamp-2">
                                  {item.overview}
                                </p>
                              )}
                            </div>
                            
                            {!isPerson && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectItem(item);
                                }}
                                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
                              >
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : searchQuery && !loading ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-16 w-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-white">No results found</h3>
                <p className="mt-2 text-sm text-gray-400">Try searching with different keywords or check your spelling.</p>
              </div>
            ) : !searchQuery ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-16 w-16 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-white">Search for media</h3>
                <p className="mt-2 text-sm text-gray-400">Enter a movie, TV show, or anime title to get started.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaSearchModal;
