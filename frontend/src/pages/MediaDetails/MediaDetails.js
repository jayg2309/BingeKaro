import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { searchAPI, apiUtils } from '../../services/api';
import { Star, Calendar, Clock, Film } from 'lucide-react';
import Layout from '../../components/Layout/Layout';

const MediaDetails = () => {
  const { type, id } = useParams();

  const { data: mediaDetails, isLoading, error } = useQuery(
    ['media-details', type, id],
    () => {
      if (type === 'movie') {
        return searchAPI.getMovieDetails(id);
      } else if (type === 'series') {
        return searchAPI.getTVDetails(id);
      }
      return null;
    },
    {
      enabled: !!id && !!type,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary-200 rounded w-1/3 mb-6"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                <div className="aspect-[2/3] bg-secondary-200 rounded-lg"></div>
              </div>
              <div className="flex-1">
                <div className="h-8 bg-secondary-200 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-secondary-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-secondary-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-secondary-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto text-center py-12">
          <Film className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Error Loading Media</h2>
          <p className="text-secondary-600">Failed to load media details. Please try again.</p>
        </div>
      </Layout>
    );
  }

  const media = mediaDetails?.data;

  if (!media) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto text-center py-12">
          <Film className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Media Not Found</h2>
          <p className="text-secondary-600">The requested media could not be found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-full md:w-1/3">
            {media.posterPath ? (
              <img
                src={apiUtils.getImageUrl(media.posterPath, 'w500')}
                alt={media.title}
                className="w-full rounded-lg shadow-lg"
              />
            ) : (
              <div className="aspect-[2/3] bg-secondary-200 rounded-lg flex items-center justify-center">
                <Film className="w-16 h-16 text-secondary-400" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-secondary-900 mb-4">{media.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {media.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{apiUtils.formatRating(media.rating)}</span>
                </div>
              )}
              
              {media.releaseDate && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-5 h-5 text-secondary-500" />
                  <span className="text-secondary-600">{apiUtils.formatDate(media.releaseDate)}</span>
                </div>
              )}
              
              {media.runtime && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-5 h-5 text-secondary-500" />
                  <span className="text-secondary-600">{apiUtils.formatRuntime(media.runtime)}</span>
                </div>
              )}
            </div>

            {media.genre && media.genre.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {media.genre.map((genre, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {media.overview && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">Overview</h3>
                <p className="text-secondary-600 leading-relaxed">{media.overview}</p>
              </div>
            )}

            {media.director && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">Director</h3>
                <p className="text-secondary-600">{media.director}</p>
              </div>
            )}

            {media.actors && media.actors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">Cast</h3>
                <p className="text-secondary-600">{media.actors.join(', ')}</p>
              </div>
            )}

            {media.language && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">Language</h3>
                <p className="text-secondary-600">{media.language}</p>
              </div>
            )}

            {media.country && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">Country</h3>
                <p className="text-secondary-600">{media.country}</p>
              </div>
            )}

            {media.awards && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">Awards</h3>
                <p className="text-secondary-600">{media.awards}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MediaDetails;
