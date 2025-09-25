import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header'; 
import AppDrawer from '../../pages/dashboard/aside/Drawer';

/**
 * DashboardLayout Component (Flexbox Version)
 *
 * This layout places the Header at the top of the viewport at all times.
 * Below the header, it uses a Flexbox container to arrange the AppDrawer (sidebar)
 * and the main content area side-by-side.
 */
const DashboardLayout = () => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const location = useLocation();

  // Effect to close the mobile drawer when the user navigates
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-base-200/50">
      {/* 
        The Header is now a top-level component. Since it has `position: fixed`,
        it will always be rendered at the top of the screen, full-width.
      */}
      <Header onMobileMenuToggle={() => setIsMobileDrawerOpen(true)} />
      
      {/* 
        This container holds the Sidebar and Main Content side-by-side.
        - `flex`: This is the key change. It creates the side-by-side layout for its children.
        - `relative`: Establishes a positioning context.
        - `pt-14`: This is CRUCIAL. It pushes this entire container down to start
                   BELOW the fixed header (which has a height of h-14).
      */}
      <div className="relative flex pt-14">

        {/* The Drawer is the first item in the flex container. Its own CSS handles its width and sticky behavior. */}
        <AppDrawer
          isMobileOpen={isMobileDrawerOpen}
          onMobileClose={() => setIsMobileDrawerOpen(false)}
        />
        
        {/* 
          The main content area is the second item.
          - `flex-1`: This is also KEY. It tells this div to grow and take up all
                      remaining available horizontal space next to the drawer.
          - `overflow-y-auto`: Ensures content inside this area can scroll independently if it's too long.
        */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet /> {/* Your dashboard page content (e.g., DashboardPage) renders here */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;