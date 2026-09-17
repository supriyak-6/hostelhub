import React, { useState } from 'react';
import { store } from '../../services/store';
import { X, Ticket, Calendar, MapPin, FileText } from 'lucide-react';

interface OutpassRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OutpassRequestModal: React.FC<OutpassRequestModalProps> = ({ isOpen, onClose }) => {
  const [fromDateTime, setFromDateTime] = useState('2026-09-20T16:00');
  const [toDateTime, setToDateTime] = useState('2026-09-22T19:00');
  const [destination, setDestination] = useState('Home');
  const [reason, setReason] = useState('Family function and wedding ceremony');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !reason.trim()) {
      store.showToast('error', 'Please fill in destination and reason');
      return;
    }

    if (new Date(toDateTime) <= new Date(fromDateTime)) {
      store.showToast('error', 'Return time must be after departure time');
      return;
    }

    store.requestOutpass({
      fromDateTime,
      toDateTime,
      destination,
      reason,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Outpass Request</h3>
            <p className="text-xs text-slate-500">Apply for campus exit permission</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">From</label>
              <input
                type="datetime-local"
                value={fromDateTime}
                onChange={(e) => setFromDateTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">To</label>
              <input
                type="datetime-local"
                value={toDateTime}
                onChange={(e) => setToDateTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Destination</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Home, Market, Hospital"
                required
              />
              <select
                onChange={(e) => setDestination(e.target.value)}
                className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-700 font-medium"
              >
                <option value="Home">Home</option>
                <option value="City Market">Market</option>
                <option value="Medical Hospital">Hospital</option>
                <option value="Library">Library</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Reason</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none leading-relaxed"
              placeholder="e.g. Family function, doctor appointment..."
              required
            />
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-[11px] text-blue-800 leading-relaxed">
            Upon Warden approval, a verifiable digital QR code will be generated. Security will scan this QR at gate exit & return.
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
