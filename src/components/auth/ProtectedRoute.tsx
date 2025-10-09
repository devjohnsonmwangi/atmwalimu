import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectIsAuthenticated, selectUserRole } from '../../features/users/userSlice';

/**
 * A component that acts as a route guard for admin users only.
 * 
 * This component performs a two-step check:
 * 1. Is the user authenticated (do they have an access token)?
 * 2. Does the authenticated user have the role of 'admin'?
 * 
 * - If both conditions are true, it renders the child routes using <Outlet />.
 * - If either condition is false, it redirects them to the '/login' page.
 * 
 * This is used for pages that should only be accessible to administrators
 * (e.g., managing users, viewing site-wide analytics, managing categories).
 */
const ProtectedRoute: React.FC = () => {
  // Use selectors to derive authentication and role information from the user slice.
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);

  // Check for authentication AND authorization (admin role).
  if (!isAuthenticated || userRole !== 'admin') {
    // If the user is not logged in or is not an admin, redirect them.
    // The `replace` prop ensures the protected route is not in the browser's history.
    return <Navigate to="/login" replace />;
  }
  
  // If the user is an authenticated admin, render the nested child routes.
  return <Outlet />;
};

export default ProtectedRoute;