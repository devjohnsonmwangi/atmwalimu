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
const darkThemeName = 'mwalimu-dark';

/**
 * The ThemeProvider component. It will wrap our application and provide
 * theme state and functionality to all components within it.
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // State to hold the current active theme ('light' or 'dark')
  const [theme, setTheme] = useState<Theme>('light');

  // This effect runs only once when the app first loads.
  // It determines the initial theme based on user's saved preference or system settings.
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('mwalimu-app-theme') as Theme | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      // Priority for initial theme:
      // 1. User's previously saved choice in localStorage.
      // 2. User's operating system preference (e.g., macOS dark mode).
      // 3. Fallback to 'light' theme as the default.
      if (storedTheme) {
        setTheme(storedTheme);
      } else if (prefersDark) {
        setTheme('dark');
      }
    } catch (error) {
      console.error("Could not access localStorage to set initial theme.", error);
    }
  }, []);

  // This effect runs whenever the `theme` state changes.
  // Its job is to update the DOM and persist the new theme.
  useEffect(() => {
    const root = window.document.documentElement;

    // Apply the correct `data-theme` attribute for DaisyUI to apply styles.
    // Also add/remove a simple '.dark' class for any custom CSS that might need it.
    if (theme === 'dark') {
      root.setAttribute('data-theme', darkThemeName);
      root.classList.add('dark');
    } else {
      root.setAttribute('data-theme', lightThemeName);
      root.classList.remove('dark');
    }

    // Save the user's current choice to localStorage for future visits.
    try {
      localStorage.setItem('mwalimu-app-theme', theme);
    } catch (error) {
      console.error("Could not save theme to localStorage.", error);
    }
  }, [theme]);

  // A memoized function to toggle the theme state.
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

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