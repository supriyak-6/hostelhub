import React, { useState, useEffect } from 'react';
import { store, ToastMessage } from './services/store';
import { authService } from './services/authService';
import { LoginPage } from './components/auth/LoginPage';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { StudentDashboard } from './components/student/StudentDashboard';
import { WardenShell } from './components/warden/WardenShell';
import { SecurityGateDesk } from './components/security/SecurityGateDesk';
import { MaintenanceWorkDesk } from './components/maintenance/MaintenanceWorkDesk';
import { AdminDashboard } from './components/admin/AdminDashboard';
import {
  Home,
  Grid,
  Bell,
  User,
} from 'lucide-react';

export default function App() {
  const [storeState, setStoreState] = useState(store.getState());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setStoreState(store.getState());
    });
    const unsubToast = store.subscribeToast((toast) => {
      setToasts((prev) => [...prev, toast]);
    });
    return () => {
      unsubscribe();
      unsubToast();
    };
  }, []);

  const currentUser = storeState.currentUser;
  const isAuthenticated = storeState.isAuthenticated && currentUser !== null;

  // When role changes, reset tab to dashboard
  useEffect(() => {
    setCurrentTab('dashboard');
  }, [currentUser?.role]);

  const handleLogout = () => {
    authService.logout();
    store.logout();
    setCurrentTab('dashboard');
  };

  // If not signed in, show professional login page with role selector
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans">
        <ToastContainer toasts={toasts} />
        <LoginPage
          onLoginSuccess={() => {
            setCurrentTab('dashboard');
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col md:flex-row min-h-screen overflow-x-hidden">
        {/* Role-adaptive Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          onSelectTab={(tab) => setCurrentTab(tab)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
          {/* Top Header */}
          <Header
            onLogout={handleLogout}
            onOpenNotifications={() => setCurrentTab('notifications')}
          />

          {/* Body Content by Role and Tab */}
          <main className="flex-1 overflow-y-auto pb-16 md:pb-8">
            {currentUser.role === 'STUDENT' && (
              <StudentDashboard currentTab={currentTab} onTabChange={setCurrentTab} />
            )}

            {currentUser.role === 'WARDEN' && (
              <WardenShell currentTab={currentTab} onTabChange={setCurrentTab} />
            )}

            {currentUser.role === 'SECURITY' && (
              <div className="max-w-7xl mx-auto px-4 py-6">
                <SecurityGateDesk />
              </div>
            )}

            {currentUser.role === 'MAINTENANCE' && (
              <div className="max-w-7xl mx-auto px-4 py-6">
                <MaintenanceWorkDesk />
              </div>
            )}

            {currentUser.role === 'ADMIN' && (
              <AdminDashboard />
            )}
          </main>

          {/* Student Mobile Bottom Bar Navigation */}
          {currentUser.role === 'STUDENT' && (
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around shadow-lg">
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                  currentTab === 'dashboard' ? 'text-blue-600' : 'text-slate-500'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
              <button
                onClick={() => setCurrentTab('complaints')}
                className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                  currentTab === 'complaints' ? 'text-blue-600' : 'text-slate-500'
                }`}
              >
                <Grid className="w-5 h-5" />
                <span>Complaints</span>
              </button>
              <button
                onClick={() => setCurrentTab('notifications')}
                className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                  currentTab === 'notifications' ? 'text-blue-600' : 'text-slate-500'
                }`}
              >
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  {storeState.notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
                  )}
                </div>
                <span>Notices</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex flex-col items-center gap-1 text-[10px] font-bold text-rose-500"
              >
                <User className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
