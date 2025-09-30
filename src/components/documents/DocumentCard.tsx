// src/components/documents/DocumentCard.tsx (UPDATED)

import React from 'react';
// import { Link } from 'react-router-dom'; // <-- REMOVED: No longer using Link for navigation here
import { useDispatch, useSelector } from 'react-redux';
import { Document } from '../../features/documents/docmentsApi';
import { addItemToCart, selectIsInCart } from '../../features/cart/cartSlice';
import { useFetchMyLibraryQuery } from '../../features/documents/docmentsApi';
import { useAuth } from '../../hooks/useAuth';
import { useFileDownloader } from '../../hooks/useFileDownloader';
import Button from '../Button';
import { ShoppingCart, FileText, Eye, Download, BookOpen } from 'lucide-react';

interface DocumentCardProps {
  document: Document;
  /** A function to be called when the main card area is clicked. */
  onCardClick: () => void; // <-- NEW: Prop to handle the click event
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onCardClick }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  
  const { downloadFile, isLoading: isDownloading } = useFileDownloader();

  const isInCart = useSelector(selectIsInCart(document.documentId));
  const { data: myLibrary } = useFetchMyLibraryQuery(undefined, {
    skip: !isAuthenticated,
  });

  const isPurchased = myLibrary?.some(libDoc => libDoc.documentId === document.documentId);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click from firing
    dispatch(addItemToCart(document));
  };
  
  // UPDATED: The "View" button now triggers the same preview action as clicking the card.
  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click from firing twice
    onCardClick();
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click from firing
    const fileExtension = document.documentUrl.split('.').pop() || 'file';
    downloadFile(document.documentUrl, `${document.title}.${fileExtension}`);
  };

  const canAddToCart = isAuthenticated && !document.isFree && !isPurchased && !isInCart;

  // UPDATED: The main wrapper is now a div with an onClick handler.
  return (
    <div 
      className="group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1 cursor-pointer"
      onClick={onCardClick} // <-- NEW: Main click handler for the entire card
    >
      
      {/* UPDATED: The Link has been replaced with a simple div. It no longer controls navigation. */}
      <div className="p-5 flex-grow flex flex-col">
        
        <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                {document.genre}
            </span>
        </div>

        <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-3">
          <FileText className="h-5 w-5 text-gray-500 group-hover:text-blue-600 flex-shrink-0" aria-hidden="true" />
          <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-blue-600" title={document.title}>
            {document.title}
          </h3>
        </div>

        <div className="h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
          <p className="text-gray-600 text-sm">
            {document.description || 'No description available.'}
          </p>
        </div>
      </div>
      
      {/* --- Card Footer --- */}
      {/* All buttons in the footer use e.stopPropagation() to prevent the main card's onClick from firing. */}
      <div className="flex justify-between items-center mt-auto p-4 bg-slate-50 border-t border-slate-100">
        <span className={`text-xl font-extrabold ${document.isFree ? 'text-green-600' : 'text-indigo-600'}`}>
          {document.isFree ? 'Free' : `Ksh ${document.price}`}
        </span>
        
        <div className="flex items-center">
          {isPurchased ? (
            <Button size="sm" onClick={handleDownload} disabled={isDownloading} title="Download this document">
              {isDownloading ? '...' : <><Download className="mr-2 h-4 w-4" /> Download</>}
            </Button>
          ) : document.isFree ? (
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleView} variant="secondary" title="Open Preview">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button size="sm" onClick={handleDownload} disabled={isDownloading} title="Download file">
                {isDownloading ? '...' : <Download className="h-4 w-4" />}
              </Button>
            </div>
          ) : isInCart ? (
             <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 px-3 py-1.5" onClick={(e) => e.stopPropagation()}>
                <ShoppingCart size={16} />
                <span>In Cart</span>
             </div>
          ) : canAddToCart ? (
            <Button size="sm" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          ) : (
            <Button size="sm" disabled={true} onClick={(e) => e.stopPropagation()}>
              Add to Cart
            </Button>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 h-1.5 w-full bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></div>
    </div>
  );
};

export default DocumentCard;