import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Clock, Users, Send, CheckCircle2, ShieldCheck, MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import axios from 'axios';
import toast from 'react-hot-toast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistName: string;
  artistId: string;
  startingPrice: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, artistName, artistId, startingPrice }) => {
  const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    eventType: '',
    eventDate: '',
    eventLocation: '',
    estimatedGuests: '',
    budget: startingPrice?.toString() || '',
    additionalNotes: '',
    clientName: '',
    clientEmail: '',
    clientPhone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const eventDate = new Date(formData.eventDate);
    if (eventDate <= new Date()) {
      toast.error('Event date must be in the future');
      return;
    }
    if (parseInt(formData.estimatedGuests) <= 0) {
      toast.error('Guest count must be greater than 0');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = {
        artistId,
        artistName,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        eventCity: formData.eventLocation,
        guestCount: parseInt(formData.estimatedGuests, 10),
        customerName: formData.clientName,
        phone: formData.clientPhone,
        email: formData.clientEmail,
        message: formData.additionalNotes || `Budget: ${formData.budget}`
      };

      const env = (import.meta as any).env;
      const baseUrl = env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${baseUrl}/api/v1/leads/create`, payload);

      toast.success("Enquiry sent successfully 🚀");
      setStep('SUCCESS');
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send enquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('FORM');
      setFormData({
        eventType: '',
        eventDate: '',
        eventLocation: '',
        estimatedGuests: '',
        budget: startingPrice?.toString() || '',
        additionalNotes: '',
        clientName: '',
        clientEmail: '',
        clientPhone: ''
      });
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            data-artist-id={artistId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden"
          >
            {step === 'FORM' ? (
              <div className="flex flex-col h-[85vh] md:h-auto max-h-[90vh]">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Book {artistName}</h2>
                    <p className="text-brand-orange font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Artist Booking Inquiry</p>
                  </div>
                  <button onClick={handleClose} className="p-3 bg-white hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all shadow-sm border border-slate-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                  {/* Event Details Section */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-brand-orange border border-orange-100">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Event Specification</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Event Type</label>
                        <select 
                          required
                          value={formData.eventType}
                          onChange={e => setFormData({...formData, eventType: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 appearance-none transition-all"
                        >
                          <option value="">Select event type...</option>
                          <option value="Corporate">Corporate Gala</option>
                          <option value="Wedding">Wedding</option>
                          <option value="Private">Private Party</option>
                          <option value="Concert">Public Concert</option>
                          <option value="Festival">College Festival</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Proposed Date</label>
                        <input 
                          type="date"
                          required
                          value={formData.eventDate}
                          onChange={e => setFormData({...formData, eventDate: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Event Location (City)</label>
                        <div className="relative">
                          <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text"
                            placeholder="e.g. Mumbai"
                            required
                            value={formData.eventLocation}
                            onChange={e => setFormData({...formData, eventLocation: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-blue transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Estimated Guests</label>
                        <div className="relative">
                          <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="number"
                            placeholder="e.g. 500"
                            required
                            value={formData.estimatedGuests}
                            onChange={e => setFormData({...formData, estimatedGuests: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-blue transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Client Information Section */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-brand-blue border border-blue-100">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Contact Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Your Full Name</label>
                        <input 
                          type="text"
                          placeholder="Enter your name"
                          required
                          value={formData.clientName}
                          onChange={e => setFormData({...formData, clientName: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-blue transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Your Mobile Number</label>
                        <input 
                          type="tel"
                          placeholder="e.g. +91 00000 00000"
                          required
                          value={formData.clientPhone}
                          onChange={e => setFormData({...formData, clientPhone: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-blue transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        type="email"
                        placeholder="e.g. name@company.com"
                        required
                        value={formData.clientEmail}
                        onChange={e => setFormData({...formData, clientEmail: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                  </section>

                  {/* Pricing/Trust Area */}
                  <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4 shadow-xl shadow-slate-900/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-brand-orange" />
                        <span className="text-xs font-bold uppercase tracking-widest">Verified Inquiry</span>
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Booking</div>
                    </div>
                    <p className="text-xs font-medium text-slate-300 leading-relaxed">
                      Your inquiry will be reviewed by our booking team. We will contact you to confirm requirements, availability, and next steps.
                    </p>
                  </div>
                </form>

                {/* Footer Actions */}
                <div className="p-8 bg-slate-50/50 border-t border-slate-100">
                  <button 
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="w-full bg-brand-orange hover:bg-brand-orangeHover text-white font-black py-5 rounded-[20px] shadow-xl shadow-brand-orange/20 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Clock className="w-5 h-5 animate-spin" />
                    ) : (
                      <>Submit Booking Request <Send className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-16 text-center space-y-8">
                <div className="w-24 h-24 bg-green-50 rounded-[40px] flex items-center justify-center text-brand-success border-2 border-green-100 mx-auto animate-bounce">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Thank you!</h2>
                  <p className="text-slate-500 font-semibold max-w-sm mx-auto text-lg">
                    Our team will contact you within <span className="text-brand-orange">30 minutes</span>.
                  </p>
                </div>
                
                <div className="flex flex-col gap-4 mt-8">
                  <a 
                    href={`https://wa.me/918595767684?text=Hi, I just submitted an enquiry for ${artistName} and need an urgent response.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black py-4 rounded-[20px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20"
                  >
                    Need urgent response? Chat on WhatsApp <MessageCircle className="w-5 h-5 ml-2" />
                  </a>
                  
                  <Button 
                    onClick={handleClose}
                    variant="outline"
                    className="w-full border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-black py-4 rounded-[20px] transition-all uppercase tracking-widest text-xs"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
