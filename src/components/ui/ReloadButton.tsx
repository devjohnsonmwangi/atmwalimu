import React from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { documentsApi } from '../../features/documents/docmentsApi';
import Button from '../Button';
import { RefreshCw } from 'lucide-react';

const ReloadButton: React.FC<{ className?: string }> = ({ className }) => {
  const dispatch = useAppDispatch();

  const handleReload = () => {
    // Invalidate user library and documents list so queries refetch
    try {
      // RTK Query typing for invalidateTags is strict; cast to unknown then never to satisfy the helper signature.
      dispatch(documentsApi.util.invalidateTags([
        { type: 'UserLibrary', id: 'CURRENT_USER' },
        { type: 'DocumentsList', id: 'PAGINATED' },
      ] as unknown as never));
    } catch (err) {
      // fallback: swallow errors quietly (best-effort reload)
      console.warn('Reload dispatch failed', err);
    }
  };

  return (
    <Button variant="secondary" size="sm" onClick={handleReload} className={className}>
      <RefreshCw className="mr-2 h-4 w-4" />
      Reload
    </Button>
  );
};

export default ReloadButton;
