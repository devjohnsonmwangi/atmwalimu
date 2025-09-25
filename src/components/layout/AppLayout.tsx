// src/components/layout/AppLayout.tsx

import { Outlet } from "react-router-dom";
import Header from "./Header";
import BottomNav from "./BottomNav";

/**
 * The main application shell component.
 * It provides the persistent layout with a header and a bottom navigation bar.
 * The main page content for the current route is rendered via the <Outlet /> component.
 */
const AppLayout = () => {
  return (
    // The main container uses DaisyUI's theme variables for background and text color.
    // 'min-h-screen' ensures it always fills at least the full height of the viewport.
    <div className="bg-base-100 text-base-content min-h-screen font-sans">
      <Header />
      
      {/* 
        This is the main content area of the application.
        The responsive padding is critical for the app shell to work correctly:
        - `pt-14`: Always have padding-top to prevent content from being hidden by the fixed Header.
        - `pb-16`: Have padding-bottom by default (for mobile) to prevent content from being hidden by the fixed BottomNav.
        - `lg:pb-0`: On large screens (lg) and up, REMOVE the padding-bottom because the BottomNav will be hidden.
      */}
      <main className="pt-14 pb-16 lg:pb-0">
        <Outlet /> {/* Child routes from `main.tsx` will be rendered here */}
      </main>
      
      <BottomNav />
    </div>
  );
};

export default AppLayout;