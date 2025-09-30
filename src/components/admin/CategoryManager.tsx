import React, { useState } from 'react';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from '../../features/articles/articlesApi';

const CategoryManager: React.FC = () => {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [newCategoryName, setNewCategoryName] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      await createCategory({ name: newCategoryName }).unwrap();
      setNewCategoryName(''); // Reset form on success
    } catch (err) {
      console.error('Failed to create category:', err);
      // You can add user-facing error handling here (e.g., a toast notification)
    }
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
        try {
            await deleteCategory(id).unwrap();
        } catch (err) {
            console.error('Failed to delete category:', err);
        }
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Categories</h2>
      
      {/* Create Category Form */}
      <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New category name"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isCreating}
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          disabled={isCreating || !newCategoryName.trim()}
        >
          {isCreating ? 'Adding...' : 'Add Category'}
        </button>
      </form>

      {/* Category List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Existing Categories</h3>
        {isLoading && <p className="text-gray-500">Loading categories...</p>}
        {isError && <p className="text-red-500">Failed to load categories.</p>}
        {categories && (
          <ul className="space-y-3">
            {categories.map((category) => (
              <li
                key={category.categoryId}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <span className="text-gray-800">{category.name}</span>
                <button
                  onClick={() => handleDelete(category.categoryId)}
                  className="text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </li>
            ))}
             {categories.length === 0 && <p className="text-gray-500">No categories found.</p>}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;