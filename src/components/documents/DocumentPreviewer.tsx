// src/components/previews/DocumentPreviewer.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Lock, File, Music, Loader2 } from 'lucide-react';

// --- CONFIGURATION ---
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
const PAID_PREVIEW_FRACTION = 0.1; // Kept for Video/Audio previews (10%)
const PAID_PDF_PAGE_LIMIT = 2;   // NEW: Fixed page limit for paid PDFs

// --- TYPE DEFINITIONS & HELPERS ---
type FileType = 'pdf' | 'video' | 'word' | 'image' | 'audio' | 'unsupported';
interface DocumentPreviewerProps { fileUrl: string; fileName: string; isFree: boolean; }

const getFileType = (url: string): FileType => {
  const extension = new URL(url).pathname.split('.').pop()?.toLowerCase();
  if (!extension) return 'unsupported';
  if (extension === 'pdf') return 'pdf';
  if (['mp4', 'webm', 'ogg'].includes(extension)) return 'video';
  if (['doc', 'docx'].includes(extension)) return 'word';
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) return 'image';
  if (['mp3', 'wav', 'ogg'].includes(extension)) return 'audio';
  return 'unsupported';
};

const PreviewLoader: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex-grow flex flex-col items-center justify-center p-8 text-gray-600 bg-gray-50">
        <Loader2 className="h-7 w-7 animate-spin text-blue-600 mb-3" />
        <p className="text-sm">{message}</p>
    </div>
);

// =================================================================
// INTERNAL PREVIEW SUB-COMPONENTS
// =================================================================

// --- UPDATED: PdfPreview now uses a fixed page limit ---
const PdfPreview: React.FC<{ fileUrl: string; isFree: boolean }> = ({ fileUrl, isFree }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const docRef = useRef<boolean>(false);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => { setNumPages(numPages); setIsLoading(false); };
    const onDocumentLoadError = () => { setError("Failed to load PDF."); setIsLoading(false); };

    // Only render the heavy PDF Document once the component is mounted and in view.
    useEffect(() => { docRef.current = true; return () => { docRef.current = false; }; }, []);

    const displayablePages = isFree || !numPages ? numPages : Math.min(PAID_PDF_PAGE_LIMIT, numPages);
    const canGoPrev = currentPage > 1;
    const canGoNext = displayablePages ? currentPage < displayablePages : false;
    const buttonStyles = "px-4 py-2 border border-gray-300 bg-white rounded-md transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed";

    if (isLoading) return <PreviewLoader message="Loading PDF Preview..." />;
    if (error) return <div className="flex-grow flex items-center justify-center p-8 text-red-700 bg-red-50">{error}</div>;

    return (
        <div className="flex flex-col w-full h-full bg-gray-200">
            {!isFree && numPages && ( <div className="px-5 py-3 text-center text-sm bg-yellow-50 text-yellow-800 border-b border-yellow-200"> <strong>PREVIEW MODE.</strong> Showing the first {displayablePages} of {numPages} pages. </div> )}
            <div className="flex-grow flex justify-center py-5 overflow-y-auto">
                <div className="shadow-lg">
                    {/* Render Document only when the pdfjs worker and component are ready to avoid blocking */}
                    <Document
                        file={fileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={<PreviewLoader message="Decoding PDF..." />}
                    >
                        <Page pageNumber={currentPage} renderAnnotationLayer={false} renderTextLayer={false} />
                    </Document>
                </div>
            </div>
            <div className="flex-shrink-0 flex justify-center items-center p-4 bg-white border-t border-gray-200">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={!canGoPrev} className={buttonStyles}>‹ Prev</button>
                <span className="mx-4 text-gray-700 font-medium">Page {currentPage} of {displayablePages}</span>
                <button onClick={() => setCurrentPage(p => Math.min((displayablePages as number) || p + 1, p + 1))} disabled={!canGoNext} className={buttonStyles}>Next ›</button>
            </div>
        </div>
    );
};

// --- UPDATED: VideoPreview is now wider ---
const VideoPreview: React.FC<{ fileUrl: string; isFree: boolean }> = ({ fileUrl, isFree }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showPurchaseOverlay, setShowPurchaseOverlay] = useState(false);

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (isFree || !video || !video.duration) return;
        const previewTimeLimit = video.duration * PAID_PREVIEW_FRACTION;
        if (video.currentTime >= previewTimeLimit) {
            video.pause(); video.currentTime = previewTimeLimit; setShowPurchaseOverlay(true);
        }
    };

    return (
        <div className="relative flex items-center justify-center w-full h-full bg-black p-4">
            {isLoading && <PreviewLoader message="Loading Video..." />}
            <video
                ref={videoRef}
                src={fileUrl}
                controls
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onLoadedData={() => setIsLoading(false)}
                className={`w-full max-h-[85vh] rounded-lg shadow-2xl bg-black ${isLoading ? 'hidden' : ''}`}
            />
            {!isFree && showPurchaseOverlay && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center text-white p-8">
                    <Lock className="h-12 w-12 text-white mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Preview Ended</h3>
                    <p className="max-w-sm">Purchase this file to watch the full content.</p>
                </div>
            )}
        </div>
    );
};

