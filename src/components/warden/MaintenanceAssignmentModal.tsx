import React, { useState } from 'react';
import { store } from '../../services/store';
import { Complaint } from '../../types';
import { X, Wrench, UserCheck, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface MaintenanceAssignmentModalProps {
  complaint: Complaint | null;
  onClose: () => void;
}

export const MaintenanceAssignmentModal: React.FC<MaintenanceAssignmentModalProps> = ({
  complaint,
  onClose,
}) => {
  const [selectedStaff, setSelectedStaff] = useState('Ramesh Kumar (Lead Electrician)');
  const [notes, setNotes] = useState('Inspect motor winding and replace capacitor if burnt.');

  if (!complaint) return null;

  const staffOptions = [
    { name: 'Ramesh Kumar', role: 'Lead Electrician', id: 'usr_maint_ramesh' },
    { name: 'Suresh Narayana', role: 'Chief Plumber', id: 'usr_maint_suresh' },
    { name: 'Mohan Lal', role: 'Carpenter & Furniture', id: 'usr_maint_mohan' },
    { name: 'Govind Rao', role: 'HVAC / AC Technician', id: 'usr_maint_govind' },
    { name: 'Anita Devi', role: 'Housekeeping Supervisor', id: 'usr_maint_anita' },
  ];

  const handleAssign = () => {
    const staff = staffOptions.find((s) => `${s.name} (${s.role})` === selectedStaff) || staffOptions[0];
    store.assignComplaintToStaff(complaint.id, `${staff.name} (${staff.role})`, staff.role);
    onClose();
  };

  const handleDirectResolve = () => {
    store.updateMaintenanceTaskStatus(
      'TSK-' + complaint.id.replace('CMP-', ''),
      'COMPLETED',
      {
        resolutionNotes: 'Directly resolved and verified by Warden.',
      }
    );
    const comp = store.complaints.find((c) => c.id === complaint.id);
    if (comp) {
      comp.status = 'RESOLVED';
      comp.resolutionNotes = 'Directly resolved and verified by Warden.';
      store.showToast('success', `Complaint ${complaint.id} marked RESOLVED`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Assign Maintenance Task</h3>
              <p className="text-xs text-slate-500">Ticket #{complaint.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Issue summary card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">{complaint.title}</span>
              <div className="flex items-center gap-1.5">
                <StatusBadge priority={complaint.priority} />
                <StatusBadge status={complaint.status} />
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed">{complaint.description}</p>
            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap justify-between text-[11px] text-slate-500">
              <span>Location: <strong className="text-slate-700">{complaint.location}</strong></span>
              <span>Student: <strong className="text-slate-700">{complaint.studentName}</strong></span>
            </div>
            {complaint.photoUrl && (
              <div className="mt-2">
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">Attached Photo Proof:</span>
                <img
                  src={complaint.photoUrl}
                  alt="Proof"
                  className="w-full h-36 rounded-xl object-cover border border-slate-200"
                />
              </div>
            )}
          </div>

          {/* Select Staff */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Maintenance Staff
            </label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              {staffOptions.map((s) => (
                <option key={s.id} value={`${s.name} (${s.role})`}>
                  {s.name} — {s.role}
                </option>
              ))}
            </select>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Work Instructions & Materials
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="Instructions for Ramesh..."
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleDirectResolve}
              className="px-3 py-2 rounded-xl border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark Resolved Directly
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssign}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                Assign & Dispatch
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
