import React from 'react';

const ArticleDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
      
      <div className="flex items-center mb-8">
        <div className="h-12 w-12 rounded-full bg-gray-300"></div>
        <div className="ml-4">
          <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
};

export default ArticleDetailSkeleton;