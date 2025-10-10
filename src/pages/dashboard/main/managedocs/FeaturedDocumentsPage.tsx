import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFetchDocumentsQuery } from '../../../../features/documents/docmentsApi';
import { Document } from '../../../../features/documents/docmentsApi';
import { addItemToCart } from '../../../../features/cart/cartSlice';
import DocumentCard from '../../../../components/documents/DocumentCard';
import Spinner from '../../../../components/Spinner';
import Button from '../../../../components/Button';
import { Star, Sparkles, AlertTriangle } from 'lucide-react';
import ReloadButton from '../../../../components/ui/ReloadButton';

// --- Showcase Card with the new, simplified button logic ---
const ShowcaseDocumentCard: React.FC<{ document: Document }> = ({ document }) => {
  const dispatch = useDispatch();

  // A simple handler specifically for adding items to the cart.
  const handleAddToCart = () => {
    dispatch(addItemToCart(document));
    // Optionally, you could show a "toast" notification here saying "Added to cart!"
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden lg:grid lg:grid-cols-2 lg:gap-6 items-center p-6 border border-amber-300">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 bg-amber-100 rounded-full opacity-50"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-32 w-32 bg-indigo-100 rounded-full opacity-50"></div>
      
      <div className="relative z-10">
        <div className="absolute -top-10 -right-10 bg-amber-400 text-white font-bold uppercase text-xs px-10 py-1 transform rotate-45">
          Featured
        </div>
        <h2 className="text-3xl font-bold font-poppins text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors">
          {document.title}
        </h2>
        <p className="text-gray-600 italic mb-4 h-24 overflow-y-auto scrollbar-thin">
          {document.description || 'No description available.'}
        </p>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center mt-4 lg:mt-0">
        <div className="text-4xl font-extrabold text-indigo-700 mb-4">
          {document.isFree ? 'Free Access' : `Ksh ${document.price}`}
        </div>
        
        {/* --- NEW SIMPLIFIED BUTTON LOGIC --- */}
        {document.isFree ? (
          // For FREE documents, this is a direct link to the file.
          <a href={document.documentUrl} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button size="lg" className="w-full">View Document</Button>
          </a>
        ) : (
          // For PAID documents, this button just adds the item to the cart.
          <Button size="lg" className="w-full" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
};


const FeaturedDocumentsPage: React.FC = () => {
  const { data: response, error, isLoading } = useFetchDocumentsQuery({ page: 1, limit: 100 });
  const featuredDocuments = response?.data?.filter(doc => doc.isFeatured);
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }

  if (error) {
    return (
      <div className="text-center p-10 bg-red-50 text-red-700 rounded-lg max-w-2xl mx-auto mt-10">
        <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
        <h2 className="text-2xl font-bold">An Error Occurred</h2>
        <p>Could not load documents. Please try again later.</p>
      </div>
    );
  }

  const showcaseDocument = featuredDocuments && featuredDocuments.length > 0 ? featuredDocuments[0] : null;
  const remainingDocuments = featuredDocuments && featuredDocuments.length > 1 ? featuredDocuments.slice(1) : [];

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* --- ELEGANT HEADER (Light Mode) --- */}
        <div className="flex items-center justify-between border-b-2 border-amber-400 pb-6 mb-12">
          <div className="text-left">
            <Star className="h-12 w-12 text-amber-400 mb-4" fill="currentColor" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">Featured Documents</h1>
            <p className="mt-2 max-w-2xl text-lg text-gray-600">A curated collection of our top-rated and most valuable resources.</p>
          </div>
          <div>
            <ReloadButton />
          </div>
        </div>

        {/* --- SHOWCASE & GRID SECTION --- */}
        {featuredDocuments && featuredDocuments.length > 0 ? (
          <div className="space-y-12">
            {showcaseDocument && (
              <section>
                <ShowcaseDocumentCard document={showcaseDocument} />
              </section>
            )}
            {remainingDocuments.length > 0 && (
              <section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {remainingDocuments.map(doc => (
                    <DocumentCard
                      key={doc.documentId}
                      document={doc}
                      onCardClick={() => navigate(`/documents/${doc.documentId}`)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* --- "NO DOCUMENTS" ELEGANT STATE (Light Mode) --- */
          <div className="text-center py-20 px-6 bg-white rounded-lg shadow-md border">
            <Sparkles className="mx-auto h-16 w-16 text-amber-400 mb-6" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Spotlight is Awaiting!</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              There are currently no featured documents. Check back soon as we are always curating new and exciting content.
            </p>
            <Link to="/documents">
              <Button variant="secondary" size="lg">Explore All Documents</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedDocumentsPage;