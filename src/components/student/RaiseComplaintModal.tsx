import React, { useState } from 'react';
import { store } from '../../services/store';
import { ComplaintCategory, PriorityLevel } from '../../types';
import { X, Upload, Camera, AlertCircle, Sparkles } from 'lucide-react';

interface RaiseComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RaiseComplaintModal: React.FC<RaiseComplaintModalProps> = ({ isOpen, onClose }) => {
  const currentUser = store.currentUser;
  const [category, setCategory] = useState<ComplaintCategory>('Electrical');
  const [location, setLocation] = useState(`${currentUser.block || 'Block A'} • 3rd Floor • Room ${currentUser.room || 'A302'}`);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('MEDIUM');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80');

  if (!isOpen) return null;

  const categories: ComplaintCategory[] = [
    'Electrical',
    'Plumbing',
    'Cleaning',
    'Water',
    'AC',
    'Furniture',
    'Internet',
    'Security',
    'Other',
  ];

  const samplePhotoPresets = [
    { label: 'Ceiling Fan', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80' },
    { label: 'Water Leak', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80' },
    { label: 'Desk Light', url: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=500&auto=format&fit=crop&q=80' },
    { label: 'AC Unit', url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500&auto=format&fit=crop&q=80' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      store.showToast('error', 'Please fill in all required fields');
      return;
    }

    store.raiseComplaint({
      category,
      title,
      description,
      location,
      priority,
      photoUrl,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Raise Complaint</h3>
            <p className="text-xs text-slate-500">Submit maintenance issue for quick SLA resolution</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Block A • Floor 3 • Room A302"
              required
            />
          </div>

          {/* Issue Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Issue Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Fan not working properly"
              required
            />
          </div>

          {/* Issue Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Issue Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none leading-relaxed"
              placeholder="Describe the issue in detail (noise, sparks, leaks, duration)..."
              required
            />
          </div>

          {/* Photo Upload & Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Upload Photo</label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
                {photoUrl ? (
                  <img src={photoUrl} alt="Complaint preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <span className="text-[11px] text-slate-500 block">
                  Select sample image proof or upload snapshot:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {samplePhotoPresets.map((p) => (
                    <button
                      type="button"
                      key={p.label}
                      onClick={() => setPhotoUrl(p.url)}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold border transition-colors ${
                        photoUrl === p.url
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Priority & SLA</label>
            <div className="grid grid-cols-4 gap-2">
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as PriorityLevel[]).map((p) => {
                const isSelected = priority === p;
                const slaText = p === 'CRITICAL' ? '2h SLA' : p === 'HIGH' ? '6h SLA' : p === 'MEDIUM' ? '24h SLA' : '48h SLA';
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`py-2 px-1 rounded-xl text-center border font-semibold transition-all ${
                      isSelected
                        ? p === 'CRITICAL' || p === 'HIGH'
                          ? 'bg-red-50 text-red-700 border-red-300 ring-1 ring-red-400'
                          : 'bg-blue-50 text-blue-700 border-blue-300 ring-1 ring-blue-400'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-xs">{p}</span>
                    <span className="text-[10px] opacity-75 font-normal">{slaText}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
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
              Submit Complaint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
