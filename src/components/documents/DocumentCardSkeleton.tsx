import React from 'react';

const DocumentCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse">
      {/* Title Placeholder */}
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
      
      {/* Description Placeholder */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
      
      {/* Footer Placeholder */}
      <div className="flex justify-between items-center mt-6">
        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );
};

export default DocumentCardSkeleton;