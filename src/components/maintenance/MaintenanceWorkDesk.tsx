import React, { useState } from 'react';
import { store } from '../../services/store';
import { MaintenanceTask, Complaint } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Wrench,
  Clock,
  CheckCircle2,
  Play,
  Camera,
  AlertTriangle,
  Award,
  Calendar,
  Sparkles,
  Check,
  X,
} from 'lucide-react';

export const MaintenanceWorkDesk: React.FC = () => {
  const currentUser = store.currentUser;
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('Replaced the damaged ceiling fan capacitor and secured mounting bolts. Verified vibration-free operation.');
  const [resolvedPhoto, setResolvedPhoto] = useState(
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600'
  );

  // Filter tasks assigned to current maintenance worker or show all if demo
  const myTasks = store.maintenanceTasks;
  const inProgressCount = myTasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const completedCount = myTasks.filter((t) => t.status === 'COMPLETED').length;

  const handleStartTask = (taskId: string) => {
    store.updateMaintenanceTaskStatus(taskId, 'IN_PROGRESS');
  };

  const handleCompleteTask = (taskId: string) => {
    store.updateMaintenanceTaskStatus(taskId, 'COMPLETED', {
      resolutionNotes,
      afterPhoto: resolvedPhoto,
    });
    setSelectedTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Maintenance Staff Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Assigned Tasks</span>
            <Wrench className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {myTasks.length}
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">
            Active in your queue
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">In Progress</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 font-mono">
            {inProgressCount}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Under active repair
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Resolved Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-mono">
            {completedCount}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            SLA Met: 100%
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Rating</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            4.9 ★
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Based on 84 student ratings
          </div>
        </div>
      </div>

      {/* Task Queue List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Work Orders & Service Queue</h3>
            <p className="text-xs text-slate-500">
              Assigned technician: <strong className="text-slate-800">{currentUser.name}</strong>
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
            Field Mode
          </span>
        </div>

        <div className="space-y-3">
          {myTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No tasks assigned currently.
            </div>
          ) : (
            myTasks.map((task) => {
              const diffHours = Math.round((new Date(task.slaDeadline).getTime() - Date.now()) / (3600 * 1000));
              const isOverdue = diffHours < 0 && task.status !== 'COMPLETED';

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    task.status === 'COMPLETED'
                      ? 'bg-slate-50/50 border-slate-200'
                      : isOverdue
                      ? 'bg-rose-50/20 border-rose-300'
                      : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {task.beforePhoto || task.photoBeforeUrl ? (
                      <img
                        src={task.beforePhoto || task.photoBeforeUrl}
                        alt="Task Before"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center flex-shrink-0">
                        <Wrench className="w-6 h-6" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {task.title}
                        </span>
                        <StatusBadge priority={task.priority} />
                        <StatusBadge status={task.status} />
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                        <span className="font-bold text-blue-700">Location: {task.location || task.roomNumber}</span>
                        {task.studentName && <span className="text-slate-500">Student: {task.studentName}</span>}
                        <span className="text-slate-500">Order #{task.id}</span>
                      </div>

                      {task.description && (
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {task.resolutionNotes && (
                        <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                          Fix Notes: {task.resolutionNotes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions & SLA Timer */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 flex-shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Target SLA: {task.slaHoursTotal || 24}h
                      </span>
                      {task.status !== 'COMPLETED' ? (
                        <span
                          className={`text-xs font-bold font-mono ${
                            isOverdue
                              ? 'text-rose-600'
                              : diffHours <= 3
                              ? 'text-amber-600 animate-pulse'
                              : 'text-slate-700'
                          }`}
                        >
                          {isOverdue ? 'DEADLINE EXCEEDED' : `${diffHours}h left to fix`}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-emerald-600 font-mono">
                          RESOLVED & VERIFIED
                        </span>
                      )}
                    </div>

                    {task.status === 'ASSIGNED' && (
                      <button
                        onClick={() => handleStartTask(task.id)}
                        className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" />
                        Start Work
                      </button>
                    )}

                    {task.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Complete & Sign Off
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Complete Task & Sign Off Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Complete Work Order</h3>
                <p className="text-xs text-slate-500">Order #{selectedTask.id} • Room {selectedTask.roomNumber}</p>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Resolution Notes (Materials replaced, actions taken)
                </label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none leading-relaxed"
                  placeholder="Details of repair..."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Work Completed Photo Proof
                </label>
                <div className="p-2 border border-slate-200 rounded-xl flex items-center gap-3 bg-slate-50">
                  <img
                    src={resolvedPhoto}
                    alt="Resolved Proof"
                    className="w-16 h-16 rounded-lg object-cover border border-slate-300"
                  />
                  <div className="text-[11px] text-slate-600">
                    <span className="font-semibold block text-slate-800">Photo Attached</span>
                    <span>Ready to submit to Warden and Student.</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px]">
                Upon completion, the associated complaint status will automatically update to <strong>RESOLVED</strong> on the Student and Warden dashboards.
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCompleteTask(selectedTask.id)}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Mark Resolved & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
