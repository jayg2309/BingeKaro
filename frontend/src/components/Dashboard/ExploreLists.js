import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendationsAPI } from '../../services/api';
import ListCard from './ListCard';
import PasswordModal from './PasswordModal';
import { useAuth } from '../../contexts/AuthContext';

const ExploreLists = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [hasExplored, setHasExplored] = useState(false);

  // Remove auto-fetch on mount

  const fetchPublicLists = async () => {
    try {
      setLoading(true);
      const response = await recommendationsAPI.getPublicLists();
      setLists(response.data.data.lists);
    } catch (err) {
      setError('Failed to fetch public lists');
      console.error('Error fetching public lists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExplore = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await recommendationsAPI.getPublicLists();
      setLists(response.data.data.lists);
      setHasExplored(true);
    } catch (err) {
      setError('Failed to fetch public lists');
      console.error('Error fetching public lists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      if (hasExplored) {
        fetchPublicLists();
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await recommendationsAPI.searchLists(searchQuery);
      setLists(response.data.data.lists);
      setHasExplored(true);
    } catch (err) {
      setError('Failed to search lists');
      console.error('Error searching lists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleListClick = (list) => {
    if (list.isPrivate) {
      setSelectedList(list);
      setShowPasswordModal(true);
    } else {
      // Navigate to public list
      window.location.href = `/dashboard/list/${list._id}`;
    }
  };

  const handlePasswordSubmit = (password) => {
    // Navigate to private list with password
    window.location.href = `/dashboard/list/${selectedList._id}?password=${encodeURIComponent(password)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">{error}</div>
        <button
          onClick={() => {
            if (searchQuery.trim()) {
              handleSearch();
            } else {
              handleExplore();
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Explore Lists</h1>
        <p className="text-gray-300 mb-6">
          Search for specific lists or explore all public recommendations
        </p>

        {/* Search and Explore Controls */}
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search lists by name, description, tags, or creator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  if (hasExplored) {
                    fetchPublicLists();
                  } else {
                    setLists([]);
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          
          {/* Explore Button */}
          {!hasExplored && !searchQuery && (
            <div className="text-center">
              <button
                onClick={handleExplore}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Explore All Public Lists
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lists Grid */}
      {!hasExplored && !searchQuery ? (
        <div className="text-center py-16">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Discover Amazing Lists</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Search for specific lists by name, tags, or creator, or explore all public lists to discover new recommendations.
          </p>
        </div>
      ) : lists.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchQuery ? 'No lists found' : 'No public lists available'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery 
              ? 'Try searching with different keywords.' 
              : 'Be the first to create a public list!'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {lists.map((list) => (
            <div
              key={list._id}
              onClick={() => handleListClick(list)}
              className="cursor-pointer"
            >
              <ListCard 
                list={list} 
                showActions={false} 
                showCreator={true}
                currentUser={user}
                onCreatorClick={(username) => navigate(`/dashboard/user/${username}`)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && selectedList && (
        <PasswordModal
          list={selectedList}
          onClose={() => {
            setShowPasswordModal(false);
            setSelectedList(null);
          }}
          onSubmit={handlePasswordSubmit}
        />
      )}
    </div>
  );
};

export default ExploreLists;
