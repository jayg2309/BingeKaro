import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title = "Delete Item", message = "Are you sure you want to delete this item?" }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="relative transform overflow-hidden rounded-lg bg-dark-surface px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-900 bg-opacity-20 rounded-full">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>

              <h3 className="text-lg font-semibold leading-6 text-text-primary mb-2">
                {title}
              </h3>

              <p className="text-sm text-text-secondary mb-6">
                {message}
              </p>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors font-medium"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-dark-primary text-text-primary px-4 py-2 rounded-md hover:bg-dark-background focus:outline-none focus:ring-2 focus:ring-accent-primary transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
