import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Info, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotificationStore, AppNotification } from '../../store/notificationStore';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'ERROR':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'INFO':
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${Math.floor(diffHrs / 24)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white transition-colors focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-[8px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex justify-between items-center">
            <h3 className="font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">You're all caught up!</div>
            ) : (
              <div className="divide-y divide-slate-800">
                {notifications.map((notif) => {
                  const content = (
                    <div
                      key={notif.id}
                      className={`p-4 flex gap-4 transition-colors ${notif.read ? 'opacity-70 hover:bg-slate-800/50' : 'bg-slate-800/20 hover:bg-slate-800/80 cursor-pointer'}`}
                      onClick={() => !notif.read && markAsRead(notif.id)}
                    >
                      <div className="mt-1 flex-shrink-0">{getIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p
                            className={`text-sm truncate ${notif.read ? 'text-slate-300 font-medium' : 'text-white font-semibold'}`}
                          >
                            {notif.title}
                          </p>
                          {notif.priority === 'HIGH' && !notif.read && (
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-2 flex-shrink-0 mt-1.5"></span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-snug line-clamp-2 mb-2">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {timeAgo(notif.createdAt)}
                        </p>
                      </div>
                    </div>
                  );

                  return notif.linkTo ? (
                    <Link to={notif.linkTo} key={notif.id} onClick={() => setIsOpen(false)}>
                      {content}
                    </Link>
                  ) : (
                    content
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-900 text-center">
            <button className="text-xs text-slate-400 hover:text-white transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
