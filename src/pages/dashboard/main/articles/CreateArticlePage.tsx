// src/pages/articles/CreateArticlePage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateArticleMutation } from '../../../../features/articles/articlesApi';
import ArticleEditorForm, { ArticleFormData } from '../../../../components/articles/ArticleEditorForm';

const CreateArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const [createArticle, { isLoading, error }] = useCreateArticleMutation();

  const handleCreate = async (formData: ArticleFormData) => {
    try {
      // The status will be 'published' or 'draft' based on which button was clicked in the form
      const newArticle = await createArticle(formData).unwrap();
      // On success, navigate to the newly created article's page
      navigate(`/articles/${newArticle.slug}`);
    } catch (err) {
      // The form component will display the error using the `error` prop
      console.error('Failed to create the article:', err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Create a New Article
          </h1>
          <p className="mt-2 text-lg text-gray-600">Share your knowledge with the world.</p>
        </header>

        <main className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <ArticleEditorForm
            onSubmit={handleCreate}
            isLoading={isLoading}
            error={error}
            submitButtonText="Publish Article"
          />
        </main>
      </div>
    </div>
  );
};

export default CreateArticlePage;