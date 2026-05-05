import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileWarning,
  HeartHandshake,
} from 'lucide-react';

export type StatusType =
  // Artist States
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'HIDDEN'
  | 'ARCHIVED'
  // Booking States
  | 'REQUESTED'
  | 'NEGOTIATING'
  | 'ADVANCE_PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
  showIcon = true,
}) => {
  const getConfig = () => {
    switch (status) {
      // Pending / Warning states (Amber)
      case 'PENDING_APPROVAL':
      case 'REQUESTED':
        return {
          color: 'amber',
          icon: Clock,
          label: status === 'REQUESTED' ? 'Awaiting Mgmt' : 'In Review',
        };

      // Active / Negotiating states (Gold)
      case 'NEGOTIATING':
        return { color: 'gold', icon: HeartHandshake, label: 'Deal Room' };

      // Success / Live states (Emerald)
      case 'APPROVED':
      case 'CONFIRMED':
      case 'COMPLETED':
        return {
          color: 'emerald',
          icon: CheckCircle2,
          label: status === 'APPROVED' ? 'Live' : status,
        };

      // Action Required states (Blue)
      case 'ADVANCE_PENDING':
        return { color: 'blue', icon: AlertCircle, label: 'Advance Pending' };

      // Error / Rejected states (Red)
      case 'REJECTED':
      case 'CANCELLED':
        return { color: 'red', icon: XCircle, label: status };
      case 'HIDDEN':
        return { color: 'red', icon: FileWarning, label: 'Hidden (Violation)' };

      // Neutral states (Slate)
      case 'DRAFT':
      case 'ARCHIVED':
      default:
        return { color: 'slate', icon: Clock, label: status || 'Unknown' };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  // Use fixed classes because Tailwind purges dynamic class names if they aren't fully spelled out
  const colorStyles = {
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    gold: 'bg-gold-500/10 text-gold-400 border border-gold-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    red: 'bg-red-500/10 text-red-400 border border-red-500/20',
    slate: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
  }[config.color];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${colorStyles} ${className}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {config.label}
    </span>
  );
};
