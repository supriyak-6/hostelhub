import React, { useState } from 'react';
import { store } from '../../services/store';
import { Megaphone, PlusCircle, Pin, Calendar, User, Send, X } from 'lucide-react';

export const AnnouncementsView: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'URGENT' | 'GENERAL' | 'MAINTENANCE' | 'EVENT'>('GENERAL');
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'BLOCK_A' | 'BLOCK_B' | 'BLOCK_C'>('ALL');

  const announcements = store.announcements;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    store.postAnnouncement({
      title,
      content,
      category,
      targetAudience,
    });

    setIsCreateOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Hostel Notice Board</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast emergency advisories, mess notifications, and hostel circulars
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Post Announcement</span>
        </button>
      </div>

      {/* Announcements Feed */}
      <div className="space-y-3">
        {announcements.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition-all ${
              item.isPinned
                ? 'bg-blue-50/30 border-blue-200 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {item.isPinned && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    <Pin className="w-2.5 h-2.5" /> PINNED
                  </span>
                )}
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    item.category === 'URGENT'
                      ? 'bg-rose-100 text-rose-700'
                      : item.category === 'MAINTENANCE'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.category}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Audience: {item.targetAudience === 'ALL' ? 'All Residents' : item.targetAudience}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">{item.postedAt}</span>
            </div>

            <h4 className="font-extrabold text-slate-900 text-sm mb-1">{item.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{item.content}</p>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Author: <strong>{item.postedBy}</strong></span>
              <span className="text-blue-600 font-medium">Broadcasted to student applets</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Broadcast Announcement</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Water Tank Cleaning Schedule"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="GENERAL">General Notice</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="URGENT">Urgent Advisory</option>
                    <option value="EVENT">Event / Festival</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="ALL">All Blocks</option>
                    <option value="BLOCK_A">Block A Only</option>
                    <option value="BLOCK_B">Block B Only</option>
                    <option value="BLOCK_C">Block C Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Announcement Details</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write message for residents..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
