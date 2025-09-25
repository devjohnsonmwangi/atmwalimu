import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { RefreshCw, X, CheckCircle, AlertTriangle, Inbox, FileText, ShieldCheck, Trash2, } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import {
  useFetchPendingDocumentsQuery,
  useApproveDocumentMutation,
  useDeleteDocumentMutation, // <-- NEW: Import delete mutation
  Document,
} from '../../../../features/documents/docmentsApi';
import Button from '../../../../components/Button';
import Spinner from '../../../../components/Spinner';

// A consistent list of genres for the dropdown.
const documentGenres = [
  "Lecture Notes",
  "Exam Paper",
  "Revision Guide",
  "Book",
  "Novel",
  "Research Paper",
  "Thesis",
  "Case Study",
  "tutorial",
  "Other",
];

// --- Reusable Modal Backdrop ---
const ModalBackdrop = ({ children, onClose }: { children: React.ReactNode, onClose: () => void }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        onClick={onClose}
    >
        {children}
    </motion.div>
);

// --- Approval Modal (Now includes Genre editing) ---
const ApprovalModal = ({ document, onClose, onConfirm, isApproving }: {
    document: Document;
    onClose: () => void;
    onConfirm: (payload: { documentId: number; price: number; genre: string }) => void; // <-- MODIFIED: Added genre to payload
    isApproving: boolean;
}) => {
    const [price, setPrice] = useState('0');
    const [genre, setGenre] = useState(document.genre || ''); // <-- NEW: State for genre
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onConfirm({ documentId: document.documentId, price: parseFloat(price), genre }); // <-- MODIFIED: Pass genre
    };

    return (
        <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2"><ShieldCheck className="text-blue-500" />Approve Document</h2>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Confirm details for: <strong className="text-slate-900 dark:text-white">{document.title}</strong></p>
                    
                    {/* --- NEW: Genre Selector --- */}
                    <div>
                        <label htmlFor="genre" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Genre</label>
                        <select id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required>
                            <option value="" disabled>Select a genre...</option>
                            {documentGenres.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price (Ksh)</label>
                        <input ref={inputRef} type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g., 0 for free" step="1" min="0" required />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enter '0' to make this document free.</p>
                    </div>
                </div>
                <div className="flex justify-end items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl space-x-3">
                    <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                    <Button type="submit" isLoading={isApproving} disabled={!genre}><CheckCircle size={16} className="mr-2" />Confirm & Publish</Button>
                </div>
            </form>
        </motion.div>
    );
};

// --- NEW: Deletion Confirmation Modal ---
const DeleteConfirmationModal = ({ document, onClose, onConfirm, isDeleting }: {
    document: Document;
    onClose: () => void;
    onConfirm: (documentId: number) => void;
    isDeleting: boolean;
}) => {
    return (
         <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2"><Trash2 className="text-red-500" />Confirm Deletion</h2>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-red-500"><X size={24} /></button>
            </div>
            <div className="p-6">
                <p className="text-sm text-slate-600 dark:text-slate-400">Are you sure you want to permanently delete this submission?
                    <br />
                    <strong className="text-slate-900 dark:text-white">"{document.title}"</strong>
                </p>
                 <p className="mt-2 text-xs text-red-600 dark:text-red-400">This action cannot be undone.</p>
            </div>
            <div className="flex justify-end items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl space-x-3">
                <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                <Button variant="danger" isLoading={isDeleting} onClick={() => onConfirm(document.documentId)}>
                    <Trash2 size={16} className="mr-2" />Delete
                </Button>
            </div>
        </motion.div>
    );
};


