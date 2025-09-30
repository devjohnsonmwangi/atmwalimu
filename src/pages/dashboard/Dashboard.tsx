import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
//import Navbar from "../../components/navbar/Navbar"; // Correctly included for a self-contained layout
import Drawer from "./aside/Drawer"; 
import { useSelector } from 'react-redux';
import { RootState } from "../../app/store"; 
import DashboardRouteChangeTracker from "../../components/RouteChangeTracker"; 

const Dashboard = () => {
  const navigate = useNavigate();
  const userAuthData = useSelector((state: RootState) => state.user);
  const currentUserDetails = userAuthData?.user; 

  useEffect(() => {
    if (!currentUserDetails || !currentUserDetails.email) {
      navigate('/login', { replace: true });
    }
  }, [currentUserDetails, navigate]);
  
  if (!currentUserDetails || !currentUserDetails.email) { 
    return (
        <div className="h-screen flex items-center justify-center bg-[rgb(var(--bg-secondary))]">
            <p className="text-lg text-[rgb(var(--text-secondary))]">Loading user session...</p>
        </div>
    );
  }

  return (
    <>
      <DashboardRouteChangeTracker />
      {/* 
        This is the main container for the entire dashboard view.
        - `h-screen`: Makes it fill the full viewport height.
        - `flex flex-col`: Stacks its children (Navbar and content) vertically.
      */}
      <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        
        {/* 1. The Navbar is rendered at the top of the dashboard. */}
       

        {/* 
          2. This div is the main content area.
          - `flex-1`: This is the KEY FIX. It tells this div to grow and take up all *remaining* vertical space after the Navbar is rendered.
          - `overflow-hidden`: Prevents the container itself from scrolling, which could cause double scrollbars.
        */}
        <div className="flex flex-1 overflow-hidden"> 
          
          {/* The desktop sidebar drawer */}
          <aside className="hidden lg:flex lg:flex-col lg:w-64 flex-shrink-0">
            <Drawer isMobileOpen={false} onMobileClose={() => {}} />
          </aside>
          
          {/* The main scrollable content area */}
          <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
            <div className="p-4 sm:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;