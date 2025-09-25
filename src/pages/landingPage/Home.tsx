import React from 'react';

// --- COMPONENT IMPORTS ---
import About from "./About";
import Footer from "./Footer";
import Hero from './Hero';
import Services from "./Services";
// --- REMOVED: No longer need to import a separate Navbar ---
// import Navbar from "../../components/navbar/Navbar";

// --- CONTEXT IMPORT ---
import { useTheme } from '../../contexts/ThemeContext';

/**
 * The Home page is now a pure content component.
 * It is rendered inside the AppLayout, which provides the main Header.
 */
const Home: React.FC = () => {
  // We still use the theme context to pass the theme to child components.
  const { theme } = useTheme();

  return (
    // ‼️ REMOVED the "pt-8" padding and the <Navbar /> component ‼️
    // The AppLayout's <main> tag already handles the necessary padding.
    <div>
      <section id="hero">
        <Hero theme={theme} />
      </section>

      <section id="about" className="mt-4">
        <About  />
      </section>

      <section id="services" className="mt-4">
        <Services />
      </section>

      <Footer />
    </div>
  );
}

export default Home;