// --- UPDATED: WordPreview mimics a 2-page preview for paid files ---
const WordPreview: React.FC<{ fileUrl: string; isFree: boolean }> = ({ fileUrl, isFree }) => {
    const [isLoading, setIsLoading] = useState(true);
    const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;

    return (
        <div className="relative flex-grow w-full h-full overflow-hidden bg-gray-200">
            {isLoading && <PreviewLoader message="Loading Document Viewer..." />}
            {/* This container crops the iframe to a fixed height for paid docs */}
            <div className={`w-full ${isFree ? 'h-full' : 'h-[900px]'}`}>
                <iframe
                    src={viewerUrl}
                    title="Word Document Preview"
                    onLoad={() => setIsLoading(false)}
                    className={`w-full h-full ${isLoading ? 'hidden' : ''}`}
                    frameBorder="0"
                    loading="lazy"
                />
            </div>
            {!isFree && !isLoading && (
                <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
                    <div className="h-2/3 w-full bg-gradient-to-t from-gray-100 via-gray-100/80 to-transparent" />
                    <div className="flex-shrink-0 bg-gray-100 p-6 text-center pointer-events-auto">
                        <Lock className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-xl font-bold mb-2">You've reached the end of the preview</h3>
                        <p className="text-gray-600">Purchase this document to scroll and view the full content.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const ImagePreview: React.FC<{ fileUrl: string; isFree: boolean }> = ({ fileUrl, isFree }) => {
    const [isLoading, setIsLoading] = useState(true);
    return (
        <div className="relative flex-grow flex items-center justify-center p-4 bg-gray-200 overflow-hidden">
             {isLoading && <PreviewLoader message="Loading Image..." />}
             <img src={fileUrl} alt="Document Preview" onLoad={() => setIsLoading(false)} decoding="async" loading="lazy" className={`max-w-full max-h-full object-contain transition-all duration-300 ${isLoading ? 'hidden' : ''} ${!isFree ? 'filter blur-xl scale-110' : ''}`} />
             {!isFree && !isLoading && (
                 <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white p-8">
                    <Lock className="h-12 w-12 text-white mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Full Image Locked</h3>
                    <p className="max-w-sm">Purchase this item to view the clear, high-quality image.</p>
                </div>
             )}
        </div>
    );
};

const AudioPreview: React.FC<{ fileUrl: string; isFree: boolean }> = ({ fileUrl, isFree }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showPurchaseOverlay, setShowPurchaseOverlay] = useState(false);

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (isFree || !audio || !audio.duration) return;
        const previewTimeLimit = audio.duration * PAID_PREVIEW_FRACTION;
        if (audio.currentTime >= previewTimeLimit) {
            audio.pause(); audio.currentTime = previewTimeLimit; setShowPurchaseOverlay(true);
        }
    };

    return (
        <div className="flex-grow flex flex-col justify-center items-center text-center p-10 bg-gray-100 text-gray-600">
            <Music className="text-6xl text-gray-400 mb-5" />
            {isLoading && <p>Loading Audio...</p>}
            <div className={`w-full max-w-md ${isLoading ? 'hidden' : ''}`}>
                <audio ref={audioRef} src={fileUrl} controls onTimeUpdate={handleTimeUpdate} onLoadedData={() => setIsLoading(false)} className="w-full" />
            </div>
            {!isFree && showPurchaseOverlay && ( <div className="mt-6 p-4 rounded-md bg-yellow-50 text-yellow-800"> <p><strong>Preview ended.</strong> Purchase to listen to the full audio file.</p> </div> )}
        </div>
    );
};

const UnsupportedPreview: React.FC<{ fileName: string }> = ({ fileName }) => (
    <div className="flex-grow flex flex-col justify-center items-center text-center p-10 bg-gray-100 text-gray-600">
        <File className="text-6xl text-gray-300 mb-5" />
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Preview Not Available</h3>
        <p>Cannot display a preview for the file "{fileName}".</p>
    </div>
);

// =================================================================
// MAIN DOCUMENT PREVIEWER COMPONENT
// =================================================================
const DocumentPreviewer: React.FC<DocumentPreviewerProps> = (props) => {
    const [fileType, setFileType] = useState<FileType | null>(null);

    useEffect(() => {
        setFileType(null); setFileType(getFileType(props.fileUrl));
    }, [props.fileUrl]);

    if (fileType === null) {
        return <PreviewLoader message="Analyzing file type..." />;
    }

    switch (fileType) {
        case 'pdf': return <PdfPreview fileUrl={props.fileUrl} isFree={props.isFree} />;
        case 'video': return <VideoPreview fileUrl={props.fileUrl} isFree={props.isFree} />;
        case 'word': return <WordPreview fileUrl={props.fileUrl} isFree={props.isFree} />;
        case 'image': return <ImagePreview fileUrl={props.fileUrl} isFree={props.isFree} />;
        case 'audio': return <AudioPreview fileUrl={props.fileUrl} isFree={props.isFree} />;
        default: return <UnsupportedPreview fileName={props.fileName} />;
    }
};

export default DocumentPreviewer;