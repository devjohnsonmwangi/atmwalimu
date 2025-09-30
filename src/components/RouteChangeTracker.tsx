import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { addPageToHistory } from '../pages/dashboard/activity'; // Adjust path if needed
import { drawerData } from './drawer/drawerData'; // We'll use this to get page titles and icons

const HistoryTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Find the metadata (title, icon) for the current path from your drawerData
    // This makes the history much more meaningful than just storing a URL.
    const currentPageMetadata = drawerData.find(item => item.link === location.pathname);

    if (currentPageMetadata) {
      addPageToHistory({
        link: currentPageMetadata.link,
        title: currentPageMetadata.name,
        iconName: currentPageMetadata.iconName, // Assuming you add iconName to drawerData
      });
    }
    // This effect runs every time the user navigates to a new page
  }, [location.pathname]);

  // This component renders nothing. It's purely for side effects.
  return null;
};

export default HistoryTracker;