/**
 * PublicLayout — Shared wrapper for all public-facing static pages.
 * Renders Navbar + scrollable content + Footer.
 */
import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-slate-900">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);
