// Define the structure of a stored page
export interface StoredVisitedPage {
  id: string;      // A unique identifier, usually the path
  link: string;
  title: string;
  iconName?: string; // The name of the lucide-react icon
  lastVisited: string; // ISO string format for dates
}

const HISTORY_STORAGE_KEY = 'mwalimu-recent-pages';
const MAX_HISTORY_ITEMS = 7; // Keep the list from getting too long

/**
 * Retrieves the list of recently visited pages from localStorage.
 */
export const getStoredRecentPages = (): StoredVisitedPage[] => {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (stored) {
      // Sort by most recent first
      const pages = JSON.parse(stored) as StoredVisitedPage[];
      return pages.sort((a, b) => new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime());
    }
    return [];
  } catch (error) {
    console.error("Failed to parse recent pages from localStorage", error);
    return [];
  }
};

/**
 * Adds or updates a page in the recent history.
 * This is the missing piece of the puzzle.
 */
export const addPageToHistory = (page: Omit<StoredVisitedPage, 'lastVisited' | 'id'>) => {
  if (!page || !page.link || !page.title) return;

  // Don't track the main dashboard page itself
  if (page.link === '/dashboard' || page.link === '/dashboard/') return;

  const newEntry: StoredVisitedPage = {
    ...page,
    id: page.link, // Use the link as a unique ID
    lastVisited: new Date().toISOString(),
  };

  let history = getStoredRecentPages();

  // Remove any existing entry with the same link to avoid duplicates
  history = history.filter(p => p.link !== newEntry.link);

  // Add the new entry to the beginning of the array
  history.unshift(newEntry);

  // Trim the array to the maximum allowed size
  if (history.length > MAX_HISTORY_ITEMS) {
    history = history.slice(0, MAX_HISTORY_ITEMS);
  }

  // Save back to localStorage
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));

  // --- VERY IMPORTANT ---
  // Dispatch a custom event to notify other components (like your DashboardOverview)
  // that the storage has been updated. Your code is already listening for this!
  window.dispatchEvent(new CustomEvent('mwalimuStorageUpdated'));
};