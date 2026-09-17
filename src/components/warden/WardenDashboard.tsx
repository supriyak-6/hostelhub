import React, { useState } from 'react';
import { store } from '../../services/store';
import { Complaint, PriorityLevel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { MaintenanceAssignmentModal } from './MaintenanceAssignmentModal';
import {
  Users,
  Building,
  CalendarCheck,
  AlertCircle,
  Clock,
  UserCheck,
  Ticket,
  Wrench,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Flame,
  ArrowUpRight,
} from 'lucide-react';

interface WardenDashboardProps {
  onNavigateToTab?: (tab: string) => void;
}

export const WardenDashboard: React.FC<WardenDashboardProps> = ({ onNavigateToTab }) => {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const stats = store.getStats();

  const recentComplaints = store.complaints.slice(0, 5);

  // SVG-based responsive Trend Chart for complaint categories across the week
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const series = [
    { label: 'Electrical', color: '#3b82f6', points: [12, 18, 14, 22, 19, 28, 24] },
    { label: 'Water', color: '#06b6d4', points: [8, 11, 15, 12, 14, 16, 13] },
    { label: 'Cleaning', color: '#10b981', points: [15, 12, 10, 8, 14, 11, 9] },
    { label: 'Others', color: '#f59e0b', points: [5, 7, 6, 9, 8, 10, 7] },
  ];

  // Helper to compute SVG polyline coordinates
  const chartWidth = 500;
  const chartHeight = 160;
  const maxVal = 32;

  const getCoordinates = (points: number[]) => {
    return points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * (chartWidth - 40) + 20;
        const y = chartHeight - (val / maxVal) * (chartHeight - 30) - 15;
        return `${x},${y}`;
      })
      .join(' ');
  };

  return (
    <div className="space-y-6">
      {/* 4 Top KPI Cards inspired by Warden Dashboard in reference image */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Students</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            {stats.totalStudents}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14 newly enrolled this week</span>
          </div>
        </div>

        {/* Occupancy */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Occupancy</span>
            <Building className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            {stats.occupancyRate}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            <span>28 of 32 rooms occupied</span>
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Attendance</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            {stats.averageAttendance}%
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            <span>Roll call verified today</span>
          </div>
        </div>

        {/* Pending Complaints */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Complaints</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600 font-mono tracking-tight">
            {stats.pendingComplaints}
          </div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>{stats.slaViolations} SLA Violations</span>
          </div>
        </div>
      </div>

      {/* Quick Alerts + Today's Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Alerts (5 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="font-bold text-slate-900 text-sm">Quick Alerts</h3>
            <span className="text-xs text-rose-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Live Alerts
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Alert 1 */}
            <div className="p-3 rounded-xl border border-red-200 bg-red-50/50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Block A - 3rd Floor</span>
                <span className="text-slate-600 text-[11px]">7 electrical complaints reported</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                HIGH
              </span>
            </div>

            {/* Alert 2 */}
            <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Block B - 2nd Floor</span>
                <span className="text-slate-600 text-[11px]">4 water pipeline complaints</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                MEDIUM
              </span>
            </div>

            {/* Alert 3 */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">SLA Violations</span>
                <span className="text-slate-600 text-[11px]">{stats.slaViolations} complaints exceed resolution deadline</span>
              </div>
              <button
                onClick={() => onNavigateToTab?.('complaints')}
                className="text-blue-600 font-bold text-[11px] hover:underline"
              >
                Review →
              </button>
            </div>
          </div>
        </div>

        {/* Today's Overview (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="font-bold text-slate-900 text-sm">Today's Overview</h3>
            <span className="text-xs text-slate-400 font-medium">Campus Activity</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div
              onClick={() => onNavigateToTab?.('visitors')}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-500 font-medium">Visitors</span>
                <UserCheck className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {stats.visitorsToday}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">{stats.visitorsInside} inside right now</p>
            </div>

            <div
              onClick={() => onNavigateToTab?.('outpasses')}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-500 font-medium">Outpasses</span>
                <Ticket className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {stats.outpassesToday}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">{stats.outpassesPending} pending approval</p>
            </div>

            <div
              onClick={() => onNavigateToTab?.('maintenance')}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-500 font-medium">Maintenance</span>
                <Wrench className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {stats.maintenanceCount}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">In progress with staff</p>
            </div>

            <div
              onClick={() => onNavigateToTab?.('attendance')}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-500 font-medium">Students Outside</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {stats.studentsOutside}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">Outpass & day scholars</p>
            </div>
          </div>
        </div>
      </div>

      {/* Complaint Trends Chart & Recent Complaints List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trends Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Complaint Trends</h3>
              <p className="text-xs text-slate-500">Weekly ticket distribution by category</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold">
              {series.map((s) => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-slate-600">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SVG Multi-line Chart */}
          <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44">
              {/* Horizontal Grid lines */}
              {[0, 10, 20, 30].map((val) => {
                const y = chartHeight - (val / maxVal) * (chartHeight - 30) - 15;
                return (
                  <g key={val}>
                    <line x1="20" y1={y} x2={chartWidth - 20} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                    <text x="5" y={y + 3} fill="#94a3b8" fontSize="9" textAnchor="start">
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Day Labels on bottom */}
              {days.map((day, idx) => {
                const x = (idx / (days.length - 1)) * (chartWidth - 40) + 20;
                return (
                  <text key={day} x={x} y={chartHeight - 2} fill="#94a3b8" fontSize="9" textAnchor="middle">
                    {day}
                  </text>
                );
              })}

              {/* Polyline series */}
              {series.map((s) => (
                <polyline
                  key={s.label}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={getCoordinates(s.points)}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Recent Complaints (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-bold text-slate-900 text-sm">Recent Complaints</h3>
              <button
                onClick={() => onNavigateToTab?.('complaints')}
                className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {recentComplaints.map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => setSelectedComplaint(comp)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50/70 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-1.5 h-6 rounded-full bg-blue-500 flex-shrink-0" />
                    <div className="truncate">
                      <span className="font-bold text-slate-900 block truncate">
                        {comp.studentRoom} • {comp.title}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {comp.category} • {comp.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge priority={comp.priority} />
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing top 5 of {store.complaints.length} tickets</span>
            <button
              onClick={() => onNavigateToTab?.('complaints')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Open Complaints Desk
            </button>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      <MaintenanceAssignmentModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
      />
    </div>
  );
};
