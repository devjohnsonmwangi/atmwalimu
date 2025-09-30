import React from 'react';
import { Document } from '../../features/documents/docmentsApi'; // Adjust path if necessary
import DocumentCard from './DocumentCard';
import DocumentCardSkeleton from './DocumentCardSkeleton';

/**
 * The properties for the DocumentList component.
 */
interface DocumentListProps {
  /** The array of documents to display. */
  documents?: Document[];
  /** A boolean indicating if the documents are currently being loaded. */
  isLoading: boolean;
  /** An error object if the data fetching failed. */
  error?: object | null;
  /** A callback function that is triggered when a document card is selected. */
  onDocumentSelect: (document: Document) => void;
}

/**
 * A component that displays a grid of documents, handling loading, error, and empty states.
 */
const DocumentList: React.FC<DocumentListProps> = ({ documents, isLoading, error, onDocumentSelect }) => {
  // --- Loading State ---
  // Display a grid of skeleton loaders to match the final layout and prevent layout shifts.
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Render 8 skeleton cards as placeholders while data is fetching. */}
        {Array.from({ length: 8 }).map((_, index) => (
          <DocumentCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // --- Error State ---
  // Display a user-friendly error message if the API call fails.
  if (error) {
    return (
      <div className="text-center mt-10 p-4 bg-red-100 text-red-700 rounded-md">
        <p className="font-semibold">An error occurred while fetching documents.</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  // --- Empty State ---
  // Display a helpful message if no documents match the current filters or search query.
  if (!documents || documents.length === 0) {
    return (
      <div className="text-center mt-10 p-6 bg-gray-50 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800">No Documents Found</h3>
        <p className="text-gray-600 mt-2">There are no documents that match your criteria.</p>
      </div>
    );
  }

  // --- Success State ---
  // Display the grid of actual document cards. The `onDocumentSelect` function is
  // passed down to each `DocumentCard` as the `onCardClick` prop.
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {documents.map((document) => (
        <DocumentCard
          key={document.documentId}
          document={document}
          onCardClick={() => onDocumentSelect(document)} // This is the crucial link to the parent page.
        />
      ))}
    </div>
  );
};

export default DocumentList;