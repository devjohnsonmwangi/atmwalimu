import React, { useState, useRef } from 'react';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from '../../features/articles/articlesApi';
import toast from 'react-hot-toast';
import DeleteConfirmationModal from '../DeleteConfirmationModal';

const CategoryManager: React.FC = () => {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const [newCategoryName, setNewCategoryName] = useState('');
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setCreateError('Please enter a category name');
      return;
    }
    setCreateError(null);
    try {
      // Build explicit payload to avoid sending unexpected fields (eg. `status`)
      // Per CreateCategoryDto (server) only `name` is allowed on create.
      const payload = { name: newCategoryName.trim() };
      // Debug: show exact payload being sent to the server
      // eslint-disable-next-line no-console
      console.debug('Creating category with payload:', payload);

  await createCategory(payload).unwrap();
  setNewCategoryName(''); // Reset form on success
  setCoverPreview(null);
      setSuccessMessage('Category added');
      toast.success('Category added');
    } catch (err: unknown) {
      console.error('Failed to create category:', err);
      let message = 'Failed to add category';
      if (err && typeof err === 'object') {
        const e = err as Record<string, unknown>;
        if (e.data && typeof e.data === 'object') {
          const data = e.data as Record<string, unknown>;
            if (data.message) {
              // server sometimes returns an array of messages
              if (Array.isArray(data.message)) message = data.message.join(', ');
              else message = String(data.message);
            }
        } else if (e.error) {
          message = String(e.error);
        }
      }
      setCreateError(message);
      toast.error(message);
    }
  };
  
  const handleDelete = async (id: number) => {
    // Use confirmation modal triggered by setting pendingDeleteId
    setPendingDeleteId(id);
  };

  const confirmDelete = async () => {
    if (pendingDeleteId == null) return;
    try {
      await deleteCategory(pendingDeleteId).unwrap();
      toast.success('Category deleted');
      setSuccessMessage('Category deleted');
    } catch (err) {
      console.error('Failed to delete category:', err);
      toast.error('Could not delete category');
    } finally {
      setPendingDeleteId(null);
    }
  };

  const cancelDelete = () => setPendingDeleteId(null);

  return (
    <div className="w-full bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-md">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">Manage Categories</h2>
      
      {/* Create Category Form */}
      <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 mb-4 items-center">
        <label htmlFor="new-category" className="sr-only">New category name</label>
        <input
          id="new-category"
          type="text"
          value={newCategoryName}
          onChange={(e) => {
            setNewCategoryName(e.target.value);
            if (createError) setCreateError(null);
            if (successMessage) setSuccessMessage(null);
          }}
          placeholder="New category name"
          className="flex-grow w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isCreating}
          aria-invalid={!!createError}
          aria-describedby={createError ? 'create-error' : undefined}
        />
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(ev) => {
              const f = ev.target.files?.[0] || null;
              if (f) {
                const reader = new FileReader();
                reader.onload = () => setCoverPreview(String(reader.result));
                reader.readAsDataURL(f);
              } else {
                setCoverPreview(null);
              }
            }}
          />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-2 bg-gray-100 rounded-md text-sm">{coverPreview ? 'Change Cover' : 'Upload Cover'}</button>
          {coverPreview && <img src={coverPreview} alt="cover preview" className="h-10 w-16 object-cover rounded ml-2" />}
        </div>
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors shadow-sm"
          disabled={isCreating || !newCategoryName.trim()}
          aria-busy={isCreating}
        >
          {isCreating ? 'Adding...' : 'Add Category'}
        </button>
      </form>
      {createError && (
        <p id="create-error" className="text-sm text-red-600 mb-4" role="alert" aria-live="assertive">
          {createError}
        </p>
      )}
      {successMessage && (
        <p className="text-sm text-green-600 mb-4" role="status" aria-live="polite">
          {successMessage}
        </p>
      )}

      {/* Category List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Existing Categories</h3>
        {isLoading ? (
          <p role="status" className="text-gray-500">Loading categories...</p>
        ) : isError ? (
          <p className="text-red-500">Failed to load categories.</p>
        ) : !categories || categories.length === 0 ? (
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-gray-600">No categories found. Add a new category using the form above.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {categories.map((category) => (
              <li
                key={category.categoryId}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                onClick={(e) => e.stopPropagation()} // prevent parent handlers from receiving clicks
              >
                <span className="text-gray-800">{category.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(category.categoryId);
                  }}
                  className="text-sm font-medium text-red-600 hover:text-red-800"
                  aria-label={`Delete ${category.name}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={pendingDeleteId != null}
        title="Delete category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        onClose={cancelDelete}
        onConfirm={() => {
          void confirmDelete();
        }}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default CategoryManager;