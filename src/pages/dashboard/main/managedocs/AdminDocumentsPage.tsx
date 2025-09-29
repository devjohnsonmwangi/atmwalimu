import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useFetchDocumentsQuery,
  useDeleteDocumentMutation,
  useUpdateDocumentFeaturedStatusMutation,
  Document
} from '../../../../features/documents/docmentsApi'; // Ensure this path is correct
import Button from '../../../../components/Button';
import Modal from '../../../../components/Modal';
import {
  Eye,
  Pencil,
  Trash2,
  FileText,
  DollarSign,
  Activity,
  Star,
  Settings,
  Search,
  UploadCloud,
  BookOpen
} from 'lucide-react';

// --- Skeleton Loader Components for a Modern Loading Experience ---

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-16"></div></td>
    <td className="px-6 py-4 text-center"><div className="h-6 bg-gray-200 rounded-full w-12 mx-auto"></div></td>
    <td className="px-6 py-4">
      <div className="flex justify-end space-x-4">
        <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
        <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
        <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
      </div>
    </td>
  </tr>
);

const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="h-6 bg-gray-200 rounded w-3/5"></div>
      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
    </div>
    <div className="mt-4 space-y-3 text-sm">
      <div className="flex justify-between"><div className="h-4 bg-gray-200 rounded w-1/4"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></div>
      <div className="flex justify-between"><div className="h-4 bg-gray-200 rounded w-1/4"></div><div className="h-4 bg-gray-200 rounded w-1/4"></div></div>
      <div className="flex justify-between items-center"><div className="h-4 bg-gray-200 rounded w-1/4"></div><div className="h-6 bg-gray-200 rounded-full w-12"></div></div>
    </div>
    <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end items-center space-x-4">
      <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
      <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
      <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);


