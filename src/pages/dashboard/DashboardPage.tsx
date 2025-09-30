// src/pages/dashboard/main/DashboardPage.tsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {
    selectIsAuthenticated,
    selectUserFullName,
    selectUserEmail,
    selectUserRole,
    selectUserProfilePictureUrl,
    selectUserNotificationCount
} from '../../features/users/userSlice'; // Adjust path
import DashboardOverview from './dashboardoverview'; // Adjust path

const DashboardPage: React.FC = () => {
  // Use the specific selectors to get exactly the data you need.
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const fullName = useSelector(selectUserFullName);
  const email = useSelector(selectUserEmail);
  const role = useSelector(selectUserRole);
  const profilePictureUrl = useSelector(selectUserProfilePictureUrl);
  const notificationCount = useSelector(selectUserNotificationCount);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardOverview
      userName={fullName || 'Mwalimu'}
      userEmail={email || 'No email provided'}
      userRole={role || 'user'}
      userAvatarUrl={profilePictureUrl || undefined}
      notificationCount={notificationCount || 0} 
    />
  );
};

export default DashboardPage;