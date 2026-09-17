import React, { useState } from 'react';
import { WardenDashboard } from './WardenDashboard';
import { ProblemHeatmap } from './ProblemHeatmap';
import { StudentManagement } from './StudentManagement';
import { RoomManagement } from './RoomManagement';
import { ComplaintManagement } from './ComplaintManagement';
import { VisitorApprovals } from './VisitorApprovals';
import { OutpassApprovals } from './OutpassApprovals';
import { AttendanceOverview } from './AttendanceOverview';
import { AnnouncementsView } from './AnnouncementsView';
import { ReportsAnalytics } from './ReportsAnalytics';
import { Settings, Shield, Sliders, Bell } from 'lucide-react';
import { store } from '../../services/store';

interface WardenShellProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const WardenShell: React.FC<WardenShellProps> = ({ currentTab, onTabChange }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {currentTab === 'dashboard' && <WardenDashboard onNavigateToTab={onTabChange} />}
      {currentTab === 'problem_heatmap' && <ProblemHeatmap />}
      {currentTab === 'students' && <StudentManagement />}
      {currentTab === 'rooms' && <RoomManagement />}
      {currentTab === 'complaints' && <ComplaintManagement />}
      {currentTab === 'visitors' && <VisitorApprovals />}
      {currentTab === 'outpasses' && <OutpassApprovals />}
      {currentTab === 'attendance' && <AttendanceOverview />}
      {currentTab === 'maintenance' && <ComplaintManagement />}
      {currentTab === 'reports' && <ReportsAnalytics />}
      {currentTab === 'announcements' && <AnnouncementsView />}
      {currentTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs max-w-2xl mx-auto space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">Hostel Operations Settings</h3>
              <p className="text-xs text-slate-500">Configure SLA thresholds, curfews, and notifications</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Hostel Curfew & Roll Call Cutoff</label>
              <input
                type="time"
                defaultValue="21:30"
                className="px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs w-48"
              />
              <span className="text-slate-400 block text-[11px] mt-1">Automatic alert triggered if student is not checked in after this time.</span>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block font-bold text-slate-700 mb-2">SLA Thresholds (Hours)</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-rose-600 block">Critical Defects:</span>
                  <span className="font-mono text-slate-700">4 Hours Target SLA</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-amber-600 block">High Priority:</span>
                  <span className="font-mono text-slate-700">12 Hours Target SLA</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-blue-600 block">Medium Priority:</span>
                  <span className="font-mono text-slate-700">24 Hours Target SLA</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-600 block">Low Priority:</span>
                  <span className="font-mono text-slate-700">48 Hours Target SLA</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => store.showToast('success', 'Configuration Saved', 'Operations policy updated successfully')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-xs"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
