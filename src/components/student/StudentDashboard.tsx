import React, { useState } from 'react';
import { store } from '../../services/store';
import { StatusBadge } from '../common/StatusBadge';
import { QRCodeModal } from '../common/QRCodeModal';
import { RaiseComplaintModal } from './RaiseComplaintModal';
import { VisitorRequestModal } from './VisitorRequestModal';
import { OutpassRequestModal } from './OutpassRequestModal';
import { RoomTransferModal } from './RoomTransferModal';
import { EmergencySOSModal } from './EmergencySOSModal';
import { EvacuationMapModal } from './EvacuationMapModal';
import { MessViewModal } from './MessViewModal';
import { StudentAttendanceModal } from './StudentAttendanceModal';
import { StudentComplaintsModal } from './StudentComplaintsModal';
import { StudentNotificationsModal } from './StudentNotificationsModal';
import {
  DoorClosed,
  CalendarCheck,
  AlertCircle,
  Bell,
  PlusCircle,
  UserCheck,
  Ticket,
  ArrowRightLeft,
  UtensilsCrossed,
  AlertOctagon,
  Map,
  ChevronRight,
  ShieldCheck,
  Clock,
  ExternalLink,
  Users,
  Wifi,
  Sparkles,
  QrCode,
} from 'lucide-react';

interface StudentDashboardProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ currentTab, onTabChange }) => {
  const currentUser = store.currentUser || {
    id: 'uid_student_stu0001',
    userId: 'STU0001',
    name: 'Divya Sharma',
    email: 'student1@hostelhub.demo',
    role: 'STUDENT' as const,
    phone: '+91 9800000001',
    room: 'A302',
    block: 'Block A',
    department: 'Computer Science & Eng',
  };
  const [activeModal, setActiveModal] = useState<
    | 'none'
    | 'complaints_list'
    | 'raise_complaint'
    | 'attendance'
    | 'notifications'
    | 'visitor'
    | 'outpass'
    | 'transfer'
    | 'sos'
    | 'map'
    | 'mess'
    | 'room_details'
  >('none');

  React.useEffect(() => {
    if (currentTab === 'complaints') setActiveModal('complaints_list');
    else if (currentTab === 'attendance') setActiveModal('attendance');
    else if (currentTab === 'notifications' || currentTab === 'notices') setActiveModal('notifications');
    else if (currentTab === 'visitors') setActiveModal('visitor');
    else if (currentTab === 'outpasses') setActiveModal('outpass');
    else if (currentTab === 'room-transfer') setActiveModal('transfer');
    else if (currentTab === 'emergency') setActiveModal('sos');
    else if (currentTab === 'mess') setActiveModal('mess');
  }, [currentTab]);

