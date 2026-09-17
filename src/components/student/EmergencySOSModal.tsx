import React, { useState } from 'react';
import { store } from '../../services/store';
import { EmergencyType } from '../../types';
import { X, Flame, Stethoscope, ShieldAlert, Zap, AlertTriangle, AlertOctagon } from 'lucide-react';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState<EmergencyType>('Fire');
  const [customMessage, setCustomMessage] = useState('');
  const [isTriggered, setIsTriggered] = useState(false);

  if (!isOpen) return null;

  const types: { type: EmergencyType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { type: 'Fire', label: 'Fire', icon: Flame },
    { type: 'Medical', label: 'Medical', icon: Stethoscope },
    { type: 'Security', label: 'Security', icon: ShieldAlert },
    { type: 'Electrical', label: 'Electrical', icon: Zap },
    { type: 'Other', label: 'Other', icon: AlertTriangle },
  ];

  const handleTriggerSOS = () => {
    store.triggerEmergencySOS({
      emergencyType: selectedType,
      message: customMessage || `${selectedType} emergency initiated from Room ${store.currentUser.room || 'A302'}.`,
    });
    setIsTriggered(true);
    setTimeout(() => {
      setIsTriggered(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-red-200 overflow-hidden flex flex-col text-center animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-rose-600 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-white" />
            <h3 className="font-bold text-base">Emergency SOS</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-rose-200 hover:text-white hover:bg-rose-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          {/* Glowing SOS Button */}
          <div className="my-3 relative flex items-center justify-center">
            <div className="absolute w-36 h-36 rounded-full bg-rose-500/20 animate-ping" />
            <div className="absolute w-32 h-32 rounded-full bg-rose-500/30 animate-pulse" />
            <button
              onClick={handleTriggerSOS}
              disabled={isTriggered}
              className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center font-extrabold text-2xl text-white shadow-xl transition-transform active:scale-95 ${
                isTriggered
                  ? 'bg-emerald-600 scale-105'
                  : 'bg-gradient-to-tr from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600 ring-4 ring-rose-200 shadow-rose-600/40'
              }`}
            >
              <span>{isTriggered ? 'SENT!' : 'SOS'}</span>
              <span className="text-[10px] font-medium opacity-80 uppercase tracking-widest mt-0.5">
                {isTriggered ? 'Alerted' : 'Press Now'}
              </span>
            </button>
          </div>

          <p className="text-xs text-slate-500 font-semibold mb-3">Select Emergency Type</p>

          {/* Types Selection */}
          <div className="grid grid-cols-2 gap-2 w-full mb-4">
            {types.map((t) => {
              const Icon = t.icon;
              const isSelected = selectedType === t.type;
              return (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => setSelectedType(t.type)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-rose-50 border-rose-300 text-rose-800 ring-1 ring-rose-400'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-rose-600' : 'text-slate-500'}`} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Additional details */}
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Brief info (optional e.g. 3rd floor west wing)"
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 leading-snug w-full">
            Your location will be shared automatically with the warden, campus security, and campus medical unit.
          </div>
        </div>
      </div>
    </div>
  );
};
