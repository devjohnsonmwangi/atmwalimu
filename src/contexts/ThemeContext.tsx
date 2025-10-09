/* eslint-disable react-refresh/only-export-components */
// src/contexts/ThemeContext.tsx

import  { 
  createContext, 
  useState, 
  useEffect, 
  useContext, 
  ReactNode,
  useCallback 
} from 'react';

// Define the possible theme values we'll manage in our state
type Theme = 'light' | 'dark';

// Define the shape of the data our context will provide
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create the actual React Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Define the names of our custom DaisyUI themes from tailwind.config.js
const lightThemeName = 'mwalimu-light';

/**
 * The ThemeProvider component. It will wrap our application and provide
 * theme state and functionality to all components within it.
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Theme is fixed to light mode for this application.
  const [theme] = useState<Theme>('light');

  // Ensure the document uses the light DaisyUI theme and remove any 'dark' class.
  useEffect(() => {
    try {
      const root = window.document.documentElement;
      root.setAttribute('data-theme', lightThemeName);
      root.classList.remove('dark');
      // Clean up any stored preference to avoid future confusion.
  try { localStorage.removeItem('mwalimu-app-theme'); } catch (e) { void e; }
    } catch (err) {
      // ignore
    }
  }, []);

  // No-op toggle since the app will always be light
  const toggleTheme = useCallback(() => {}, []);

  // Provide the theme state and toggle function to all child components.
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * A custom hook for easily consuming the theme context in any component.
 * This is a best practice to avoid importing `useContext` and `ThemeContext` everywhere.
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};