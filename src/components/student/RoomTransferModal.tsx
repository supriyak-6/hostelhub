import React, { useState } from 'react';
import { store } from '../../services/store';
import { X, ArrowRightLeft, Building2 } from 'lucide-react';

interface RoomTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoomTransferModal: React.FC<RoomTransferModalProps> = ({ isOpen, onClose }) => {
  const currentUser = store.currentUser;
  const [requestedRoom, setRequestedRoom] = useState('B204');
  const [requestedBlock, setRequestedBlock] = useState('Block B');
  const [reason, setReason] = useState('Roommate issue');
  const [additionalNote, setAdditionalNote] = useState('I would like to transfer due to study schedule and sleep cycle differences.');

  if (!isOpen) return null;

  // Filter available rooms with vacancy
  const availableRooms = store.rooms.filter((r) => r.occupancy < r.capacity && r.roomNumber !== (currentUser.room || 'A302'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.requestRoomTransfer({
      requestedRoom,
      requestedBlock,
      reason,
      additionalNote,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Room Transfer</h3>
            <p className="text-xs text-slate-500">Request reallocation to another room/block</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Room</label>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm">{currentUser.room || 'A302'} ({currentUser.block || 'Block A'})</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">Current</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Requested Room & Block</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={requestedBlock}
                onChange={(e) => setRequestedBlock(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="Block A">Block A (Girls)</option>
                <option value="Block B">Block B (Girls)</option>
                <option value="Block C">Block C (Boys)</option>
              </select>

              <select
                value={requestedRoom}
                onChange={(e) => setRequestedRoom(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="B204">B204 (1 Vacancy)</option>
                <option value="A103">A103 (1 Vacancy)</option>
                <option value="A104">A104 (2 Vacancies)</option>
                <option value="A403">A403 (2 Vacancies)</option>
                <option value="C101">C101 (1 Vacancy)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="Roommate issue">Roommate issue</option>
              <option value="Medical condition / Ground floor needed">Medical condition / Ground floor needed</option>
              <option value="Academics / Quiet study wing required">Academics / Quiet study wing required</option>
              <option value="AC room upgrade">AC room upgrade</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Additional Note</label>
            <textarea
              rows={3}
              value={additionalNote}
              onChange={(e) => setAdditionalNote(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none leading-relaxed"
              placeholder="Provide context for the Warden..."
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
