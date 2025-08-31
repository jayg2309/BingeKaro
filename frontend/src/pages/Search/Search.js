import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { searchAPI, apiUtils } from '../../services/api';
import { Search as SearchIcon, Film, Tv, Zap } from 'lucide-react';
import Layout from '../../components/Layout/Layout';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('');

  const { data: searchResults, isLoading, refetch } = useQuery(
    ['search', query, searchType],
    () => searchAPI.search(query, searchType, 1),
    {
      enabled: false,
      staleTime: 5 * 60 * 1000,
    }
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      refetch();
    }
  };

  const MediaCard = ({ media, type }) => (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
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
        {media.rating && (
          <p className="text-sm text-secondary-600 mt-1">
            ⭐ {apiUtils.formatRating(media.rating)}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-secondary-900 mb-8">Search</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for movies, TV shows, or anime..."
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="movie">Movies</option>
              <option value="series">TV Shows</option>
              <option value="episode">Episodes</option>
            </select>
            
            <button
              type="submit"
              disabled={!query.trim()}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <SearchIcon className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Search Results */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-secondary-600">Searching...</p>
          </div>
        )}

        {searchResults && !isLoading && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-secondary-900">
                Search Results ({searchResults.data?.totalResults || 0})
              </h2>
            </div>
            
            {searchResults.data?.results?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {searchResults.data.results.map((media) => (
                  <MediaCard key={media.imdbId} media={media} type={media.mediaType} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                <p className="text-secondary-600">No results found for "{query}"</p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!searchResults && !isLoading && (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-600">Enter a search term to find movies, TV shows, or anime</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
