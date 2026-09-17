import React, { useState } from 'react';
import { store } from '../../services/store';
import { AttendanceRecord } from '../../types';
import {
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  ShieldCheck,
  FileQuestion,
  Search,
  Filter,
  X,
  ChevronRight,
  ExternalLink,
  Calendar,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface StudentAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentAttendanceModal: React.FC<StudentAttendanceModalProps> = ({ isOpen, onClose }) => {
  const currentUser = store.currentUser;
  const [filter, setFilter] = useState<'ALL' | 'ABSENT' | 'PRESENT' | 'OUTPASS'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [disputeRecord, setDisputeRecord] = useState<AttendanceRecord | null>(null);
  const [disputeReason, setDisputeReason] = useState('');

  if (!isOpen) return null;

  // Fetch student's attendance records
  const allRecords = store.attendanceRecords.filter(
    (r) =>
      r.studentId === currentUser?.id ||
      r.studentName === currentUser?.name ||
      r.room === currentUser?.room
  );

  // Stats calculation
  const totalDays = allRecords.length || 30;
  const absentRecords = allRecords.filter((r) => r.status === 'ABSENT');
  const presentRecords = allRecords.filter((r) => r.status === 'PRESENT');
  const outpassRecords = allRecords.filter((r) => r.status === 'OUTPASS' || r.status === 'ON_LEAVE');

  const absentCount = absentRecords.length;
  const presentCount = presentRecords.length;
  const outpassCount = outpassRecords.length;
  const percentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 92;

  // Filtered records
  const filteredRecords = allRecords.filter((r) => {
    const matchesFilter = filter === 'ALL' || r.status === filter;
    const matchesSearch =
      r.date.includes(searchTerm) ||
      r.dayOfWeek.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.remarks && r.remarks.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeRecord || !disputeReason.trim()) return;

    store.requestAttendanceRectification({
      recordId: disputeRecord.id,
      date: disputeRecord.date,
      reason: disputeReason.trim(),
    });

    setDisputeRecord(null);
    setDisputeReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  Attendance & Curfew Roll Call
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
                  {percentage}% ATTENDANCE
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {currentUser?.name} • Room {currentUser?.room || 'A302'} ({currentUser?.block || 'Block A'})
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

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* 4 Summary Metric Cards */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Days
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono mt-0.5 block">
                {totalDays}
              </span>
              <span className="text-[10px] text-slate-400">Past 30 Days</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Present
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-emerald-700 font-mono mt-0.5 block">
                {presentCount}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">In Room</span>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center ring-1 ring-rose-300/60">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                Absent
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-rose-700 font-mono mt-0.5 block">
                {absentCount}
              </span>
              <span className="text-[10px] text-rose-600 font-bold">Unexcused</span>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-center">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                Outpass
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-blue-700 font-mono mt-0.5 block">
                {outpassCount}
              </span>
              <span className="text-[10px] text-blue-600 font-medium">Approved Leave</span>
            </div>
          </div>

          {/* PROMINENT SECTION: EXACT DATES ON WHICH SHE IS ABSENT */}
          <div className="rounded-2xl border-2 border-rose-300 bg-gradient-to-br from-rose-50/80 via-white to-rose-50/40 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-rose-950 text-sm tracking-tight flex items-center gap-1.5">
                    Absent Dates & Roll Call Log
                    <span className="px-2 py-0.2 rounded-full bg-rose-200/80 text-rose-800 text-[10px] font-extrabold">
                      {absentCount} Dates Recorded
                    </span>
                  </h3>
                  <p className="text-[11px] text-rose-700">
                    Dates when night curfew roll-call biometric verification was not recorded
                  </p>
                </div>
              </div>
            </div>

            {absentRecords.length === 0 ? (
              <div className="p-3 bg-white rounded-xl border border-rose-200 text-center text-slate-500">
                🎉 No unexcused absences recorded. Full attendance!
              </div>
            ) : (
              <div className="space-y-2.5">
                {absentRecords.map((rec) => {
                  const formattedDate = new Date(rec.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  });

                  return (
                    <div
                      key={rec.id}
                      className="p-3.5 bg-white rounded-xl border border-rose-200/90 shadow-xs hover:border-rose-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[11px] font-bold font-mono tracking-tight">
                            {rec.date}
                          </span>
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {formattedDate}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold border border-rose-200">
                            ABSENT
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 space-y-0.5">
                          <p className="flex items-center gap-1.5 text-rose-900 font-medium">
                            <Clock className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                            <span>Roll Call: {rec.rollCallTime}</span>
                            <span className="text-slate-300">•</span>
                            <span>Verified by: {rec.verifiedBy}</span>
                          </p>
                          {rec.remarks && (
                            <p className="text-[11px] text-slate-700 bg-rose-50/70 p-2 rounded-lg border border-rose-100 mt-1 leading-relaxed">
                              <strong>Remarks:</strong> {rec.remarks}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 flex-shrink-0">
                        <button
                          onClick={() => {
                            setDisputeRecord(rec);
                            setDisputeReason('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold transition-colors flex items-center gap-1"
                        >
                          <FileQuestion className="w-3.5 h-3.5" />
                          <span>Dispute / Submit Proof</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Daily Attendance History with Filter Tabs */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Full 30-Day Roll Call Ledger
              </h3>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    filter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  All ({totalDays})
                </button>
                <button
                  onClick={() => setFilter('ABSENT')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    filter === 'ABSENT' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  Absent ({absentCount})
                </button>
                <button
                  onClick={() => setFilter('PRESENT')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    filter === 'PRESENT' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Present ({presentCount})
                </button>
                <button
                  onClick={() => setFilter('OUTPASS')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    filter === 'OUTPASS' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Outpass ({outpassCount})
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-64 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50/50">
              {filteredRecords.length === 0 ? (
                <p className="text-center py-6 text-slate-400">No attendance entries match this filter.</p>
              ) : (
                filteredRecords.map((r) => (
                  <div
                    key={r.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors bg-white ${
                      r.status === 'ABSENT'
                        ? 'border-rose-300 bg-rose-50/30'
                        : r.status === 'OUTPASS'
                        ? 'border-blue-200'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          r.status === 'ABSENT'
                            ? 'bg-rose-100 text-rose-700'
                            : r.status === 'OUTPASS'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {r.status === 'ABSENT' ? '✕' : r.status === 'OUTPASS' ? '✈' : '✓'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-mono text-[11px]">
                            {r.date} ({r.dayOfWeek})
                          </span>
                          <span
                            className={`px-1.5 py-0.2 text-[9px] font-extrabold rounded ${
                              r.status === 'ABSENT'
                                ? 'bg-rose-600 text-white'
                                : r.status === 'OUTPASS'
                                ? 'bg-blue-600 text-white'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-sm sm:max-w-md">
                          {r.remarks || `Verified during ${r.rollCallTime} roll call`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-[10px] text-slate-400 font-mono">
                      {r.rollCallTime}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <div className="text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Biometric Curfew Audit System • Certified by Warden</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>

        {/* Dispute / Rectification Sub-Modal */}
        {disputeRecord && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <FileQuestion className="w-5 h-5 text-rose-600" />
                  <span>Submit Attendance Dispute</span>
                </div>
                <button
                  onClick={() => setDisputeRecord(null)}
                  className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 text-xs text-slate-700 space-y-1">
                <p>
                  <strong>Date:</strong> {disputeRecord.date} ({disputeRecord.dayOfWeek})
                </p>
                <p>
                  <strong>Roll Call Time:</strong> {disputeRecord.rollCallTime}
                </p>
                <p className="text-rose-800 text-[11px]">
                  Please state why biometric check was missed (e.g., late library study slip, medical center visit, or sanctioned department event).
                </p>
              </div>

              <form onSubmit={handleDisputeSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Explanation / Justification <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="E.g., I was studying at the university library with Dr. Sharma's permission slip and returned at 10:15 PM..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDisputeRecord(null)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm"
                  >
                    Submit Dispute to Warden
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
