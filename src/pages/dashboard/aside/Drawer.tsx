import { useState, useMemo, FC, memo } from 'react';
import { ChevronsLeft, Search as SearchIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { filterDrawerByRole } from '../../../components/drawer/drawerData'; // Ensure this path is correct

// --- TYPE DEFINITIONS ---
interface DrawerProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}
interface DrawerItem {
  id: string;
  name: string;
  link: string;
  icon: React.ElementType;
}

// Array of encouraging quotes
const quotes = [
    "Great choice! ⭐", "You're on the right track! 🌟", "Fantastic selection! 🎉", "Keep up the great work! 💪",
    "You're doing amazing! 🌈", "Believe in yourself! 🌻", "Every step counts! 🚀", "You're stronger than you think! 💖",
    "Your effort today is success tomorrow! 🌅", "Stay positive, work hard, make it happen! 🌟",
    "You are capable of achieving great things! 🏆",
];

// --- MAIN COMPONENT ---
const Drawer: FC<DrawerProps> = ({ isMobileOpen, onMobileClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<DrawerItem | null>(null);
  const [quote, setQuote] = useState<string>('');
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();

  const handleLinkClick = (item: DrawerItem) => {
    setSelectedItem(item);
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    onMobileClose();
  };

  const displayedItems: DrawerItem[] = useMemo(() => {
    const userRole = user.user?.role || 'guest';
    let items = filterDrawerByRole(userRole).map((item) => ({
      ...item,
      id: String(item.id),
    })) as DrawerItem[];

    if (searchTerm.trim() !== '') {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return items;
  }, [user.user?.role, searchTerm]);

  return (
    <>
      <FontStyle />
      <AnimationStyle />
      {/* Backdrop for Mobile view. It's hidden on large screens. */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer content panel with updated responsive classes */}
      <aside
        id="app-sidebar"
        className={`
          /* --- Base Styles --- */
          flex flex-col flex-shrink-0 w-64 bg-base-100 border-r border-base-300
          transition-transform duration-300 ease-in-out
          
          /* --- MOBILE STYLES (Default) --- */
          /* It's a fixed overlay, positioned below the 3.5rem header (top-14) and */
          /* above a hypothetical 4rem bottom nav (bottom-16). This defines its vertical space. */
          fixed top-14 bottom-16 z-50 transform 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}

          /* --- DESKTOP STYLES (lg and up) --- */
          /* On desktop, it becomes part of the layout flow, not a fixed overlay. */
          lg:relative lg:translate-x-0 lg:z-auto
          /* It sticks to the top of its scrolling container, 14 units (3.5rem) down from the top. */
          lg:sticky lg:top-14 
          /* Its height is calculated to fill the viewport minus the header's height. */
          lg:h-[calc(100vh-3.5rem)] 
        `}
        tabIndex={-1}
        aria-labelledby="drawer-title"
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center p-4 border-b border-base-300 shrink-0 h-14">
          <h5
            id="drawer-title"
            className="text-2xl font-fancy-lobster text-primary tracking-wide"
          >
            Navigation
          </h5>
          {/* Close button ONLY appears on small screens */}
          <button
            title="Close menu"
            className="p-1.5 rounded-full text-base-content hover:bg-base-200 lg:hidden"
            type="button"
            onClick={onMobileClose}
            aria-label="Close menu"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Area */}
        <div className="p-3 border-b border-base-300 shrink-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="w-4 h-4 text-base-content/70" />
            </div>
            <input
              type="text"
              name="search-drawer"
              id="search-drawer"
              className="block w-full pl-9 pr-3 py-2 text-sm rounded-md bg-base-200 border border-base-300 text-base-content placeholder:text-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search menu items"
            />
          </div>
        </div>

        {/* Drawer Items List */}
        <div className="flex-grow p-3 overflow-y-auto">
          {displayedItems.length > 0 ? (
            <ul className="space-y-1.5 font-medium">
              {displayedItems.map((item: DrawerItem) => {
                const isActive = location.pathname === item.link ||
                                 (item.link !== "/" && location.pathname.startsWith(item.link) && item.link.length > 1);
                return (
                  <li key={item.id}>
                    <Link
                      to={item.link}
                      onClick={() => handleLinkClick(item)}
                      className={`flex items-center p-2.5 rounded-lg transition-all duration-200 ease-in-out group
                        ${isActive
                          ? 'bg-primary/10 text-primary shadow-sm font-semibold'
                          : 'text-base-content/80 hover:bg-base-200 hover:text-base-content'
                        }
                      `}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.icon && (
                        <item.icon className={`w-5 h-5 mr-3 shrink-0 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-base-content/70'}`} />
                      )}
                      <span className="flex-1 whitespace-nowrap text-sm">{item.name}</span>
                    </Link>
                    {selectedItem && selectedItem.id === item.id && (
                      <div className="mt-2 text-center text-base-content/70 animate-fade-in-up">
                        <p className="text-xs italic">"{quote}"</p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="p-4 text-sm text-center text-base-content/70">
              No items match your search.
            </p>
          )}
        </div>
      </aside>
    </>
  );
};

// --- HELPER COMPONENTS (These are unchanged) ---
const FontStyle = memo(() => {
    const css = `
        @import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');
        .font-fancy-lobster {
            font-family: 'Lobster', cursive;
        }
    `;
    return <style>{css}</style>;
});

const AnimationStyle = memo(() => {
    const css = `
        @keyframes fade-in-up {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
        }
    `;
    return <style>{css}</style>;
});

export default Drawer;