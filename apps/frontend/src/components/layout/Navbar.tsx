import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About us', to: '/about' },
    { label: 'Browse Artists', to: '/artists' },
    { label: 'Categories', to: '#', hasDropdown: true },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact us', to: '/contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 top-0 transition-all duration-300 ${
        isScrolled || location.pathname !== '/'
          ? 'bg-white py-4 shadow-sm border-b border-surface-container'
          : 'bg-white py-6 shadow-sm border-b border-surface-container'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center">
          {/* ── Logo ──────────────────────────────────────────────────────── */}
          <Link to="/" className="relative z-10">
            <img src="/logo.png" alt="The Artist Mall" className="h-10 md:h-11 w-auto" />
          </Link>

          {/* ── Desktop Navigation ────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group py-2">
                <Link
                  to={link.to}
                  className={`text-[15px] font-medium transition-all duration-300 relative px-1 ${
                    location.pathname === link.to || (link.to === '/' && location.pathname === '/')
                      ? 'text-brand-primary'
                      : 'text-neutral-content/70 hover:text-brand-primary'
                  }`}
                >
                  {link.label}

                  {/* Underline for active/hover */}
                  <span
                    className={`absolute bottom-[-14px] left-0 h-[2px] bg-brand-primary transition-all duration-300 ${
                      location.pathname === link.to ||
                      (link.to === '/' && location.pathname === '/')
                        ? 'w-full'
                        : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </Link>

                {link.hasDropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-white shadow-2xl rounded-2xl border border-surface-high opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-2 transform origin-top group-hover:scale-100 scale-95">
                    <div className="flex flex-col">
                      <DropdownItem label="Singers & Vocalists" to="/artists?categoryName=Singer" />
                      <DropdownItem label="Live Bands" to="/artists?categoryName=Live%20Band" />
                      <DropdownItem label="DJs & Producers" to="/artists?categoryName=DJ" />
                      <DropdownItem label="Comedians" to="/artists?categoryName=Comedian" />
                      <DropdownItem label="Celebrity Anchors" to="/artists?categoryName=Anchor" />
                      <div className="mx-3 my-2 h-[1px] bg-surface-container"></div>
                      <Link
                        to="/artist-categories"
                        className="px-4 py-2 text-xs font-bold text-brand-primary hover:text-brand-primaryContainer flex items-center justify-between group/link"
                      >
                        View All Categories{' '}
                        <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Desktop Action ───────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center">
            <Link
              to="/contact"
              className="bg-brand-primary text-white px-7 py-3 rounded-xl text-[15px] font-bold transition-all duration-300 shadow-lg hover:bg-brand-primaryContainer hover:shadow-brand-primary/20 flex items-center justify-center whitespace-nowrap"
            >
              Book an Artist
            </Link>
          </div>

          {/* ── Mobile menu button ────────────────────────────────────────── */}
          <div className="lg:hidden relative z-10">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 transition-colors text-neutral-content"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-0 left-0 w-full bg-surface z-40 flex flex-col pt-24 px-6 border-b border-surface-container overflow-hidden"
          >
            <div className="space-y-6 flex-1 overflow-y-auto">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="border-b border-surface-container pb-4"
                >
                  <Link
                    to={link.to}
                    className={`text-2xl font-bold tracking-tight transition-colors flex items-center justify-between ${
                      location.pathname === link.to ||
                      (link.to === '/' && location.pathname === '/')
                        ? 'text-brand-primary'
                        : 'text-neutral-content hover:text-brand-primary'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                    <ChevronDown className="-rotate-90 w-5 h-5 text-surface-dim" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto pb-10 pt-6 bg-surface">
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full bg-brand-primary hover:bg-brand-primaryContainer transition-colors text-white text-center py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-primary/20"
              >
                Book an Artist
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const DropdownItem: React.FC<{ label: string; to: string }> = ({ label, to }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-content hover:text-brand-primary hover:bg-surface-low rounded-lg transition-all"
  >
    {label}
  </Link>
);
