import React, { useState, useEffect } from 'react';
import { useFetchDocumentsQuery } from '../../../../features/documents/docmentsApi'; // Corrected Path
import DocumentList from '../../../../components/documents/DocumentList'; // Corrected Path
import Button from '../../../../components/Button'; // Corrected Path
import { Search } from 'lucide-react'; // Import the search icon

// --- ASSUMPTION ---
// We are assuming the main navigation bar has a fixed height.
// Let's assume it is 64px for this example. You should adjust this value.
const MAIN_NAV_HEIGHT = '64px';

const AllDocumentsPage: React.FC = () => {
  // --- State Management for Query Parameters ---
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // --- Debouncing User Input ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // --- API Data Fetching ---
  const { data: paginatedResponse, error, isLoading, isFetching } = useFetchDocumentsQuery({
    page: currentPage,
    limit: 12,
    searchTerm: debouncedSearchTerm,
  });

  const { data: documents, totalPages } = paginatedResponse || {};

  // --- Event Handlers for Pagination ---
  const handleNextPage = () => {
    if (totalPages && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50" style={{ paddingTop: MAIN_NAV_HEIGHT }}>
      
      {/* --- FIXED HEADER (BELOW MAIN NAV) --- */}
      {/* This header is now 'sticky' and uses a 'top' value to position itself below the main navigation. */}
      <header 
        className="sticky w-full z-10 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-lg"
        style={{ top: MAIN_NAV_HEIGHT }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Title and Subtitle */}
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold">
              Explore Our Document Library
            </h1>
            <p className="text-blue-200 mt-1">Find the resources you need.</p>
          </div>
          
          {/* Search Input with Icon */}
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
      {/* This main container is now the primary scrolling area for the document cards. */}
      <main className="flex-grow overflow-y-auto p-4 md:p-6">
        {/* --- Document List Display --- */}
        <DocumentList
          documents={documents}
          isLoading={isLoading || isFetching}
          error={error}
        />
      
        {/* --- Pagination Controls --- */}
        {totalPages && totalPages > 1 && (
          <div className="flex justify-between items-center mt-8">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
          
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllDocumentsPage;