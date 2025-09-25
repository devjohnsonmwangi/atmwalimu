import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFetchMyLibraryQuery } from '../../../../features/documents/docmentsApi';
import DocumentCard from '../../../../components/documents/DocumentCard';
import Spinner from '../../../../components/Spinner';
import { Document } from '../../../../features/documents/docmentsApi';

const MyLibraryPage: React.FC = () => {
  const { data: myLibrary, error, isLoading } = useFetchMyLibraryQuery();

  const groupedLibrary = useMemo(() => {
    if (!myLibrary) {
      return {};
    }
    const groups: { [key: string]: Document[] } = {};
    const sortedDocs = [...myLibrary].sort((a, b) => a.title.localeCompare(b.title));
    sortedDocs.forEach(doc => {
      const firstLetter = doc.title[0]?.toUpperCase() || '#';
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(doc);
    });
    return groups;
  }, [myLibrary]);

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center mt-20"><Spinner /></div>;
    }

    if (error) {
      return (
        <div className="text-center mt-10 p-6 bg-red-50 text-red-700 rounded-lg">
          <h3 className="text-xl font-semibold">An Error Occurred</h3>
          <p className="mt-2">We couldn't load your library. Please try again later.</p>
        </div>
      );
    }

    const libraryKeys = Object.keys(groupedLibrary);

    if (libraryKeys.length === 0) {
      return (
        // Enhanced empty state with more vertical padding for focus
        <div className="text-center py-16 sm:py-24">
          <div className="max-w-md mx-auto p-8 bg-gray-50 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-800">Your Library is Empty</h3>
            <p className="text-gray-600 mt-2 mb-6">Purchased documents will appear here automatically.</p>
            <Link to="/dashboard/documents" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Browse Documents
            </Link>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-10">
        {libraryKeys.map(letter => (
          <section key={letter}>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 border-b-2 border-gray-200 pb-2 mb-6 tracking-wide">
              {letter}
            </h2>
            {/* --- 3. Tighter, more app-like grid --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
              {groupedLibrary[letter].map(doc => (
                <DocumentCard key={doc.documentId} document={doc} />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  };

  return (
    // --- 1. Main container is now full-width (no padding) ---
    <div className="bg-white min-h-screen">
      {/* --- 2. New wrapper provides minimal horizontal padding for all screen sizes --- */}
      <div className="w-full mx-auto px-2 sm:px-4">
        <div className="py-4 sm:py-6 mb-4 border-b">
          <h1 className="relative group w-fit text-3xl sm:text-4xl font-bold font-poppins text-blue-600">
            My Library
            <span 
              className="absolute bottom-0 left-0 w-full h-1 bg-green-500 
                         transform scale-x-0 group-hover:scale-x-100 
                         transition-transform duration-300 ease-out"
            ></span>
          </h1>
          <p className="text-gray-600 mt-1 font-poppins text-sm sm:text-base">All your purchased documents in one place.</p>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default MyLibraryPage;