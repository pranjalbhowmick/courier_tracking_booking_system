import React from 'react';
import type { BookingStatus, ShipmentStatus } from '../types';

interface StatusBadgeProps {
  status: BookingStatus | ShipmentStatus;
}

const STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  Approved: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  Rejected: 'bg-red-500/15 text-red-400 border border-red-500/30',
  'In Transit': 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  Delivered: 'bg-teal-500/15 text-teal-400 border border-teal-500/30',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[status] ?? 'bg-slate-500/15 text-slate-400'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {status}
    </span>
  );
};

export default StatusBadge;