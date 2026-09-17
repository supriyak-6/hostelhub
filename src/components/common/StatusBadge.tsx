import React from 'react';
import { PriorityLevel, ComplaintStatus, VisitorStatus, OutpassStatus, RoomStatus } from '../../types';

interface StatusBadgeProps {
  status?: string;
  priority?: PriorityLevel;
  type?: 'status' | 'priority' | 'room';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, priority, type = 'status', className = '' }) => {
  if (priority) {
    switch (priority) {
      case 'CRITICAL':
        return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200 ${className}`}>Critical</span>;
      case 'HIGH':
        return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 ${className}`}>High</span>;
      case 'MEDIUM':
        return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200 ${className}`}>Medium</span>;
      case 'LOW':
        return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 ${className}`}>Low</span>;
    }
  }

  const s = (status || '').toUpperCase();

  if (s === 'IN_PROGRESS' || s === 'IN PROGRESS') {
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 ${className}`}>In Progress</span>;
  }
  if (s === 'ASSIGNED') {
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200 ${className}`}>Assigned</span>;
  }
  if (s === 'RESOLVED' || s === 'COMPLETED' || s === 'APPROVED') {
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 ${className}`}>{status === 'RESOLVED' ? 'Resolved' : status === 'COMPLETED' ? 'Completed' : 'Approved'}</span>;
  }
  if (s === 'SUBMITTED' || s === 'PENDING') {
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 ${className}`}>Pending</span>;
  }
  if (s === 'REJECTED' || s === 'CLOSED') {
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 ${className}`}>{status}</span>;
  }
  if (s === 'CHECKED_IN' || s === 'IN') {
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 ${className}`}>IN</span>;
  }
  if (s === 'CHECKED_OUT' || s === 'OUT' || s === 'ACTIVE_OUT') {
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 ${className}`}>OUT</span>;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 ${className}`}>
      {status || 'Unknown'}
    </span>
  );
};
