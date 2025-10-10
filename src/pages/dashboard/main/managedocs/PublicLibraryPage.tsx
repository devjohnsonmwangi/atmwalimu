import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Core API and Type Imports ---
import { 
    useFetchDocumentsByGenreQuery, 
    Document 
} from '../../../../features/documents/docmentsApi'; 

// --- Component Imports ---
import DocumentCard from '../../../../components/documents/DocumentCard';
import Spinner from '../../../../components/Spinner';
import DocumentPreviewer from '../../../../components/documents/DocumentPreviewer'; // <-- 1. IMPORT PREVIEWER
import { Library, Inbox, Search, X, ChevronDown } from 'lucide-react';
import ReloadButton from '../../../../components/ui/ReloadButton';

// --- Reusable Pagination Component ---
interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    const handlePrev = () => onPageChange(currentPage - 1);
    const handleNext = () => onPageChange(currentPage + 1);

    return (
        <div className="flex justify-center items-center gap-4 mt-6">
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Previous
            </button>
            <span className="text-sm text-slate-600">Page {currentPage} of {totalPages}</span>
            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Next
            </button>
        </div>
    );
};

const PublicLibraryPage: React.FC = () => {
  const { data: groupedDocuments, error, isLoading } = useFetchDocumentsByGenreQuery();
  
  // --- 2. ADD STATE AND HANDLERS FOR MODAL ---
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const handleDocumentSelect = (doc: Document) => setSelectedDocument(doc);
  const handleClosePreview = () => setSelectedDocument(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [pagination, setPagination] = useState<{ [genre: string]: number }>({});
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const DOCS_PER_PAGE = 8;

  const sortedGenres = useMemo(() => {
    if (!groupedDocuments) return [];
    return ["All Genres", ...Object.keys(groupedDocuments).sort()];
  }, [groupedDocuments]);

  const filteredAndGroupedDocuments = useMemo(() => {
    if (!groupedDocuments) return {};
    const filteredData: { [key: string]: Document[] } = {};
    const genresToFilter = activeGenre && activeGenre !== "All Genres" ? [activeGenre] : Object.keys(groupedDocuments);

    genresToFilter.forEach(genre => {
        const docs = groupedDocuments[genre].filter(doc => 
            doc.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (docs.length > 0) filteredData[genre] = docs;
    });
    return filteredData;
  }, [groupedDocuments, searchQuery, activeGenre]);

  const genresForDisplay = useMemo(() => Object.keys(filteredAndGroupedDocuments).sort(), [filteredAndGroupedDocuments]);

  useEffect(() => setPagination({}), [searchQuery, activeGenre]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleGenreSelect = (genre: string | null) => {
    setActiveGenre(genre);
    setDropdownOpen(false);
  };
  
  const handlePageChange = (genre: string, page: number) => {
    setPagination(prev => ({ ...prev, [genre]: page }));
  };

  if (isLoading) return <div className="flex justify-center items-center h-96"><Spinner /></div>;
  if (error) return <div className="text-center p-8">Error loading documents.</div>;
  if (!groupedDocuments || sortedGenres.length <= 1) return <div className="text-center p-8"><Inbox className="mx-auto h-12 w-12 text-slate-400"/><p>The library is currently empty.</p></div>;

  return (
    // --- WRAP IN FRAGMENT FOR MODAL ---
    <>
      <div className="flex flex-col h-screen bg-slate-50">
        
        <header className="flex-shrink-0 z-30 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
            {/* Header content... */}
            <div className="max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
              <div className="flex items-center gap-4 justify-between w-full">
                <div className="flex items-center gap-4">
                  <Library className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">The Public Library</h1>
                    <p className="mt-1 text-indigo-200 text-base sm:text-lg">Browse our curated collection of documents.</p>
                  </div>
                </div>
                <div>
                  <ReloadButton />
                </div>
              </div>
    
              <div className="mt-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full md:w-auto" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!isDropdownOpen)}
                      className="flex items-center justify-between w-full md:w-56 px-4 py-2 text-left bg-white/90 text-slate-800 border border-slate-300 rounded-md text-sm font-medium hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                    >
                      <span>{activeGenre || "All Genres"}</span>
                      <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute mt-2 w-full md:w-56 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                        >
                          {sortedGenres.map(genre => (
                            <a
                              key={genre}
                              href="#"
                              onClick={(e) => { e.preventDefault(); handleGenreSelect(genre === "All Genres" ? null : genre); }}
                              className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-600 hover:text-white transition-colors duration-150"
                            >
                              {genre}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
    
                  <div className="relative w-full md:w-80 order-first md:order-last">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-200" />
                    <input 
                      type="text"
                      placeholder="Search documents by title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 rounded-md bg-indigo-900/50 text-white placeholder-indigo-200 border border-transparent focus:bg-indigo-900 focus:ring-2 focus:ring-white outline-none transition"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="h-5 w-5 text-indigo-200 hover:text-white" />
                      </button>
                    )}
                  </div>
              </div>
            </div>
        </header>
        
        <main className="flex-grow overflow-y-auto">
          <div className="max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-6 py-6 md:py-8">
              <div className="space-y-10">
                {genresForDisplay.length > 0 ? (
                  genresForDisplay.map((genre) => {
                    const currentPage = pagination[genre] || 1;
                    const totalDocs = filteredAndGroupedDocuments[genre].length;
                    const totalPages = Math.ceil(totalDocs / DOCS_PER_PAGE);
                    const paginatedDocs = filteredAndGroupedDocuments[genre].slice(
                      (currentPage - 1) * DOCS_PER_PAGE,
                      currentPage * DOCS_PER_PAGE
                    );

                    return (
                      <motion.section key={genre} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="mb-4">
                          <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">{genre}</h2>
                          <div className="mt-1 h-1 w-16 bg-indigo-500 rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {paginatedDocs.map((document: Document) => (
                            // --- 3. ADD onCardClick PROP ---
                            <DocumentCard
                                key={document.documentId}
                                document={document}
                                onCardClick={() => handleDocumentSelect(document)}
                            />
                          ))}
                        </div>
                        
                        <PaginationControls 
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={(page) => handlePageChange(genre, page)}
                        />
                      </motion.section>
                    );
                  })
                ) : (
                  <div className="text-center py-16">
                       <Search className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                      <h3 className="text-xl font-semibold text-slate-700">No Matching Documents</h3>
                      <p className="text-slate-500 mt-2">Try adjusting your search or selecting a different genre.</p>
                  </div>
                )}
              </div>
          </div>
        </main>
      </div>

      {/* --- 4. ADD MODAL JSX --- */}
      <AnimatePresence>
        {selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4"
            onClick={handleClosePreview}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-100 rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="flex justify-between items-center p-4 border-b border-gray-300 bg-white flex-shrink-0">
                <h2 className="text-lg font-semibold text-gray-800 truncate">{selectedDocument.title}</h2>
                <button onClick={handleClosePreview} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </header>
              <main className="flex-grow overflow-y-auto">
                <DocumentPreviewer
                  fileUrl={selectedDocument.documentUrl}
                  fileName={selectedDocument.title}
                  isFree={selectedDocument.isFree}
                />
              </main>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PublicLibraryPage;