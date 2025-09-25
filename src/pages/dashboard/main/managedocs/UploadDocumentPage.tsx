import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateDocumentMutation } from '../../../../features/documents/docmentsApi'; // Corrected Path
import Button from '../../../../components/Button';
import { UploadCloud, FileText, X, AlertTriangle, Info, FileUp, Star } from 'lucide-react';

// Define a list of genres for the dropdown. This can be moved to a config file.
const documentGenres = [
  "Lecture Notes",
  "Exam Paper",
  "Revision Guide",
  "Book",
  "Novel",
  "Research Paper",
  "Thesis",
  "Case Study",
  "tutorial",
  "Other",
];

const UploadDocumentPage: React.FC = () => {
  const navigate = useNavigate();

  // --- State Management ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState(0); // Initial price is set to 0
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFree, setIsFree] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // --- RTK Mutation Hook ---
  const [createDocument, { isLoading, error: apiError }] = useCreateDocumentMutation();

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setFormError(null);
    }
  };

  // --- MODIFIED: Enhanced price validation ---
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newPrice = parseFloat(e.target.value);

    // Ensure the price is a valid number and not less than 0
    if (isNaN(newPrice) || newPrice < 0) {
      newPrice = 0;
    }

    setPrice(newPrice);
    setIsFree(newPrice <= 0);
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim() || !selectedFile || !genre.trim()) {
      setFormError('Title, file, and genre are all required fields.');
      return;
    }
    
    // --- ADDED: Final check before submission ---
    if (price < 0) {
        setFormError("Price must not be less than 0.");
        return;
    }

    try {
      await createDocument({ title, description, genre, price, file: selectedFile, isFeatured }).unwrap();
      navigate('/dashboard/admin/manage-documents');
    } catch (err) {
      console.error('Failed to upload document:', err);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-0 py-4 sm:px-6 lg:px-8">
        
        <div className="relative bg-gradient-to-r from-indigo-600 to-blue-700 text-white p-6 rounded-lg shadow-lg mb-8 flex items-center gap-4 overflow-hidden group">
          <UploadCloud className="h-8 w-8 flex-shrink-0" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Upload a New Document</h1>
            <p className="text-indigo-200 text-sm mt-1">Add a new resource to the library.</p>
          </div>
          <div className="absolute bottom-0 left-0 h-1.5 w-full bg-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 shadow-lg rounded-lg space-y-8">

          {/* --- Step 1: File Upload --- */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Step 1: Choose a File</h2>
            {!selectedFile ? (
              <label
                onDragEnter={handleDragEnter} onDragOver={handleDragEnter}
                onDragLeave={handleDragLeave} onDrop={handleDrop}
                className={`relative block w-full border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}
              >
                <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm font-semibold text-gray-600">Drag & Drop or click to browse</span>
                <input type="file" onChange={(e) => handleFileChange(e.target.files)} className="sr-only" required />
              </label>
            ) : (
              <div className="flex items-center justify-between p-4 bg-slate-100 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3"><FileText className="h-6 w-6 text-indigo-600 flex-shrink-0" /><span className="font-medium text-gray-800 truncate">{selectedFile.name}</span></div>
                <button type="button" onClick={() => setSelectedFile(null)} className="p-1 text-gray-500 hover:text-red-600 rounded-full"><X size={20} /></button>
              </div>
            )}
          </div>
          
          {/* --- Step 2: Document Details --- */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Step 2: Add Details</h2>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>

            {/* --- NEW: Genre/Type Selector --- */}
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">Genre / Document Type</label>
              <select
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                required
              >
                <option value="" disabled>Select a genre...</option>
                {documentGenres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (Ksh)</label>
              <input type="number" id="price" value={price} onChange={handlePriceChange} min="0" step="1" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              {isFree && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 mt-2 rounded-md">
                  <Info size={16} /><span>This document will be marked as free.</span>
                </div>
              )}
            </div>

            {/* --- Featured Toggle Switch --- */}
            <div>
                <label className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Star size={16} /> Mark as Featured
                    </span>
                    <div className="relative">
                        <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </div>
                </label>
                <p className="text-xs text-gray-500 mt-1">Featured documents appear on the homepage and at the top of lists.</p>
            </div>
          </div>

          {/* --- Error Display --- */}
          {(formError || apiError) && (
            <div className="flex items-center gap-3 p-3 bg-red-50 text-red-800 rounded-md text-sm border border-red-200">
              <AlertTriangle size={20} className="flex-shrink-0"/>
              <span>{formError || 'An API error occurred. Please try again.'}</span>
            </div>
          )}

          {/* --- Form Footer with Action Buttons --- */}
          <div className="border-t pt-6 flex justify-end space-x-4">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Upload Document
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDocumentPage;