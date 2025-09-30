// src/pages/documents/AllDocumentsPage.tsx (your file path)

import React, { useState, useEffect } from 'react';
import { useFetchDocumentsQuery, Document } from '../../../../features/documents/docmentsApi'; // Corrected Path & IMPORT Document type
import DocumentList from '../../../../components/documents/DocumentList'; // Corrected Path
import Button from '../../../../components/Button'; // Corrected Path
import DocumentPreviewer from '../../../../components/documents/DocumentPreviewer'; // <-- IMPORT THE PREVIEWER
import { Search, X } from 'lucide-react'; // <-- IMPORT X for the close icon

const MAIN_NAV_HEIGHT = '64px';

const AllDocumentsPage: React.FC = () => {
  // --- State Management ---
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null); // <-- NEW: State for the selected document

  // --- Debouncing ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // --- API Data Fetching ---
  const { data: paginatedResponse, error, isLoading, isFetching } = useFetchDocumentsQuery({
    page: currentPage,
    limit: 12,
    searchTerm: debouncedSearchTerm,
  });

  const { data: documents, totalPages } = paginatedResponse || {};

  // --- Event Handlers ---
  const handleNextPage = () => {
    if (totalPages && currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  
  // <-- NEW: Handlers for selecting and closing the document preview
  const handleDocumentSelect = (doc: Document) => {
    setSelectedDocument(doc);
  };

  const handleClosePreview = () => {
    setSelectedDocument(null);
  };

  return (
    <> {/* Use a fragment to contain the page and the modal */}
      <div className="flex flex-col h-screen bg-gray-50" style={{ paddingTop: MAIN_NAV_HEIGHT }}>
        
        {/* --- FIXED HEADER --- */}
        <header 
          className="sticky w-full z-10 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-lg"
          style={{ top: MAIN_NAV_HEIGHT }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold">Explore Our Document Library</h1>
              <p className="text-blue-200 mt-1">Find the resources you need.</p>
            </div>
            
            <div className="relative w-full md:w-2/5">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title..."
                className="w-full pl-10 pr-4 py-2 border border-transparent rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        </header>

        {/* --- SCROLLABLE MAIN CONTENT --- */}
        <main className="flex-grow overflow-y-auto p-4 md:p-6">
          
          {/* --- NEW: Instructional Text --- */}
          <p className="text-center text-gray-500 mb-6 -mt-2">
            Click or tap on any document to open a preview.
          </p>

          {/* --- Document List Display --- */}
          <DocumentList
            documents={documents}
            isLoading={isLoading || isFetching}
            error={error}
            onDocumentSelect={handleDocumentSelect} // <-- NEW: Pass the handler to the list
          />
        
          {/* --- Pagination Controls --- */}
          {totalPages && totalPages > 1 && (
            <div className="flex justify-between items-center mt-8">
              <Button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</Button>
              <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
              <Button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</Button>
            </div>
          )}
        </main>
      </div>

      {/* --- NEW: Document Preview Modal --- */}
      {selectedDocument && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
          onClick={handleClosePreview} // Close modal on overlay click
        >
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 truncate">{selectedDocument.title}</h2>
              <button onClick={handleClosePreview} className="p-1 rounded-full hover:bg-gray-200">
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Body with Previewer */}
            <div className="overflow-y-auto flex-grow">
              <DocumentPreviewer
                fileUrl={selectedDocument.documentUrl}
                fileName={selectedDocument.title}
                isFree={selectedDocument.isFree}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllDocumentsPage;