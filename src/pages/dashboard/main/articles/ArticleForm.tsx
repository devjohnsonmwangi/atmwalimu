// src/features/articles/ArticleForm.tsx
import React, { useState, useEffect } from 'react';
import type { Article } from '../../../../features/articles/articlesApi';
// Spinner was unused and the component doesn't rely on it; remove import

interface ArticleFormSubmit {
  title: string;
  content: string;
  excerpt?: string | null;
  status?: 'draft' | 'published';
}

interface ArticleFormProps {
  articleToEdit?: Article;
  onSubmit: (data: ArticleFormSubmit) => void;
  isSaving: boolean;
  onCancel: () => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ articleToEdit, onSubmit, isSaving, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  
  // const { data: categories, isLoading: isLoadingCategories } = useGetCategoriesQuery();

  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title);
      setContent(articleToEdit.content);
      setExcerpt(articleToEdit.excerpt ?? '');
      // articleToEdit.status might be undefined in the public Article type
  // The public Article type may not include `status` in some responses; check safely
  const maybeStatus = (articleToEdit as Article & { status?: 'draft' | 'published' }).status;
  if (maybeStatus) setStatus(maybeStatus);
    }
  }, [articleToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  onSubmit({ title, content, excerpt, status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Excerpt</label>
        <textarea
          id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content (HTML supported)</label>
        <textarea
          id="content" value={content} onChange={(e) => setContent(e.target.value)}
          rows={15}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
       <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status" value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      <div className="flex justify-end space-x-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Cancel
          </button>
          <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">
              {isSaving ? 'Saving...' : 'Save Article'}
          </button>
      </div>
    </form>
  );
};

export default ArticleForm;