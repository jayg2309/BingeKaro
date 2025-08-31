import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus } from 'lucide-react';
import Layout from '../../components/Layout/Layout';

const Recommendations = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Recommendations</h1>
          <Link
            to="/recommendations/create"
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create List</span>
          </Link>
        </div>

        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Coming Soon!</h2>
          <p className="text-secondary-600 mb-6">
            The recommendations feature is currently under development.
          </p>
          <p className="text-secondary-600">
            You'll soon be able to create and share your favorite movie, TV show, and anime lists!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Recommendations;
