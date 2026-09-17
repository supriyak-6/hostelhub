import React, { useState } from 'react';
import { store } from '../../services/store';
import { ComplaintCategory } from '../../types';
import { Grid, AlertCircle, CheckCircle2, ChevronRight, X } from 'lucide-react';

export const ProblemHeatmap: React.FC = () => {
  const [selectedBlock, setSelectedBlock] = useState<'Block A' | 'Block B' | 'Block C'>('Block A');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string | null>(null);

  const floors = [4, 3, 2, 1]; // Top to bottom floor order
  const roomSlots = ['1', '2', '3', '4']; // e.g. A1, A2, A3, A4 on that floor

  // Derive severity for each room based on complaints in that room
  const getRoomSeverity = (block: string, floor: number, slot: string) => {
    const prefix = block === 'Block A' ? 'A' : block === 'Block B' ? 'B' : 'C';
    const roomNum = `${prefix}${floor}0${slot}`;

    const roomComplaints = store.complaints.filter(
      (c) => c.studentRoom === roomNum && c.status !== 'RESOLVED' && c.status !== 'CLOSED'
    );

    if (roomComplaints.some((c) => c.priority === 'CRITICAL' || c.priority === 'HIGH')) {
      return { severity: 'HIGH', count: roomComplaints.length, roomNum, complaints: roomComplaints };
    }
    if (roomComplaints.length > 0) {
      return { severity: 'MEDIUM', count: roomComplaints.length, roomNum, complaints: roomComplaints };
    }
    return { severity: 'LOW', count: 0, roomNum, complaints: [] };
  };

  const selectedRoomDetails = selectedRoomNumber
    ? {
        roomNum: selectedRoomNumber,
        complaints: store.complaints.filter((c) => c.studentRoom === selectedRoomNumber),
        room: store.rooms.find((r) => r.roomNumber === selectedRoomNumber),
      }
    : null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Hostel Problem Heatmap</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time visual maintenance density by floor and wing
          </p>
        </div>

        {/* Block Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {(['Block A', 'Block B', 'Block C'] as const).map((blk) => (
            <button
              key={blk}
              onClick={() => setSelectedBlock(blk)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedBlock === blk
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {blk}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Grid inspired by the bottom-right panel of reference image */}
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/60 overflow-x-auto">
        <div className="min-w-[480px]">
          <div className="flex justify-between items-center mb-4 text-xs font-bold text-slate-700">
            <span>{selectedBlock}</span>
            <div className="flex items-center gap-8 pr-4">
              <span className="w-12 text-center">Room 1</span>
              <span className="w-12 text-center">Room 2</span>
              <span className="w-12 text-center">Room 3</span>
              <span className="w-12 text-center">Room 4</span>
            </div>
          </div>

          <div className="space-y-4">
            {floors.map((floor) => (
              <div key={floor} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-600 w-24">
                  {floor === 1 ? '1st Floor' : floor === 2 ? '2nd Floor' : floor === 3 ? '3rd Floor' : '4th Floor'}
                </span>

                <div className="flex items-center gap-8 pr-4">
                  {roomSlots.map((slot) => {
                    const info = getRoomSeverity(selectedBlock, floor, slot);
                    let dotColor = 'bg-emerald-500';
                    let ringColor = 'hover:ring-emerald-200';

                    if (info.severity === 'HIGH') {
                      dotColor = 'bg-rose-500 animate-pulse';
                      ringColor = 'hover:ring-rose-200';
                    } else if (info.severity === 'MEDIUM') {
                      dotColor = 'bg-amber-500';
                      ringColor = 'hover:ring-amber-200';
                    }

                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedRoomNumber(info.roomNum)}
                        className={`w-12 flex flex-col items-center justify-center p-1.5 rounded-lg hover:bg-slate-50 hover:ring-2 ${ringColor} transition-all cursor-pointer group`}
                        title={`${info.roomNum}: ${info.count} open issues`}
                      >
                        <span className={`w-4 h-4 rounded-full ${dotColor} mb-1 shadow-xs`} />
                        <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-900">
                          {info.roomNum}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-200 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-slate-600 font-medium">High Severity Issue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-600 font-medium">Medium Severity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-600 font-medium">Low / All Clear</span>
            </div>
          </div>
        </div>
      </div>

      {/* Room Detail Modal on Click */}
      {selectedRoomDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Room {selectedRoomDetails.roomNum} Diagnostics
                </h3>
                <p className="text-xs text-slate-500">
                  Occupancy: {selectedRoomDetails.room?.occupancy || 0}/{selectedRoomDetails.room?.capacity || 2} • {selectedRoomDetails.room?.type || 'Double'}
                </p>
              </div>
              <button
                onClick={() => setSelectedRoomNumber(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 overflow-y-auto space-y-3 flex-1 text-xs">
              <h4 className="font-bold text-slate-800">
                Complaints History ({selectedRoomDetails.complaints.length})
              </h4>
              {selectedRoomDetails.complaints.length === 0 ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No maintenance defects reported for this room.</span>
                </div>
              ) : (
                selectedRoomDetails.complaints.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{c.title}</span>
                      <span className="text-[10px] uppercase font-bold text-rose-600">{c.priority}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">{c.description}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Status: {c.status}</span>
                      <span>SLA: {c.slaHoursTotal}h total</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setSelectedRoomNumber(null)}
              className="mt-2 w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
