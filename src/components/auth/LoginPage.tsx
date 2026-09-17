import React, { useState } from 'react';
import { UserRole } from '../../types';
import { store } from '../../services/store';
import { getDatabaseConnectionStatus } from '../../services/firebaseService';
import {
  GraduationCap,
  Shield,
  ShieldCheck,
  Wrench,
  Sliders,
  Eye,
  EyeOff,
  Lock,
  User,
  Building2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Database,
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [identifier, setIdentifier] = useState('STU0001');
  const [password, setPassword] = useState('Demo@123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dbStatus = getDatabaseConnectionStatus();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    // Suggest corresponding default ID
    if (role === 'STUDENT') setIdentifier('STU0001');
    else if (role === 'WARDEN') setIdentifier('WRD0001');
    else if (role === 'SECURITY') setIdentifier('SEC0001');
    else if (role === 'MAINTENANCE') setIdentifier('MNT0001');
    else if (role === 'ADMIN') setIdentifier('ADM0001');
  };

  const handleQuickLogin = async (role: UserRole, id: string) => {
    setSelectedRole(role);
    setIdentifier(id);
    setPassword('Demo@123');
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await store.login(role, id, 'Demo@123');
      if (!result.success) {
        setErrorMessage(result.error || 'Authentication failed. Please check credentials.');
      } else {
        if (onLoginSuccess) onLoginSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await store.login(selectedRole, identifier, password);
      if (!result.success) {
        setErrorMessage(result.error || 'Authentication failed. Please check credentials.');
      } else {
        if (onLoginSuccess) onLoginSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const roles: { role: UserRole; label: string; icon: React.FC<any>; desc: string }[] = [
    { role: 'STUDENT', label: 'Student', icon: GraduationCap, desc: 'Residents & Hostellers' },
    { role: 'WARDEN', label: 'Warden', icon: Shield, desc: 'Hostel Administration' },
    { role: 'SECURITY', label: 'Security', icon: ShieldCheck, desc: 'Gate & Checkpost' },
    { role: 'MAINTENANCE', label: 'Maintenance', icon: Wrench, desc: 'Field Technicians' },
    { role: 'ADMIN', label: 'Admin', icon: Sliders, desc: 'Campus Residence IT' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col justify-between p-4 md:p-8 selection:bg-blue-500 selection:text-white">
      {/* Top Bar with Connection Status */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between py-2 text-xs">
        <div className="flex items-center gap-2 text-white/80">
          <Building2 className="w-5 h-5 text-blue-400" />
          <span className="font-extrabold tracking-tight text-white text-base">HostelHub</span>
          <span className="hidden sm:inline text-white/40">|</span>
          <span className="hidden sm:inline text-white/60">Smart Residence & Campus Living</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300 backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Database className="w-3 h-3 text-emerald-400" />
          <span className="font-medium">{dbStatus.label}</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-xl w-full mx-auto my-auto bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col">
        {/* Card Header */}
        <div className="bg-gradient-to-b from-slate-50 to-white px-8 pt-8 pb-4 text-center border-b border-slate-100">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">HostelHub</h1>
          <p className="text-xs text-slate-500 mt-1">Smart Hostel & Student Residence Management</p>
          <p className="text-sm font-semibold text-blue-600 mt-2">Sign in to continue</p>
        </div>

        {/* Step 1: Role Selector */}
        <div className="px-6 pt-5 pb-3">
          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
            1. Select Your Role
          </label>
          <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
            {roles.map(({ role, label, icon: Icon }) => {
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
                  className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-blue-600 shadow-md font-bold scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span className="text-[11px] leading-tight truncate">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Role Status & 1-Click Quick Enter */}
          <div className="mt-2.5 px-3 py-2 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
            <div className="text-[11px] text-slate-700">
              <span className="text-slate-500">Selected Role: </span>
              <strong className="text-blue-700 font-bold">
                {roles.find((r) => r.role === selectedRole)?.label}
              </strong>
              <span className="hidden sm:inline text-slate-400"> • </span>
              <span className="hidden sm:inline font-mono text-[10px] text-slate-500">{identifier}</span>
            </div>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickLogin(selectedRole, identifier)}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-[11px] shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
              title={`Instantly sign in as ${roles.find((r) => r.role === selectedRole)?.label}`}
            >
              <span>Instant Sign In</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </button>
          </div>
        </div>

        {/* Step 2: Credentials Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-6 pt-2 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Authentication Error</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {selectedRole === 'STUDENT'
                ? 'Student ID or Email Address'
                : `${roles.find((r) => r.role === selectedRole)?.label} ID or Email`}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setErrorMessage('');
                }}
                placeholder={
                  selectedRole === 'STUDENT'
                    ? 'e.g. STU0001 or student1@hostelhub.demo'
                    : selectedRole === 'WARDEN'
                    ? 'e.g. WRD0001 or warden1@hostelhub.demo'
                    : selectedRole === 'SECURITY'
                    ? 'e.g. SEC0001 or security1@hostelhub.demo'
                    : selectedRole === 'MAINTENANCE'
                    ? 'e.g. MNT0001 or maintenance1@hostelhub.demo'
                    : 'e.g. ADM0001 or admin1@hostelhub.demo'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Supports both <strong>Unique ID</strong> (e.g. {selectedRole.substring(0, 3)}0001) or <strong>Email</strong>
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => {
                  store.showToast('info', 'Demo Password Reminder', 'All 500 demo accounts use password: Demo@123');
                }}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Enter account password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating with Database...</span>
              </>
            ) : (
              <>
                <span>Sign In as {roles.find((r) => r.role === selectedRole)?.label}</span>
              </>
            )}
          </button>

          {/* Quick Demo Autofill Chips for Evaluators */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Demo Logins for Hackathon Evaluators:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('STUDENT', 'STU0001')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                title="Immediately login as Student Divya Sharma"
              >
                Student: Divya (A302) ⚡
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('WARDEN', 'WRD0001')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors"
                title="Immediately login as Chief Warden Dr. Rajesh Kumar"
              >
                Warden: Dr. Rajesh ⚡
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('SECURITY', 'SEC0001')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                title="Immediately login as Head Security Vikram Singh"
              >
                Security: Vikram ⚡
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('MAINTENANCE', 'MNT0001')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors"
                title="Immediately login as Maintenance Technician Ramesh Kumar"
              >
                Maintenance: Ramesh ⚡
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN', 'ADM0001')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 transition-colors"
                title="Immediately login as Chief Administrator Sunita Rao"
              >
                Admin: Sunita Rao ⚡
              </button>
            </div>
          </div>
        </form>

        {/* Card Footer */}
        <div className="bg-slate-50 px-8 py-3 border-t border-slate-100 text-center text-[11px] text-slate-500">
          <span>500 seeded active users (STU0001-STU0100, WRD0001-WRD0100, etc.) • Password: </span>
          <code className="bg-slate-200/70 px-1 py-0.5 rounded font-mono font-bold text-slate-800">Demo@123</code>
        </div>
      </div>

      {/* Page Footer */}
      <div className="max-w-5xl w-full mx-auto text-center text-[11px] text-white/40 py-4">
        HostelHub Enterprise Platform • Compliant with Firebase Authentication & Firestore Security Rules
      </div>
    </div>
  );
};