  const [selectedQR, setSelectedQR] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    data: string;
    badgeLabel?: string;
    metadata?: { label: string; value: string }[];
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    data: '',
  });

  // Filter items belonging to current student
  const studentComplaints = store.complaints.filter(
    (c) => c.studentId === currentUser.id || c.studentRoom === currentUser.room
  );
  const activeComplaintsCount = studentComplaints.filter(
    (c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED'
  ).length;

  const studentOutpasses = store.outpasses.filter(
    (o) => o.studentId === currentUser.id || o.studentRoom === currentUser.room
  );
  const latestOutpass = studentOutpasses[0];

  const studentVisitors = store.visitors.filter(
    (v) => v.studentId === currentUser.id || v.studentRoom === currentUser.room
  );

  const studentNotifications = store.notifications.filter(
    (n) => n.recipientId === currentUser.id
  );
  const unreadCount = studentNotifications.filter((n) => !n.read).length || 3;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* 4 Dashboard Metric Cards inspired directly by screenshot */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: My Room */}
        <div
          onClick={() => setActiveModal('room_details')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold tracking-wider uppercase">My Room</span>
            <DoorClosed className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
            {currentUser.room || 'A302'}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-blue-600 font-semibold mt-2 group-hover:translate-x-0.5 transition-transform">
            <span>View Details</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 2: Attendance */}
        <div
          onClick={() => setActiveModal('attendance')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold tracking-wider uppercase">Attendance</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight flex items-baseline gap-2">
            <span>92%</span>
            <span className="text-[10px] text-rose-600 font-bold px-1.5 py-0.2 rounded bg-rose-50 border border-rose-200">
              2 Absent Days
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-2 group-hover:translate-x-0.5 transition-transform">
            <span>View Absent Dates & Log</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 3: Complaints */}
        <div
          onClick={() => setActiveModal('complaints_list')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 transition-all cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold tracking-wider uppercase">Complaints</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight flex items-baseline gap-2">
            <span>{studentComplaints.length}</span>
            <span className="text-[10px] text-slate-400 font-normal">
              ({activeComplaintsCount} Active)
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold mt-2 group-hover:translate-x-0.5 transition-transform">
            <span>View Overall Complaints</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 4: Notifications */}
        <div
          onClick={() => setActiveModal('notifications')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold tracking-wider uppercase">Notifications</span>
            <Bell className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight flex items-baseline gap-2">
            <span>{unreadCount}</span>
            <span className="text-[10px] text-indigo-600 font-medium">New Notices</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-indigo-600 font-semibold mt-2 group-hover:translate-x-0.5 transition-transform">
            <span>View All Notices</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Quick Actions Section inspired by reference image */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3.5">
          Quick Actions
        </h3>

        {/* Row 1: Primary actions */}
        <div className="grid grid-cols-4 gap-2.5 mb-3">
          <button
            onClick={() => setActiveModal('raise_complaint')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-200 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight">
              Raise Complaint
            </span>
          </button>

          <button
            onClick={() => setActiveModal('visitor')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-200 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight">
              Visitor Request
            </span>
          </button>

          <button
            onClick={() => setActiveModal('outpass')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200/80 hover:border-amber-200 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight">
              Outpass
            </span>
          </button>

          <button
            onClick={() => setActiveModal('transfer')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-200 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight">
              Room Transfer
            </span>
          </button>
        </div>

        {/* Row 2: Mess, SOS, Emergency Map */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => setActiveModal('mess')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-cyan-50/70 border border-slate-200/80 hover:border-cyan-200 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight">
              Mess
            </span>
          </button>

          <button
            onClick={() => setActiveModal('sos')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-50/80 hover:bg-rose-100 border border-rose-200 transition-all group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform ring-2 ring-rose-300">
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[11px] font-bold text-rose-700 text-center leading-tight">
              SOS Alert
            </span>
          </button>

          <button
            onClick={() => setActiveModal('map')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-200 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <Map className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight">
              Emergency Map
            </span>
          </button>
        </div>
      </div>

      {/* Active Outpass & QR Pass Card if available */}
      {latestOutpass && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Recent Outpass Request</h3>
            </div>
            <StatusBadge status={latestOutpass.status} />
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-800">
                Destination: {latestOutpass.destination}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Valid: {latestOutpass.fromDateTime.replace('T', ' ')} to {latestOutpass.toDateTime.replace('T', ' ')}
              </p>
              <p className="text-[11px] text-slate-600 mt-1 italic">
                Reason: "{latestOutpass.reason}"
              </p>
            </div>

            {latestOutpass.status === 'APPROVED' && latestOutpass.qrCodeData && (
              <button
                onClick={() =>
                  setSelectedQR({
                    isOpen: true,
                    title: 'Approved Campus Outpass',
                    subtitle: `${currentUser.name} • Room ${currentUser.room}`,
                    data: latestOutpass.qrCodeData!,
                    badgeLabel: 'APPROVED OUTPASS',
                    metadata: [
                      { label: 'Student', value: currentUser.name },
                      { label: 'Room', value: currentUser.room || 'A302' },
                      { label: 'Destination', value: latestOutpass.destination },
                      { label: 'Valid Until', value: latestOutpass.toDateTime.replace('T', ' ') },
                    ],
                  })
                }
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition-colors flex-shrink-0"
              >
                <QrCode className="w-4 h-4" />
                <span>Show QR Pass</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Complaints Tracking & SLA List inspired by screenshot */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">My Maintenance Complaints</h3>
            <p className="text-xs text-slate-500">Real-time status and SLA resolution tracking</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal('complaints_list')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              <span>View All ({studentComplaints.length})</span>
            </button>
            <button
              onClick={() => setActiveModal('raise_complaint')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Complaint</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {studentComplaints.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No active complaints. Click "Raise Complaint" if you need maintenance!
            </div>
          ) : (
            studentComplaints.map((comp) => {
              // Calculate SLA remaining hours
              const diffHours = Math.round((new Date(comp.slaDeadline).getTime() - Date.now()) / (3600 * 1000));
              const slaLeft = diffHours > 0 ? `${diffHours} hrs left` : 'SLA VIOLATED';

              return (
                <div
                  key={comp.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
                >
                  <div className="flex items-start gap-3">
                    {comp.photoUrl && (
                      <img
                        src={comp.photoUrl}
                        alt="Issue"
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-slate-900 text-xs">{comp.title}</span>
                        <StatusBadge priority={comp.priority} />
                        <StatusBadge status={comp.status} />
                      </div>
                      <p className="text-[11px] text-slate-500">{comp.location} • {comp.category}</p>
                      {comp.assignedStaffName && (
                        <p className="text-[11px] text-blue-700 font-semibold mt-1">
                          Assigned To: {comp.assignedStaffName}
                        </p>
                      )}
                      {comp.resolutionNotes && (
                        <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                          Resolution: {comp.resolutionNotes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0">
                    <span className="text-[10px] text-slate-400">
                      Ticket #{comp.id}
                    </span>
                    {comp.status !== 'RESOLVED' ? (
                      <span
                        className={`text-xs font-bold font-mono mt-0.5 ${
                          diffHours <= 3 ? 'text-rose-600 animate-pulse' : 'text-slate-700'
                        }`}
                      >
                        SLA: {slaLeft}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 font-mono mt-0.5">
                        RESOLVED
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Room Details Modal */}
      {activeModal === 'room_details' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Room Details - Room A302</h3>
              <button
                onClick={() => setActiveModal('none')}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Block & Floor:</span>
                <span className="font-bold text-slate-800">Block A (3rd Floor)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Room Type:</span>
                <span className="font-bold text-slate-800">Double Sharing with Balcony & AC</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Roommate:</span>
                <span className="font-bold text-blue-700">Ananya Reddy (3rd Year CSE)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Floor Warden:</span>
                <span className="font-bold text-slate-800">Mrs. Lakshmi Devi (+91 94401 23451)</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Amenities Included:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['High Speed WiFi', 'Attached Restroom', 'Geyser', 'Air Conditioner', 'Study Desk x 2', 'Steel Wardrobes'].map(
                    (a) => (
                      <span key={a} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                        {a}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('none')}
              className="mt-2 w-full py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Sub-modals */}
      <StudentAttendanceModal
        isOpen={activeModal === 'attendance'}
        onClose={() => setActiveModal('none')}
      />
      <StudentComplaintsModal
        isOpen={activeModal === 'complaints_list'}
        onClose={() => setActiveModal('none')}
        onOpenNewComplaint={() => setActiveModal('raise_complaint')}
      />
      <StudentNotificationsModal
        isOpen={activeModal === 'notifications'}
        onClose={() => setActiveModal('none')}
        onNavigateAction={(action) => {
          if (action === 'attendance') setActiveModal('attendance');
          else if (action === 'complaints') setActiveModal('complaints_list');
          else if (action === 'visitors') setActiveModal('visitor');
          else if (action === 'mess') setActiveModal('mess');
          else if (onTabChange) onTabChange(action);
        }}
      />
      <RaiseComplaintModal
        isOpen={activeModal === 'raise_complaint'}
        onClose={() => setActiveModal('none')}
      />
      <VisitorRequestModal
        isOpen={activeModal === 'visitor'}
        onClose={() => setActiveModal('none')}
      />
      <OutpassRequestModal
        isOpen={activeModal === 'outpass'}
        onClose={() => setActiveModal('none')}
      />
      <RoomTransferModal
        isOpen={activeModal === 'transfer'}
        onClose={() => setActiveModal('none')}
      />
      <EmergencySOSModal
        isOpen={activeModal === 'sos'}
        onClose={() => setActiveModal('none')}
      />
      <EvacuationMapModal
        isOpen={activeModal === 'map'}
        onClose={() => setActiveModal('none')}
      />
      <MessViewModal
        isOpen={activeModal === 'mess'}
        onClose={() => setActiveModal('none')}
      />
      <QRCodeModal
        isOpen={selectedQR.isOpen}
        onClose={() => setSelectedQR((prev) => ({ ...prev, isOpen: false }))}
        title={selectedQR.title}
        subtitle={selectedQR.subtitle}
        data={selectedQR.data}
        badgeLabel={selectedQR.badgeLabel}
        metadata={selectedQR.metadata}
      />
    </div>
  );
};
