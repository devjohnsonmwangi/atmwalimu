// src/components/layout/BottomNav.tsx

import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useSelector } from 'react-redux';
import { RootState } from "../../app/store";

// --- ICON IMPORTS ---
import { Home, FileText, Newspaper, LayoutDashboard, Award, Star, MoreHorizontal, Info, Mail, HelpCircle, X, LogIn, UserPlus } from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface NavLinkType {
  to: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  auth?: boolean;
}

// ===================================================================
// --- SUB-COMPONENT: The "More" Sheet ---
// ===================================================================
const MobileMoreSheet: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user: currentUser } = useSelector((state: RootState) => state.user);
  const isLoggedIn = !!currentUser;

  const isActive = (path: string) => location.pathname === path || (path !== "/" && location.pathname.startsWith(path));

  // Links to show in the "More" sheet
  const moreSheetLinks: NavLinkType[] = [
    { to: "/how-it-works", icon: HelpCircle, label: "How It Works" },
    { to: "/about", icon: Info, label: "About Us" }, 
    { to: "/contactus", icon: Mail, label: "Contact Us" } 
  ];

  const sheetLinkClass = (active: boolean) =>
    `flex items-center gap-4 p-3 rounded-lg text-base font-semibold ${
      active ? 'bg-primary/10 text-primary' : 'hover:bg-base-200'
    }`;
  
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 z-40 transition-opacity lg:hidden ${isOpen ? "bg-black/40" : "bg-transparent pointer-events-none"}`} 
        onClick={onClose} 
        aria-hidden="true"
      />
      {/* Sheet Content */}
      <div className={`fixed bottom-0 left-0 right-0 w-full bg-base-100 rounded-t-2xl shadow-lg z-50 p-4 transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? 'translate-y-0' : 'translate-y-full'}`} role="dialog">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-base-content">More Options</h3>
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {moreSheetLinks.map(link => (
            <Link key={`mobile-more-${link.to}`} to={link.to} className={sheetLinkClass(isActive(link.to))}>
              <link.icon className="w-5 h-5" /> {link.label}
            </Link>
          ))}
          {!isLoggedIn && (
            <>
              <div className="divider my-2"></div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link to="/login" className="btn btn-ghost">
                  <LogIn className="w-4 h-4" /> Log In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  <UserPlus className="w-4 h-4" /> Sign Up
                </Link>
              </div>
            </>
          )}
        </nav>
      </div>
    </>
  );
};

// ===================================================================
// --- MAIN COMPONENT: The Bottom Navigation Bar ---
// ===================================================================
const BottomNav = () => {
  const location = useLocation();
  const { user: currentUser } = useSelector((state: RootState) => state.user);
  const isLoggedIn = !!currentUser;
  const [isMoreSheetOpen, setMoreSheetOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path || (path !== "/" && location.pathname.startsWith(path));

  // Determine which links to show based on login status.
  const mobileLinks = isLoggedIn
    ? [ { to: "/", icon: Home, label: "Home" }, { to: "/documents", icon: FileText, label: "Docs" }, { to: "/articles", icon: Newspaper, label: "Articles" }, { to: "/dashboard", icon: LayoutDashboard, label: "Board" } ]
    : [ { to: "/", icon: Home, label: "Home" }, { to: "/featured", icon: Award, label: "Featured" }, { to: "/articles", icon: Newspaper, label: "Articles" }, { to: "/subscriptions", icon: Star, label: "Plans" } ];

  // Reusable classes for the nav items
  const linkClass = (active: boolean) => 
    `flex flex-col items-center justify-center h-full w-full transition-colors duration-300 transform active:scale-90 ${
      active ? 'text-primary' : 'text-base-content/70'
    }`;

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 z-30 bg-base-100/80 backdrop-blur-lg border-t border-base-300 flex items-center justify-around">
        {mobileLinks.map(link => (
          <Link key={link.to} to={link.to} className={linkClass(isActive(link.to))} title={link.label}>
            <link.icon className="w-5 h-5" />
            <span className="text-xs mt-1 font-bold">{link.label}</span>
          </Link>
        ))}
        <button onClick={() => setMoreSheetOpen(true)} className={linkClass(false)} title="More Options">
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-xs mt-1 font-bold">More</span>
        </button>
      </nav>
      <MobileMoreSheet isOpen={isMoreSheetOpen} onClose={() => setMoreSheetOpen(false)} />
    </>
  );
};

export default BottomNav;