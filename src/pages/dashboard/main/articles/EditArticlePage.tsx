// src/pages/articles/EditArticlePage.tsx

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  usePreviewArticleBySlugQuery,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} from '../../../../features/articles/articlesApi';
import ArticleEditorForm, { ArticleFormData } from '../../../../components/articles/ArticleEditorForm';
import ArticleDetailSkeleton from '../../../../components/articles/ArticleDetailSkeleton';
import Modal from '../../../../components/Modal';

const EditArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { data: article, isLoading: isLoadingArticle, isError } = usePreviewArticleBySlugQuery(slug!, { skip: !slug });
  const [updateArticle, { isLoading: isUpdating, error: updateError }] = useUpdateArticleMutation();
  const [deleteArticle, { isLoading: isDeleting, }] = useDeleteArticleMutation();

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusModalMessage, setStatusModalMessage] = useState('');
  const [statusModalIsSuccess, setStatusModalIsSuccess] = useState(false);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const closeStatusModal = () => setStatusModalOpen(false);

  const handleUpdate = async (formData: ArticleFormData) => {
    if (!article) return;
    
    try {
      const patch: Partial<ArticleFormData> = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        coverImageUrl: formData.coverImageUrl,
      };

      const updatedArticle = await updateArticle({ id: article.articleId, ...patch }).unwrap();
      
      setStatusModalMessage('Article updated successfully.');
      setStatusModalIsSuccess(true);
      setStatusModalOpen(true);
      
      setTimeout(() => {
        setStatusModalOpen(false);
        navigate(`/articles/edit/${updatedArticle.slug}`);
      }, 1500);
    } catch (err) {
      console.error('Failed to update article:', err);
      setStatusModalMessage('Failed to update the article. Please try again.');
      setStatusModalIsSuccess(false);
      setStatusModalOpen(true);
    }
  };

  const handleDeleteRequest = () => {
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!article) return;
    try {
      await deleteArticle(article.articleId).unwrap();
      setIsDeleteModalOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete article:', err);
      setIsDeleteModalOpen(false);
      setStatusModalMessage('Could not delete the article. Please try again.');
      setStatusModalIsSuccess(false);
      setStatusModalOpen(true);
    }
  };

  if (isLoadingArticle) {
    return <div className="w-full sm:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><ArticleDetailSkeleton /></div>;
  }

  if (isError || !article) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-bold">Article Not Found</h2>
        <p className="text-gray-600 mt-2">This article could not be loaded or you do not have permission to edit it.</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">Go to Homepage</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
  <div className="w-full sm:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <header className="mb-8 text-center px-4 sm:px-0">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 inline-block border-b-4 border-transparent hover:border-green-500 transition-colors duration-300 pb-2">
            Edit Article
          </h1>
        </header>
        
  <main className="w-full sm:max-w-4xl mx-auto bg-white sm:p-6 md:p-8 sm:rounded-lg sm:shadow-md">
          <ArticleEditorForm
            initialData={article}
            onSubmit={handleUpdate}
            isLoading={isUpdating}
            error={updateError}
            formId="article-form"
            submitButtonText="Save Changes"
          />
        </main>

        <div className="max-w-4xl mx-auto mt-8 p-4 sm:p-6 bg-red-50 border-y sm:border-x border-red-200 sm:rounded-lg">
            <h3 className="text-lg font-semibold text-red-800">Danger Zone</h3>
            <p className="text-sm text-gray-600 mb-4">Deleting this article is a permanent action and cannot be undone.</p>
            <button
                onClick={handleDeleteRequest}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Delete This Article
            </button>
        </div>
      </div>

      <Modal 
        isOpen={statusModalOpen} 
        onClose={closeStatusModal} 
        title={statusModalIsSuccess ? 'Success' : 'Action Failed'}
      >
        <div className="text-center">
          <p className={`text-sm ${statusModalIsSuccess ? 'text-green-700' : 'text-red-700'}`}>{statusModalMessage}</p>
          <div className="mt-4">
            <button onClick={closeStatusModal} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Close</button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="text-center">
          <p className="text-gray-700">Are you sure you want to permanently delete this article?</p>
          <p className="text-sm text-red-600 font-medium mt-1">This action cannot be undone.</p>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-wait"
          >
            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default EditArticlePage;