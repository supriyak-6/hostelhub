import React, { useState } from 'react';
import { store } from '../../services/store';
import { StatusBadge } from '../common/StatusBadge';
import {
  Shield,
  QrCode,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Ticket,
  ArrowRight,
  ArrowLeft,
  ScanLine,
  Camera,
  AlertTriangle,
} from 'lucide-react';

export const SecurityGateDesk: React.FC = () => {
  const [scanInput, setScanInput] = useState('');
  const [activeTab, setActiveTab] = useState<'scan' | 'visitors' | 'outpasses' | 'emergency'>('scan');
  const [scanResult, setScanResult] = useState<{
    found: boolean;
    type?: 'OUTPASS' | 'VISITOR';
    item?: any;
    message?: string;
  } | null>(null);

  const stats = store.getStats();

  // Handle Quick Scan Verification
  const handleVerifyPass = (codeToTest?: string) => {
    const raw = (codeToTest || scanInput).trim();
    if (!raw) return;

    // Search in Outpasses
    const matchedOutpass = store.outpasses.find(
      (o) => o.id === raw || o.qrCodeData === raw || o.studentName.toLowerCase().includes(raw.toLowerCase())
    );

    if (matchedOutpass) {
      setScanResult({
        found: true,
        type: 'OUTPASS',
        item: matchedOutpass,
      });
      return;
    }

    // Search in Visitors
    const matchedVisitor = store.visitors.find(
      (v) => v.id === raw || v.qrCodeData === raw || v.visitorName.toLowerCase().includes(raw.toLowerCase())
    );

    if (matchedVisitor) {
      setScanResult({
        found: true,
        type: 'VISITOR',
        item: matchedVisitor,
      });
      return;
    }

    setScanResult({
      found: false,
      message: `No active, approved pass found matching "${raw}". Please check ID or ask resident to generate a valid pass.`,
    });
  };

  const handleGateAction = (action: 'OUTPASS_EXIT' | 'OUTPASS_RETURN' | 'VISITOR_IN' | 'VISITOR_OUT') => {
    if (!scanResult?.item) return;

    if (action === 'OUTPASS_EXIT') {
      store.recordGateMovement(scanResult.item.id, 'EXIT');
      // Refresh scan result item
      const updated = store.outpasses.find((o) => o.id === scanResult.item.id);
      setScanResult({ found: true, type: 'OUTPASS', item: updated });
    } else if (action === 'OUTPASS_RETURN') {
      store.recordGateMovement(scanResult.item.id, 'RETURN');
      const updated = store.outpasses.find((o) => o.id === scanResult.item.id);
      setScanResult({ found: true, type: 'OUTPASS', item: updated });
    } else if (action === 'VISITOR_IN') {
      store.checkInVisitor(scanResult.item.id);
      const updated = store.visitors.find((v) => v.id === scanResult.item.id);
      setScanResult({ found: true, type: 'VISITOR', item: updated });
    } else if (action === 'VISITOR_OUT') {
      store.checkOutVisitor(scanResult.item.id);
      const updated = store.visitors.find((v) => v.id === scanResult.item.id);
      setScanResult({ found: true, type: 'VISITOR', item: updated });
    }
  };

  return (
    <div className="space-y-6">
      {/* Gate Top Bar & Live Gate Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Gate Status</span>
            <Shield className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono">
            OPERATIONAL
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Main Gate 1 • Turnstile Active
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Visitors Inside</span>
            <UserCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {stats.visitorsInside}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {stats.visitorsToday} registered today
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Students Outside</span>
            <Ticket className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 font-mono">
            {stats.studentsOutside}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Curfew: 9:30 PM
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Active Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            0
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            No active perimeter triggers
          </div>
        </div>
      </div>

      {/* Main Gate Scanner & Pass Verification Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scanner Terminal (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScanLine className="w-5 h-5 text-blue-600 animate-pulse" />
              <h3 className="font-bold text-slate-900 text-base">Gate Pass QR Scanner</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
              Live Gate Ingress
            </span>
          </div>

          {/* Quick Scanner input + simulated camera frame */}
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center relative overflow-hidden">
            <div className="max-w-xs mx-auto py-6 flex flex-col items-center">
              <div className="w-44 h-44 rounded-2xl border-2 border-dashed border-blue-400/70 relative flex items-center justify-center mb-3">
                <div className="absolute inset-x-2 h-0.5 bg-blue-400 shadow-md shadow-blue-400 animate-bounce" />
                <QrCode className="w-20 h-20 text-slate-600" />
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Hold Student / Visitor QR Code in front of terminal camera
              </p>
            </div>

            {/* Quick Demo Pre-fills for Instant Testing during Presentation */}
            <div className="border-t border-slate-800 pt-3 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold">1-Click Scan Test:</span>
              <button
                onClick={() => {
                  setScanInput('OUT-2026-001');
                  handleVerifyPass('OUT-2026-001');
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 text-[11px] font-mono transition-colors"
              >
                Scan Divya's Outpass
              </button>
              <button
                onClick={() => {
                  setScanInput('VIS-2026-001');
                  handleVerifyPass('VIS-2026-001');
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] font-mono transition-colors"
              >
                Scan Ravi's Visitor Pass
              </button>
            </div>
          </div>

          {/* Manual Input or Barcode Scanner Gun input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerifyPass()}
              placeholder="Or enter Pass ID / Student Name (e.g. OUT-2026-001)..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={() => handleVerifyPass()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-sm transition-colors"
            >
              Verify Pass
            </button>
          </div>

          {/* Verification Result Card */}
          {scanResult && (
            <div
              className={`p-5 rounded-2xl border transition-all animate-in fade-in ${
                scanResult.found
                  ? 'bg-blue-50/40 border-blue-200'
                  : 'bg-rose-50/40 border-rose-200'
              }`}
            >
              {scanResult.found ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {scanResult.type === 'OUTPASS'
                          ? 'Valid Student Outpass'
                          : 'Valid Visitor Entry Pass'}
                      </h4>
                    </div>
                    <StatusBadge status={scanResult.item.status} />
                  </div>

                  {/* Outpass details */}
                  {scanResult.type === 'OUTPASS' && (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Student:</span>
                          <span className="font-bold text-slate-900">
                            {scanResult.item.studentName} ({scanResult.item.studentRoom})
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Destination:</span>
                          <span className="font-bold text-slate-800">{scanResult.item.destination}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Valid Window:</span>
                          <span className="text-slate-700">
                            {scanResult.item.fromDateTime.replace('T', ' ')} to {scanResult.item.toDateTime.replace('T', ' ')}
                          </span>
                        </div>
                        {scanResult.item.actualExitTime && (
                          <div className="flex justify-between text-amber-700 font-semibold">
                            <span>Exited Campus At:</span>
                            <span>{scanResult.item.actualExitTime}</span>
                          </div>
                        )}
                        {scanResult.item.actualReturnTime && (
                          <div className="flex justify-between text-emerald-700 font-semibold">
                            <span>Returned Campus At:</span>
                            <span>{scanResult.item.actualReturnTime}</span>
                          </div>
                        )}
                      </div>

                      {/* Security Action Buttons for Outpass */}
                      <div className="flex gap-2 pt-1">
                        {scanResult.item.status === 'APPROVED' && (
                          <button
                            onClick={() => handleGateAction('OUTPASS_EXIT')}
                            className="flex-1 py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <ArrowRight className="w-4 h-4" />
                            Confirm Gate Exit (Leave Campus)
                          </button>
                        )}
                        {scanResult.item.status === 'ACTIVE_OUT' && (
                          <button
                            onClick={() => handleGateAction('OUTPASS_RETURN')}
                            className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            Confirm Gate Return (Back to Hostel)
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Visitor details */}
                  {scanResult.type === 'VISITOR' && (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Visitor:</span>
                          <span className="font-bold text-slate-900">
                            {scanResult.item.visitorName} ({scanResult.item.relationship})
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Visiting Student:</span>
                          <span className="font-bold text-slate-800">
                            {scanResult.item.studentName} ({scanResult.item.studentRoom})
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Phone:</span>
                          <span className="text-slate-700">{scanResult.item.phoneNumber}</span>
                        </div>
                        {scanResult.item.checkedInAt && (
                          <div className="flex justify-between text-blue-700 font-semibold">
                            <span>Checked In At:</span>
                            <span>{scanResult.item.checkedInAt}</span>
                          </div>
                        )}
                      </div>

                      {/* Security Action Buttons for Visitor */}
                      <div className="flex gap-2 pt-1">
                        {scanResult.item.status === 'APPROVED' && (
                          <button
                            onClick={() => handleGateAction('VISITOR_IN')}
                            className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Check In Visitor (Entry Granted)
                          </button>
                        )}
                        {scanResult.item.status === 'CHECKED_IN' && (
                          <button
                            onClick={() => handleGateAction('VISITOR_OUT')}
                            className="flex-1 py-2.5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <ArrowRight className="w-4 h-4" />
                            Check Out Visitor (Exit Completed)
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-rose-800 block text-xs">Verification Failed</span>
                    <p className="text-[11px] text-rose-700 mt-0.5">{scanResult.message}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Gate Feed & Active Movement Logs (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Gate Activity Feed</h3>
              <span className="text-[11px] text-slate-400 font-mono">Real-time log</span>
            </div>

            <div className="space-y-3 text-xs">
              {store.visitors.slice(0, 3).map((v) => (
                <div key={v.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>{v.visitorName}</span>
                    <StatusBadge status={v.status} />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Visiting: {v.studentName} ({v.studentRoom})
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    Pass #{v.id} • {v.visitDate}
                  </p>
                </div>
              ))}

              {store.outpasses.slice(0, 2).map((o) => (
                <div key={o.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>{o.studentName}</span>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    To: {o.destination} ({o.studentRoom})
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    Pass #{o.id} • {o.fromDateTime.replace('T', ' ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Gate 1 Security Officer on duty</span>
            <span className="text-emerald-600 font-bold">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};
