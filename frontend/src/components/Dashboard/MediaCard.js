import React from 'react';
import { omdbService } from '../../services/omdbAPI';

const MediaCard = ({ item, onRemove }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
  };

  const getMediaTypeIcon = (mediaType) => {
    switch (mediaType) {
      case 'movie':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V3a1 1 0 00-1 1v14a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1m-9 0V3a1 1 0 011-1h8a1 1 0 011 1v1" />
          </svg>
        );
      case 'series':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'anime':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group relative bg-dark-surface rounded-lg shadow-sm border border-dark-border hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Remove button */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 z-10 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          title="Remove from list"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Poster */}
      <div className="aspect-[2/3] bg-dark-primary overflow-hidden">
        {item.poster ? (
          <img
            src={omdbService.getImageUrl(item.poster)}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-dark-primary">
            <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V3a1 1 0 00-1 1v14a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1m-9 0V3a1 1 0 011-1h8a1 1 0 011 1v1" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-medium text-text-primary line-clamp-2 flex-1 mr-2">
            {item.title}
          </h3>
          <div className="flex items-center text-text-muted">
            {getMediaTypeIcon(item.mediaType)}
          </div>
        </div>

        {/* Rating and Year */}
        <div className="flex items-center justify-between text-xs text-text-muted mb-2">
          {item.rating && item.rating > 0 && (
            <span className="flex items-center">
              <svg className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {item.rating ? item.rating.toFixed(1) : 'N/A'}
            </span>
          )}
          {item.releaseDate && (
            <span>{formatDate(item.releaseDate)}</span>
          )}
        </div>

        {/* Genres */}
        {item.genre && item.genre.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.genre.slice(0, 2).map((genre, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent-primary bg-opacity-20 text-accent-primary"
              >
                {genre}
              </span>
            ))}
            {item.genre.length > 2 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-dark-primary text-text-secondary">
                +{item.genre.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Notes */}
        {item.notes && (
          <div className="mt-2 pt-2 border-t border-dark-border">
            <p className="text-xs text-text-secondary line-clamp-2">
              {item.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaCard;
