import React, { useState } from 'react';
import { X, MapPin, Flame, ShieldAlert, Cross, Navigation, CheckCircle2 } from 'lucide-react';

interface EvacuationMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EvacuationMapModal: React.FC<EvacuationMapModalProps> = ({ isOpen, onClose }) => {
  const [selectedFloor, setSelectedFloor] = useState<number>(3);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Evacuation Map - Block A</h3>
            <p className="text-xs text-slate-500">Emergency exits and safety equipment routes</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Floor Switcher */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 pb-3">
          {[1, 2, 3, 4].map((floor) => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFloor === floor
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Floor {floor}
            </button>
          ))}
        </div>

        {/* Interactive Architectural Blueprint Diagram */}
        <div className="p-6 flex flex-col items-center">
          <div className="w-full h-64 bg-slate-900 rounded-2xl p-4 relative border border-slate-800 shadow-inner flex flex-col justify-between overflow-hidden">
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            />

            {/* Top Corridor / Rooms */}
            <div className="relative z-10 flex justify-between gap-2">
              <div className="flex-1 py-2 rounded-lg bg-slate-800 border border-slate-700 text-center text-[10px] font-mono text-slate-300">
                A{selectedFloor}01
              </div>
              <div
                className={`flex-1 py-2 rounded-lg border text-center text-[10px] font-mono relative ${
                  selectedFloor === 3
                    ? 'bg-blue-950 border-blue-500 text-blue-300 font-bold ring-2 ring-blue-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                A{selectedFloor}02
                {selectedFloor === 3 && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-blue-500 text-white text-[8px] font-sans font-bold flex items-center gap-0.5 shadow-sm">
                    <MapPin className="w-2.5 h-2.5" /> YOU
                  </span>
                )}
              </div>
              <div className="flex-1 py-2 rounded-lg bg-slate-800 border border-slate-700 text-center text-[10px] font-mono text-slate-300">
                A{selectedFloor}03
              </div>
              <div className="flex-1 py-2 rounded-lg bg-slate-800 border border-slate-700 text-center text-[10px] font-mono text-slate-300">
                A{selectedFloor}04
              </div>
            </div>

            {/* Central Corridor with Exit Paths & Equipments */}
            <div className="relative z-10 my-auto py-3 px-2 border-y border-dashed border-emerald-500/40 bg-emerald-950/20 rounded-lg flex items-center justify-between">
              {/* Emergency Staircase Left */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-[9px] font-bold">
                <Navigation className="w-3 h-3 -rotate-90" />
                <span>EXIT NORTH</span>
              </div>

              {/* Corridor Equipment Markers */}
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-[9px] text-rose-400 font-semibold bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded">
                  <Flame className="w-3 h-3 text-rose-500" /> Extinguisher
                </span>
                <span className="flex items-center gap-1 text-[9px] text-sky-400 font-semibold bg-sky-950/60 border border-sky-800/80 px-2 py-0.5 rounded">
                  <Cross className="w-3 h-3 text-sky-400" /> First Aid
                </span>
              </div>

              {/* Emergency Staircase Right */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-[9px] font-bold">
                <span>EXIT SOUTH</span>
                <Navigation className="w-3 h-3 rotate-90" />
              </div>
            </div>

            {/* Bottom Row / Balcony Wing */}
            <div className="relative z-10 flex justify-between gap-2">
              <div className="flex-1 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-center text-[10px] font-mono text-slate-400">
                Study Lounge
              </div>
              <div className="flex-1 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-center text-[10px] font-mono text-slate-400">
                Pantry
              </div>
              <div className="flex-1 py-2 rounded-lg bg-emerald-900/40 border border-emerald-600/50 text-center text-[10px] font-semibold text-emerald-300 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Assembly Point
              </div>
            </div>
          </div>

          {/* Legend inspired by screenshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-4 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Exit Route</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Fire Extinguisher</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span>First Aid</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>Assembly Point</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
