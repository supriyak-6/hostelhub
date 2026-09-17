import React, { useState } from 'react';
import { store } from '../../services/store';
import { AppNotification } from '../../types';
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  Ticket,
  UserCheck,
  CalendarCheck,
  UtensilsCrossed,
  Shield,
  X,
  ChevronRight,
  Sparkles,
  Check,
  Info,
} from 'lucide-react';

interface StudentNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateAction?: (tab: string) => void;
}

export const StudentNotificationsModal: React.FC<StudentNotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigateAction,
}) => {
  const currentUser = store.currentUser;
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'COMPLAINTS' | 'ATTENDANCE' | 'GENERAL'>('ALL');

  if (!isOpen) return null;

  // Filter for student's notifications
  const studentNotifications = store.notifications.filter(
    (n) => n.recipientId === currentUser?.id || !n.recipientId || n.recipientId === 'ALL'
  );

  const unreadList = studentNotifications.filter((n) => !n.read);
  const unreadCount = unreadList.length;

  const filteredNotifications = studentNotifications.filter((n) => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'COMPLAINTS') return n.type === 'COMPLAINT' || n.type === 'MAINTENANCE' || n.type === 'OUTPASS' || n.type === 'VISITOR';
    if (filter === 'ATTENDANCE') return n.type === 'ANNOUNCEMENT' && (n.title.toLowerCase().includes('attendance') || n.title.toLowerCase().includes('curfew') || n.title.toLowerCase().includes('roll'));
    if (filter === 'GENERAL') return n.type === 'ANNOUNCEMENT' || n.type === 'EMERGENCY';
    return true;
  });

  const getIcon = (type: AppNotification['type'], title: string) => {
    if (title.toLowerCase().includes('attendance') || title.toLowerCase().includes('curfew')) {
      return <CalendarCheck className="w-4 h-4 text-emerald-600" />;
    }
    switch (type) {
      case 'COMPLAINT':
      case 'MAINTENANCE':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'VISITOR':
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'OUTPASS':
        return <Ticket className="w-4 h-4 text-indigo-600" />;
      case 'EMERGENCY':
        return <Shield className="w-4 h-4 text-rose-600" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-600" />;
    }
  };

  const handleActionClick = (notif: AppNotification) => {
    store.markNotificationAsRead(notif.id);
    if (notif.linkAction && onNavigateAction) {
      onClose();
      onNavigateAction(notif.linkAction);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full max-h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 via-white to-slate-50">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  Notifications & Notices
                </h2>
                {unreadCount > 0 ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                    {unreadCount} New
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    All Caught Up
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Hostel administration circulars, maintenance alerts & roll call updates
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills & Actions */}
        <div className="p-3 sm:px-5 border-b border-slate-100 flex items-center justify-between gap-2 flex-wrap bg-slate-50/50 text-xs">
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl flex-wrap">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                filter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({studentNotifications.length})
            </button>
            <button
              onClick={() => setFilter('UNREAD')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                filter === 'UNREAD'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-600 hover:bg-rose-50'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('COMPLAINTS')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                filter === 'COMPLAINTS'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Complaints & Passes
            </button>
            <button
              onClick={() => setFilter('ATTENDANCE')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                filter === 'ATTENDANCE'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Attendance
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => store.markAllNotificationsAsRead(currentUser?.id)}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 ml-auto"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 text-xs max-h-[60vh]">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-1.5">
              <Bell className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-600 text-xs">No notifications to display</p>
              <p className="text-[11px]">You're all caught up with your hostel notices!</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  !notif.read
                    ? 'bg-blue-50/40 border-blue-200/90 shadow-xs'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-100 flex-shrink-0 mt-0.5">
                  {getIcon(notif.type, notif.title)}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-xs">{notif.title}</span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-200" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                      {notif.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">{notif.message}</p>

                  <div className="flex items-center justify-between pt-1">
                    {notif.linkAction ? (
                      <button
                        onClick={() => handleActionClick(notif)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 group"
                      >
                        <span>
                          {notif.linkAction === 'attendance'
                            ? 'Check Attendance History'
                            : notif.linkAction === 'complaints'
                            ? 'View Complaints List'
                            : notif.linkAction === 'visitors'
                            ? 'View Visitor Pass'
                            : notif.linkAction === 'mess'
                            ? 'View Mess Menu'
                            : 'View Details'}
                        </span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ) : (
                      <span />
                    )}

                    {!notif.read && (
                      <button
                        onClick={() => store.markNotificationAsRead(notif.id)}
                        className="text-[10px] font-semibold text-slate-500 hover:text-slate-800"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {filteredNotifications.length} notifications in record
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
