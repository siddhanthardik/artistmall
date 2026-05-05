import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Reminder {
  id: string;
  priority: 'HIGH' | 'MEDIUM';
  message: string;
  actionText: string;
  actionLink: string;
}

const DUMMY_REMINDERS: Reminder[] = [
  { id: '1', priority: 'HIGH', message: 'Booking #8423 has been awaiting your counter-offer for > 48 hours.', actionText: 'Review Deal', actionLink: '/dashboard/booking/negotiations' },
  { id: '2', priority: 'MEDIUM', message: 'Advance payment deadline approaching for Neha Kakkar event.', actionText: 'Process Payment', actionLink: '/dashboard/booking/requests' }
];

export const RemindersWidget: React.FC = () => {
  if (DUMMY_REMINDERS.length === 0) return null;

  return (
    <div className="glass-panel overflow-hidden border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
      <div className="p-4 border-b border-slate-700/50 bg-slate-800/30 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-red-400" />
        <h3 className="text-sm font-semibold text-white tracking-wide uppercase">Action Required</h3>
      </div>
      
      <div className="divide-y divide-slate-800">
        {DUMMY_REMINDERS.map((reminder) => (
          <div key={reminder.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
            <div className="flex-1 pr-4">
              <p className="text-sm text-slate-300 leading-snug">{reminder.message}</p>
              {reminder.priority === 'HIGH' && (
                <span className="mt-2 inline-block text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">URGENT</span>
              )}
            </div>
            <Link 
              to={reminder.actionLink}
              className="flex items-center gap-1 text-xs font-medium text-gold-400 hover:text-gold-300 whitespace-nowrap"
            >
              {reminder.actionText} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