const AdminDocumentsPage: React.FC = () => {
  const navigate = useNavigate();

  // --- STATE HOOKS ---
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  // --- RTK QUERY HOOKS ---
  const { data: response, error, isLoading, isFetching } = useFetchDocumentsQuery({
    page,
    limit: 15,
    searchTerm: searchTerm || undefined,
  });

  const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();
  const [updateFeaturedStatus] = useUpdateDocumentFeaturedStatusMutation();

  // --- EVENT HANDLERS ---
  const openDeleteModal = (document: Document) => {
    setDocumentToDelete(document);
    setShowConfirmModal(true);
  };

  const closeDeleteModal = () => {
    setDocumentToDelete(null);
    setShowConfirmModal(false);
  };

  const handleDelete = async () => {
    if (documentToDelete) {
      try {
        await deleteDocument(documentToDelete.documentId).unwrap();
      } catch (err) {
        console.error('Failed to delete document:', err);
      } finally {
        closeDeleteModal();
      }
    }
  };

  const handleToggleFeatured = (document: Document) => {
    updateFeaturedStatus({
      documentId: document.documentId,
      isFeatured: !document.isFeatured,
    });
  };

  // --- DERIVED STATE ---
  const documents = response?.data ?? [];
  const totalPages = response?.totalPages || 1;

  // --- REUSABLE SUB-COMPONENTS ---
  const DocumentStatusBadge = ({ isFree }: { isFree: boolean }) => (
    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${isFree ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
      {isFree ? 'Free' : 'Paid'}
    </span>
  );

  const FeaturedButton = ({ doc }: { doc: Document }) => (
    <button onClick={() => handleToggleFeatured(doc)} className={`px-3 py-1 text-sm rounded-full transition-colors duration-300 ${doc.isFeatured ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
      {doc.isFeatured ? 'Yes' : 'No'}
    </button>
  );

  const PaginationControls = () => (
    <div className="mt-6 flex justify-between items-center px-4 py-2">
      <Button onClick={() => setPage(p => p - 1)} disabled={page <= 1}>Previous</Button>
      <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
      <Button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>Next</Button>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          {/* Skeleton for Desktop Table */}
          <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
             <table className="min-w-full">
               <thead className="bg-indigo-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider w-2/5"></th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider w-1/5"></th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider w-1/5"></th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider w-1/5"></th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider w-1/5"></th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-white uppercase tracking-wider w-1/5"></th>
                  </tr>
                </thead>
               <tbody>
                  {Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)}
               </tbody>
             </table>
          </div>
          {/* Skeleton for Mobile Cards */}
          <div className="block md:hidden space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </>
      );
    }

    if (error) {
      return <div className="text-center mt-10 text-red-600 p-4 bg-red-50 rounded-md">Failed to load documents. Please try again.</div>;
    }

    if (documents.length === 0) {
      return <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-md">No documents found.</div>;
    }

    return (
      <>
        {/* --- DESKTOP VIEW: Table Layout --- */}
        <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2"><FileText size={16} /> Title</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"><div className="flex items-center gap-2"><BookOpen size={16} /> Genre</div></th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"><div className="flex items-center gap-2"><DollarSign size={16} /> Price</div></th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"><div className="flex items-center gap-2"><Activity size={16} /> Status</div></th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider"><div className="flex items-center justify-center gap-2"><Star size={16} /> Featured</div></th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-white uppercase tracking-wider"><div className="flex items-center justify-end gap-2"><Settings size={16} /> Actions</div></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <tr key={doc.documentId} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doc.genre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Ksh {doc.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><DocumentStatusBadge isFree={doc.isFree} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-center"><FeaturedButton doc={doc} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center space-x-4">
                          <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600"><Eye size={18} /></a>
                           {/* --- EDIT BUTTON FIX ---
                           * The code below is CORRECT for navigating.
                           * The problem is likely in your routing setup (e.g., App.tsx).
                           * Ensure you have a route like this:
                           * <Route path="/dashboard/admin/documents/edit/:documentId" element={<YourEditPageComponent />} />
                           */}
                          <button onClick={() => navigate(`/dashboard/admin/documents/edit/${doc.documentId}`)} className="text-gray-500 hover:text-indigo-600"><Pencil size={18} /></button>
                          <button onClick={() => openDeleteModal(doc)} className="text-gray-500 hover:text-red-600"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && <PaginationControls />}
        </div>

        {/* --- MOBILE VIEW: Card Layout --- */}
        <div className="block md:hidden space-y-4">
            {documents.map((doc) => (
              <div key={doc.documentId} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-blue-600 pr-2">{doc.title}</h3>
                  <DocumentStatusBadge isFree={doc.isFree} />
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Genre:</span><span className="font-medium text-gray-700">{doc.genre}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Price:</span><span className="font-medium text-gray-700">Ksh {doc.price}</span></div>
                  <div className="flex justify-between items-center"><span className="text-gray-500">Featured:</span><FeaturedButton doc={doc} /></div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end items-center space-x-4">
                  <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-600 hover:text-blue-600"><Eye size={20} /></a>
                  <button onClick={() => navigate(`/dashboard/admin/documents/edit/${doc.documentId}`)} className="p-2 text-gray-600 hover:text-indigo-600"><Pencil size={20} /></button>
                  <button onClick={() => openDeleteModal(doc)} className="p-2 text-gray-600 hover:text-red-600"><Trash2 size={20} /></button>
                </div>
              </div>
            ))}
          {totalPages > 1 && <PaginationControls />}
        </div>
      </>
    );
  };


  return (
    <>
      {/* Page container with fixed header and scrollable content */}
      <div className="bg-gray-50 h-screen flex flex-col">
        {/* --- FIXED HEADER SECTION --- */}
        <div className="p-4 md:p-6 flex-shrink-0">
          {/* Page Title */}
          <div className="relative bg-indigo-700 p-6 rounded-lg shadow-lg mb-6 overflow-hidden group">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Document Management</h1>
                <p className="text-indigo-200 mt-1">Oversee, update, and manage all documents from here.</p>
              </div>
              <div className="hidden md:block">
                <Button onClick={() => navigate('/dashboard/admin/documents/upload')} variant="secondary">
                  Upload Document
                </Button>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1.5 w-full bg-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search by document title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* --- SCROLLABLE CONTENT SECTION --- */}
        <div className={`px-4 md:px-6 pb-6 flex-grow overflow-y-auto transition-opacity duration-300 ${isFetching && !isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
          {renderContent()}
        </div>

        {/* --- Floating Action Button for Mobile Upload --- */}
        <button
          onClick={() => navigate('/dashboard/admin/documents/upload')}
          className="md:hidden fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 active:scale-95 transition-transform duration-200 z-50"
          aria-label="Upload New Document"
        >
          <UploadCloud size={24} />
        </button>
      </div>

      {/* --- Delete Confirmation Modal --- */}
      <Modal isOpen={showConfirmModal} onClose={closeDeleteModal} title="Confirm Deletion">
        <p className="text-gray-600">Are you sure you want to delete the document titled "{documentToDelete?.title}"? This action cannot be undone.</p>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="secondary" onClick={closeDeleteModal}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>Delete</Button>
        </div>
      </Modal>
    </>
  );
};

export default AdminDocumentsPage;