import React from 'react';
import {
  LayoutDashboard,
  Users,
  DoorClosed,
  CalendarCheck,
  UserCheck,
  Ticket,
  AlertCircle,
  Wrench,
  Grid,
  BarChart3,
  Bell,
  Settings,
  Shield,
  Building2,
  LogOut,
  Sparkles,
  FileText,
  Utensils,
  QrCode,
} from 'lucide-react';
import { store } from '../../services/store';
import { authService } from '../../services/authService';

export interface SidebarProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
  onTabChange?: (tab: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab = 'dashboard',
  onSelectTab,
  onTabChange,
  isCollapsed = false,
  onLogout,
}) => {
  const user = store.currentUser;
  const role = user?.role || 'STUDENT';

  const handleTabClick = (tabId: string) => {
    if (onSelectTab) onSelectTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      authService.logout();
      store.logout();
    }
  };

  const pendingComplaints = store.complaints.filter(
    (c) => c.status === 'SUBMITTED' || c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS'
  ).length;

  const pendingOutpasses = store.outpasses.filter((o) => o.status === 'PENDING').length;
  const pendingVisitors = store.visitors.filter((v) => v.status === 'PENDING').length;
  const activeEmergencies = store.emergencies.filter((e) => e.status === 'ACTIVE').length;

  // Build role-specific navigation items
  let navItems: { id: string; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [];

  if (role === 'STUDENT') {
    navItems = [
      { id: 'dashboard', label: 'Residence ID & Overview', icon: LayoutDashboard },
      { id: 'complaints', label: 'My Complaints', icon: AlertCircle, badge: pendingComplaints },
      { id: 'visitors', label: 'Visitor Passes', icon: UserCheck },
      { id: 'outpasses', label: 'Outpass Requests', icon: Ticket },
      { id: 'room-transfer', label: 'Room Transfer', icon: DoorClosed },
      { id: 'mess', label: 'Mess & Dining Menu', icon: Utensils },
      { id: 'attendance', label: 'My Attendance', icon: CalendarCheck },
      { id: 'emergency', label: 'Emergency SOS', icon: Shield },
    ];
  } else if (role === 'WARDEN') {
    navItems = [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'students', label: 'Students Roster', icon: Users },
      { id: 'rooms', label: 'Room Allocation', icon: DoorClosed },
      { id: 'attendance', label: 'Night Roll Call', icon: CalendarCheck },
      { id: 'visitors', label: 'Visitor Approvals', icon: UserCheck, badge: pendingVisitors },
      { id: 'outpasses', label: 'Outpass Approvals', icon: Ticket, badge: pendingOutpasses },
      { id: 'complaints', label: 'Complaints Queue', icon: AlertCircle, badge: pendingComplaints },
      { id: 'maintenance', label: 'Maintenance Dispatch', icon: Wrench },
      { id: 'problem-map', label: 'Problem Heatmap', icon: Grid },
      { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
      { id: 'announcements', label: 'Notices & Circulars', icon: Bell },
      { id: 'settings', label: 'Hostel Settings', icon: Settings },
    ];
  } else if (role === 'SECURITY') {
    navItems = [
      { id: 'dashboard', label: 'Gate QR Scanner', icon: QrCode },
      { id: 'visitors', label: 'Visitor Gate Log', icon: UserCheck, badge: pendingVisitors },
      { id: 'outpasses', label: 'Outpass Verifications', icon: Ticket, badge: pendingOutpasses },
      { id: 'emergency', label: 'Incident Alerts', icon: Shield, badge: activeEmergencies },
      { id: 'audit-logs', label: 'Movement Ledger', icon: FileText },
    ];
  } else if (role === 'MAINTENANCE') {
    navItems = [
      { id: 'dashboard', label: 'Technician Work Queue', icon: Wrench },
      { id: 'tasks', label: 'Assigned Work Orders', icon: AlertCircle, badge: pendingComplaints },
      { id: 'in-progress', label: 'Active Repairs', icon: Settings },
      { id: 'completed', label: 'Resolved Tickets', icon: CalendarCheck },
    ];
  } else if (role === 'ADMIN') {
    navItems = [
      { id: 'dashboard', label: 'System Overview', icon: LayoutDashboard },
      { id: 'users', label: 'User Directory (500)', icon: Users },
      { id: 'hostels', label: 'Hostels & Blocks', icon: Building2 },
      { id: 'rooms', label: 'Rooms & Occupancy', icon: DoorClosed },
      { id: 'audit-logs', label: 'Audit Trail', icon: FileText },
      { id: 'reports', label: 'Executive Reports', icon: BarChart3 },
      { id: 'settings', label: 'System Configuration', icon: Settings },
    ];
  }

  return (
    <aside className="w-64 bg-[#0B132B] text-slate-300 flex flex-col flex-shrink-0 border-r border-slate-800 select-none min-h-screen">
      {/* Brand Logo Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/40">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <span className="text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5">
            HostelHub
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30">
              {role}
            </span>
          </span>
          <p className="text-[11px] text-slate-400 font-medium">Smart Residence Mgmt</p>
        </div>
      </div>

      {/* Role Pill */}
      <div className="px-4 pt-3 pb-1">
        <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium">Logged in as:</span>
          <span className="font-bold text-blue-400 font-mono">{user?.name?.split(' ')[0] || role}</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-blue-700' : 'bg-rose-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout & Footer */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-rose-300 border border-slate-800 hover:border-rose-500/40 text-xs font-bold transition-all"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-400" />
          <span>Sign Out / Switch Role</span>
        </button>

        <div className="px-2 pt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>Campus v2.6</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </span>
        </div>
      </div>
    </aside>
  );
};
