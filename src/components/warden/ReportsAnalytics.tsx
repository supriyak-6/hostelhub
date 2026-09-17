import React from 'react';
import { store } from '../../services/store';
import { BarChart3, TrendingUp, CheckCircle, Clock, Utensils, Shield, Award } from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const stats = store.getStats();

  const categoryBreakdown = [
    { label: 'Electrical', count: 42, percentage: 38, color: '#3b82f6' },
    { label: 'Plumbing & Water', count: 28, percentage: 25, color: '#06b6d4' },
    { label: 'Cleaning & Hygiene', count: 18, percentage: 16, color: '#10b981' },
    { label: 'Internet / WiFi', count: 14, percentage: 13, color: '#8b5cf6' },
    { label: 'Civil & Furniture', count: 9, percentage: 8, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">SLA Compliance</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-mono">
            94.6%
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Within promised deadlines
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Resolution</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            4.2 hrs
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            -1.8 hrs from last month
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Mess Food Saved</span>
            <Utensils className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 font-mono">
            -23%
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Reduced dining wastage
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Student CSAT</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            4.8 / 5
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            98% satisfaction rating
          </div>
        </div>
      </div>

      {/* Breakdown grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Complaints by Category</h3>
            <span className="text-xs text-slate-400 font-mono">111 Tickets This Month</span>
          </div>

          <div className="space-y-3">
            {categoryBreakdown.map((cat) => (
              <div key={cat.label} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{cat.label}</span>
                  <span className="font-mono text-slate-500">
                    {cat.count} issues ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Block Occupancy & Capacity Analysis */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Hostel Block Capacity</h3>
            <span className="text-xs text-slate-400 font-mono">Total 500 Capacity</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>Block A (Women's Wing)</span>
                <span className="text-emerald-700 font-mono">192 / 200 (96%)</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '96%' }} />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">8 Vacancies remaining</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>Block B (Senior Women's Wing)</span>
                <span className="text-blue-700 font-mono">140 / 150 (93%)</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '93%' }} />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">10 Vacancies remaining</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>Block C (Men's Wing)</span>
                <span className="text-indigo-700 font-mono">136 / 150 (91%)</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '91%' }} />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">14 Vacancies remaining</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
