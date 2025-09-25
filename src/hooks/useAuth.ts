import { useSelector } from 'react-redux';

import { selectCurrentUser, selectIsAuthenticated } from '../features/users/userSlice'; // Import selectors from your user slice

export const useAuth = () => {
  // Use the selectors to get data directly from your userSlice
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // You can also add logic to derive data here
  // For example, check if the user has an 'admin' role
  const isAdmin = user?.role === 'admin'; // Adjust 'user.role' based on your user object's structure

  // Return a convenient object for your components to use
  return {
    user,
    isAuthenticated,
    isAdmin,
  };
};