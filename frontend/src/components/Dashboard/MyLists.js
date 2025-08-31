import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { recommendationsAPI } from '../../services/api';
import CreateListModal from './CreateListModal';
import ListCard from './ListCard';
import { useAuth } from '../../contexts/AuthContext';

const MyLists = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchUserLists();
  }, []);

  const fetchUserLists = async () => {
    try {
      setLoading(true);
      const response = await recommendationsAPI.getUserLists();
      setLists(response.data.data.lists);
    } catch (err) {
      setError('Failed to fetch your lists');
      console.error('Error fetching lists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (listData) => {
    try {
      console.log('MyLists: Creating list with data:', listData);
      const response = await recommendationsAPI.createList(listData);
      console.log('MyLists: Create list response:', response);
      setLists(prev => [response.data.data.list, ...prev]);
      setShowCreateModal(false);
    } catch (err) {
      console.error('MyLists: Error creating list:', err);
      console.error('MyLists: Error response:', err.response);
      throw new Error(err.response?.data?.message || 'Failed to create list');
    }
  };

  const handleDeleteList = async (listId) => {
    if (!window.confirm('Are you sure you want to delete this list?')) return;
    
    try {
      await recommendationsAPI.deleteList(listId);
      setLists(prev => prev.filter(list => list._id !== listId));
    } catch (err) {
      console.error('Error deleting list:', err);
      alert('Failed to delete list');
    }
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
          onClick={fetchUserLists}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">My Lists</h1>
          <p className="mt-2 text-sm text-gray-300">
            Create and manage your movie, series, and anime recommendation lists
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New List
          </button>
        </div>
      </div>

      {/* Lists Grid */}
      {lists.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-white">No lists yet</h3>
          <p className="mt-1 text-sm text-gray-300">Get started by creating your first recommendation list.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create List
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {lists.map((list) => (
            <ListCard
              key={list._id}
              list={list}
              onDelete={handleDeleteList}
              showActions={true}
              onCreatorClick={(creatorUsername) => navigate(`/dashboard/user/${creatorUsername}`)}
            />
          ))}
        </div>
      )}

      {/* Create List Modal */}
      {showCreateModal && (
        <CreateListModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateList}
        />
      )}
    </div>
  );
};

export default MyLists;
