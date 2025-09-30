import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  useGetArticleBySlugQuery,
  useDeleteArticleMutation,
} from '../../../../features/articles/articlesApi';
import type { RootState } from '../../../../app/store';
import ArticleDetailSkeleton from '../../../../components/articles/ArticleDetailSkeleton';
import CommentsSection from '../../../../components/articles/CommentsSection';

const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Get the current logged-in user's state from Redux
  const user = useSelector((state: RootState) => state.user);
  
  // Fetch the article data based on the slug from the URL
  const { data: article,  isLoading, isError } = useGetArticleBySlugQuery(slug!, {
    skip: !slug, // Don't run the query if slug is not available yet
  });
  
  // Initialize the delete mutation hook
  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();

  // Determine user permissions for this specific article
  // Optional chaining (?.) is used to prevent errors if user or article is not yet loaded
  const isAdmin = user?.role === 'admin';
  const isOwner = user?.id === article?.author.userId;

  // Handler for the admin delete action
  const handleDelete = async () => {
    if (!article) return;

    if (window.confirm('ADMIN ACTION: Are you sure you want to permanently delete this article? This cannot be undone.')) {
      try {
        await deleteArticle(article.articleId).unwrap();
        // On success, redirect the admin to the main articles list
        navigate('/articles');
      } catch (err) {
        console.error('Failed to delete the article:', err);
        alert('An error occurred while deleting the article. Please check the console.');
      }
    }
  };

  // Helper function to format date strings for readability
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Date not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // === Render Logic ===

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ArticleDetailSkeleton />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-3xl font-bold text-red-600">Article Not Found</h2>
        <p className="text-gray-600 mt-2">The article you are looking for does not exist or has been moved.</p>
        <Link 
          to="/articles"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to All Articles
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-white py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <main className="max-w-3xl mx-auto">

          {/* --- Action Bar for Admins or Owners --- */}
          {(isAdmin || isOwner) && (
            <div className="bg-gray-50 border p-4 mb-8 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-700 tracking-wider uppercase">
                  Actions
                </p>
                <div className="flex items-center gap-4">
                  {isOwner && (
                    <Link 
                      to={`/articles/edit/${article.slug}`} 
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit Article
                    </Link>
                  )}
                  {isAdmin && (
                    <button 
                      onClick={handleDelete} 
                      disabled={isDeleting} 
                      className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete (Admin)'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <header className="mb-8 text-center">
            {article.publishedAt && (
              <p className="text-base font-semibold text-blue-600">Published on {formatDate(article.publishedAt)}</p>
            )}
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
              {article.title}
            </h1>
          </header>

          <div className="flex items-center justify-center my-8">
            <img className="h-14 w-14 rounded-full object-cover" src={article.author.profilePictureUrl || `https://ui-avatars.com/api/?name=${article.author.fullName.replace(/\s/g, '+')}&background=random`} alt={`Profile of ${article.author.fullName}`} />
            <div className="ml-4 text-left">
              <p className="text-lg font-semibold text-gray-800">{article.author.fullName}</p>
              <p className="text-sm text-gray-500">Last updated on {formatDate(article.updatedAt)}</p>
            </div>
          </div>
          
          {article.coverImageUrl && (
            <img src={article.coverImageUrl} alt={article.title} className="w-full h-auto rounded-xl shadow-lg my-8 aspect-video object-cover" />
          )}

          {/* Using Tailwind's typography plugin ('prose') for beautiful content rendering */}
          <div className="prose prose-lg lg:prose-xl max-w-none mx-auto mt-8" dangerouslySetInnerHTML={{ __html: article.content }} />

          <hr className="my-12 border-t border-gray-200" />
          
          <CommentsSection articleId={article.articleId} />
        </main>
      </div>
    </article>
  );
};

export default ArticleDetailPage;