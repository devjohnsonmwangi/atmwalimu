/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Define the shape of a user object
interface User {
  id: string;
  name: string;
  email: string;
}

// 2. Define the shape of the context's value
interface AuthContextState {
  user: User | null;
  isLoading: boolean;
  login: (username: string) => Promise<void>;
  logout: () => void;
}

// 3. Create the context with a default value (undefined)
// We'll handle the 'undefined' case in our custom hook.
const AuthContext = createContext<AuthContextState | undefined>(undefined);

// 4. Create the Provider component
// This component will wrap our app and provide the auth state.
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Simulate a login API call
  const login = async (username: string) => {
    setIsLoading(true);
    console.log(`Logging in as ${username}...`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, you would fetch user data from an API
    const fakeUserData: User = {
      id: '123',
      name: username,
      email: `${username}@mwalimu.io`,
    };
    setUser(fakeUserData);
    setIsLoading(false);
    console.log('Logged in successfully!');
  };

  // Simulate a logout action
  const logout = () => {
    console.log('Logging out...');
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 5. Create a custom hook for easy consumption of the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This error is helpful for developers. It tells them they've
    // used the hook outside of the provider's scope.
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};