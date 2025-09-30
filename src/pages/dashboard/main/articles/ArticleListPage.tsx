import React, { useState } from 'react';
import { useGetArticlesQuery } from '../../../../features/articles/articlesApi';
import ArticleCard from '../../../../components/articles/ArticleCard';
import ArticleListSkeleton from '../../../../components/articles/ArticleDetailSkeleton';

const ArticleListPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, error, isLoading, isFetching } = useGetArticlesQuery({
    page: currentPage,
    limit: 9, // A good number for a 3-column grid
    sortBy: 'publishedAt',
    order: 'desc',
  });

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <ArticleListSkeleton />;
    }

    if (error) {
      return (
        <div className="text-center py-10 px-4 bg-red-50 text-red-700 rounded-lg">
          <h3 className="text-xl font-semibold">An Error Occurred</h3>
          <p>Could not fetch articles. Please try again later.</p>
        </div>
      );
    }

    if (!data || data.data.length === 0) {
      return (
        <div className="text-center py-10 px-4 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold">No Articles Found</h3>
          <p>Check back later for new content!</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.data.map((article) => (
          <ArticleCard key={article.articleId} article={article} />
        ))}
      </div>
    );
  };
  
  const PaginationControls = () => {
    if (isLoading || !data || data.totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-4 mt-12">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isFetching}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {data.currentPage} of {data.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === data.totalPages || isFetching}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            The Knowledge Hub
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
            Insights, tutorials, and updates from our team.
          </p>
        </div>

        {renderContent()}

        <PaginationControls />
      </main>
    </div>
  );
};

export default ArticleListPage;