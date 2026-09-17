import React, { useState } from 'react';
import { store } from '../../services/store';
import { Student } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Users,
  Search,
  UserPlus,
  Phone,
  Mail,
  GraduationCap,
  DoorClosed,
  MoreVertical,
  X,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock,
} from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [blockFilter, setBlockFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    studentId: 'STU-' + Math.floor(1000 + Math.random() * 9000),
    name: '',
    email: '',
    phone: '',
    gender: 'Female' as const,
    course: 'B.Tech',
    year: '2nd Year',
    department: 'Computer Science',
    block: 'Block A',
    roomNumber: 'A103',
    guardianName: '',
    guardianPhone: '',
    bloodGroup: 'B+',
  });

  const students = store.students.filter((s) => {
    const roomStr = s.roomNumber || s.room || '';
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roomStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm);

    const matchesBlock = blockFilter === 'ALL' || s.block === blockFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;

    return matchesSearch && matchesBlock && matchesStatus;
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name.trim() || !newStudent.phone.trim()) {
      store.showToast('error', 'Name and phone are required');
      return;
    }

    store.addStudent({
      ...newStudent,
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      attendancePercentage: 100,
    });

    setIsAddModalOpen(false);
    // Reset
    setNewStudent({
      studentId: 'STU-' + Math.floor(1000 + Math.random() * 9000),
      name: '',
      email: '',
      phone: '',
      gender: 'Female',
      course: 'B.Tech',
      year: '2nd Year',
      department: 'Computer Science',
      block: 'Block A',
      roomNumber: 'A103',
      guardianName: '',
      guardianPhone: '',
      bloodGroup: 'B+',
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Hostel Resident Directory</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student registrations, room assignments, and resident profiles
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student, ID, room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 w-44 sm:w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Block filter */}
          <select
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
          >
            <option value="ALL">All Blocks</option>
            <option value="Block A">Block A</option>
            <option value="Block B">Block B</option>
            <option value="Block C">Block C</option>
          </select>

          {/* Add Student Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Student List Table */}
      <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Room / Block</th>
              <th className="py-3 px-4">Course & Dept</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Attendance</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {students.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No students found matching search criteria.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                >
                  {/* Name + ID + Photo */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={student.photoUrl || student.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                        alt={student.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{student.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{student.studentId}</span>
                      </div>
                    </div>
                  </td>

                  {/* Room / Block */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-800 font-mono text-xs">
                      {student.roomNumber || student.room}
                    </span>
                    <span className="text-[10px] text-slate-500 block">{student.block}</span>
                  </td>

                  {/* Course & Dept */}
                  <td className="py-3 px-4">
                    <span className="text-slate-800 font-semibold block">{student.department}</span>
                    <span className="text-[10px] text-slate-500">{student.course} • {student.year}</span>
                  </td>

                  {/* Contact */}
                  <td className="py-3 px-4">
                    <span className="text-slate-700 block">{student.phone}</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[140px] block">{student.email}</span>
                  </td>

                  {/* Attendance */}
                  <td className="py-3 px-4">
                    {(() => {
                      const att = student.attendancePercentage ?? student.attendanceRate ?? 90;
                      return (
                        <span
                          className={`font-bold font-mono ${
                            att >= 90
                              ? 'text-emerald-600'
                              : att >= 75
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {att}%
                        </span>
                      );
                    })()}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <StatusBadge status={student.status} />
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudent(student);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudent.photoUrl}
                  alt={selectedStudent.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedStudent.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedStudent.studentId} • {selectedStudent.department}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Room Assigned</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {selectedStudent.roomNumber} ({selectedStudent.block})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Hostel Attendance</span>
                  <span className="font-bold text-emerald-600 text-sm">
                    {selectedStudent.attendancePercentage}% Verified
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Contact</span>
                  <span className="font-semibold text-slate-800">{selectedStudent.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Blood Group</span>
                  <span className="font-semibold text-rose-600">{selectedStudent.bloodGroup}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2">Emergency Guardian Information</h4>
                <div className="p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Guardian Name:</span>
                    <span className="font-bold text-slate-800">{selectedStudent.guardianName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Emergency Contact:</span>
                    <span className="font-bold text-blue-700">{selectedStudent.guardianPhone}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2">Recent Outpasses & Permissions</h4>
                {store.outpasses.filter((o) => o.studentId === selectedStudent.id).length === 0 ? (
                  <p className="text-slate-400 text-xs italic">No outpasses requested recently.</p>
                ) : (
                  store.outpasses
                    .filter((o) => o.studentId === selectedStudent.id)
                    .map((o) => (
                      <div key={o.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 mb-2 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-800">{o.destination}</span>
                          <span className="text-[10px] text-slate-500 block">{o.fromDateTime} to {o.toDateTime}</span>
                        </div>
                        <StatusBadge status={o.status} />
                      </div>
                    ))
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Register New Student</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="p-6 overflow-y-auto space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    placeholder="e.g. Sneha Patel"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student ID</label>
                  <input
                    type="text"
                    required
                    value={newStudent.studentId}
                    onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    placeholder="student@hostel.edu"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value as any })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Block</label>
                  <select
                    value={newStudent.block}
                    onChange={(e) => setNewStudent({ ...newStudent, block: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room #</label>
                  <input
                    type="text"
                    value={newStudent.roomNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, roomNumber: e.target.value })}
                    placeholder="A103"
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Guardian Name</label>
                  <input
                    type="text"
                    value={newStudent.guardianName}
                    onChange={(e) => setNewStudent({ ...newStudent, guardianName: e.target.value })}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Guardian Phone</label>
                  <input
                    type="tel"
                    value={newStudent.guardianPhone}
                    onChange={(e) => setNewStudent({ ...newStudent, guardianPhone: e.target.value })}
                    placeholder="+91 9440123456"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  Register Resident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
