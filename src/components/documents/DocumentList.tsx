import React from 'react';
import { Document } from '../../features/documents/docmentsApi'; // Corrected Path
import DocumentCard from './DocumentCard';
import DocumentCardSkeleton from './DocumentCardSkeleton';

interface DocumentListProps {
  documents?: Document[];
  isLoading: boolean;
  error?: object | null;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, isLoading, error }) => {
  // --- Loading State ---
  // Display a grid of skeleton loaders to match the final layout.
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Create an array of 8 items to render 8 skeletons */}
        {Array.from({ length: 8 }).map((_, index) => (
          <DocumentCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // --- Error State ---
  // Display a user-friendly error message.
  if (error) {
    return (
      <div className="text-center mt-10 p-4 bg-red-100 text-red-700 rounded-md">
        <p className="font-semibold">An error occurred while fetching documents.</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  // --- Empty State ---
  // Display a message if there are no documents to show.
  if (!documents || documents.length === 0) {
    return (
      <div className="text-center mt-10 p-6 bg-gray-50 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800">No Documents Found</h3>
        <p className="text-gray-600 mt-2">There are no documents that match your criteria.</p>
      </div>
    );
  }

  // --- Success State ---
  // Display the grid of actual document cards.
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {documents.map((document) => (
        <DocumentCard key={document.documentId} document={document} />
      ))}
    </div>
  );
};

export default DocumentList;