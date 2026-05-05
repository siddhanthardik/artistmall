import React from 'react';
import { Clock, CheckCircle, AlertTriangle, MessageSquare, Plus } from 'lucide-react';

interface FeedItem {
  id: string;
  type: 'SUCCESS' | 'WARNING' | 'MESSAGE' | 'ACTION';
  title: string;
  description: string;
  timeAgo: string;
}

const DUMMY_FEED: FeedItem[] = [
  { id: '1', type: 'SUCCESS', title: 'Artist Approved', description: 'Zakir Khan is now LIVE on the marketplace.', timeAgo: '2h ago' },
  { id: '2', type: 'MESSAGE', title: 'Counter-Offer Received', description: 'Reliance Events countered with ₹8.5L for Neha Kakkar.', timeAgo: '5h ago' },
  { id: '3', type: 'WARNING', title: 'Profile Incomplete', description: 'Your KYC documents are still pending upload.', timeAgo: '1d ago' },
  { id: '4', type: 'ACTION', title: 'New Booking Request', description: 'Sunburn Fest requested a quote for DJ Chetas.', timeAgo: '2d ago' },
];

export const ActivityFeed: React.FC = () => {
  const getIcon = (type: FeedItem['type']) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'WARNING': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'MESSAGE': return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'ACTION': return <Plus className="w-4 h-4 text-gold-400" />;
    }
  };

  const getBgColor = (type: FeedItem['type']) => {
    switch (type) {
      case 'SUCCESS': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'WARNING': return 'bg-amber-500/10 border-amber-500/20';
      case 'MESSAGE': return 'bg-blue-500/10 border-blue-500/20';
      case 'ACTION': return 'bg-gold-500/10 border-gold-500/20';
    }
  };

  return (
    <div className="glass-panel overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
        <h3 className="text-sm font-semibold text-white tracking-wide uppercase">Operational Feed</h3>
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
      </div>
      
      <div className="p-5 flex-1 overflow-y-auto">
        <div className="relative border-l border-slate-700 ml-3 space-y-6">
          {DUMMY_FEED.map((item) => (
            <div key={item.id} className="relative pl-6">
              {/* Timeline dot */}
              <div className={`absolute -left-3.5 top-1 w-7 h-7 rounded-full border ${getBgColor(item.type)} flex items-center justify-center`}>
                {getIcon(item.type)}
              </div>
              
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-medium text-white">{item.title}</h4>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.timeAgo}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
