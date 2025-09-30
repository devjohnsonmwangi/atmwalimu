import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '../../app/store'; // Adjust the path to your Redux store if needed

/**
 * A component that acts as a route guard for authenticated users.
 * 
 * This component checks if a user has an access token in the Redux store.
 * - If the user is authenticated, it renders the child routes using <Outlet />.
 * - If the user is not authenticated, it redirects them to the '/login' page.
 * 
 * This is used for pages that require a user to be logged in but do not require
 * any specific role (e.g., profile page, create post page).
 */
const AuthenticatedRoute: React.FC = () => {
  // Select the access token from the user slice in the Redux store.
  const { accessToken } = useSelector((state: RootState) => state.user);

  // If there's no access token, the user is not logged in.
  if (!accessToken) {
    // Redirect the user to the login page.
    // The `replace` prop prevents the user from navigating back to the protected route.
    return <Navigate to="/login" replace />;
  }
  
  // If the user is authenticated, render the nested child routes.
  // The <Outlet /> component is a placeholder provided by React Router.
  return <Outlet />;
};

export default AuthenticatedRoute;