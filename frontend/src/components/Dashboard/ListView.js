import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recommendationsAPI } from '../../services/api';
import { omdbService } from '../../services/omdbAPI';
import { useAuth } from '../../contexts/AuthContext';
import MediaSearchModal from './MediaSearchModal';
import PasswordModal from './PasswordModal';
import MediaCard from './MediaCard';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const ListView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchList();
  }, [id]);

  // Extract password from URL params for private list access
  const urlParams = new URLSearchParams(window.location.search);
  const passwordFromUrl = urlParams.get('password');

  const fetchList = async (listPassword = null) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use password from URL if available, otherwise use provided password
      const passwordToUse = listPassword || passwordFromUrl;
      
      console.log('ListView: Fetching list with ID:', id);
      console.log('ListView: Using password:', passwordToUse ? '[PASSWORD PROVIDED]' : '[NO PASSWORD]');
      
      const response = await recommendationsAPI.getListById(id, passwordToUse);
      console.log('ListView: List fetch response:', response.data);
      
      setList(response.data.data.list);
      setPasswordRequired(false);
    } catch (err) {
      console.error('ListView: Error fetching list:', err);
      console.error('ListView: Error response:', err.response?.data);
      
      if (err.response?.status === 401 && err.response?.data?.requiresPassword) {
        console.log('ListView: Password required for private list');
        setPasswordRequired(true);
      } else if (err.response?.status === 401 && err.response?.data?.message?.includes('Password required')) {
        console.log('ListView: Password required (message check)');
        setPasswordRequired(true);
      } else if (err.response?.status === 401) {
        console.log('ListView: Incorrect password or auth error');
        setError('Incorrect password. Please try again.');
        setPasswordRequired(true);
      } else {
        setError('Failed to load list');
        console.error('Error fetching list:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password.trim()) {
      fetchList(password);
    }
  };

  const handleAddMedia = async (mediaItem) => {
    try {
      console.log('ListView: Adding media item:', mediaItem);
      const formattedItem = omdbService.formatForBackend(mediaItem);
      console.log('ListView: Formatted item for backend:', formattedItem);
      
      // Log the exact request being made
      console.log('ListView: Making request to add item with ID:', id);
      console.log('ListView: Request URL would be:', `/api/recommendations/${id}/items`);
      
      const response = await recommendationsAPI.addItem(id, formattedItem);
      console.log('ListView: Add item response:', response);
      
      // Refresh the list
      await fetchList();
      setShowSearchModal(false);
    } catch (err) {
      console.error('ListView: Error adding media:', err);
      console.error('ListView: Error response:', err.response);
      console.error('ListView: Error status:', err.response?.status);
      console.error('ListView: Error data:', err.response?.data);
      
      if (err.response?.status === 400) {
        console.error('ListView: Validation errors:', err.response?.data?.errors);
        alert('Validation error: ' + (err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Invalid data format'));
      } else {
        alert('Failed to add media to list: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleRemoveMedia = (imdbId, mediaType) => {
    setItemToDelete({ imdbId, mediaType });
    setShowDeleteModal(true);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      console.log('ListView: Removing item:', itemToDelete);
      await recommendationsAPI.removeItem(id, itemToDelete.imdbId, itemToDelete.mediaType);
      console.log('ListView: Item removed successfully');

      // Refresh the list from server to ensure consistency
      await fetchList();

      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      console.error('ListView: Error removing media:', err);
      console.error('ListView: Error response:', err.response);
      alert('Failed to remove media from list: ' + (err.response?.data?.message || err.message));
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (passwordRequired && list) {
    return (
      <PasswordModal
        list={list}
        onClose={() => navigate('/dashboard/explore')}
        onSubmit={(password) => fetchList(password)}
      />
    );
  }

  if (passwordRequired) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-300">
          <div className="text-center mb-6">
            <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Private List</h3>
            <p className="mt-1 text-sm text-gray-600">This list is private. Please enter the password to access it.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-900 bg-opacity-20 border border-red-500 border-opacity-30 p-4">
              <div className="text-sm text-red-400">{error}</div>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter list password"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                Access List
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/explore')}
                className="flex-1 bg-gray-50 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">{error}</div>
        <button
          onClick={() => fetchList()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">List not found</div>
      </div>
    );
  }

  // Check if current user is the owner of the list
  const isOwner = user && list.creator && list.creator._id === user._id;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white truncate">{list.name}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                list.isPrivate 
                  ? 'bg-red-900 bg-opacity-20 text-red-400' 
                  : 'bg-green-900 bg-opacity-20 text-green-400'
              }`}>
                {list.isPrivate ? (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Private
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    Public
                  </>
                )}
              </span>
            </div>
            
            {list.description && (
              <p className="mt-2 text-gray-600">{list.description}</p>
            )}
            
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span>By {list.creator?.name || 'Unknown'}</span>
              <span>•</span>
              <span>{list.items?.length || 0} items</span>
              {list.viewCount > 0 && (
                <>
                  <span>•</span>
                  <span>{list.viewCount} views</span>
                </>
              )}
            </div>
          </div>
          
          {isOwner && (
            <button
              onClick={() => setShowSearchModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Movie/Series
            </button>
          )}
        </div>
      </div>

      {/* Items Grid */}
      {list.items && list.items.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {list.items.map((item) => (
            <MediaCard
              key={`${item.imdbId}-${item.type}`}
              item={item}
              onRemove={isOwner ? () => handleRemoveMedia(item.imdbId, item.type) : null}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V3a1 1 0 00-1 1v14a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1m-9 0V3a1 1 0 011-1h8a1 1 0 011 1v1" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items yet</h3>
          <p className="mt-1 text-sm text-gray-600">
            {isOwner ? 'Start building your list by adding movies, series, or anime.' : 'This list is empty.'}
          </p>
          {isOwner && (
            <div className="mt-6">
              <button
                onClick={() => setShowSearchModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add First Item
              </button>
            </div>
          )}
        </div>
      )}

      {/* Media Search Modal */}
      {showSearchModal && (
        <MediaSearchModal
          onClose={() => setShowSearchModal(false)}
          onSelect={handleAddMedia}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDeleteItem}
        title="Delete Item"
        message="Are you sure you want to delete this item from the list?"
      />
    </div>
  );
};

export default ListView;
