import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      console.log('AuthContext: checkAuth called, token:', token);
      
      if (token) {
        try {
          console.log('AuthContext: Checking auth with token:', token);
          const response = await authAPI.getCurrentUser();
          console.log('AuthContext: Auth check response:', response);
          setUser(response.data.data.user || response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          console.log('AuthContext: Clearing invalid token');
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } else {
        console.log('AuthContext: No token found, clearing user');
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Login function
  const login = async (credentials) => {
    try {
      console.log('AuthContext: Making login request...');
      const response = await authAPI.login(credentials);
      console.log('AuthContext: Login response:', response);
      
      const { token: newToken, user: userData } = response.data.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      console.log('AuthContext: User state updated:', userData);
      
      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return { success: true };
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token: newToken, user: userInfo } = response.data.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userInfo);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      setUser(response.data.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Profile update failed'
      };
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    try {
      await authAPI.updatePassword(passwordData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Password update failed'
      };
    }
  };

  // Upload profile picture
  const uploadProfilePicture = async (file) => {
    try {
      console.log('AuthContext: Uploading profile picture:', file.name);
      const response = await authAPI.uploadProfilePicture(file);
      console.log('AuthContext: Upload response:', response.data);
      
      const updatedUser = response.data.data.user;
      console.log('AuthContext: Updated user:', updatedUser);
      
      setUser(updatedUser);
      return { success: true, url: response.data.data.profilePicture };
    } catch (error) {
      console.error('AuthContext: Upload error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Profile picture upload failed'
      };
    }
  };

  // Remove profile picture
  const removeProfilePicture = async () => {
    try {
      const response = await authAPI.removeProfilePicture();
      setUser(response.data.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Profile picture removal failed'
      };
    }
  };

  // Add to favorites
  const addToFavorites = async (category, mediaItem) => {
    try {
      const response = await authAPI.post(`/users/favorites/${category}`, {
        imdbId: mediaItem.imdbId,
        title: mediaItem.title,
        year: mediaItem.year,
        poster: mediaItem.poster,
        genre: mediaItem.genre,
        imdbRating: mediaItem.imdbRating
      });
      
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Add to favorites error:', error);
      throw error;
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (type, imdbId) => {
    try {
      const response = await authAPI.removeFromFavorites(type, imdbId);
      setUser(response.data.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to remove from favorites'
      };
    }
  };

  // Check if media is in favorites
  const isInFavorites = (type, imdbId) => {
    if (!user) return false;
    
    const favorites = user[`favorite${type.charAt(0).toUpperCase() + type.slice(1)}s`];
    return favorites.some(item => item.imdbId === imdbId);
  };

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    uploadProfilePicture,
    removeProfilePicture,
    addToFavorites,
    removeFromFavorites,
    isInFavorites
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
