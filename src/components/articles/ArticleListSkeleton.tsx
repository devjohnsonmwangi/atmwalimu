import React from 'react';

const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse flex flex-col h-56">
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-full mt-4" />
      <div className="h-3 bg-gray-200 rounded w-5/6 mt-2" />
    </div>
    <div className="mt-4 flex items-center">
      <div className="h-10 w-10 rounded-full bg-gray-200" />
      <div className="ml-3">
        <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-16" />
      </div>
    </div>
  </div>
);

const ArticleListSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export default ArticleListSkeleton;
