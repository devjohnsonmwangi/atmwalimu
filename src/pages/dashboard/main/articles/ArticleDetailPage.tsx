import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  useGetArticleBySlugQuery,
  useDeleteArticleMutation,
} from '../../../../features/articles/articlesApi';
import type { RootState } from '../../../../app/store';
import ArticleDetailSkeleton from '../../../../components/articles/ArticleDetailSkeleton';
import CommentsSection from '../../../../components/articles/CommentsSection';
import DOMPurify from 'dompurify';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal';
import Modal from '../../../../components/Modal';

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

  // Handler for the admin delete action (modal-based confirmation)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = async () => {
    if (!article) return;
    try {
      await deleteArticle(article.articleId).unwrap();
      navigate('/articles');
    } catch (err) {
      console.error('Failed to delete the article:', err);
      setErrorMessage('An error occurred while deleting the article. Please check the console.');
      setErrorModalOpen(true);
    } finally {
      setShowDeleteConfirm(false);
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

  // Sanitize HTML content for safe rendering
  const sanitizedContent = useMemo(() => DOMPurify.sanitize(article?.content || ''), [article?.content]);

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
    <article className="bg-base-100 py-8 sm:py-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <main className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mobile back button for phone-app feel */}
          <div className="lg:hidden mb-4">
            <button onClick={() => navigate(-1)} className="inline-flex items-center px-3 py-2 rounded-md bg-white shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              ← Back
            </button>
          </div>
          <div className="lg:col-span-2 max-w-3xl mx-auto">

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
                    <>
                      <button 
                        onClick={() => setShowDeleteConfirm(true)} 
                        disabled={isDeleting} 
                        className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete (Admin)'}
                      </button>
                      <DeleteConfirmationModal
                        isOpen={showDeleteConfirm}
                        onClose={() => setShowDeleteConfirm(false)}
                        onConfirm={handleDelete}
                        title="Confirm Delete"
                        message="Are you sure you want to permanently delete this article? This action cannot be undone."
                        isDeleting={isDeleting}
                      />
                      <Modal isOpen={errorModalOpen} onClose={() => setErrorModalOpen(false)} title="Error">
                        <div className="text-center">
                          <p className="text-red-700 text-sm">{errorMessage}</p>
                          <div className="mt-4">
                            <button onClick={() => setErrorModalOpen(false)} className="px-4 py-2 bg-blue-600 text-white rounded-md">Close</button>
                          </div>
                        </div>
                      </Modal>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <header className="mb-8 text-center">
            {article.publishedAt && (
              <p className="text-base font-bold text-blue-600">Published on {formatDate(article.publishedAt)}</p>
            )}
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 tracking-tight">
              <span className="underline-border-hover">{article.title}</span>
            </h1>
          </header>

          <div className="flex items-center gap-4 my-6 sm:my-8">
            <img className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover" src={article.author.profilePictureUrl || `https://ui-avatars.com/api/?name=${article.author.fullName.replace(/\s/g, '+')}&background=random`} alt={`Profile of ${article.author.fullName}`} />
            <div className="text-left">
              <p className="text-base sm:text-lg font-semibold text-gray-800">{article.author.fullName}</p>
              <p className="text-xs sm:text-sm text-gray-500">Last updated on {formatDate(article.updatedAt)}</p>
            </div>
          </div>
          
          {article.coverImageUrl && (
            <img loading="lazy" src={article.coverImageUrl} alt={article.title} className="w-full h-auto rounded-xl shadow-lg my-6 sm:my-8 aspect-video object-cover" />
          )}

          {/* Using Tailwind's typography plugin ('prose') for beautiful content rendering */}
          <div className="prose prose-sm sm:prose-lg lg:prose-xl max-w-none mx-auto mt-6 sm:mt-8">
            {/* Sanitize HTML to prevent XSS before injecting */}
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
          </div>

          <hr className="my-8 sm:my-12 border-t border-base-300 lg:col-span-2" />

          <CommentsSection articleId={article.articleId} />
        </div>

        {/* Sidebar: author / actions (mobile-stacked, sticky on desktop) */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 shadow-sm lg:sticky lg:top-20">
            <div className="flex items-center">
              <img loading="lazy" className="h-12 w-12 rounded-full object-cover" src={article.author.profilePictureUrl || `https://ui-avatars.com/api/?name=${article.author.fullName.replace(/\s/g, '+')}&background=random`} alt={`Profile of ${article.author.fullName}`} />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{article.author.fullName}</p>
                <p className="text-xs text-gray-500">Updated {formatDate(article.updatedAt)}</p>
              </div>
            </div>

            {(isAdmin || isOwner) && (
              <div className="mt-4 flex flex-col gap-2">
                {isOwner && (
                  <Link to={`/articles/edit/${article.slug}`} className="px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 text-center">Edit Article</Link>
                )}
                {isAdmin && (
                  <button onClick={handleDelete} disabled={isDeleting} className="px-3 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-300">{isDeleting ? 'Deleting...' : 'Delete (Admin)'}</button>
                )}
              </div>
            )}
          </div>
        </aside>
        </main>
      </div>
    </article>
  );
};

export default ArticleDetailPage;