import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import {
  useGetCategoriesQuery,
  type Article, // IMPORTANT: Ensure your Article type in articlesApi.ts includes 'categories'
  type Category,
  type CreateArticleDto,
} from '../../features/articles/articlesApi';

// A unified type for the form's data structure
export type ArticleFormData = CreateArticleDto & { status?: 'published' | 'draft' };

// Define the props for our enhanced, reusable form component
interface ArticleEditorFormProps {
  /** The article to edit. If not provided, the form is in 'create' mode. */
  initialData?: Article;
  /** The function to call on submission. It will receive the complete form data. */
  onSubmit: (data: ArticleFormData) => Promise<unknown>; // CHANGED: Promise<any> to Promise<unknown> for better type safety
  /** The loading state from the parent component's mutation hook. */
  isLoading: boolean;
  /** The text for the primary submission button, e.g., "Publish Article" or "Save Changes". */
  submitButtonText?: string;
  /** An error object from the parent's mutation hook to display. */
  error?: unknown; // CHANGED: `any` to `unknown` to fix the first ESLint error.
}

// ADDED: A helper function to safely parse RTK Query error objects.
const getErrorMessage = (error: unknown): string => {
  if (error) {
    if (typeof error === 'object' && 'data' in error) {
      const errorData = (error as { data: unknown }).data;
      if (errorData && typeof errorData === 'object' && 'message' in errorData) {
        const message = errorData.message;
        return Array.isArray(message) ? message.join(', ') : String(message);
      }
      return JSON.stringify(errorData);
    }
    if (typeof error === 'object' && 'error' in error) {
      return String((error as { error: string }).error);
    }
  }
  return 'An unexpected error occurred. Please check your connection and try again.';
};

const ArticleEditorForm: React.FC<ArticleEditorFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  submitButtonText = 'Publish Article',
  error,
}) => {
  // Form field states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  // Fetch categories for the selection UI
  const { data: categories, isLoading: isLoadingCategories } = useGetCategoriesQuery();

  // useEffect to populate the form when editing an existing article
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setExcerpt(initialData.excerpt || '');
      // CHANGED: Removed the `(initialData as any)` cast to fix the second ESLint error.
      // This now relies on the `Article` type having an optional `categories` property.
      const initialCategoryIds = initialData.categories?.map((c: Category) => c.categoryId) || [];
      setSelectedCategories(initialCategoryIds);
    }
  }, [initialData]);

  // Handler for category checkbox changes
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Centralized submission handler that calls the parent's onSubmit prop
  const handleSave = (status: 'published' | 'draft') => {
    const articleData: ArticleFormData = {
      title,
      content,
      excerpt: excerpt || undefined,
      categoryIds: selectedCategories,
      status,
    };
    onSubmit(articleData);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave('published'); }} className="space-y-8">
      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          <p className="font-semibold">An error occurred:</p>
          {/* Ensure the error message is always a string for ReactNode compatibility */}
          <p>{getErrorMessage(error)}</p>
        </div>
      ) : null}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Article Title</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your Awesome Title" required className="w-full px-4 py-2 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">Excerpt (Short Summary)</label>
        <textarea id="excerpt" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="A brief teaser for your article..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
        {isLoadingCategories ? (<p>Loading categories...</p>) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
            {categories?.map((cat) => (
              <label key={cat.categoryId} className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={selectedCategories.includes(cat.categoryId)} onChange={() => handleCategoryChange(cat.categoryId)} />
                <span className="text-gray-800">{cat.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Main Content</label>
        <div className="bg-white"><ReactQuill theme="snow" value={content} onChange={setContent} placeholder="Write your story..."/></div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 border-t">
         <button type="button" onClick={() => handleSave('draft')} disabled={isLoading} className="w-full sm:w-auto px-6 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors">
          {isLoading ? 'Saving...' : 'Save as Draft'}
        </button>
        <button type="submit" disabled={isLoading || !title || !content} className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all">
          {isLoading ? 'Saving...' : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default ArticleEditorForm;