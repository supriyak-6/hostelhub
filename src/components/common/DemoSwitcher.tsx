import React, { useState } from 'react';
import { store } from '../../services/store';
import { authService } from '../../services/authService';
import { DEMO_USERS } from '../../services/mockData';
import { FIRESTORE_COLLECTIONS, FIRESTORE_SECURITY_RULES } from '../../services/firebaseConfig';
import {
  Users,
  Shield,
  Wrench,
  GraduationCap,
  Sparkles,
  RotateCcw,
  Database,
  CheckCircle2,
  ChevronRight,
  X,
  Flame,
  Award,
  LogOut,
} from 'lucide-react';

export const DemoSwitcher: React.FC = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);
  const currentRole = store.currentUser?.role;

  const demoAccounts = [
    { key: 'student', label: 'Student (Divya A302)', icon: GraduationCap, role: 'STUDENT', desc: 'Room A302 • Attendance 92%' },
    { key: 'warden', label: 'Warden (Dr. Rao)', icon: Shield, role: 'WARDEN', desc: 'Approvals • Rooms • Analytics' },
    { key: 'security', label: 'Security (Vikram)', icon: Shield, role: 'SECURITY', desc: 'QR Scanner • Gate Log' },
    { key: 'maintenance', label: 'Maintenance (Ramesh)', icon: Wrench, role: 'MAINTENANCE', desc: 'SLA Tasks • Photo Proof' },
    { key: 'admin', label: 'Admin Panel', icon: Users, role: 'ADMIN', desc: 'Full System Control' },
  ];

  return (
    <>
      <div className="bg-slate-900 text-slate-100 border-b border-slate-800 px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold tracking-tight text-slate-200 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline text-amber-400 font-semibold">NN HACKATHON 2026:</span>
            <span className="text-white font-bold">HostelHub</span>
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 font-medium">Quick Role Switch:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {demoAccounts.map((acc) => {
            const isActive = currentRole === acc.role;
            const Icon = acc.icon;
            return (
              <button
                key={acc.key}
                onClick={() => store.setCurrentRole(acc.key as any)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold ring-1 ring-blue-400'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={acc.desc}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{acc.label.split(' ')[0]}</span>
                <span className="hidden md:inline text-[11px] opacity-75">({acc.label.split('(')[1]?.replace(')', '')})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>3-Min Demo Flow</span>
          </button>

          <button
            onClick={() => setShowFirebaseModal(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
            title="Inspect Firestore schema & security rules"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden lg:inline">Firestore Schema</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset all demo data to initial pristine hackathon state?')) {
                store.resetDemoData();
              }
            }}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Reset seed data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              authService.logout();
              store.logout();
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-[11px] font-bold transition-colors"
            title="Sign Out to Login Page"
          >
            <LogOut className="w-3 h-3 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* 3-Minute Hackathon Demo Script Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-900 to-indigo-950 text-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  <Award className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Judges 3-Minute Live Demo Flow</h3>
                  <p className="text-xs text-blue-200">
                    Step-by-step end-to-end hackathon workflow across 4 integrated roles
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  Tip: Use the top <strong>Quick Role Switch</strong> buttons to jump between roles instantly.
                  All state updates in real-time across student, warden, maintenance, and security!
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors bg-slate-50/50">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
                      Step 1: Student Dashboard & Raise Complaint
                    </span>
                    <button
                      onClick={() => {
                        store.setCurrentRole('student');
                        setShowGuide(false);
                      }}
                      className="text-xs text-blue-600 hover:underline font-semibold"
                    >
                      Go to Student →
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 pl-7">
                    Login as <strong>Divya (Room A302)</strong>. Notice Attendance 92%, Room A302, pending tickets. Click <strong>"Raise Complaint"</strong>, submit "Ceiling fan rattling" with Medium/High priority.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors bg-slate-50/50">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
                      Step 2: Warden Assigns Task & SLA Tracking
                    </span>
                    <button
                      onClick={() => {
                        store.setCurrentRole('warden');
                        setShowGuide(false);
                      }}
                      className="text-xs text-blue-600 hover:underline font-semibold"
                    >
                      Go to Warden →
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 pl-7">
                    Switch to <strong>Warden</strong>. See pending complaints increment. Open the complaint and click <strong>"Assign to Ramesh (Electrician)"</strong>.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors bg-slate-50/50">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">3</span>
                      Step 3: Maintenance Staff Work Proof (Before & After)
                    </span>
                    <button
                      onClick={() => {
                        store.setCurrentRole('maintenance');
                        setShowGuide(false);
                      }}
                      className="text-xs text-blue-600 hover:underline font-semibold"
                    >
                      Go to Maintenance →
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 pl-7">
                    Switch to <strong>Ramesh (Maintenance)</strong>. See the assigned task with SLA timer countdown. Upload Before & After photos, enter resolution notes ("Replaced capacitor"), and click <strong>"Mark Completed"</strong>.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors bg-slate-50/50">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">4</span>
                      Step 4: Student Sees Resolution & Outpass Request
                    </span>
                    <button
                      onClick={() => {
                        store.setCurrentRole('student');
                        setShowGuide(false);
                      }}
                      className="text-xs text-blue-600 hover:underline font-semibold"
                    >
                      Go to Student →
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 pl-7">
                    Switch back to <strong>Student</strong>. Notice complaint is now <strong className="text-emerald-600">RESOLVED</strong> and a resolution notification arrived! Next, request an <strong>Outpass</strong> or <strong>Visitor Pass</strong> for Ravi Kumar (Father).
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors bg-slate-50/50">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">5</span>
                      Step 5: Warden Approves & Generates Secure QR Code
                    </span>
                    <button
                      onClick={() => {
                        store.setCurrentRole('warden');
                        setShowGuide(false);
                      }}
                      className="text-xs text-blue-600 hover:underline font-semibold"
                    >
                      Go to Warden →
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 pl-7">
                    Warden approves the outpass/visitor pass. A cryptographically verifiable QR Code is generated instantly.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors bg-slate-50/50">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">6</span>
                      Step 6: Security QR Verification & Gate Log
                    </span>
                    <button
                      onClick={() => {
                        store.setCurrentRole('security');
                        setShowGuide(false);
                      }}
                      className="text-xs text-blue-600 hover:underline font-semibold"
                    >
                      Go to Security →
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 pl-7">
                    Switch to <strong>Security</strong>. Open the QR Scanner, scan/verify the pass, and record <strong>IN / OUT</strong> timestamps. Student status updates to OUTSIDE and mess dinner count adjusts!
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/40">
                  <div className="flex items-center justify-between font-semibold text-rose-900">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">7</span>
                      Step 7: Emergency SOS Alert Broadcast
                    </span>
                    <span className="text-xs font-semibold text-rose-600">Real-Time Alert</span>
                  </div>
                  <p className="text-xs text-rose-800 mt-1 pl-7">
                    Click <strong>SOS</strong> on Student mobile dashboard. Emergency type is broadcast immediately to both Warden and Security consoles with audio/visual warnings.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">HostelHub • Smart Residence OS</span>
              <button
                onClick={() => setShowGuide(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors"
              >
                Close & Start Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Firestore Schema & Rules Modal */}
      {showFirebaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="font-bold text-base">Firebase Firestore Architecture & Rules</h3>
                  <p className="text-xs text-slate-400">Schema design with role-based security rules</p>
                </div>
              </div>
              <button
                onClick={() => setShowFirebaseModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">Firestore Collections Schema</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(FIRESTORE_COLLECTIONS).map(([key, col]) => (
                    <div key={key} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                      <span className="font-mono font-semibold text-blue-700 text-xs">/{col}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5 capitalize">{key.toLowerCase().replace(/_/g, ' ')}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">Production Security Rules (`firestore.rules`)</h4>
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto max-h-60 leading-relaxed">
                  {FIRESTORE_SECURITY_RULES}
                </pre>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">Firebase Firestore Ready</span>
              <button
                onClick={() => setShowFirebaseModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
