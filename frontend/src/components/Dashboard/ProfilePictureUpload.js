import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePictureUpload = () => {
  const { user, uploadProfilePicture, removeProfilePicture } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const result = await uploadProfilePicture(file);
      
      if (!result.success) {
        alert(result.error || 'Failed to upload profile picture');
      }
    } catch (err) {
      alert('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemove = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) return;

    try {
      setUploading(true);
      const result = await removeProfilePicture();
      
      if (!result.success) {
        alert(result.error || 'Failed to remove profile picture');
      }
    } catch (err) {
      alert('Failed to remove profile picture');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-4">
        Profile Picture
      </label>
      
      <div className="flex items-center space-x-6">
        {/* Current Profile Picture */}
        <div className="flex-shrink-0">
          <img
            className="h-20 w-20 rounded-full object-cover"
            src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff&size=80`}
            alt={user?.name}
          />
        </div>

        {/* Upload Area */}
        <div className="flex-1">
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center hover:border-dark-border transition-colors ${
              dragOver ? 'border-accent-primary bg-accent-primary bg-opacity-10' : 'border-dark-border'
            } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
            
            {uploading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-6 w-6 text-accent-primary mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm text-text-secondary">Uploading...</span>
              </div>
            ) : (
              <>
                <svg className="mx-auto h-8 w-8 text-text-muted" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-accent-primary hover:text-accent-secondary font-medium"
                  >
                    Upload a photo
                  </button>
                  <span className="text-text-muted"> or drag and drop</span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex space-x-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center px-3 py-2 border border-dark-border shadow-sm text-sm leading-4 font-medium rounded-md text-text-primary bg-dark-primary hover:bg-dark-background focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Change
            </button>
            
            {user?.profilePicture && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                className="inline-flex items-center px-3 py-2 border border-dark-border shadow-sm text-sm leading-4 font-medium rounded-md text-red-400 bg-dark-primary hover:bg-red-900 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
