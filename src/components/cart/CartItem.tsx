import React from 'react';
import { motion } from 'framer-motion';
import { Document } from '../../features/documents/docmentsApi';
import { useFileDownloader } from '../../hooks/useFileDownloader';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import { Trash2, FileText, CheckCircle, Eye, Download } from 'lucide-react';

interface CartItemProps {
  item: Document;
  isPurchased: boolean; // <-- Controls the display state
  onRemove: (documentId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, isPurchased, onRemove }) => {
  const { downloadFile, isLoading: isDownloading } = useFileDownloader();
  const navigate = useNavigate();

  const handleView = () => {
    // Navigate to the document detail route within the app so users see the preview page
    navigate(`/documents/${item.documentId}`);
  };

  const handleDownload = () => {
    const fileExtension = item.documentUrl.split('.').pop() || 'file';
    downloadFile(item.documentUrl, `${item.title}.${fileExtension}`);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow-sm border transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-4 mb-3 sm:mb-0">
        <FileText className="h-6 w-6 text-blue-500 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-gray-800">{item.title}</h4>
          <p className="text-sm font-bold text-gray-600">Ksh {Number(item.price).toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {isPurchased ? (
          <>
            <div className="flex items-center gap-2 text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
              <CheckCircle size={16} />
              <span>Paid</span>
            </div>
            <Button size="sm" variant="secondary" onClick={handleView} title="View File">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={handleDownload} disabled={isDownloading} title="Download File">
              {isDownloading ? '...' : <Download className="h-4 w-4" />}
            </Button>
          </>
        ) : (
          <Button variant="danger" size="sm" onClick={() => onRemove(item.documentId)}>
            <Trash2 className="mr-1 h-4 w-4" />
            Remove
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default CartItem;