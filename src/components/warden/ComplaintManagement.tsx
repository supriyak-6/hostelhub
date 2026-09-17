import React, { useState } from 'react';
import { store } from '../../services/store';
import { Complaint, ComplaintCategory, PriorityLevel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { MaintenanceAssignmentModal } from './MaintenanceAssignmentModal';
import {
  AlertCircle,
  Search,
  Filter,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Wrench,
} from 'lucide-react';

export const ComplaintManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const complaints = store.complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.studentRoom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesPri = priorityFilter === 'ALL' || c.priority === priorityFilter;
    const matchesSta = statusFilter === 'ALL' || c.status === statusFilter;

    return matchesSearch && matchesCat && matchesPri && matchesSta;
  });

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-slate-900 text-base">Hostel Complaints & SLA Desk</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time maintenance triage, workforce dispatch, and SLA resolution tracking
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search room, student, issue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 w-48 sm:w-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Civil & Carpentry">Civil & Carpentry</option>
            <option value="Cleaning & Hygiene">Cleaning</option>
            <option value="Internet / WiFi">WiFi / Network</option>
            <option value="Furniture">Furniture</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical (4h SLA)</option>
            <option value="HIGH">High (12h SLA)</option>
            <option value="MEDIUM">Medium (24h SLA)</option>
            <option value="LOW">Low (48h SLA)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Assignment</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="ESCALATED">Escalated</option>
          </select>
        </div>
      </div>

      {/* Complaints List Table */}
      <div className="space-y-3">
        {complaints.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No complaints found matching criteria.
          </div>
        ) : (
          complaints.map((c) => {
            const diffHours = Math.round((new Date(c.slaDeadline).getTime() - Date.now()) / (3600 * 1000));
            const isViolated = diffHours < 0 && c.status !== 'RESOLVED' && c.status !== 'CLOSED';

            return (
              <div
                key={c.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isViolated
                    ? 'border-rose-300 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {c.photoUrl ? (
                    <img
                      src={c.photoUrl}
                      alt="Defect"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                      <Wrench className="w-6 h-6" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-sm">{c.title}</span>
                      <StatusBadge priority={c.priority} />
                      <StatusBadge status={c.status} />
                      {isViolated && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> SLA VIOLATED
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span className="font-semibold text-blue-700">
                        {c.studentRoom} • {c.studentName}
                      </span>
                      <span className="text-slate-500">Category: {c.category}</span>
                      <span className="text-slate-500">Location: {c.location}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>

                    {c.assignedStaffName && (
                      <p className="text-[11px] text-indigo-700 font-semibold mt-1">
                        Assigned To: {c.assignedStaffName} {c.assignedStaffRole ? `(${c.assignedStaffRole})` : ''}
                      </p>
                    )}
                    {c.resolutionNotes && (
                      <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                        Resolution: {c.resolutionNotes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side SLA & Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 flex-shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Ticket #{c.id}
                    </span>
                    {c.status !== 'RESOLVED' ? (
                      <span
                        className={`text-xs font-extrabold font-mono ${
                          isViolated
                            ? 'text-rose-600 font-black'
                            : diffHours <= 3
                            ? 'text-amber-600 animate-pulse'
                            : 'text-slate-700'
                        }`}
                      >
                        {isViolated ? `OVERDUE by ${Math.abs(diffHours)}h` : `${diffHours}h remaining`}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 font-mono">
                        CLOSED
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedComplaint(c)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    {c.assignedStaffName ? 'Reassign / View' : 'Assign Staff'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Assignment Modal */}
      <MaintenanceAssignmentModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
      />
    </div>
  );
};
