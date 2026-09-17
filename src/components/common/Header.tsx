import React, { useState } from 'react';
import { store } from '../../services/store';
import {
  Bell,
  Search,
  AlertOctagon,
  CheckCircle,
  X,
  User,
  LogOut,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  onOpenNotifications?: () => void;
  onOpenSearch?: () => void;
  onLogout?: () => void;
  greeting?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onLogout,
  greeting,
  subtitle,
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const currentUser = store.currentUser;
  const unreadNotifs = store.notifications.filter((n) => !n.read);
  const activeEmergencies = store.emergencies.filter((e) => e.status === 'ACTIVE');

  const defaultGreeting =
    greeting ||
    (!currentUser
      ? 'HostelHub Residence Portal'
      : currentUser.role === 'STUDENT'
      ? `Good Morning, ${currentUser.name.split(' ')[0]} 👋`
      : currentUser.role === 'WARDEN'
      ? 'Good Morning, Warden 👋'
      : currentUser.role === 'SECURITY'
      ? 'Security Gate Control'
      : currentUser.role === 'MAINTENANCE'
      ? 'Maintenance Operations'
      : 'Administration Console');

  const defaultSubtitle =
    subtitle ||
    (!currentUser
      ? 'NN Student Residence • Nizamabad Campus'
      : currentUser.role === 'STUDENT'
      ? `${currentUser.block || 'Block A'} • Room ${currentUser.room || 'A302'}`
      : 'NN Student Residence • Nizamabad Campus');

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 lg:px-6 py-3 transition-colors">
      {/* Active Emergency Alert Banner */}
      {activeEmergencies.length > 0 && (
        <div className="mb-3 px-4 py-2.5 rounded-xl bg-rose-600 text-white flex items-center justify-between text-xs font-semibold animate-pulse shadow-md">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-white" />
            <span>
              EMERGENCY ALERT: {activeEmergencies[0].emergencyType} reported in {activeEmergencies[0].studentRoom} ({activeEmergencies[0].studentBlock})!
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => store.acknowledgeEmergency(activeEmergencies[0].id)}
              className="px-2.5 py-1 rounded bg-white text-rose-700 font-bold hover:bg-rose-50 text-[11px] transition-colors"
            >
              Acknowledge Alert
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        {/* Left: Greeting & Location */}
        <div>
          <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight">
            {defaultGreeting}
          </h1>
          <p className="text-xs text-slate-500 font-medium">{defaultSubtitle}</p>
        </div>

        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                  <span className="text-xs text-slate-500">{store.notifications.length} total</span>
                </div>

                <div className="py-2 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {store.notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No notifications yet</p>
                  ) : (
                    store.notifications.slice(0, 5).map((notif) => (
                      <div key={notif.id} className="py-2.5 flex items-start gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setShowNotifMenu(false);
                      if (onOpenNotifications) onOpenNotifications();
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                  >
                    View All Notices →
                  </button>
                  <button
                    onClick={() => {
                      store.notifications.forEach((n) => (n.read = true));
                      store.markAllNotificationsAsRead();
                      setShowNotifMenu(false);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <img
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                alt={currentUser?.name || 'User'}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser ? currentUser.name.split(' ')[0] : 'Guest'}
                </p>
                <p className="text-[10px] text-slate-500 font-medium capitalize">
                  {currentUser ? currentUser.role.toLowerCase() : 'Anonymous'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && currentUser && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                    Role: {currentUser.role}
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      store.showToast('info', 'Profile details', `${currentUser.name} (${currentUser.role}) - ID: ${currentUser.studentId || currentUser.id}`);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    My Profile
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
