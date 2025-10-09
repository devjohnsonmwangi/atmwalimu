import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchDocumentByIdQuery } from '../../../../features/documents/docmentsApi';
import DocumentPreviewer from '../../../../components/documents/DocumentPreviewer';
import Button from '../../../../components/Button';

const DocumentDetailPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const id = Number(documentId);

  const { data: document, isLoading, isError } = useFetchDocumentByIdQuery(id, { skip: !id });

  if (!documentId) return <div className="p-6">Invalid document.</div>;
  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError || !document) return <div className="p-6">Document not found.</div>;

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{document.title}</h1>
            <p className="text-sm text-gray-600 mt-1">{document.genre} — {document.isFree ? 'Free' : `Ksh ${document.price}`}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
            {!document.isFree && (
              <Button onClick={() => navigate('/dashboard/cart')}>Add to Cart</Button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <DocumentPreviewer fileUrl={document.documentUrl} fileName={document.title} isFree={document.isFree} />
          <div className="mt-4 flex justify-end">
            <a href={document.documentUrl} target="_blank" rel="noreferrer" className="inline-block">
              <Button>Open in new tab</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailPage;
