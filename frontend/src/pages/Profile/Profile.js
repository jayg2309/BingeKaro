import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout/Layout';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-secondary-900 mb-8">Profile</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-6 mb-6">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-secondary-300 rounded-full flex items-center justify-center">
                <span className="text-2xl text-secondary-600">{user?.name?.charAt(0)}</span>
              </div>
            )}
            
            <div>
              <h2 className="text-2xl font-semibold text-secondary-900">{user?.name}</h2>
              <p className="text-secondary-600">@{user?.username}</p>
              <p className="text-secondary-600">{user?.email}</p>
            </div>
          </div>
          
          {user?.bio && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Bio</h3>
              <p className="text-secondary-600">{user.bio}</p>
            </div>
          )}
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-secondary-50 rounded-lg">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Favorite Movies</h3>
              <p className="text-2xl font-bold text-primary-600">{user?.favoriteMovies?.length || 0}</p>
            </div>
            
            <div className="text-center p-4 bg-secondary-50 rounded-lg">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Favorite Series</h3>
              <p className="text-2xl font-bold text-primary-600">{user?.favoriteSeries?.length || 0}</p>
            </div>
            
            <div className="text-center p-4 bg-secondary-50 rounded-lg">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Favorite Anime</h3>
              <p className="text-2xl font-bold text-primary-600">{user?.favoriteAnime?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
