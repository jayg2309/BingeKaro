import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recommendationsAPI } from '../../services/api';
import ListCard from './ListCard';
import PasswordModal from './PasswordModal';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await recommendationsAPI.getUserListsByUsername(username);
      setUser(response.data.data.user);
      setLists(response.data.data.lists);
    } catch (err) {
      setError('Failed to load user profile');
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleListClick = (list) => {
    if (list.isPrivate) {
      setSelectedList(list);
      setShowPasswordModal(true);
    } else {
      navigate(`/dashboard/list/${list._id}`);
    }
  };

  const handlePasswordSubmit = (password) => {
    navigate(`/dashboard/list/${selectedList._id}?password=${encodeURIComponent(password)}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchUserProfile}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">User not found</div>
        <button
          onClick={() => navigate('/dashboard/explore')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  const publicLists = lists.filter(list => !list.isPrivate);
  const privateLists = lists.filter(list => list.isPrivate);

  return (
    <div>
      {/* User Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate('/dashboard/explore')}
            className="text-indigo-600 hover:text-indigo-700 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Explore
          </button>
        </div>

        <div className="flex items-center space-x-6">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
          
          <div>
            <h1 className="text-3xl font-bold text-gray-300">{user.name}</h1>
            <p className="text-lg text-gray-600">@{user.username}</p>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span>{lists.length} lists</span>
              <span>•</span>
              <span>{publicLists.length} public</span>
              <span>•</span>
              <span>{privateLists.length} private</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lists Sections */}
      <div className="space-y-8">
        {/* Public Lists */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Public Lists ({publicLists.length})
          </h2>
          
          {publicLists.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {publicLists.map((list) => (
                <div
                  key={list._id}
                  onClick={() => handleListClick(list)}
                  className="cursor-pointer"
                >
                  <ListCard 
                    list={list} 
                    showActions={false}
                    onCreatorClick={(creatorUsername) => navigate(`/dashboard/user/${creatorUsername}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No public lists</h3>
              <p className="mt-1 text-sm text-gray-500">This user hasn't created any public lists yet.</p>
            </div>
          )}
        </div>

        {/* Private Lists */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Private Lists ({privateLists.length})
          </h2>
          
          {privateLists.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {privateLists.map((list) => (
                <div
                  key={list._id}
                  onClick={() => handleListClick(list)}
                  className="cursor-pointer"
                >
                  <ListCard 
                    list={list} 
                    showActions={false}
                    onCreatorClick={(creatorUsername) => navigate(`/dashboard/user/${creatorUsername}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No private lists</h3>
              <p className="mt-1 text-sm text-gray-500">This user hasn't created any private lists yet.</p>
            </div>
          )}
        </div>
      </div>

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

export default UserProfile;
