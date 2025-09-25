
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa'; // Keeping these for now, can be replaced

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Social links are good to keep for general presence
  const socialLinks = [
    { href: 'https://facebook.com/mwalimuedu', icon: FaFacebookF, label: 'Facebook' },
    { href: 'https://twitter.com/mwalimuedu', icon: FaTwitter, label: 'Twitter' },
    { href: 'https://linkedin.com/company/mwalimuedu', icon: FaLinkedinIn, label: 'LinkedIn' },
    { href: 'https://instagram.com/mwalimuedu', icon: FaInstagram, label: 'Instagram' },
  ];

  // Define color scheme for @mwalimu
  const mwalimuColors = {
    background: 'bg-gray-900', // Dark background
    textPrimary: 'text-gray-300', // Light grey text
    textSecondary: 'text-gray-400', // Slightly dimmer grey text
    accent: 'text-green-400', // Primary green accent for links and highlights
    accentHover: 'hover:text-green-300', // Green hover
    logoColor: 'text-blue-400', // A nice blue for the logo
    logoHoverColor: 'hover:text-blue-300',
    copyrightBg: 'border-t border-green-700', // Green line separator
    linkHoverBg: 'hover:bg-green-600', // For button-like links if used
  };

  return (
    <footer className={`${mwalimuColors.background} ${mwalimuColors.textPrimary}`}>
      <div className="container mx-auto px-6 py-8 sm:py-12 lg:py-16">

        <div className="hidden sm:block">
          <div className="mb-10 flex flex-col items-center space-y-6 text-center md:flex-row md:justify-between md:space-y-0">
            {/* Logo Section */}
            <Link to="/" className={`text-3xl font-bold ${mwalimuColors.logoColor} ${mwalimuColors.logoHoverColor} transition-colors duration-300`}>
              @mwalimu
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Resources Section */}
            <div>
              <h6 className={`text-sm font-semibold uppercase tracking-wider ${mwalimuColors.textSecondary} mb-4`}>Resources</h6>
              <ul className="space-y-2">
                <li><Link to="/notes" className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}>Revision Notes</Link></li>
                <li><Link to="/videos" className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}>Video Lessons</Link></li>
                <li><Link to="/articles" className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}>Articles & Guides</Link></li>
                <li><Link to="/news" className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}>Latest News</Link></li>
                <li><Link to="/exams" className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}>Exam Prep</Link></li>
              </ul>
            </div>

            {/* About Section */}
            <div>
              <h6 className={`text-sm font-semibold uppercase tracking-wider ${mwalimuColors.textSecondary} mb-4`}>About Us</h6>
              <ul className="space-y-2">
                <li><Link to="/about" className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}>Our Mission</Link></li>
                <li><Link to="/team" className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}>Our Team</Link></li>
                <li><Link to="/partners" className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}>Partners</Link></li>
                <li><Link to="/contact" className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}>Contact Us</Link></li>
              </ul>
            </div>

            {/* Community Section */}
            <div>
              <h6 className={`text-sm font-semibold uppercase tracking-wider ${mwalimuColors.textSecondary} mb-4`}>Community</h6>
              <ul className="space-y-2">
                <li><Link to="/forum" className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}>Forum</Link></li>
                <li><Link to="/discussions" className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}>Discussions</Link></li>
                <li><Link to="/events" className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}>Events</Link></li>
                <li><Link to="/get-involved" className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}>Get Involved</Link></li>
              </ul>
            </div>

            {/* Connect With Us Section (Social Media) */}
            <div>
              <h6 className={`text-sm font-semibold uppercase tracking-wider ${mwalimuColors.textSecondary} mb-4`}>Connect With Us</h6>
              <div className="flex space-x-4 justify-center md:justify-start"> {/* Center on mobile, left on larger screens */}
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}
                  >
                    <social.icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-specific footer for quick links and copyright */}
        <div className="sm:hidden">
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className={`text-3xl font-bold ${mwalimuColors.logoColor} ${mwalimuColors.logoHoverColor} transition-colors duration-300 mb-6`}>
              @mwalimu
            </Link>
            <div className="flex space-x-4 justify-center">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h6 className={`text-sm font-semibold uppercase tracking-wider ${mwalimuColors.textSecondary} mb-4 text-center`}>Resources</h6>
              <ul className="space-y-2 text-center">
                <li><Link to="/notes" className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}>Notes</Link></li>
                <li><Link to="/videos" className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}>Videos</Link></li>
                <li><Link to="/articles" className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}>Articles</Link></li>
              </ul>
            </div>
            <div>
              <h6 className={`text-sm font-semibold uppercase tracking-wider ${mwalimuColors.textSecondary} mb-4 text-center`}>About</h6>
              <ul className="space-y-2 text-center">
                <li><Link to="/about" className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}>Mission</Link></li>
                <li><Link to="/contact" className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}>Contact</Link></li>
                <li><Link to="/privacy-policy" className={`${mwalimuColors.accent} ${mwalimuColors.accentHover} transition-colors duration-300`}>Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className={`text-center text-sm sm:pt-8 pt-6 ${mwalimuColors.copyrightBg}`}>
          <p className={`${mwalimuColors.textSecondary}`}>
            © {currentYear} <Link to="/" className={`font-semibold ${mwalimuColors.logoColor} ${mwalimuColors.logoHoverColor} transition-colors duration-300`}>@mwalimu</Link>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;