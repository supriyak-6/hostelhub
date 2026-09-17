import React, { useState } from 'react';
import { store } from '../../services/store';
import { X, UtensilsCrossed, Check, Clock, Users, Moon, Sun, Coffee } from 'lucide-react';

interface MessViewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessViewModal: React.FC<MessViewModalProps> = ({ isOpen, onClose }) => {
  const mess = store.messData;
  const [dinnerAttending, setDinnerAttending] = useState(true);

  if (!isOpen) return null;

  const toggleAttendance = () => {
    const newState = !dinnerAttending;
    setDinnerAttending(newState);
    if (newState) {
      store.messData.dinnerExpected += 1;
      store.showToast('success', 'Dinner attendance confirmed', 'Marked present for tonight');
    } else {
      store.messData.dinnerExpected -= 1;
      store.showToast('info', 'Dinner opted out', 'Helpful in minimizing mess wastage');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Mess Attendance & Menu</h3>
              <p className="text-xs text-slate-500">NN Campus Dining Hall</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Today's Expected Count Card inspired by screenshot */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">
              Today's Expected Count
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <Coffee className="w-4 h-4 text-amber-600" /> Breakfast
                </span>
                <span className="font-bold text-slate-900 text-sm font-mono">{mess.breakfastExpected}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <Sun className="w-4 h-4 text-orange-500" /> Lunch
                </span>
                <span className="font-bold text-slate-900 text-sm font-mono">{mess.lunchExpected}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <Moon className="w-4 h-4 text-indigo-600" /> Dinner
                </span>
                <span className="font-bold text-slate-900 text-sm font-mono">{mess.dinnerExpected}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-200/60 grid grid-cols-3 text-center">
              <div>
                <span className="text-[10px] text-slate-500 block">Total Residents</span>
                <span className="font-bold text-slate-800 text-xs">{mess.totalResidents}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Currently Outside</span>
                <span className="font-bold text-amber-700 text-xs">{mess.currentlyOutside}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Expected Dinner</span>
                <span className="font-bold text-emerald-700 text-xs">{mess.dinnerExpected}</span>
              </div>
            </div>
          </div>

          {/* Student Dinner Toggle */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Attending Dinner Tonight?</span>
              <span className="text-[11px] text-slate-500">8:00 PM – 9:30 PM at Main Dining Hall</span>
            </div>
            <button
              onClick={toggleAttendance}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                dinnerAttending
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {dinnerAttending ? <Check className="w-3.5 h-3.5" /> : null}
              {dinnerAttending ? 'Attending' : 'Skipping'}
            </button>
          </div>

          {/* Menu Sections */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs">Today's Menu</h4>

            <div className="p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5 text-xs">
                <Coffee className="w-3.5 h-3.5 text-amber-600" /> Breakfast (7:30 AM - 9:30 AM)
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {mess.menu.breakfast.join(' • ')}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5 text-xs">
                <Sun className="w-3.5 h-3.5 text-orange-500" /> Lunch (12:30 PM - 2:30 PM)
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {mess.menu.lunch.join(' • ')}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5 text-xs">
                <Moon className="w-3.5 h-3.5 text-indigo-600" /> Dinner (8:00 PM - 10:00 PM)
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {mess.menu.dinner.join(' • ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
