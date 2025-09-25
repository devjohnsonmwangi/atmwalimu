import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Document } from '../../features/documents/docmentsApi';
import { addItemToCart, selectIsInCart } from '../../features/cart/cartSlice';
import { useFetchMyLibraryQuery } from '../../features/documents/docmentsApi';
import { useAuth } from '../../hooks/useAuth';
import { useFileDownloader } from '../../hooks/useFileDownloader';
import Button from '../Button';
// Import necessary icons, including BookOpen for the new genre field
import { ShoppingCart, FileText, Eye, Download, BookOpen } from 'lucide-react';

interface DocumentCardProps {
  document: Document;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  
  const { downloadFile, isLoading: isDownloading } = useFileDownloader();

  const isInCart = useSelector(selectIsInCart(document.documentId));
  const { data: myLibrary } = useFetchMyLibraryQuery(undefined, {
    skip: !isAuthenticated,
  });

  const isPurchased = myLibrary?.some(libDoc => libDoc.documentId === document.documentId);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addItemToCart(document));
  };
  
  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(document.documentUrl, '_blank');
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const fileExtension = document.documentUrl.split('.').pop() || 'file';
    downloadFile(document.documentUrl, `${document.title}.${fileExtension}`);
  };

  // Determine if the "Add to Cart" button should be enabled.
  const canAddToCart = isAuthenticated && !document.isFree && !isPurchased && !isInCart;

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1">
      
      <Link to={`/dashboard/documents/${document.documentId}`} className="p-5 flex-grow flex flex-col">
        
        {/* --- NEW: Genre Badge --- */}
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

        {/* Description with custom scrollbar */}
        <div className="h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
          <p className="text-gray-600 text-sm">
            {document.description || 'No description available.'}
          </p>
        </div>
      </Link>
      
      {/* --- Card Footer --- */}
      <div className="flex justify-between items-center mt-auto p-4 bg-slate-50 border-t border-slate-100">
        <span className={`text-xl font-extrabold ${document.isFree ? 'text-green-600' : 'text-indigo-600'}`}>
          {document.isFree ? 'Free' : `Ksh ${document.price}`}
        </span>
        
        <div className="flex items-center">
          {isPurchased ? (
            // 1. If purchased, show a prominent Download button
            <Button size="sm" onClick={handleDownload} disabled={isDownloading} title="Download this document from your library">
              {isDownloading ? 'Downloading...' : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </>
              )}
            </Button>
          ) : document.isFree ? (
            // 2. If free, show View and Download options
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleView} variant="secondary">
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
              <Button 
                size="sm" 
                onClick={handleDownload} 
                disabled={isDownloading}
                title="Download file"
              >
                {isDownloading ? '...' : <Download className="h-4 w-4" />}
              </Button>
            </div>
          ) : isInCart ? (
             // 3. If in cart, show an "In Cart" indicator
             <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 px-3 py-1.5">
                <ShoppingCart size={16} />
                <span>In Cart</span>
             </div>
          ) : canAddToCart ? (
            // 4. If available to buy, show "Add to Cart"
            <Button size="sm" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          ) : (
            // 5. Fallback for non-logged-in users
            <Button size="sm" disabled={true} title="You must be logged in to add paid items to the cart">
              Add to Cart
            </Button>
          )}
        </div>
      </div>
      
      {/* --- Decorative Bottom Border on Hover --- */}
      <div className="absolute bottom-0 left-0 h-1.5 w-full bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></div>
    </div>
  );
};

export default DocumentCard;