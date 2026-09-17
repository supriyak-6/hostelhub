import React, { useState } from 'react';
import { store } from '../../services/store';
import { CalendarCheck, Search, Users, Check, X, Clock, Moon, ShieldCheck } from 'lucide-react';

export const AttendanceOverview: React.FC = () => {
  const [selectedBlock, setSelectedBlock] = useState('Block A');
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState('2026-09-16');

  const students = store.students.filter((s) => {
    const matchesBlock = selectedBlock === 'ALL' || s.block === selectedBlock;
    const roomStr = s.roomNumber || s.room || '';
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roomStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBlock && matchesSearch;
  });

  const [studentStatus, setStudentStatus] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'OUTPASS'>>({
    usr_student_divya: 'PRESENT',
    usr_student_ananya: 'PRESENT',
    usr_student_rohit: 'PRESENT',
    usr_student_priya: 'OUTPASS',
  });

  const toggleStatus = (id: string, status: 'PRESENT' | 'ABSENT' | 'OUTPASS') => {
    setStudentStatus((prev) => ({ ...prev, [id]: status }));
    store.showToast('info', 'Attendance Updated', `Marked as ${status}`);
  };

  const presentCount = Object.values(studentStatus).filter((s) => s === 'PRESENT').length;
  const outpassCount = Object.values(studentStatus).filter((s) => s === 'OUTPASS').length;
  const absentCount = Object.values(studentStatus).filter((s) => s === 'ABSENT').length;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Night Attendance & Roll Call</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily 9:30 PM biometric and warden roll-call audit
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium"
          />

          <select
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium"
          >
            <option value="ALL">All Blocks</option>
            <option value="Block A">Block A</option>
            <option value="Block B">Block B</option>
            <option value="Block C">Block C</option>
          </select>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 text-center">
          <span className="text-[10px] uppercase font-bold text-emerald-700">Present in Hostel</span>
          <span className="text-2xl font-extrabold text-emerald-700 block font-mono mt-0.5">
            485 (93%)
          </span>
        </div>
        <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 text-center">
          <span className="text-[10px] uppercase font-bold text-amber-700">On Authorized Leave</span>
          <span className="text-2xl font-extrabold text-amber-700 block font-mono mt-0.5">
            32 (6%)
          </span>
        </div>
        <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 text-center">
          <span className="text-[10px] uppercase font-bold text-rose-700">Unaccounted / Absent</span>
          <span className="text-2xl font-extrabold text-rose-700 block font-mono mt-0.5">
            3 (0.6%)
          </span>
        </div>
      </div>

      {/* Student roll list */}
      <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Room</th>
              <th className="py-3 px-4">Block</th>
              <th className="py-3 px-4">Monthly Rate</th>
              <th className="py-3 px-4 text-center">Roll Call Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {students.map((s) => {
              const status = studentStatus[s.id] || 'PRESENT';

              return (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{s.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{s.studentId}</span>
                  </td>
                  <td className="py-3 px-4 font-bold font-mono">{s.roomNumber || s.room}</td>
                  <td className="py-3 px-4 text-slate-600">{s.block}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600">
                    {s.attendancePercentage ?? s.attendanceRate}%
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => toggleStatus(s.id, 'PRESENT')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          status === 'PRESENT'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => toggleStatus(s.id, 'OUTPASS')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          status === 'OUTPASS'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Outpass
                      </button>
                      <button
                        onClick={() => toggleStatus(s.id, 'ABSENT')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          status === 'ABSENT'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
