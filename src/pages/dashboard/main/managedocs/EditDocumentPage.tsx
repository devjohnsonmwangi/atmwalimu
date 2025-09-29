import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useUpdateDocumentMutation,
  useFetchDocumentByIdQuery,
} from '../../../../features/documents/docmentsApi';
import Button from '../../../../components/Button';
import { Edit, FileText, AlertTriangle, Info, Star, Loader2 } from 'lucide-react';

const documentGenres = [
  "Lecture Notes", "Exam Paper", "Revision Guide", "Book", "Novel",
  "Research Paper", "Thesis", "Case Study", "Tutorial", "Other",
];

const EditDocumentPage: React.FC = () => {
  const navigate = useNavigate();
  const { documentId } = useParams<{ documentId: string }>();

  // --- State Management ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // --- RTK Hooks ---
  const { 
    data: existingDocument, 
    isLoading: isLoadingDocument, 
    error: fetchError 
  } = useFetchDocumentByIdQuery(Number(documentId), { skip: !documentId });

  const [updateDocument, { isLoading: isUpdating, error: updateError }] = useUpdateDocumentMutation();
  const apiError = fetchError || updateError;

  // --- Effect to pre-fill the form once data is fetched ---
  useEffect(() => {
    if (existingDocument) {
      setTitle(existingDocument.title);
      setDescription(existingDocument.description || '');
      setGenre(existingDocument.genre);
      setPrice(existingDocument.price);
      setIsFeatured(existingDocument.isFeatured);
    }
  }, [existingDocument]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrice(value === '' ? '' : parseFloat(value));
  };

  // --- FIX: This function now creates a JSON object, not FormData ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim() || !genre.trim()) {
      setFormError('Title and genre are required fields.');
      return;
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      setFormError('Price must be a valid non-negative number.');
      return;
    }

    // Create the payload as a plain object to match the RTK Query definition
    const updatePayload = {
        title,
        description,
        genre,
        price: numericPrice,
        isFeatured,
    };
    
    try {
      // Call the mutation with an object containing documentId and the patch data
      await updateDocument({
        documentId: Number(documentId),
        ...updatePayload
      }).unwrap();

      // Navigate back to the management page on success
      navigate('/dashboard/admin/manage-documents');
    } catch (err) {
      console.error('Failed to update document:', err);
      // The `apiError` state will automatically display the error from RTK
    }
  };
  
  const isFree = Number(price) <= 0;

  if (isLoadingDocument) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <span className="ml-4 text-lg text-gray-700">Loading Document...</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-0 py-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-green-600 to-teal-700 text-white p-6 rounded-lg shadow-lg mb-8 flex items-center gap-4">
          <Edit className="h-8 w-8 flex-shrink-0" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Edit Document</h1>
            <p className="text-green-200 text-sm mt-1">Update the details for "{existingDocument?.title}"</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 shadow-lg rounded-lg space-y-8">
          
          {/* --- FIX: Removed file input, as the update mutation only handles metadata --- */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Current File</h2>
            <div className="flex items-center p-4 bg-gray-100 border border-gray-200 rounded-lg text-gray-800">
                <FileText className="h-6 w-6 text-gray-500 flex-shrink-0 mr-3" />
                <span className="font-medium truncate">{existingDocument?.documentUrl.split('/').pop()?.split('-').slice(1).join('-')}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">To replace the document file, please delete this entry and upload a new one.</p>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Update Details</h2>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
              <select id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" required>
                <option value="" disabled>Select a genre...</option>
                {documentGenres.map((g) => (<option key={g} value={g}>{g}</option>))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (Ksh)</label>
              <input type="number" id="price" value={price} onChange={handlePriceChange} min="0" step="1" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0" />
              {isFree && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 mt-2 rounded-md">
                  <Info size={16} /><span>This document will be marked as free.</span>
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2 text-sm font-medium text-gray-700"><Star size={16} /> Mark as Featured</span>
                <div className="relative">
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </label>
            </div>
          </div>

          {(formError || apiError) && (
            <div className="flex items-center gap-3 p-3 bg-red-50 text-red-800 rounded-md text-sm border border-red-200">
              <AlertTriangle size={20} className="flex-shrink-0"/>
              <span>{formError || 'An API error occurred. Please try again.'}</span>
            </div>
          )}

          <div className="border-t pt-6 flex justify-end space-x-4">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" isLoading={isUpdating}>Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDocumentPage;