import React, { useState } from 'react';
import { store } from '../../services/store';
import { StatusBadge } from '../common/StatusBadge';
import { Complaint, PriorityLevel, ComplaintCategory } from '../../types';
import {
  AlertCircle,
  PlusCircle,
  Clock,
  CheckCircle2,
  Wrench,
  Search,
  Filter,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Calendar,
  Star,
  MapPin,
  Image as ImageIcon,
} from 'lucide-react';

interface StudentComplaintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewComplaint: () => void;
}

export const StudentComplaintsModal: React.FC<StudentComplaintsModalProps> = ({
  isOpen,
  onClose,
  onOpenNewComplaint,
}) => {
  const currentUser = store.currentUser;
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter complaints raised by this particular student
  const studentComplaints = store.complaints.filter(
    (c) =>
      c.studentId === currentUser?.id ||
      c.studentRoom === currentUser?.room ||
      c.studentName === currentUser?.name
  );

  const totalCount = studentComplaints.length;
  const activeComplaints = studentComplaints.filter(
    (c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED' && c.status !== 'REJECTED'
  );
  const resolvedComplaints = studentComplaints.filter(
    (c) => c.status === 'RESOLVED' || c.status === 'CLOSED'
  );

  const filteredList = studentComplaints.filter((c) => {
    const matchesFilter =
      filter === 'ALL'
        ? true
        : filter === 'ACTIVE'
        ? c.status !== 'RESOLVED' && c.status !== 'CLOSED' && c.status !== 'REJECTED'
        : c.status === 'RESOLVED' || c.status === 'CLOSED';

    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[92vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/50 via-white to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-xs">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  My Raised Complaints
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-mono">
                  {totalCount} Total Filed
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Overall maintenance history & real-time technician SLA tracking for Room {currentUser?.room || 'A302'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenNewComplaint();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Raise New Complaint</span>
              <span className="sm:hidden">New</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Summary Metric Chips */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            <div
              onClick={() => setFilter('ALL')}
              className={`p-3 rounded-xl border cursor-pointer transition-all text-center ${
                filter === 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">
                Total Complaints
              </span>
              <span className="text-xl font-extrabold font-mono mt-0.5 block">{totalCount}</span>
            </div>

            <div
              onClick={() => setFilter('ACTIVE')}
              className={`p-3 rounded-xl border cursor-pointer transition-all text-center ${
                filter === 'ACTIVE'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-amber-50/70 border-amber-200 text-amber-800 hover:border-amber-300'
              }`}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">
                In Progress / Active
              </span>
              <span className="text-xl font-extrabold font-mono mt-0.5 block">
                {activeComplaints.length}
              </span>
            </div>

            <div
              onClick={() => setFilter('RESOLVED')}
              className={`p-3 rounded-xl border cursor-pointer transition-all text-center ${
                filter === 'RESOLVED'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-800 hover:border-emerald-300'
              }`}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">
                Resolved & Closed
              </span>
              <span className="text-xl font-extrabold font-mono mt-0.5 block">
                {resolvedComplaints.length}
              </span>
            </div>
          </div>

          {/* Search bar & filter pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search complaints by title, category, ticket ID..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl flex-shrink-0">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  filter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All ({totalCount})
              </button>
              <button
                onClick={() => setFilter('ACTIVE')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  filter === 'ACTIVE'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                Active ({activeComplaints.length})
              </button>
              <button
                onClick={() => setFilter('RESOLVED')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  filter === 'RESOLVED'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                Resolved ({resolvedComplaints.length})
              </button>
            </div>
          </div>

          {/* Complaints List */}
          <div className="space-y-3">
            {filteredList.length === 0 ? (
              <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-600">No complaints found</p>
                <p className="text-[11px]">
                  {searchTerm
                    ? 'Try searching with a different term'
                    : 'You have not raised any complaints matching this filter.'}
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenNewComplaint();
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Raise a Complaint</span>
                </button>
              </div>
            ) : (
              filteredList.map((comp) => {
                const diffHours = Math.round(
                  (new Date(comp.slaDeadline).getTime() - Date.now()) / (3600 * 1000)
                );
                const slaLeft = diffHours > 0 ? `${diffHours} hrs left` : 'SLA VIOLATED';
                const isResolved = comp.status === 'RESOLVED' || comp.status === 'CLOSED';

                const formattedDate = new Date(comp.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <div
                    key={comp.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all bg-white shadow-xs space-y-3"
                  >
                    {/* Top Row: Ticket ID, Category, Badges */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-slate-700 text-xs px-2 py-0.5 rounded bg-slate-100">
                          #{comp.id}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {comp.category}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] text-slate-400">Filed {formattedDate}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge priority={comp.priority} />
                        <StatusBadge status={comp.status} />
                      </div>
                    </div>

                    {/* Middle: Title, Description & Photos */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {comp.photoUrl && (
                        <div
                          onClick={() => setSelectedPhoto(comp.photoUrl || null)}
                          className="relative group cursor-pointer w-full sm:w-28 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0"
                        >
                          <img
                            src={comp.photoUrl}
                            alt={comp.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                            View Photo
                          </div>
                        </div>
                      )}

                      <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">
                          {comp.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {comp.description}
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{comp.location}</span>
                        </p>
                      </div>
                    </div>

                    {/* Bottom: Staff assignment, SLA, Resolution */}
                    <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/70 p-2.5 rounded-xl text-[11px]">
                      <div>
                        {comp.assignedStaffName ? (
                          <div className="flex items-center gap-1.5 text-blue-900 font-semibold">
                            <Wrench className="w-3.5 h-3.5 text-blue-600" />
                            <span>Assigned Technician: {comp.assignedStaffName}</span>
                            {comp.assignedStaffRole && (
                              <span className="text-[10px] text-blue-600 font-normal">
                                ({comp.assignedStaffRole})
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Awaiting Warden Dispatch & Technician Assignment</span>
                          </div>
                        )}

                        {comp.resolutionNotes && (
                          <p className="text-emerald-800 font-medium mt-1">
                            <strong>Resolution:</strong> {comp.resolutionNotes}
                          </p>
                        )}
                      </div>

                      <div className="text-right flex items-center sm:flex-col items-end justify-between sm:justify-center flex-shrink-0">
                        {!isResolved ? (
                          <span
                            className={`font-mono font-bold text-xs ${
                              diffHours <= 4 ? 'text-rose-600 animate-pulse' : 'text-slate-700'
                            }`}
                          >
                            SLA: {slaLeft}
                          </span>
                        ) : (
                          <div className="flex items-center gap-1 text-emerald-700 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Resolved</span>
                            {comp.feedbackRating && (
                              <span className="ml-1 flex items-center text-amber-500">
                                {'★'.repeat(comp.feedbackRating)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Showing {filteredList.length} of {totalCount} registered complaints
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>

        {/* Photo Preview Lightbox */}
        {selectedPhoto && (
          <div
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
          >
            <div className="relative max-w-xl max-h-[80vh] overflow-hidden rounded-2xl bg-black">
              <img src={selectedPhoto} alt="Preview" className="max-w-full max-h-[80vh] object-contain" />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-xs"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
