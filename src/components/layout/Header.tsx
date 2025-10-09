import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';

// --- ICON IMPORTS ---
import { Home, FileText, Award, Newspaper, LayoutDashboard, DownloadCloud, Menu, ArrowLeft, ArrowRight, ChevronDown, Info, Mail, HelpCircle } from 'lucide-react';

// --- COMPONENT IMPORTS ---
import ProfileDropdown from "./ProfileDropdown";
import { RootState } from "../../app/store";

// --- HOOKS & UTILS ---
import { usePWA } from "../../hooks/usePWA";

// --- TYPE DEFINITIONS ---
interface NavLinkType {
  to: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  auth?: boolean;
}

// The onMobileMenuToggle prop remains optional for use in multiple layouts.
interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

/**
 * The main Header component for the application.
 * It is designed to be fixed at the top of the screen, spanning the full width
 * in all layouts. It conditionally shows a menu button for the dashboard layout.
 */
const Header = ({ onMobileMenuToggle }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // --- GLOBAL STATE ---
  const { user: currentUser } = useSelector((state: RootState) => state.user);
  const isLoggedIn = !!currentUser;
  
  // --- CUSTOM HOOKS ---
  const { shouldShowPWAButton, handlePWAInstall } = usePWA();
  
  // --- NAVIGATION CONFIGURATION ---
  const mainNavLinks: NavLinkType[] = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/documents", icon: FileText, label: "Documents", auth: true },
    { to: "/featured", icon: Award, label: "Featured" },
    { to: "/articles", icon: Newspaper, label: "Articles" },
  // Subscriptions removed per request
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", auth: true },
  ];

  const moreLinks: NavLinkType[] = [
  { to: "/how-it-works", icon: HelpCircle, label: "How It Works" },
  { to: "/about", icon: Info, label: "About Us" }, 
  { to: "/contact", icon: Mail, label: "Contact Us" } 
  ];

  // Helper function to determine if a nav link is currently active.
  const isActive = (path: string) => location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
  
  // Reusable DaisyUI/Tailwind classes for consistent styling.
  const linkClasses = (active: boolean) =>
    `relative group flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors duration-300 ${
      active ? 'text-primary' : 'text-base-content hover:text-primary'
    }`;
  
  const iconButtonClasses = "btn btn-ghost btn-circle";

  return (
    // ‼️ UPDATED CLASSNAME FOR FULL-WIDTH LAYOUT ‼️
    // This header is now always fixed to the top, left, and right of the screen.
    // The complex logic for `lg:left-64` has been removed for a consistent, full-width appearance.
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-base-100/80 backdrop-blur-lg border-b border-base-300 transition-colors duration-300">
      <div className="flex items-center justify-between h-full w-full max-w-screen-2xl mx-auto px-4">
        
        {/* Left Side: Logo, Conditional Drawer Toggle, and Desktop Navigation */}
        <div className="flex items-center gap-4">
          
          {/* This menu button will ONLY render if the onMobileMenuToggle prop is passed (i.e., in DashboardLayout) */}
          {isLoggedIn && onMobileMenuToggle && (
            <button 
              onClick={onMobileMenuToggle} 
              className={`${iconButtonClasses} lg:hidden -ml-2`} 
              aria-label="Open Dashboard Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group" aria-label="Go to Mwalimu Homepage">
            <img src="/atmwalimulogo.png" alt="@mwalimu Logo" className="h-8 w-auto transition-transform duration-300 group-hover:scale-110" />
            <span className="text-xl font-bold text-base-content transition-colors duration-300 group-hover:text-primary">@mwalimu</span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-1">
            {mainNavLinks.filter(link => !link.auth || isLoggedIn).map(link => (
              <Link key={link.to} to={link.to} className={linkClasses(isActive(link.to))}>
                <link.icon className="w-4 h-4" /> {link.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
            
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-sm flex items-center gap-1 normal-case font-semibold">
                More <ChevronDown className="w-4 h-4" />
              </label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52">
                {moreLinks.map(link => (
                  <li key={link.to}><Link to={link.to} className={isActive(link.to) ? 'active' : ''}><link.icon className="w-4 h-4" /> {link.label}</Link></li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        {/* Right Side: Navigation controls, PWA button, and Profile Menu */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 border-r border-base-300 pr-3 mr-1">
            <button onClick={() => navigate(-1)} className={iconButtonClasses} title="Go back"><ArrowLeft className="h-5 w-5" /></button>
            <button onClick={() => navigate(1)} className={iconButtonClasses} title="Go forward"><ArrowRight className="h-5 w-5" /></button>
          </div>
          
          {shouldShowPWAButton && (
            <button onClick={handlePWAInstall} title="Install App" className={iconButtonClasses}>
              <DownloadCloud className="h-5 w-5" />
            </button>
          )}
          
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;