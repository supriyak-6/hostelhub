import React, { useState } from 'react';
import { store } from '../../services/store';
import { Outpass } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { QRCodeModal } from '../common/QRCodeModal';
import { Ticket, Check, X, Phone, Calendar, Clock, QrCode, Search, AlertCircle } from 'lucide-react';

export const OutpassApprovals: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedQR, setSelectedQR] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    data: string;
    metadata?: { label: string; value: string }[];
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    data: '',
  });

  const outpasses = store.outpasses.filter((o) => {
    const matchesSearch =
      o.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.studentRoom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-base">Outpass Approvals & Passes</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Review student leave & gate outpass requests with verifiable QR issuance
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student, room, destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 w-52 sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="ACTIVE_OUT">Currently Outside</option>
            <option value="RETURNED">Returned</option>
          </select>
        </div>
      </div>

      {/* Outpass List */}
      <div className="space-y-3">
        {outpasses.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No outpasses found matching criteria.
          </div>
        ) : (
          outpasses.map((o) => (
            <div
              key={o.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-slate-900 text-sm">{o.studentName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    {o.studentRoom} ({o.studentBlock})
                  </span>
                  <StatusBadge status={o.status} />
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span className="text-slate-800 font-semibold">
                    Destination: {o.destination}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3.5 h-3.5" /> From: {o.fromDateTime.replace('T', ' ')}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5" /> To: {o.toDateTime.replace('T', ' ')}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 italic mt-0.5">
                  Reason: "{o.reason}"
                </p>

                {o.actualExitTime && (
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    Gate Exit: {o.actualExitTime} {o.actualReturnTime ? `• Returned: ${o.actualReturnTime}` : '• (Student Currently Outside)'}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {o.status === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => store.approveOutpass(o.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm flex items-center gap-1.5 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Approve & Gen QR
                    </button>
                    <button
                      onClick={() => store.rejectOutpass(o.id)}
                      className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 border border-rose-200 flex items-center gap-1.5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                ) : o.qrCodeData ? (
                  <button
                    onClick={() =>
                      setSelectedQR({
                        isOpen: true,
                        title: 'Approved Campus Outpass',
                        subtitle: `${o.studentName} • Room ${o.studentRoom}`,
                        data: o.qrCodeData!,
                        metadata: [
                          { label: 'Student', value: o.studentName },
                          { label: 'Room', value: `${o.studentRoom} (${o.studentBlock})` },
                          { label: 'Destination', value: o.destination },
                          { label: 'From', value: o.fromDateTime.replace('T', ' ') },
                          { label: 'To', value: o.toDateTime.replace('T', ' ') },
                          { label: 'Status', value: o.status },
                        ],
                      })
                    }
                    className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <QrCode className="w-4 h-4 text-amber-600" />
                    Show Outpass QR
                  </button>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>

      <QRCodeModal
        isOpen={selectedQR.isOpen}
        onClose={() => setSelectedQR((prev) => ({ ...prev, isOpen: false }))}
        title={selectedQR.title}
        subtitle={selectedQR.subtitle}
        data={selectedQR.data}
        badgeLabel="OUTPASS APPROVED"
        metadata={selectedQR.metadata}
      />
    </div>
  );
};
