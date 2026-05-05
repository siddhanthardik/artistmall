import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '../../utils/constants';

/**
 * Premium Floating WhatsApp Widget
 * Provides a production-grade, elegant chat interface.
 */
export const WhatsAppWidget: React.FC = () => {
  return (
    <AnimatePresence>
      <motion.a
        href={CONTACT_INFO.WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-[9999] group"
        title="Chat on WhatsApp"
      >
        {/* Tooltip */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-xl shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Chat with Us</p>
        </div>

        {/* Pulse Effect */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
        
        {/* Main Button */}
        <div className="relative w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-2xl shadow-[#25D366]/40 border-4 border-white">
          <MessageCircle className="w-8 h-8 fill-white" />
        </div>
      </motion.a>
    </AnimatePresence>
  );
};
