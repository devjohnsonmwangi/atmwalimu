import React, { useState } from 'react';
import { useGetAdminArticlesQuery, useUpdateArticleMutation, useDeleteArticleMutation } from '../../../../features/articles/articlesApi';
import toast from 'react-hot-toast';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal';

const AdminModerationPage: React.FC = () => {
  // Fetch all articles (admin endpoint)
  const { data, error, isLoading, refetch } = useGetAdminArticlesQuery({ page: 1, limit: 50, sortBy: 'createdAt', order: 'desc' });
  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();
  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();

  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('draft');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const allArticles = data?.data ?? [];
  const pendingArticles = allArticles.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'published') return a.status === 'published';
    return a.status !== 'published';
  });

  const handlePublish = async (articleId: number) => {
    try {
      await updateArticle({ id: articleId, status: 'published' }).unwrap();
      // Show toast and inline success message
      toast.success('Article published');
      const published = allArticles.find((a) => a.articleId === articleId);
      setSuccessMessage(published ? `Published: ${published.title}` : 'Article published');
      // Auto-dismiss inline message after 4 seconds
      setTimeout(() => setSuccessMessage(null), 4000);
      void refetch();
    } catch (err) {
      console.error('Failed to publish article', err);
      toast.error('Failed to publish article');
    }
  };

  const [deleteCandidate, setDeleteCandidate] = useState<number | null>(null);

  const handleDelete = async (articleId: number) => {
    try {
      await deleteArticle(articleId).unwrap();
      toast.success('Article deleted');
      void refetch();
    } catch (err) {
      console.error('Failed to delete article', err);
      toast.error('Failed to delete article');
    } finally {
      setDeleteCandidate(null);
    }
  };

  if (isLoading) return <div className="p-6">Loading articles...</div>;

  if (error) return <div className="p-6 text-red-600">Failed to load articles for moderation.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Article Moderation</h1>

      <div className="mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Filter:</span>
          <div className="space-x-2">
            <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>All</button>
            <button onClick={() => setFilter('published')} className={`px-3 py-1 rounded ${filter === 'published' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Published</button>
            <button onClick={() => setFilter('draft')} className={`px-3 py-1 rounded ${filter === 'draft' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Draft</button>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          {successMessage}
        </div>
      )}

      {pendingArticles.length === 0 ? (
        <div className="p-4 bg-green-50 text-green-700 rounded">No articles match the selected filter.</div>
      ) : (
        <div className="space-y-4">
          {pendingArticles.map((article) => (
            <div key={article.articleId} className="bg-white p-4 rounded shadow-sm flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-blue-600">{article.title}</h2>
                <p className="text-sm text-gray-600">By {article.author.fullName} • {new Date(article.createdAt).toLocaleString()}</p>
                <p className="mt-2 text-sm text-gray-800 line-clamp-3">{article.excerpt}</p>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0 flex items-center space-x-2">
                <button disabled={isUpdating} onClick={() => handlePublish(article.articleId)} className="px-3 py-2 bg-green-600 text-white rounded">Publish</button>
                <button disabled={isDeleting} onClick={() => setDeleteCandidate(article.articleId)} className="px-3 py-2 bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <DeleteConfirmationModal
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={() => deleteCandidate && void handleDelete(deleteCandidate)}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default AdminModerationPage;
