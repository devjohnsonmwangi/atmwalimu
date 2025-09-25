import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUploadDocumentForApprovalMutation } from '../../../../features/documents/docmentsApi';
import Button from '../../../../components/Button';
import { UploadCloud, FileText, X, AlertTriangle, CheckCircle, FileUp, } from 'lucide-react';

// Define a consistent list of genres for the dropdown.
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

const UploadForApprovalPage: React.FC = () => {
  const navigate = useNavigate();

  // --- State Management ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState(''); // <-- NEW STATE for genre
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // --- RTK Mutation Hook ---
  const [uploadDocument, { isLoading, error: apiError }] = useUploadDocumentForApprovalMutation();

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setFormError(null);
    }
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

    // --- MODIFICATION: Added validation for the new 'genre' field ---
    if (!title.trim() || !selectedFile || !genre.trim()) {
      setFormError('Title, file, and genre are all required fields.');
      return;
    }

    // --- MODIFICATION: Added 'genre' to the payload ---
    const payload = { title, description, genre, file: selectedFile };

    try {
      await uploadDocument(payload).unwrap();
      setUploadSuccess(true);
    } catch (err) {
      console.error('Failed to submit document:', err);
    }
  };

  // --- SUCCESS SCREEN RENDER ---
  if (uploadSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl max-w-lg w-full">
          <CheckCircle className="text-green-500 h-20 w-20 mx-auto mb-6" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Submission Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your submission. Our administrators will review your document shortly. You will be notified once a decision has been made.
          </p>
          <Button onClick={() => navigate('/dashboard')} size="lg">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // --- FORM RENDER ---
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-0 py-4 sm:px-6 lg:px-8">
        
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-lg shadow-lg mb-8 flex items-center gap-4 overflow-hidden group">
          <UploadCloud className="h-8 w-8 flex-shrink-0" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Submit Your Work</h1>
            <p className="text-blue-200 text-sm mt-1">Share your knowledge with the community.</p>
          </div>
          <div className="absolute bottom-0 left-0 h-1.5 w-full bg-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 shadow-lg rounded-lg space-y-8">
          
          {/* --- Step 1: File Upload --- */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Step 1: Upload Your File</h2>
            {!selectedFile ? (
              <label
                onDragEnter={handleDragEnter} onDragOver={handleDragEnter}
                onDragLeave={handleDragLeave} onDrop={handleDrop}
                className={`relative block w-full border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}
              >
                <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm font-semibold text-gray-600">Drag & Drop your file here</span>
                <span className="mt-1 block text-xs text-gray-500">or click to browse</span>
                <input type="file" onChange={(e) => handleFileChange(e.target.files)} className="sr-only" />
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
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Step 2: Add Details</h2>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>

            {/* --- NEW: Genre/Type Selector --- */}
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                Genre / Document Type
              </label>
              <select
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                required
              >
                <option value="" disabled>Select a type...</option>
                {documentGenres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          
          {/* --- Error Display --- */}
          {(formError || apiError) && (
            <div className="flex items-center gap-3 p-3 bg-red-50 text-red-800 rounded-md text-sm border border-red-200">
              <AlertTriangle size={20} className="flex-shrink-0"/>
              <span>{formError || 'An API error occurred. Please try again.'}</span>
            </div>
          )}

          {/* --- Form Footer with Action Button --- */}
          <div className="border-t pt-6 flex justify-end">
            <Button type="submit" isLoading={isLoading} size="lg">
              Submit for Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadForApprovalPage;