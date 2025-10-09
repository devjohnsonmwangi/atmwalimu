// src/pages/articles/CreateArticlePage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateArticleMutation, articlesApi } from '../../../../features/articles/articlesApi';
import { useDispatch } from 'react-redux';
import ArticleEditorForm, { ArticleFormData } from '../../../../components/articles/ArticleEditorForm';
import type { CreateArticleDto } from '../../../../features/articles/articlesApi';
import Modal from '../../../../components/Modal';

const CreateArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const [createArticle, { isLoading, error }] = useCreateArticleMutation();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const dispatch = useDispatch();

  const handleCreate = async (formData: ArticleFormData) => {
    try {
      // Build explicit payload to match CreateArticleDto defined in articlesApi.ts
      const payload: CreateArticleDto = {
        title: formData.title,
        content: formData.content,
        ...(formData.excerpt ? { excerpt: formData.excerpt } : {}),
        ...(formData.coverImageUrl ? { coverImageUrl: formData.coverImageUrl } : {}),
        ...(formData.categoryIds ? { categoryIds: formData.categoryIds } : {}),
      };
      // Debug: log payload to inspect what we're sending to the API
      console.debug('Creating article with payload:', payload);

      // The server CreateArticleDto does not accept `status` on create (status belongs to update),
      // so we call createArticle with the explicit payload above.
      await createArticle(payload).unwrap();
      // On success, open a modal and offer navigation options
      setIsSuccessOpen(true);
    } catch (err) {
      // The form component will display the error using the `error` prop
      console.error('Failed to create the article:', err);
    }
  };

  return (
    // MODIFIED: Removed py-12 from here to move it to the inner container for better control.
    <div className="bg-gray-50 min-h-screen">
      {/* 
        MODIFIED: Main container now has ZERO horizontal padding on mobile (px-0)
        and brings it back on larger screens (sm:px-6). Vertical padding is now responsive.
      */}
      <div className="container mx-auto px-0 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* 
          MODIFIED: The header gets its own padding on mobile so the title doesn't touch the edge.
        */}
        <header className="mb-10 text-center px-4 sm:px-0">
          {/* 
            MODIFIED: Header is now blue with a green line hover effect.
            'inline-block' is used to make the border only as wide as the text.
          */}
          <h1 className="text-4xl font-extrabold text-blue-700 inline-block border-b-4 border-transparent hover:border-green-500 transition-colors duration-300 pb-2">
            Create a New Article
          </h1>
          <p className="mt-2 text-lg text-gray-600">Share your knowledge with the world.</p>
        </header>

        {/* 
          MODIFIED: The main content card is now full-width on mobile.
          Padding, rounding, and shadow are removed on mobile and re-applied on larger screens.
        */}
        <main className="max-w-4xl mx-auto bg-white sm:p-6 md:p-8 sm:rounded-xl sm:shadow-lg">
          <ArticleEditorForm
            onSubmit={handleCreate}
            isLoading={isLoading}
            error={error}
            submitButtonText="Publish Article"
          />
        </main>

        <Modal
          isOpen={isSuccessOpen}
          onClose={() => {
            setIsSuccessOpen(false);
            // Invalidate so that admins see new submissions in moderation list
            dispatch(articlesApi.util.invalidateTags([{ type: 'ArticleList', id: 'LIST' }]));
          }}
          title="Submission received"
        >
          <p className="mb-4">Thank you! Your article has been submitted and is pending admin review. Once approved it will appear in the public articles list.</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setIsSuccessOpen(false);
                dispatch(articlesApi.util.invalidateTags([{ type: 'ArticleList', id: 'LIST' }]));
                navigate('/dashboard');
              }}
              className="px-4 py-2 bg-gray-100 rounded"
            >
              OK
            </button>
            <button
              onClick={() => {
                setIsSuccessOpen(false);
                // Navigate to articles list (public) — may not show this article until published
                navigate('/articles');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              View Articles
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CreateArticlePage;