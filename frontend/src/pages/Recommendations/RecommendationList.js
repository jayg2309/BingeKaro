import React from 'react';
import { Heart } from 'lucide-react';
import Layout from '../../components/Layout/Layout';

const RecommendationList = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-secondary-900 mb-8">Recommendation List</h1>

        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Coming Soon!</h2>
          <p className="text-secondary-600">
            Individual recommendation list pages are currently under development.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default RecommendationList;