const AdminApprovalPage: React.FC = () => {
    const [documentToApprove, setDocumentToApprove] = useState<Document | null>(null);
    const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null); // <-- NEW: State for deletion modal

    const { data: pendingDocuments, error, isLoading, isFetching, refetch } = useFetchPendingDocumentsQuery(undefined, { pollingInterval: 90000 });
    const [approveDocument, { isLoading: isApproving }] = useApproveDocumentMutation();
    const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation(); // <-- NEW: Delete mutation hook

    const handleConfirmApproval = (payload: { documentId: number; price: number; genre: string }) => {
        const promise = approveDocument({
            documentId: payload.documentId,
            updates: { isApproved: true, price: payload.price, genre: payload.genre }, // <-- MODIFIED: Pass genre
        }).unwrap();
        toast.promise(promise, {
            loading: 'Publishing document...',
            success: 'Document has been approved and published!',
            error: 'Error: Could not approve the document.',
        });
        promise.then(() => setDocumentToApprove(null));
    };
    
    // <-- NEW: Handler for confirming deletion -->
    const handleConfirmDelete = (documentId: number) => {
        const promise = deleteDocument(documentId).unwrap();
        toast.promise(promise, {
            loading: 'Deleting submission...',
            success: 'Submission has been deleted.',
            error: 'Error: Could not delete the submission.',
        });
        promise.then(() => setDocumentToDelete(null));
    };

    const renderContent = () => {
        if (isLoading) return <div className="text-center mt-24"><Spinner /><p className="text-slate-500 dark:text-slate-400 mt-4 font-semibold">Loading submissions...</p></div>;
        if (error) return <div className="text-center mt-16 p-8 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-500/30"><AlertTriangle className="mx-auto h-12 w-12 text-red-500 dark:text-red-400 mb-4" /><h3 className="text-xl font-semibold">Failed to Load Submissions</h3><p className="mt-2 mb-4">An error occurred while fetching data. Please try again.</p><Button variant="danger" onClick={refetch}>Retry</Button></div>;
        if (!pendingDocuments || pendingDocuments.length === 0) return <div className="text-center mt-16 p-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"><Inbox className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500 mb-4" /><h3 className="text-2xl font-bold text-slate-800 dark:text-white">Inbox Zero!</h3><p className="text-slate-600 dark:text-slate-400 mt-2">You're all caught up. There are no new documents pending approval.</p></div>;

        return (
            <div className="space-y-5">
                {pendingDocuments.map((doc, index) => (
                    <motion.div key={doc.documentId} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05, type: 'spring' }} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-300 hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-500 hover:-translate-y-1">
                        <div className="flex-grow flex items-center gap-4">
                            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full"><FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div>
                            <div className="flex-grow">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">{doc.title}</h3>
                                    {/* --- NEW: Genre Badge --- */}
                                    <span className="flex-shrink-0 text-xs font-semibold text-indigo-800 bg-indigo-100 dark:text-indigo-200 dark:bg-indigo-500/30 px-2 py-0.5 rounded-full">{doc.genre}</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{doc.description}</p>
                                <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block font-semibold">Preview Document</a>
                            </div>
                        </div>
                        <div className="flex-shrink-0 flex items-center space-x-3 self-end sm:self-center">
                            <Button variant="primary" size="sm" onClick={() => setDocumentToApprove(doc)} disabled={isApproving || isDeleting}><ShieldCheck size={16} className="mr-2" /> Approve</Button>
                            {/* --- MODIFIED: Reject button is now a Delete button --- */}
                            <Button variant="danger" size="sm" onClick={() => setDocumentToDelete(doc)} disabled={isApproving || isDeleting}><Trash2 size={16} className="mr-2" /> Delete</Button>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    };

    return (
        <>
            <div className="p-4 md:p-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
                <main className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200 dark:border-slate-700">
                        <div>
                             <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">Submissions for Review</h1>
                            <p className="mt-1 text-slate-500 dark:text-slate-400">Review and manage new documents from users.</p>
                        </div>
                        <Button variant="secondary" size="sm" onClick={refetch} disabled={isFetching}><RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />{isFetching && !isLoading ? 'Refreshing...' : 'Refresh'}</Button>
                    </div>
                    {renderContent()}
                </main>
            </div>

            <AnimatePresence>
                {documentToApprove && (
                    <ModalBackdrop onClose={() => setDocumentToApprove(null)}>
                        <ApprovalModal document={documentToApprove} onClose={() => setDocumentToApprove(null)} onConfirm={handleConfirmApproval} isApproving={isApproving} />
                    </ModalBackdrop>
                )}
                {/* --- NEW: Render Delete Modal --- */}
                {documentToDelete && (
                    <ModalBackdrop onClose={() => setDocumentToDelete(null)}>
                        <DeleteConfirmationModal document={documentToDelete} onClose={() => setDocumentToDelete(null)} onConfirm={handleConfirmDelete} isDeleting={isDeleting} />
                    </ModalBackdrop>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminApprovalPage;