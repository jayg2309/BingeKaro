import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ListCard = ({ list, onDelete, showActions = false, showCreator = true, onCreatorClick }) => {
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getItemsPreview = () => {
    if (!list.items || list.items.length === 0) return [];
    return list.items.slice(0, 4);
  };

  return (
    <div className="bg-blue-900 bg-opacity-20 rounded-lg shadow-sm border border-blue-500 border-opacity-30 hover:shadow-md transition-shadow duration-200">
      {/* Card Header */}
      <div className="p-4 border-b border-blue-400 border-opacity-30">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link
              to={`/dashboard/list/${list._id}`}
              className="text-lg font-semibold text-white hover:text-blue-300 transition-colors truncate block"
            >
              {list.name}
            </Link>
            <div className="flex items-center mt-1 space-x-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                list.isPrivate 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
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
              <span className="text-xs text-gray-500">
                {list.items?.length || 0} items
              </span>
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center space-x-1 ml-2">
              <Link
                to={`/dashboard/list/${list._id}`}
                className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                title="View List"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </Link>
              <button
                onClick={() => onDelete(list._id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete List"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {list.description && (
          <p className="mt-2 text-sm text-gray-300 line-clamp-2">
            {list.description}
          </p>
        )}
      </div>

      {/* Items Preview */}
      <div className="p-4">
        {getItemsPreview().length > 0 ? (
          <div className="grid grid-cols-4 gap-2">
            {getItemsPreview().map((item, index) => (
              <div key={index} className="aspect-[2/3] bg-gray-200 rounded overflow-hidden">
                {item.posterPath ? (
                  <img
                    src={item.posterPath}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V3a1 1 0 00-1 1v14a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1m-9 0V3a1 1 0 011-1h8a1 1 0 011 1v1" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            {/* Fill empty slots */}
            {Array.from({ length: 4 - getItemsPreview().length }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-[2/3] bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V3a1 1 0 00-1 1v14a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1m-9 0V3a1 1 0 011-1h8a1 1 0 011 1v1" />
            </svg>
            <p className="mt-2 text-xs text-gray-500">No items yet</p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-4 py-3 bg-blue-800 bg-opacity-20 border-t border-blue-400 border-opacity-30">
        <div className="flex items-center justify-between text-xs text-gray-300">
          <div className="flex items-center space-x-2">
            <span>Created {formatDate(list.createdAt)}</span>
            {showCreator && list.creator && (
              <>
                <span>•</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onCreatorClick) {
                      onCreatorClick(list.creator.username);
                    } else {
                      navigate(`/dashboard/user/${list.creator.username}`);
                    }
                  }}
                  className="text-blue-300 hover:text-blue-200 font-medium transition-colors hover:underline"
                >
                  @{list.creator.username}
                </button>
              </>
            )}
          </div>
          {list.viewCount > 0 && (
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {list.viewCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListCard;
