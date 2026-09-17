import React, { useState } from 'react';
import { store } from '../../services/store';
import { authService } from '../../services/authService';
import { SeedAccount } from '../../services/seedUsers';
import { StatusBadge } from '../common/StatusBadge';
import {
  Users,
  Building2,
  DoorClosed,
  Shield,
  FileText,
  Sliders,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Eye,
  Plus,
  BarChart3,
  RefreshCw,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'hostels' | 'rooms' | 'audit' | 'reports'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedUser, setSelectedUser] = useState<SeedAccount | null>(null);

  const allAccounts = authService.getAccounts();
  const stats = store.getStats();

  const filteredAccounts = allAccounts.filter((acc) => {
    const matchesSearch =
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || acc.role === roleFilter;
    const matchesStatus =
      statusFilter === 'ALL' || (statusFilter === 'ACTIVE' ? acc.isActive : !acc.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = (acc: SeedAccount) => {
    authService.toggleAccountStatus(acc.id);
    store.showToast(
      'info',
      'Account Status Updated',
      `${acc.id} (${acc.name}) is now ${!acc.isActive ? 'Active' : 'Inactive'}`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Admin Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">{allAccounts.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">100 per role active</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Hostel Blocks</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">{store.blocks.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Block A, B, C</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Occupancy</span>
            <DoorClosed className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono">{stats.occupancyRate}%</div>
          <div className="text-[11px] text-slate-500 mt-1">480 / 500 Residents</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Open Tickets</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono">{stats.pendingComplaints}</div>
          <div className="text-[11px] text-slate-500 mt-1">Active repair queue</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">SLA Met</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">94.8%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Within target SLA</div>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User Directory (500 Seeded Accounts)</span>
        </button>

        <button
          onClick={() => setActiveTab('hostels')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'hostels'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Hostels & Blocks</span>
        </button>

        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'rooms'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <DoorClosed className="w-3.5 h-3.5" />
          <span>Rooms & Allocations</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'audit'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>System Audit Trail</span>
        </button>
      </div>

      {/* TAB 1: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Campus User Management</h3>
              <p className="text-xs text-slate-500">
                100 accounts per role: Students, Wardens, Security, Maintenance, and Administrators
              </p>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Showing {filteredAccounts.length} of {allAccounts.length} accounts
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID (e.g. STU0001, WRD0001), Name, or Email..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
            >
              <option value="ALL">All Roles (500)</option>
              <option value="STUDENT">Students (100)</option>
              <option value="WARDEN">Wardens (100)</option>
              <option value="SECURITY">Security (100)</option>
              <option value="MAINTENANCE">Maintenance (100)</option>
              <option value="ADMIN">Admins (100)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Deactivated Only</option>
            </select>
          </div>

          {/* Accounts Table */}
          <div className="overflow-x-auto border border-slate-200/80 rounded-xl max-h-[500px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">User & Contact</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Assigned Location</th>
                  <th className="py-2.5 px-3">Account Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredAccounts.slice(0, 50).map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{acc.id}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-900 block">{acc.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{acc.email}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          acc.role === 'STUDENT'
                            ? 'bg-blue-100 text-blue-800'
                            : acc.role === 'WARDEN'
                            ? 'bg-purple-100 text-purple-800'
                            : acc.role === 'SECURITY'
                            ? 'bg-amber-100 text-amber-800'
                            : acc.role === 'MAINTENANCE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {acc.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {acc.room ? `Room ${acc.room} (${acc.block})` : acc.block || acc.specialization || 'Campus'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          acc.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {acc.isActive ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedUser(acc)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          title="View Profile Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(acc)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            acc.isActive
                              ? 'text-rose-600 hover:bg-rose-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={acc.isActive ? 'Deactivate Account' : 'Reactivate Account'}
                        >
                          {acc.isActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: HOSTELS */}
      {activeTab === 'hostels' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {store.blocks.map((block) => (
            <div key={block.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{block.name}</h4>
                  <span className="text-xs text-slate-500 font-semibold">{block.gender} Residence</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 font-mono">
                  {block.floors} Floors
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Total Capacity:</span>
                  <span className="font-bold font-mono text-slate-900">160 Beds</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Occupancy:</span>
                  <span className="font-bold font-mono text-emerald-600">95% Occupied</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Chief Warden:</span>
                  <span className="font-semibold text-slate-800">{block.wardenName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Warden Phone:</span>
                  <span className="font-mono text-slate-700">{block.wardenPhone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Security & Administrative Audit Log</h3>
              <p className="text-xs text-slate-500">Immutable ledger of all student, security, and warden actions</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {store.auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-slate-200/70 bg-slate-50/40 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-semibold">
                      {log.role}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{log.target}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">User Profile Record</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <img src={selectedUser.avatarUrl} alt="" className="w-14 h-14 rounded-2xl object-cover border" />
                <div>
                  <span className="font-extrabold text-slate-900 text-sm block">{selectedUser.name}</span>
                  <span className="font-mono text-blue-700 font-bold">{selectedUser.id}</span>
                  <span className="text-slate-500 block text-[11px]">{selectedUser.email}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200/80">
                <div className="flex justify-between">
                  <span className="text-slate-500">Role:</span>
                  <span className="font-bold">{selectedUser.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-mono">{selectedUser.phone}</span>
                </div>
                {selectedUser.room && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Room & Block:</span>
                    <span className="font-semibold">{selectedUser.room} ({selectedUser.block})</span>
                  </div>
                )}
                {selectedUser.department && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-semibold">{selectedUser.department}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Account Status:</span>
                  <span className={`font-bold ${selectedUser.isActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {selectedUser.isActive ? 'Active' : 'Deactivated'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
