import React, { useState } from 'react';

const CreateListModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    password: '',
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('List name is required');
      return;
    }

    if (formData.isPrivate && !formData.password.trim()) {
      setError('Password is required for private lists');
      return;
    }

    // For public lists, ensure password is not sent
    const submitData = { ...formData };
    if (!formData.isPrivate) {
      delete submitData.password;
    }

    setLoading(true);
    setError('');

    try {
      console.log('CreateListModal: Submitting form data:', submitData);
      await onSubmit(submitData);
      console.log('CreateListModal: List created successfully');
    } catch (err) {
      console.error('CreateListModal: Error creating list:', err);
      setError(err.message || 'Failed to create list');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-dark-surface px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button
              type="button"
              className="rounded-md bg-dark-surface text-text-muted hover:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 className="text-base font-semibold leading-6 text-text-primary mb-4">
                Create New List
              </h3>

              {error && (
                <div className="mb-4 rounded-md bg-red-900 bg-opacity-20 p-4">
                  <div className="text-sm text-red-400">{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* List Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-primary">
                    List Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-dark-primary border-dark-border text-text-primary placeholder-text-muted shadow-sm focus:border-accent-primary focus:ring-accent-primary sm:text-sm"
                    placeholder="My Favorite Movies"
                    maxLength={100}
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-text-primary">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-dark-primary border-dark-border text-text-primary placeholder-text-muted shadow-sm focus:border-accent-primary focus:ring-accent-primary sm:text-sm"
                    placeholder="A collection of my all-time favorite movies..."
                    maxLength={500}
                  />
                </div>

                {/* Privacy Settings */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="isPrivate"
                      name="isPrivate"
                      type="checkbox"
                      checked={formData.isPrivate}
                      onChange={handleChange}
                      className="h-4 w-4 text-accent-primary focus:ring-accent-primary border-dark-border rounded bg-dark-primary"
                    />
                    <label htmlFor="isPrivate" className="ml-2 block text-sm text-text-primary">
                      Make this list private
                    </label>
                  </div>

                  {formData.isPrivate && (
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-dark-primary border-dark-border text-text-primary placeholder-text-muted shadow-sm focus:border-accent-primary focus:ring-accent-primary sm:text-sm"
                        placeholder="Enter password for private access"
                        minLength={4}
                      />
                      <p className="mt-1 text-xs text-text-muted">
                        Others will need this password to view your private list
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full justify-center rounded-md bg-accent-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      'Create List'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-dark-primary px-3 py-2 text-sm font-semibold text-text-primary shadow-sm ring-1 ring-inset ring-dark-border hover:bg-dark-background sm:mt-0 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListModal;
