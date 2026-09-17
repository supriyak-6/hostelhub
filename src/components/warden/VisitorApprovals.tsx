import React, { useState } from 'react';
import { store } from '../../services/store';
import { Visitor } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { QRCodeModal } from '../common/QRCodeModal';
import { UserCheck, Check, X, Phone, Calendar, Clock, QrCode, Search } from 'lucide-react';

export const VisitorApprovals: React.FC = () => {
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

  const visitors = store.visitors.filter((v) => {
    const matchesSearch =
      v.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.studentRoom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.phoneNumber.includes(searchTerm);

    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Visitor Approval & Passes</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Review and grant campus entry passes with verified QR generation
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search visitor, student, room..."
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
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="CHECKED_IN">Checked In</option>
            <option value="CHECKED_OUT">Checked Out</option>
          </select>
        </div>
      </div>

      {/* Visitors List inspired by reference image Visitor Approval screen */}
      <div className="space-y-3">
        {visitors.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No visitor requests found matching your filter criteria.
          </div>
        ) : (
          visitors.map((v) => (
            <div
              key={v.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white"
            >
              {/* Left Column: Student & Visitor Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-slate-900 text-sm">{v.visitorName}</span>
                  <span className="text-xs text-slate-500 font-medium">
                    ({v.relationship})
                  </span>
                  <StatusBadge status={v.status} />
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span className="text-blue-700 font-semibold">
                    Visiting: {v.studentName} ({v.studentRoom})
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Phone className="w-3.5 h-3.5" /> {v.phoneNumber}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3.5 h-3.5" /> {v.visitDate} • {v.visitTime}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 italic mt-1">
                  Purpose: "{v.purpose}"
                </p>

                {v.checkedInAt && (
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    Entry Time: {v.checkedInAt} {v.checkedOutAt ? `• Exit Time: ${v.checkedOutAt}` : '• (Currently Inside)'}
                  </p>
                )}
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {v.status === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => store.approveVisitor(v.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm flex items-center gap-1.5 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => store.rejectVisitor(v.id)}
                      className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 border border-rose-200 flex items-center gap-1.5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                ) : v.qrCodeData ? (
                  <button
                    onClick={() =>
                      setSelectedQR({
                        isOpen: true,
                        title: 'Verified Visitor Gate Pass',
                        subtitle: `${v.visitorName} visiting ${v.studentName} (${v.studentRoom})`,
                        data: v.qrCodeData!,
                        metadata: [
                          { label: 'Visitor', value: v.visitorName },
                          { label: 'Relation', value: v.relationship },
                          { label: 'Student', value: `${v.studentName} (${v.studentRoom})` },
                          { label: 'Date/Time', value: `${v.visitDate} ${v.visitTime}` },
                          { label: 'Status', value: v.status },
                        ],
                      })
                    }
                    className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <QrCode className="w-4 h-4 text-blue-600" />
                    View Pass QR
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
        badgeLabel="VISITOR VERIFIED"
        metadata={selectedQR.metadata}
      />
    </div>
  );
};
