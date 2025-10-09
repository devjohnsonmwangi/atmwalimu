import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import {
  useGetCategoriesQuery,
  type Article,
  type Category,
  type CreateArticleDto,
} from '../../features/articles/articlesApi';
import Select, { OnChangeValue } from 'react-select';
import Modal from '../Modal';

// A unified type for the form's data structure
export type ArticleFormData = CreateArticleDto & { status?: 'published' | 'draft' };

// Define the props for our enhanced, reusable form component
interface ArticleEditorFormProps {
  /** The article to edit. If not provided, the form is in 'create' mode. */
  initialData?: Article;
  /** The function to call on submission. It will receive the complete form data. */
  onSubmit: (data: ArticleFormData) => Promise<unknown>;
  /** The loading state from the parent component's mutation hook. */
  isLoading: boolean;
  /** The text for the primary submission button, e.g., "Publish Article" or "Save Changes". */
  submitButtonText?: string;
  /** An error object from the parent's mutation hook to display. */
  error?: unknown;
  /** Optional id to set on the form element so parent pages can trigger submit programmatically. */
  formId?: string;
}

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
  formId,
}) => {
  // Form field states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // Fetch categories for the selection UI
  const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories } = useGetCategoriesQuery();

  // useEffect to populate the form when editing an existing article
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setExcerpt(initialData.excerpt || '');
      const initialCategoryIds = initialData.categories?.map((c: Category) => c.categoryId) || [];
      setSelectedCategories(initialCategoryIds);
    }
  }, [initialData]);

  // Handler for category multi-select (react-select)
  const categoryOptions = categories?.map((c) => ({ value: c.categoryId, label: c.name })) || [];
  const handleCategorySelect = (selected: OnChangeValue<{ value: number; label: string }, true>) => {
    if (!selected || (Array.isArray(selected) && selected.length === 0)) {
      setSelectedCategories([]);
      return;
    }
    const values = (selected as readonly { value: number; label: string }[]).map((s) => Number(s.value));
    setSelectedCategories(values);
  };

  // Centralized submission handler that calls the parent's onSubmit prop
  const handleSave = async (status: 'published' | 'draft') => {
    // Client-side validation: ensure at least one category is selected when publishing
    if (status === 'published' && selectedCategories.length === 0) {
      setModalMessage('Please select at least one category before publishing.');
      setModalIsSuccess(false);
      setModalOpen(true);
      return;
    }

    let coverImageUrl: string | undefined;
    if (coverFile) {
      setIsUploadingCover(true);
      try {
        const url = await import('../../utils/cloudinary').then(m => m.uploadToCloudinary(coverFile));
        coverImageUrl = url;
      } catch (err) {
        console.error('Cover upload failed:', err);
        setModalMessage('Cover image upload failed. Please try again or save as draft.');
        setModalIsSuccess(false);
        setModalOpen(true);
        setIsUploadingCover(false);
        return;
      } finally {
        setIsUploadingCover(false);
      }
    }

    const articleData: ArticleFormData = {
      title,
      content,
      excerpt: excerpt || undefined,
      categoryIds: selectedCategories,
      status,
      ...(coverImageUrl ? { coverImageUrl } : {}),
    };

    return onSubmit(articleData);
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalIsSuccess, setModalIsSuccess] = useState(false);
  const closeModal = () => setModalOpen(false);

  // Shared class string for all field labels.
  const labelStyles = "block text-sm font-medium text-blue-700 mb-2 w-fit transition-all duration-200 border-b-2 border-transparent hover:border-green-500 pb-1";

  return (
    <form id={formId} onSubmit={(e) => { e.preventDefault(); void handleSave('published'); }}>
      {/* Remove padding on small screens and allow full width on wider screens */}
      <div className="space-y-6 sm:space-y-8 px-0 pb-28 sm:pb-0">
        {error ? (
          <div className="p-3 sm:p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
            <p className="font-semibold">An error occurred:</p>
            <p>{getErrorMessage(error)}</p>
          </div>
        ) : null}

        <div>
          <label htmlFor="title" className={labelStyles}>Article Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your Awesome Title"
            required
            className="w-full px-3 py-2 text-xl border-t-0 border-x-0 border-b-2 border-gray-300 rounded-none focus:ring-0 focus:border-blue-500 text-blue-600 font-bold bg-transparent"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className={labelStyles}>Excerpt (Short Summary)</label>
          <textarea
            id="excerpt"
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A brief teaser for your article..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className={labelStyles}>Cover Image (optional)</label>
          <div className="flex items-center gap-3">
            <input
              id="cover-file"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                if (f) {
                  setCoverFile(f);
                  const reader = new FileReader();
                  reader.onload = () => setCoverPreview(String(reader.result));
                  reader.readAsDataURL(f);
                } else {
                  setCoverFile(null);
                  setCoverPreview(null);
                }
              }}
            />
            {coverPreview && (
              <div className="flex items-center gap-2">
                <img src={coverPreview} alt="cover preview" className="h-16 w-24 object-cover rounded" />
                {isUploadingCover && (
                  <span className="text-sm text-gray-500">Uploading cover...</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className={labelStyles}>Categories</label>
          {isLoadingCategories ? (
              <p>Loading categories...</p>
            ) : isErrorCategories ? (
              <div className="p-3 bg-yellow-50 rounded-md border border-yellow-100">
                <p className="text-yellow-700">Could not load categories. You can still save a draft or try again later.</p>
              </div>
            ) : categoryOptions.length === 0 ? (
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-gray-600">No categories available. Create categories in the admin area first.</p>
              </div>
            ) : (
              <div className="p-0 border border-gray-200 rounded-lg">
                <Select
                  isMulti
                  name="categories"
                  options={categoryOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={handleCategorySelect}
                  placeholder="Select categories..."
                  value={categoryOptions.filter((o) => selectedCategories.includes(o.value))}
                />
              </div>
            )}
        </div>

        <div>
          <label className={labelStyles}>Main Content</label>
          <div className="bg-white rounded-lg overflow-hidden border">
            {typeof window !== 'undefined' ? (
              <ReactQuill theme="snow" value={content} onChange={setContent} placeholder="Write your story..." />
            ) : (
              <div className="p-4 text-sm text-gray-500">Editor loading...</div>
            )}
          </div>
        </div>
      </div>
      
      {/* 
        This bottom bar is now truly edge-to-edge on mobile, which looks much better.
      */}
      <div className="fixed bottom-0 left-0 right-0 z-10 grid grid-cols-2 gap-3 p-3 bg-white/80 backdrop-blur-sm border-t border-gray-200 sm:relative sm:flex sm:justify-end sm:p-0 sm:bg-transparent sm:border-t-0 sm:pt-4">
        <button
          type="button"
          onClick={() => void handleSave('draft')}
          disabled={isLoading || isUploadingCover}
          className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          {isUploadingCover ? 'Uploading...' : isLoading ? 'Saving...' : 'Save as Draft'}
        </button>
        <button
          type="submit"
          disabled={isLoading || isUploadingCover || !title || !content}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
        >
          {isUploadingCover ? 'Uploading...' : isLoading ? 'Saving...' : submitButtonText}
        </button>
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={modalIsSuccess ? 'Success' : 'Notice'}>
        <div className="text-center">
          <p className={`text-sm ${modalIsSuccess ? 'text-green-700' : 'text-red-700'}`}>{modalMessage}</p>
          <div className="mt-4">
            <button onClick={closeModal} className="px-4 py-2 bg-blue-600 text-white rounded-md">Close</button>
          </div>
        </div>
      </Modal>
    </form>
  );
};

export default ArticleEditorForm;
