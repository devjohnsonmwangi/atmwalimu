// src/AppWrapper.tsx

import React from 'react';
// Imagine you have these context providers defined elsewhere in your app
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return (
    // Providers are nested. The outer ones are available to the inner ones.
    <ThemeProvider>
      <AuthProvider>
        {/* Your <App /> component and all its children can now
            access the AuthContext and ThemeContext. */}
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppWrapper;