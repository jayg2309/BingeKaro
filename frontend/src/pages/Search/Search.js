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
    <div className="group relative overflow-hidden rounded-lg bg-gray-800 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="aspect-[2/3] relative">
        {media.posterPath ? (
          <img
            src={apiUtils.getImageUrl(media.posterPath, 'w342')}
            alt={media.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <Film className="w-12 h-12 text-gray-500" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-100 group-hover:text-indigo-400 transition-colors line-clamp-2">
          {media.title || media.name}
        </h3>
        {media.releaseDate && (
          <p className="text-sm text-gray-400 mt-1">
            {apiUtils.formatDate(media.releaseDate || media.first_air_date)}
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-100">Search</h1>
          
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for movies, TV shows..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSearchType(searchType === 'movie' ? '' : 'movie')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${searchType === 'movie' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  <Film className="h-4 w-4" />
                  Movies
                </button>
                <button
                  type="button"
                  onClick={() => setSearchType(searchType === 'tv' ? '' : 'tv')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${searchType === 'tv' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  <Tv className="h-4 w-4" />
                  TV Shows
                </button>
              </div>
              
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <SearchIcon className="h-4 w-4" />
                Search
              </button>
            </div>
          </form>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : searchResults ? (
            <div className="mt-8">
              {searchResults.data?.results?.length > 0 ? (
                <>
                  <h2 className="text-2xl font-semibold mb-6 text-gray-100">
                    Search Results ({searchResults.data?.totalResults || 0})
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {searchResults.data.results.map((media) => (
                      <MediaCard key={media.imdbId} media={media} type={media.mediaType} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <SearchIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No results found for "{query}"</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <SearchIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Enter a search term to find movies, TV shows, or anime</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
