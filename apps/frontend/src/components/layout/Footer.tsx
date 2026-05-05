import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Send, MapPin, Mail, Phone } from 'lucide-react';
import { CONTACT_INFO } from '../../utils/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-lowest pt-24 pb-12 border-t border-surface-container">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
          
          {/* Brand (Col 1-4) */}
          <div className="lg:col-span-4">
            <Link to="/" className="block mb-8">
              <img 
                src="/logo.png" 
                alt="The Artist Mall" 
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-neutral-content/60 text-base font-medium leading-relaxed mb-8 max-w-sm">
              A verified artist directory and booking support platform for corporate events, weddings, private functions, and live shows.
            </p>
            <div className="flex items-center gap-4">
              <a href={CONTACT_INFO.SOCIAL.FACEBOOK} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-surface-low text-neutral-content/40 rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all shadow-sm"><Facebook className="w-4 h-4" /></a>
              <a href={CONTACT_INFO.SOCIAL.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-surface-low text-neutral-content/40 rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all shadow-sm"><Instagram className="w-4 h-4" /></a>
              <a href={CONTACT_INFO.SOCIAL.LINKEDIN} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-surface-low text-neutral-content/40 rounded-full flex items-center justify-center hover:bg-brand-secondary hover:text-white transition-all shadow-sm"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick Links (Col 5-6) */}
          <div className="lg:col-span-2">
            <h4 className="text-neutral-content text-xs font-black uppercase tracking-[0.2em] mb-8">Navigation</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-neutral-content/60 hover:text-brand-primary font-bold text-sm transition-colors">About Us</Link></li>
              <li><Link to="/artists" className="text-neutral-content/60 hover:text-brand-primary font-bold text-sm transition-colors">Browse Artists</Link></li>
              <li><Link to="/how-it-works" className="text-neutral-content/60 hover:text-brand-primary font-bold text-sm transition-colors">How It Works</Link></li>
              <li><Link to="/why-choose-us" className="text-neutral-content/60 hover:text-brand-primary font-bold text-sm transition-colors">Why Choose Us</Link></li>
              <li><Link to="/contact" className="text-neutral-content/60 hover:text-brand-primary font-bold text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Expertise (Col 7-8) */}
          <div className="lg:col-span-2">
            <h4 className="text-neutral-content text-xs font-black uppercase tracking-[0.2em] mb-8">Expertise</h4>
            <ul className="space-y-4">
              <li><Link to="/corporate-solutions" className="text-neutral-content/60 hover:text-brand-primary font-bold text-sm transition-colors">Corporate Events</Link></li>
              <li><Link to="/wedding-entertainment" className="text-neutral-content/60 hover:text-brand-primary font-bold text-sm transition-colors">Weddings</Link></li>
              <li><Link to="/celebrity-booking" className="text-neutral-content/60 hover:text-brand-primary font-bold text-sm transition-colors">Celebrity Booking</Link></li>
              <li><Link to="/artist-categories" className="text-neutral-content/60 hover:text-brand-primary font-bold text-sm transition-colors">Categories</Link></li>
              <li><Link to="/featured-artists" className="text-neutral-content/60 hover:text-brand-primary font-bold text-sm transition-colors">Featured Talent</Link></li>
            </ul>
          </div>

          {/* Contact Information (Col 9-12) */}
          <div className="lg:col-span-4">
            <h4 className="text-neutral-content text-xs font-black uppercase tracking-[0.2em] mb-8">Contact</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-surface-low rounded-xl flex items-center justify-center shrink-0 border border-surface-container">
                  <MapPin className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <p className="text-neutral-content font-bold text-sm">Location</p>
                  <p className="text-neutral-content/60 text-sm mt-1 whitespace-pre-line">{CONTACT_INFO.ADDRESS}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-surface-low rounded-xl flex items-center justify-center shrink-0 border border-surface-container">
                  <Mail className="w-5 h-5 text-brand-secondary" />
                </div>
                <div>
                  <p className="text-neutral-content font-bold text-sm">Email Inquiry</p>
                  <a href={`mailto:${CONTACT_INFO.EMAIL}`} className="text-neutral-content/60 text-sm mt-1 hover:text-brand-secondary transition-colors block">{CONTACT_INFO.EMAIL}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-surface-low rounded-xl flex items-center justify-center shrink-0 border border-surface-container">
                  <Phone className="w-5 h-5 text-brand-success" />
                </div>
                <div>
                  <p className="text-neutral-content font-bold text-sm">Phone & WhatsApp</p>
                  <a href={`tel:+91${CONTACT_INFO.PHONE}`} className="text-neutral-content/60 text-sm mt-1 hover:text-brand-success transition-colors block">+91 {CONTACT_INFO.PHONE}</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Policy Links */}
        <div className="border-t border-surface-container pt-12 pb-8 flex flex-wrap gap-x-8 gap-y-4">
          <Link to="/privacy-policy" className="text-neutral-content/40 hover:text-neutral-content text-[11px] font-bold uppercase tracking-widest transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="text-neutral-content/40 hover:text-neutral-content text-[11px] font-bold uppercase tracking-widest transition-colors">Terms & Conditions</Link>
          <Link to="/refund-policy" className="text-neutral-content/40 hover:text-neutral-content text-[11px] font-bold uppercase tracking-widest transition-colors">Refund Policy</Link>
          <Link to="/booking-policy" className="text-neutral-content/40 hover:text-neutral-content text-[11px] font-bold uppercase tracking-widest transition-colors">Booking Policy</Link>
          <Link to="/cancellation-policy" className="text-neutral-content/40 hover:text-neutral-content text-[11px] font-bold uppercase tracking-widest transition-colors">Cancellation Policy</Link>
          <Link to="/disclaimer" className="text-neutral-content/40 hover:text-neutral-content text-[11px] font-bold uppercase tracking-widest transition-colors">Disclaimer</Link>
          <Link to="/faq" className="text-neutral-content/40 hover:text-neutral-content text-[11px] font-bold uppercase tracking-widest transition-colors">FAQ</Link>
        </div>

        {/* Newsletter & Bottom Bar */}
        <div className="border-t border-surface-container pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-success rounded-full animate-pulse"></div>
            <p className="text-neutral-content/40 font-bold text-[11px] uppercase tracking-widest">
              © {new Date().getFullYear()} The Artist Mall
            </p>
          </div>
          
          <div className="flex bg-surface-low border border-surface-container rounded-2xl p-1.5 focus-within:ring-4 focus-within:ring-brand-primary/10 focus-within:border-brand-primary transition-all min-w-[320px]">
            <input 
              type="email" 
              placeholder="Get artist and event updates" 
              className="bg-transparent text-xs font-bold px-4 py-2 flex-grow focus:outline-none placeholder:text-neutral-content/40"
            />
            <button className="bg-brand-primary hover:bg-brand-primaryContainer text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20 transition-all flex items-center gap-2">
              Subscribe <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
