import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProfilePictureUpload from './ProfilePictureUpload';
import FavoriteMediaSection from './FavoriteMediaSection';

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      const result = await updateProfile(profileData);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      const result = await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update password' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const tabs = [
    { id: 'profile', name: 'Profile Information', icon: '👤' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'favorites', name: 'Favorite Media', icon: '❤️' }
  ];

  return (
    <div className="max-w-4xl mx-auto fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-gray-300">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 surface-card ${
          message.type === 'success' 
            ? 'border-green-500 bg-green-900 bg-opacity-20 text-green-400' 
            : 'border-red-500 bg-red-900 bg-opacity-20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="surface-card">
        {activeTab === 'profile' && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Profile Information</h3>
            
            {/* Profile Picture */}
            <div className="mb-8">
              <ProfilePictureUpload />
            </div>

            {/* Profile Form */}
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={profileData.username}
                    onChange={handleProfileChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-white mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  id="bio"
                  rows={4}
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  className="input-field"
                  placeholder="Tell us about yourself..."
                  maxLength={500}
                />
                <p className="mt-1 text-xs text-gray-400">
                  {profileData.bio.length}/500 characters
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-6 py-3 text-sm font-medium"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'security' && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Change Password</h3>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-white mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-white mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="input-field"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="input-field"
                  minLength={6}
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-6 py-3 text-sm font-medium"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            <FavoriteMediaSection />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
