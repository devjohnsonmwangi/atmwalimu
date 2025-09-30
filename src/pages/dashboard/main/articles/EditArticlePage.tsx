// src/pages/articles/EditArticlePage.tsx

import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  useGetArticleBySlugQuery,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} from '../../../../features/articles/articlesApi';
import ArticleEditorForm, { ArticleFormData } from '../../../../components/articles/ArticleEditorForm';
import ArticleDetailSkeleton from '../../../../components/articles/ArticleDetailSkeleton';
import type { RootState } from '.././../../../app/store';

const EditArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  const { data: article, isLoading: isLoadingArticle, isError } = useGetArticleBySlugQuery(slug!, { skip: !slug });
  const [updateArticle, { isLoading: isUpdating, error: updateError }] = useUpdateArticleMutation();
  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();

  const handleUpdate = async (formData: ArticleFormData) => {
    if (!article) return;
    
    try {
      const updatedArticle = await updateArticle({ id: article.articleId, ...formData }).unwrap();
      navigate(`/articles/${updatedArticle.slug}`);
    } catch (err) {
      console.error('Failed to update article:', err);
    }
  };

  const handleDelete = async () => {
    if (article && window.confirm('Are you sure you want to permanently delete this article?')) {
      try {
        await deleteArticle(article.articleId).unwrap();
        navigate('/');
      } catch (err) {
        console.error('Failed to delete article:', err);
        alert('Could not delete the article. Please try again.');
      }
    }
  };

  if (isLoadingArticle) return <div className="container mx-auto p-8"><ArticleDetailSkeleton /></div>;

  if (isError || !article) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Article Not Found</h2>
        <p className="text-gray-600 mt-2">This article could not be loaded.</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">Go to Homepage</Link>
      </div>
    );
  }
  
  // Security Check: Only the author or an admin can access the edit page
  if (user.id !== article.author.userId && user.role !== 'admin') {
    return <div className="text-center py-20"><h2>You are not authorized to edit this article.</h2></div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">Edit Article</h1>
        </header>
        <main className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <ArticleEditorForm
            initialData={article}
            onSubmit={handleUpdate}
            isLoading={isUpdating}
            error={updateError}
            submitButtonText="Save Changes"
          />
        </main>
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800">Danger Zone</h3>
            <p className="text-sm text-gray-600 mb-4">Deleting this article is a permanent and irreversible action.</p>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-800 disabled:bg-gray-400"
            >
                {isDeleting ? 'Deleting...' : 'Delete This Article'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default EditArticlePage;