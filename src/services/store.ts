import {
  UserProfile,
  UserRole,
  PriorityLevel,
  ComplaintCategory,
  EmergencyType,
  Student,
  Room,
  HostelBlock,
  Complaint,
  MaintenanceTask,
  Visitor,
  Outpass,
  RoomTransferRequest,
  EmergencyAlert,
  MessAttendanceData,
  HostelAnnouncement,
  AppNotification,
  AuditLogEntry,
  AttendanceRecord,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_BLOCKS,
  INITIAL_ROOMS,
  INITIAL_STUDENTS,
  INITIAL_COMPLAINTS,
  INITIAL_MAINTENANCE_TASKS,
  INITIAL_VISITORS,
  INITIAL_OUTPASSES,
  INITIAL_ROOM_TRANSFERS,
  INITIAL_EMERGENCIES,
  INITIAL_MESS_DATA,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from './mockData';
import { generateSeedData, DatabaseUser, StaffMember } from './seedData';

const STORAGE_KEY = 'hostelhub_state_v1';
const AUTH_SESSION_KEY = 'hostelhub_auth_session';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

type Listener = () => void;
type ToastListener = (toast: ToastMessage) => void;

const SEED = generateSeedData();

class HostelStore {
  public isAuthenticated: boolean = false;
  public currentUser: UserProfile | null = null;
  public users: DatabaseUser[] = SEED.users;
  public staff: StaffMember[] = SEED.staff;
  public blocks: HostelBlock[] = INITIAL_BLOCKS;
  public rooms: Room[] = SEED.rooms.length > 0 ? SEED.rooms : INITIAL_ROOMS;
  public students: Student[] = SEED.students.length > 0 ? SEED.students : INITIAL_STUDENTS;
  public complaints: Complaint[] = SEED.complaints;
  public maintenanceTasks: MaintenanceTask[] = SEED.maintenanceTasks;
  public visitors: Visitor[] = SEED.visitors;
  public outpasses: Outpass[] = SEED.outpasses;
  public roomTransfers: RoomTransferRequest[] = INITIAL_ROOM_TRANSFERS;
  public emergencies: EmergencyAlert[] = SEED.emergencies;
  public messData: MessAttendanceData = INITIAL_MESS_DATA;
  public announcements: HostelAnnouncement[] = SEED.announcements;
  public notifications: AppNotification[] = SEED.notifications;
  public attendanceRecords: AttendanceRecord[] = SEED.attendanceRecords || [];
  public auditLogs: AuditLogEntry[] = SEED.auditLogs;

  private listeners: Set<Listener> = new Set();
  private toastListeners: Set<ToastListener> = new Set();

  constructor() {
    this.loadFromStorage();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          this.loadFromStorage();
          this.listeners.forEach((l) => l());
        }
      });
    }
  }

  private loadFromStorage() {
    try {
      // 1. Check persistent state
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.rooms && parsed.rooms.length > 0) this.rooms = parsed.rooms;
        if (parsed.students && parsed.students.length > 0) this.students = parsed.students;
        if (parsed.complaints) this.complaints = parsed.complaints;
        if (parsed.maintenanceTasks) this.maintenanceTasks = parsed.maintenanceTasks;
        if (parsed.visitors) this.visitors = parsed.visitors;
        if (parsed.outpasses) this.outpasses = parsed.outpasses;
        if (parsed.roomTransfers) this.roomTransfers = parsed.roomTransfers;
        if (parsed.emergencies) this.emergencies = parsed.emergencies;
        if (parsed.messData) this.messData = parsed.messData;
        if (parsed.announcements) this.announcements = parsed.announcements;
        if (parsed.notifications) this.notifications = parsed.notifications;
        if (parsed.attendanceRecords && parsed.attendanceRecords.length > 0) {
          this.attendanceRecords = parsed.attendanceRecords;
        } else {
          this.attendanceRecords = SEED.attendanceRecords || [];
        }
        if (parsed.auditLogs) this.auditLogs = parsed.auditLogs;
        if (parsed.users) this.users = parsed.users;
      }

      // 2. Check Auth Session
      const sessionStr = localStorage.getItem(AUTH_SESSION_KEY);
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        const user = this.users.find((u) => u.userId.toUpperCase() === session.userId?.toUpperCase());
        if (user && user.isActive) {
          this.currentUser = {
            id: user.id,
            userId: user.userId,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            room: user.room,
            block: user.block,
            department: user.department,
            specialization: user.specialization,
            avatarUrl: user.avatarUrl,
          };
          this.isAuthenticated = true;
        } else {
          this.currentUser = null;
          this.isAuthenticated = false;
        }
      } else {
        this.currentUser = null;
        this.isAuthenticated = false;
      }
    } catch (e) {
      console.warn('Failed to parse saved state, using defaults', e);
      this.currentUser = null;
      this.isAuthenticated = false;
    }
  }

  private saveToStorage() {
    try {
      const payload = {
        rooms: this.rooms,
        students: this.students,
        complaints: this.complaints,
        maintenanceTasks: this.maintenanceTasks,
        visitors: this.visitors,
        outpasses: this.outpasses,
        roomTransfers: this.roomTransfers,
        emergencies: this.emergencies,
        messData: this.messData,
        announcements: this.announcements,
        notifications: this.notifications,
        attendanceRecords: this.attendanceRecords,
        auditLogs: this.auditLogs,
        users: this.users,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save to storage', e);
    }
  }

  public async login(
    selectedRole: UserRole,
    identifier: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    if (!cleanId) {
      return { success: false, error: 'Please enter your ID or registered email.' };
    }
    if (!cleanPass) {
      return { success: false, error: 'Please enter your password.' };
    }

    // Lookup user in 500-member database
    let foundUser: DatabaseUser | undefined;
    if (cleanId.includes('@')) {
      foundUser = this.users.find((u) => u.email.toLowerCase() === cleanId.toLowerCase());
    } else {
      foundUser = this.users.find((u) => u.userId.toUpperCase() === cleanId.toUpperCase());
    }

    if (!foundUser) {
      return {
        success: false,
        error: `No user account found matching "${cleanId}". Please check your ID or email.`,
      };
    }

    // Strict Role Validation
    if (foundUser.role !== selectedRole) {
      return {
        success: false,
        error: `These credentials do not belong to the selected role (${selectedRole}). Account ${foundUser.userId} is registered as ${foundUser.role}.`,
      };
    }

    // Password verification (All 500 accounts seeded with Demo@123)
    if (cleanPass !== 'Demo@123') {
      return {
        success: false,
        error: 'Invalid password entered. (Demo account password is: Demo@123)',
      };
    }

    // Account active check
    if (!foundUser.isActive) {
      return {
        success: false,
        error: 'This account has been deactivated. Please contact campus hostel administration.',
      };
    }

    // Successful login!
    this.currentUser = {
      id: foundUser.id,
      userId: foundUser.userId,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      phone: foundUser.phone,
      room: foundUser.room,
      block: foundUser.block,
      department: foundUser.department,
      specialization: foundUser.specialization,
      avatarUrl: foundUser.avatarUrl,
    };
    this.isAuthenticated = true;

    localStorage.setItem(
      AUTH_SESSION_KEY,
      JSON.stringify({
        userId: foundUser.userId,
        role: foundUser.role,
        signedInAt: new Date().toISOString(),
      })
    );

    this.addAuditLog('User Sign-In', `${foundUser.name} (${foundUser.userId}) logged in as ${foundUser.role}`);
    this.notify();
    this.showToast('success', `Welcome back, ${foundUser.name}!`, `Authenticated as ${foundUser.role}`);

    return { success: true };
  }

  public logout() {
    const userName = this.currentUser?.name || 'User';
    this.currentUser = null;
    this.isAuthenticated = false;
    localStorage.removeItem(AUTH_SESSION_KEY);
    this.addAuditLog('User Sign-Out', `${userName} logged out`);
    this.notify();
    this.showToast('info', 'Signed Out', 'You have been safely signed out of HostelHub.');
  }

  public adminToggleUserStatus(userId: string) {
    const user = this.users.find((u) => u.userId === userId || u.id === userId);
    if (!user) return;
    user.isActive = !user.isActive;
    this.addAuditLog('Admin User Status Change', `${user.name} (${user.userId}) -> ${user.isActive ? 'ACTIVE' : 'DEACTIVATED'}`);
    this.notify();
    this.showToast(
      user.isActive ? 'success' : 'warning',
      `User ${user.userId} ${user.isActive ? 'Activated' : 'Deactivated'}`
    );
  }

  public getUsersByRole(role?: UserRole): DatabaseUser[] {
    if (!role) return this.users;
    return this.users.filter((u) => u.role === role);
  }

  public subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public subscribeToast(listener: ToastListener) {
    this.toastListeners.add(listener);
    return () => {
      this.toastListeners.delete(listener);
    };
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((l) => l());
  }

  public showToast(type: ToastMessage['type'], title: string, message?: string) {
    const toast: ToastMessage = {
      id: 'tst_' + Math.random().toString(36).substring(2, 9),
      type,
      title,
      message,
    };
    this.toastListeners.forEach((tl) => tl(toast));
  }

  public setCurrentRole(roleKey: 'student' | 'warden' | 'security' | 'maintenance' | 'admin') {
    const roleMap: Record<string, string> = {
      student: 'STU0001',
      warden: 'WRD0001',
      security: 'SEC0001',
      maintenance: 'MNT0001',
      admin: 'ADM0001',
    };
    const targetUserId = roleMap[roleKey];
    const user = this.users.find((u) => u.userId === targetUserId);
    if (user) {
      this.currentUser = {
        id: user.id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        room: user.room,
        block: user.block,
        department: user.department,
        specialization: user.specialization,
        avatarUrl: user.avatarUrl,
      };
      this.isAuthenticated = true;
      localStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify({ userId: user.userId, role: user.role })
      );
      this.notify();
      this.showToast('info', `Switched to ${user.name} (${user.role})`);
    }
  }

  public setCurrentUser(user: UserProfile | null) {
    this.currentUser = user;
    this.isAuthenticated = user !== null;
    if (user) {
      localStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify({ userId: user.userId || user.studentId || user.id, role: user.role })
      );
    } else {
      localStorage.removeItem(AUTH_SESSION_KEY);
    }
    this.notify();
  }

  public resetDemoData() {
    const freshSeed = generateSeedData();
    this.rooms = freshSeed.rooms;
    this.students = freshSeed.students;
    this.complaints = freshSeed.complaints;
    this.maintenanceTasks = freshSeed.maintenanceTasks;
    this.visitors = freshSeed.visitors;
    this.outpasses = freshSeed.outpasses;
    this.roomTransfers = [...INITIAL_ROOM_TRANSFERS];
    this.emergencies = freshSeed.emergencies;
    this.messData = { ...INITIAL_MESS_DATA };
    this.announcements = freshSeed.announcements;
    this.notifications = freshSeed.notifications;
    this.auditLogs = freshSeed.auditLogs;
    this.notify();
    this.showToast('success', 'Demo data reset successfully', 'Restored to clean 500-user seed state');
  }

  // --- Audit Log ---
  public addAuditLog(action: string, target: string, details?: string) {
    const entry: AuditLogEntry = {
      id: 'AUD-' + Math.floor(1000 + Math.random() * 9000),
      actor: this.currentUser?.name || 'System Administrator',
      role: this.currentUser?.role || 'ADMIN',
      action,
      target,
      timestamp: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details,
    };
    this.auditLogs = [entry, ...this.auditLogs];
  }

  // --- Notifications ---
  public addNotification(recipientId: string, title: string, message: string, type: AppNotification['type']) {
    const notif: AppNotification = {
      id: 'NOTIF-' + Math.random().toString(36).substring(2, 8),
      recipientId,
      title,
      message,
      type,
      read: false,
      timestamp: 'Just now',
    };
    this.notifications = [notif, ...this.notifications];
  }

  // --- Complaints Workflow ---
  public raiseComplaint(params: {
    category: ComplaintCategory;
    title: string;
    description: string;
    location: string;
    priority: PriorityLevel;
    photoUrl?: string;
  }) {
    const count = this.complaints.length + 125;
    const complaintId = `CMP-2026-00${count}`;

    // SLA hours based on priority
    let slaHours = 24;
    if (params.priority === 'CRITICAL') slaHours = 2;
    else if (params.priority === 'HIGH') slaHours = 6;
    else if (params.priority === 'MEDIUM') slaHours = 24;
    else if (params.priority === 'LOW') slaHours = 48;

    const studentId = this.currentUser?.id || 'uid_student_stu0001';
    const studentName = this.currentUser?.name || 'Divya Sharma';
    const studentRoom = this.currentUser?.room || 'A302';
    const studentBlock = this.currentUser?.block || 'Block A';

    const newComplaint: Complaint = {
      id: complaintId,
      studentId,
      studentName,
      studentRoom,
      studentBlock,
      category: params.category,
      title: params.title,
      description: params.description,
      location: params.location,
      priority: params.priority,
      status: 'SUBMITTED',
      photoUrl: params.photoUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + slaHours * 3600 * 1000).toISOString(),
      slaHoursTotal: slaHours,
      beforePhotoUrl: params.photoUrl,
    };

    this.complaints = [newComplaint, ...this.complaints];
    this.addAuditLog('Raised Complaint', `${complaintId} (${params.title})`, `Priority: ${params.priority}`);
    this.addNotification(studentId, 'Complaint Submitted', `Your complaint ${complaintId} has been logged.`, 'COMPLAINT');
    this.notify();
    this.showToast('success', 'Complaint submitted successfully', `Generated Ticket ${complaintId}`);
    return newComplaint;
  }

  public assignComplaintToStaff(complaintId: string, staffName: string, staffRole: string) {
    const comp = this.complaints.find((c) => c.id === complaintId);
    if (!comp) return;

    // Find assigned staff in 500-member database or fallback to MNT0001
    const staffUser = this.users.find(
      (u) => u.name.toLowerCase().includes(staffName.toLowerCase()) || u.role === 'MAINTENANCE'
    );
    const assignedStaffId = staffUser ? staffUser.id : 'uid_maintenance_mnt0001';

    comp.status = 'ASSIGNED';
    comp.assignedStaffId = assignedStaffId;
    comp.assignedStaffName = staffName;
    comp.assignedStaffRole = staffRole;
    comp.updatedAt = new Date().toISOString();

    // Create or update maintenance task
    const existingTask = this.maintenanceTasks.find((t) => t.complaintId === complaintId);
    if (!existingTask) {
      const task: MaintenanceTask = {
        id: 'TSK-' + Math.floor(100 + Math.random() * 900),
        complaintId: comp.id,
        title: comp.title,
        location: comp.location,
        category: comp.category,
        priority: comp.priority,
        slaDeadline: comp.slaDeadline,
        assignedToId: assignedStaffId,
        assignedToName: staffName,
        assignedToRole: staffRole,
        status: 'ASSIGNED',
        beforePhoto: comp.photoUrl || comp.beforePhotoUrl,
        createdAt: new Date().toISOString(),
        roomNumber: comp.studentRoom,
        studentName: comp.studentName,
        description: comp.description,
        slaHoursTotal: comp.slaHoursTotal || 24,
      };
      this.maintenanceTasks = [task, ...this.maintenanceTasks];
    } else {
      existingTask.status = 'ASSIGNED';
      existingTask.assignedToId = assignedStaffId;
      existingTask.assignedToName = staffName;
      existingTask.assignedToRole = staffRole;
      existingTask.roomNumber = comp.studentRoom;
      existingTask.studentName = comp.studentName;
    }

    this.addAuditLog('Assigned Complaint', `${complaintId} to ${staffName} (${staffRole})`);
    this.addNotification(
      comp.studentId,
      'Complaint Assigned',
      `Your complaint "${comp.title}" has been assigned to ${staffName}.`,
      'COMPLAINT'
    );
    this.addNotification(
      assignedStaffId,
      'New Task Assigned',
      `You have been assigned task for complaint ${complaintId} (${comp.title}) in ${comp.location}.`,
      'MAINTENANCE'
    );

    this.notify();
    this.showToast('success', `Complaint assigned to ${staffName}`);
  }

  public updateMaintenanceTaskStatus(
    taskId: string,
    status: MaintenanceTask['status'],
    details?: { beforePhoto?: string; afterPhoto?: string; resolutionNotes?: string }
  ) {
    const task = this.maintenanceTasks.find((t) => t.id === taskId);
    if (!task) return;

    task.status = status;
    if (status === 'IN_PROGRESS' && !task.startedAt) {
      task.startedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (status === 'COMPLETED') {
      task.completedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (details?.beforePhoto) task.beforePhoto = details.beforePhoto;
    if (details?.afterPhoto) task.afterPhoto = details.afterPhoto;
    if (details?.resolutionNotes) task.resolutionNotes = details.resolutionNotes;

    // Sync to complaint
    const comp = this.complaints.find((c) => c.id === task.complaintId);
    if (comp) {
      if (status === 'IN_PROGRESS') comp.status = 'IN_PROGRESS';
      if (status === 'COMPLETED') {
        comp.status = 'RESOLVED';
        comp.resolvedAt = new Date().toISOString();
        comp.resolutionNotes = task.resolutionNotes;
        comp.afterPhotoUrl = task.afterPhoto;
        if (task.beforePhoto) comp.beforePhotoUrl = task.beforePhoto;

        this.addNotification(
          comp.studentId,
          'Complaint Resolved! 🎉',
          `Your ticket ${comp.id} (${comp.title}) has been resolved by ${task.assignedToName}.`,
          'COMPLAINT'
        );
      }
      comp.updatedAt = new Date().toISOString();
    }

    this.addAuditLog('Updated Maintenance Task', `${task.id} -> ${status}`, details?.resolutionNotes);
    this.notify();
    this.showToast('success', `Task updated to ${status}`);
  }

  // --- Visitor Management ---
  public requestVisitor(params: {
    visitorName: string;
    relationship: string;
    phoneNumber: string;
    visitDate: string;
    visitTime: string;
    purpose: string;
  }) {
    const id = 'VIS-2026-0' + (this.visitors.length + 82);
    const studentId = this.currentUser?.id || 'uid_student_stu0001';
    const studentName = this.currentUser?.name || 'Divya Sharma';
    const studentRoom = this.currentUser?.room || 'A302';

    const newVisitor: Visitor = {
      id,
      studentId,
      studentName,
      studentRoom,
      visitorName: params.visitorName,
      relationship: params.relationship,
      phoneNumber: params.phoneNumber,
      visitDate: params.visitDate,
      visitTime: params.visitTime,
      purpose: params.purpose,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    this.visitors = [newVisitor, ...this.visitors];
    this.addAuditLog('Requested Visitor Pass', `${params.visitorName} for ${studentName}`);
    this.notify();
    this.showToast('success', 'Visitor pass requested', 'Awaiting Warden approval');
    return newVisitor;
  }

  public approveVisitor(visitorId: string) {
    const v = this.visitors.find((vis) => vis.id === visitorId);
    if (!v) return;

    v.status = 'APPROVED';
    v.approvedBy = this.currentUser?.name || 'Hostel Warden';
    v.qrCodeData = `HOSTELHUB:VIS:${v.id}:${v.visitorName.toUpperCase()}:${v.studentRoom}`;

    this.addNotification(
      v.studentId,
      'Visitor Request Approved',
      `Visitor pass for ${v.visitorName} (${v.relationship}) has been approved! QR code generated.`,
      'VISITOR'
    );
    this.addAuditLog('Approved Visitor', `${v.visitorName} (${v.studentRoom})`);
    this.notify();
    this.showToast('success', `Visitor ${v.visitorName} approved`);
  }

  public rejectVisitor(visitorId: string, reason?: string) {
    const v = this.visitors.find((vis) => vis.id === visitorId);
    if (!v) return;

    v.status = 'REJECTED';
    v.rejectionReason = reason || 'Visiting hours conflict or invalid details';
    this.addNotification(v.studentId, 'Visitor Request Rejected', `Visitor pass for ${v.visitorName} was declined.`, 'VISITOR');
    this.addAuditLog('Rejected Visitor', `${v.visitorName}`);
    this.notify();
    this.showToast('warning', `Visitor ${v.visitorName} rejected`);
  }

  public checkInVisitor(visitorId: string) {
    const v = this.visitors.find((vis) => vis.id === visitorId);
    if (!v) return false;

    v.status = 'CHECKED_IN';
    v.checkedInAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.addAuditLog('Security Checked IN Visitor', `${v.visitorName} visiting ${v.studentName} (${v.studentRoom})`);
    this.notify();
    this.showToast('success', `Visitor ${v.visitorName} checked IN`);
    return true;
  }

  public checkOutVisitor(visitorId: string) {
    const v = this.visitors.find((vis) => vis.id === visitorId);
    if (!v) return false;

    v.status = 'CHECKED_OUT';
    v.checkedOutAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.addAuditLog('Security Checked OUT Visitor', `${v.visitorName}`);
    this.notify();
    this.showToast('success', `Visitor ${v.visitorName} checked OUT`);
    return true;
  }

  // --- Outpass Management ---
  public requestOutpass(params: {
    fromDateTime: string;
    toDateTime: string;
    destination: string;
    reason: string;
  }) {
    const count = this.outpasses.length + 195;
    const id = `OUT-2026-0${count}`;
    const studentId = this.currentUser?.id || 'uid_student_stu0001';
    const studentName = this.currentUser?.name || 'Divya Sharma';
    const studentRoom = this.currentUser?.room || 'A302';
    const studentBlock = this.currentUser?.block || 'Block A';
    const studentPhone = this.currentUser?.phone || '+91 98765 43210';

    const newOutpass: Outpass = {
      id,
      studentId,
      studentName,
      studentRoom,
      studentBlock,
      studentPhone,
      fromDateTime: params.fromDateTime,
      toDateTime: params.toDateTime,
      destination: params.destination,
      reason: params.reason,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    this.outpasses = [newOutpass, ...this.outpasses];
    this.addAuditLog('Requested Outpass', `${id} by ${studentName} to ${params.destination}`);
    this.notify();
    this.showToast('success', 'Outpass request submitted', 'Warden has been notified');
    return newOutpass;
  }

  public approveOutpass(outpassId: string) {
    const op = this.outpasses.find((o) => o.id === outpassId);
    if (!op) return;

    op.status = 'APPROVED';
    op.approvedBy = this.currentUser?.name || 'Hostel Warden';
    op.parentContacted = true;
    op.qrCodeData = `HOSTELHUB:OUT:${op.id}:${op.studentName}:${op.studentRoom}`;

    this.addNotification(
      op.studentId,
      'Outpass Approved! 🎟️',
      `Your outpass to ${op.destination} has been approved. Your verified QR code is ready.`,
      'OUTPASS'
    );
    this.addAuditLog('Approved Outpass', `${op.id} (${op.studentName})`);
    this.notify();
    this.showToast('success', `Outpass for ${op.studentName} approved`);
  }

  public rejectOutpass(outpassId: string, reason?: string) {
    const op = this.outpasses.find((o) => o.id === outpassId);
    if (!op) return;

    op.status = 'REJECTED';
    op.rejectionReason = reason || 'Guardian disapproval or attendance criteria';
    this.addNotification(op.studentId, 'Outpass Declined', `Your outpass to ${op.destination} was not approved.`, 'OUTPASS');
    this.addAuditLog('Rejected Outpass', `${op.id}`);
    this.notify();
    this.showToast('warning', `Outpass ${op.id} rejected`);
  }

  public recordOutpassExit(outpassId: string) {
    const op = this.outpasses.find((o) => o.id === outpassId);
    if (!op) return false;

    op.status = 'ACTIVE_OUT';
    op.actualExitTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update student status to OUTSIDE
    const student = this.students.find((s) => s.id === op.studentId);
    if (student) {
      student.status = 'OUTSIDE';
    }
    this.messData.currentlyOutside += 1;

    this.addAuditLog('Security Gate Exit Scan', `${op.studentName} marked OUTSIDE via ${op.id}`);
    this.notify();
    this.showToast('success', `${op.studentName} marked OUTSIDE`);
    return true;
  }

  public recordOutpassReturn(outpassId: string) {
    const op = this.outpasses.find((o) => o.id === outpassId);
    if (!op) return false;

    op.status = 'RETURNED';
    op.actualReturnTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update student status to ACTIVE
    const student = this.students.find((s) => s.id === op.studentId);
    if (student) {
      student.status = 'ACTIVE';
    }
    if (this.messData.currentlyOutside > 0) {
      this.messData.currentlyOutside -= 1;
    }

    this.addAuditLog('Security Gate Return Scan', `${op.studentName} marked RETURNED via ${op.id}`);
    this.notify();
    this.showToast('success', `${op.studentName} verified INSIDE`);
    return true;
  }

  // --- Room Transfer ---
  public requestRoomTransfer(params: {
    requestedRoom: string;
    requestedBlock: string;
    reason: string;
    additionalNote?: string;
  }) {
    const id = 'TRF-' + Math.floor(100 + Math.random() * 900);
    const studentId = this.currentUser?.id || 'uid_student_stu0001';
    const studentName = this.currentUser?.name || 'Divya Sharma';
    const currentRoom = this.currentUser?.room || 'A302';
    const currentBlock = this.currentUser?.block || 'Block A';

    const req: RoomTransferRequest = {
      id,
      studentId,
      studentName,
      currentRoom,
      currentBlock,
      requestedRoom: params.requestedRoom,
      requestedBlock: params.requestedBlock,
      reason: params.reason,
      additionalNote: params.additionalNote,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    this.roomTransfers = [req, ...this.roomTransfers];
    this.addAuditLog('Requested Room Transfer', `${studentName} from ${req.currentRoom} to ${req.requestedRoom}`);
    this.notify();
    this.showToast('success', 'Room transfer request submitted', 'Warden review pending');
    return req;
  }

  public approveRoomTransfer(transferId: string) {
    const trf = this.roomTransfers.find((t) => t.id === transferId);
    if (!trf) return;

    // Check target room capacity
    const targetRoom = this.rooms.find((r) => r.roomNumber === trf.requestedRoom);
    const currentRoom = this.rooms.find((r) => r.roomNumber === trf.currentRoom);

    if (targetRoom && targetRoom.occupancy >= targetRoom.capacity) {
      this.showToast('error', 'Cannot approve transfer: Target room is already full!');
      return;
    }

    // Execute transfer
    trf.status = 'APPROVED';
    trf.reviewedBy = this.currentUser?.name || 'Hostel Warden';
    trf.reviewedAt = new Date().toISOString();

    // Update rooms
    if (currentRoom) {
      currentRoom.occupancy = Math.max(0, currentRoom.occupancy - 1);
      currentRoom.studentIds = currentRoom.studentIds.filter((id) => id !== trf.studentId);
      if (currentRoom.occupancy === 0) currentRoom.status = 'AVAILABLE';
      else currentRoom.status = 'PARTIALLY_OCCUPIED';
    }

    if (targetRoom) {
      targetRoom.occupancy += 1;
      targetRoom.studentIds.push(trf.studentId);
      if (targetRoom.occupancy >= targetRoom.capacity) targetRoom.status = 'FULL';
      else targetRoom.status = 'PARTIALLY_OCCUPIED';
    }

    // Update student
    const student = this.students.find((s) => s.id === trf.studentId);
    if (student) {
      student.room = trf.requestedRoom;
      student.block = trf.requestedBlock;
    }

    if (this.currentUser && this.currentUser.id === trf.studentId) {
      this.currentUser.room = trf.requestedRoom;
      this.currentUser.block = trf.requestedBlock;
    }

    this.addNotification(
      trf.studentId,
      'Room Transfer Approved!',
      `You have been allocated to ${trf.requestedRoom} (${trf.requestedBlock}). Please complete shifting with security.`,
      'ROOM_TRANSFER'
    );
    this.addAuditLog('Approved Room Transfer', `${trf.studentName}: ${trf.currentRoom} -> ${trf.requestedRoom}`);
    this.notify();
    this.showToast('success', `Room transfer approved for ${trf.studentName} -> ${trf.requestedRoom}`);
  }

  public rejectRoomTransfer(transferId: string) {
    const trf = this.roomTransfers.find((t) => t.id === transferId);
    if (!trf) return;

    trf.status = 'REJECTED';
    trf.reviewedBy = this.currentUser?.name || 'Hostel Warden';
    trf.reviewedAt = new Date().toISOString();

    this.addNotification(
      trf.studentId,
      'Room Transfer Declined',
      `Your request to transfer to ${trf.requestedRoom} was not approved.`,
      'ROOM_TRANSFER'
    );
    this.addAuditLog('Rejected Room Transfer', `${trf.studentName} -> ${trf.requestedRoom}`);
    this.notify();
    this.showToast('info', 'Room transfer rejected');
  }

  // --- Emergency SOS ---
  public triggerEmergencySOS(params: {
    emergencyType: EmergencyType;
    message?: string;
  }) {
    const id = 'EMG-2026-00' + (this.emergencies.length + 5);
    const studentId = this.currentUser?.id || 'uid_student_stu0001';
    const studentName = this.currentUser?.name || 'Divya Sharma';
    const studentRoom = this.currentUser?.room || 'A302';
    const studentBlock = this.currentUser?.block || 'Block A';

    const alert: EmergencyAlert = {
      id,
      studentId,
      studentName,
      studentRoom,
      studentBlock,
      studentFloor: 3,
      emergencyType: params.emergencyType,
      status: 'ACTIVE',
      message: params.message || `${params.emergencyType} emergency SOS triggered from room ${studentRoom}.`,
      createdAt: new Date().toISOString(),
    };

    this.emergencies = [alert, ...this.emergencies];
    this.addAuditLog(
      '🚨 EMERGENCY SOS TRIGGERED',
      `${params.emergencyType} in ${alert.studentRoom} (${alert.studentBlock})`,
      'Alert broadcasted to Warden & Security stations'
    );
    this.notify();
    this.showToast('error', 'EMERGENCY SOS BROADCASTED!', 'Hostel security and medical response teams alerted.');
    return alert;
  }

  public acknowledgeEmergency(alertId: string) {
    const emg = this.emergencies.find((e) => e.id === alertId);
    if (!emg) return;

    emg.status = 'ACKNOWLEDGED';
    emg.acknowledgedBy = this.currentUser?.name || 'Hostel Warden';
    emg.acknowledgedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.addAuditLog('Acknowledged Emergency Alert', `${emg.id} by ${emg.acknowledgedBy}`);
    this.notify();
    this.showToast('info', 'Emergency acknowledged', 'Response team dispatched');
  }

  public resolveEmergency(alertId: string, actionTaken: string) {
    const emg = this.emergencies.find((e) => e.id === alertId);
    if (!emg) return;

    emg.status = 'RESOLVED';
    emg.resolvedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    emg.actionTaken = actionTaken;

    this.addAuditLog('Resolved Emergency Alert', `${emg.id}`, actionTaken);
    this.notify();
    this.showToast('success', 'Emergency marked resolved');
  }

  // --- Student Management ---
  public addStudent(student: Omit<Student, 'id'>) {
    const newStudent: Student = {
      ...student,
      id: 'stu_' + Math.random().toString(36).substring(2, 9),
    };
    this.students = [newStudent, ...this.students];

    // Allocate to room if room specified
    const room = this.rooms.find((r) => r.roomNumber === newStudent.room);
    if (room) {
      if (!room.studentIds.includes(newStudent.id)) {
        room.studentIds.push(newStudent.id);
        room.occupancy = room.studentIds.length;
        if (room.occupancy >= room.capacity) room.status = 'FULL';
        else room.status = 'PARTIALLY_OCCUPIED';
      }
    }

    this.addAuditLog('Added Student', `${newStudent.name} (${newStudent.studentId})`);
    this.notify();
    this.showToast('success', `Student ${newStudent.name} registered`);
  }

  public updateStudent(id: string, updates: Partial<Student>) {
    const student = this.students.find((s) => s.id === id);
    if (!student) return;

    Object.assign(student, updates);
    this.addAuditLog('Updated Student Profile', `${student.name}`);
    this.notify();
    this.showToast('success', 'Student details updated');
  }

  // --- Room Management ---
  public addRoom(room: Omit<Room, 'id' | 'occupancy' | 'studentIds'>) {
    const newRoom: Room = {
      ...room,
      id: 'rm_' + Math.random().toString(36).substring(2, 9),
      occupancy: 0,
      studentIds: [],
    };
    this.rooms = [...this.rooms, newRoom];
    this.addAuditLog('Created Room', `${newRoom.roomNumber} in ${newRoom.block}`);
    this.notify();
    this.showToast('success', `Room ${newRoom.roomNumber} created`);
  }

  public updateRoom(id: string, updates: Partial<Room>) {
    const r = this.rooms.find((rm) => rm.id === id);
    if (!r) return;
    Object.assign(r, updates);
    this.addAuditLog('Updated Room', `${r.roomNumber}`);
    this.notify();
    this.showToast('success', `Room ${r.roomNumber} updated`);
  }

  // --- Announcements ---
  public createAnnouncement(params: {
    title: string;
    message: string;
    audience: HostelAnnouncement['audience'];
    priority: HostelAnnouncement['priority'];
  }) {
    const ann: HostelAnnouncement = {
      id: 'ANN-' + Math.floor(100 + Math.random() * 900),
      title: params.title,
      message: params.message,
      audience: params.audience,
      priority: params.priority,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      authorName: this.currentUser?.name || 'Chief Warden',
    };
    this.announcements = [ann, ...this.announcements];
    this.addAuditLog('Published Announcement', params.title);
    this.notify();
    this.showToast('success', 'Announcement published');
  }

  public getState() {
    return {
      isAuthenticated: this.isAuthenticated,
      currentUser: this.currentUser,
      users: this.users,
      staff: this.staff,
      blocks: this.blocks,
      rooms: this.rooms,
      students: this.students,
      complaints: this.complaints,
      maintenanceTasks: this.maintenanceTasks,
      visitors: this.visitors,
      outpasses: this.outpasses,
      roomTransfers: this.roomTransfers,
      emergencies: this.emergencies,
      messData: this.messData,
      announcements: this.announcements,
      notifications: this.notifications,
      attendanceRecords: this.attendanceRecords,
      auditLogs: this.auditLogs,
      toasts: [] as ToastMessage[],
    };
  }

  public markNotificationAsRead(id: string) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveToStorage();
      this.notify();
    }
  }

  public markAllNotificationsAsRead(recipientId?: string) {
    this.notifications.forEach((n) => {
      if (!recipientId || n.recipientId === recipientId) {
        n.read = true;
      }
    });
    this.saveToStorage();
    this.notify();
    this.showToast('info', 'All notifications marked as read');
  }

  public requestAttendanceRectification(params: {
    recordId: string;
    date: string;
    reason: string;
  }) {
    const record = this.attendanceRecords.find((r) => r.id === params.recordId);
    if (record) {
      record.remarks = `${record.remarks} [DISPUTE SUBMITTED: ${params.reason}]`;
    }
    this.addAuditLog('Attendance Dispute Filed', `Date: ${params.date} by ${this.currentUser?.name}`);
    this.saveToStorage();
    this.notify();
    this.showToast('success', 'Attendance dispute submitted', 'Warden office will verify against biometric logs');
  }

  public recordGateMovement(passId: string, type: 'EXIT' | 'RETURN') {
    if (type === 'EXIT') {
      return this.recordOutpassExit(passId);
    } else {
      return this.recordOutpassReturn(passId);
    }
  }

  public postAnnouncement(params: {
    title: string;
    content: string;
    category?: 'URGENT' | 'GENERAL' | 'MAINTENANCE' | 'EVENT' | string;
    targetAudience?: 'ALL' | 'BLOCK_A' | 'BLOCK_B' | 'BLOCK_C' | string;
  }) {
    const ann: HostelAnnouncement = {
      id: 'ANN-' + Math.floor(100 + Math.random() * 900),
      title: params.title,
      message: params.content,
      content: params.content,
      audience: (params.targetAudience === 'ALL' ? 'All Students' : params.targetAudience) as any,
      targetAudience: params.targetAudience || 'ALL',
      category: params.category || 'GENERAL',
      priority: params.category === 'URGENT' ? 'URGENT' : 'NORMAL',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      postedAt: 'Just now',
      postedBy: this.currentUser?.name || 'Chief Warden',
      authorName: this.currentUser?.name || 'Chief Warden',
      isPinned: params.category === 'URGENT',
    };
    this.announcements = [ann, ...this.announcements];
    this.addAuditLog('Published Announcement', params.title);
    this.notify();
    this.showToast('success', 'Announcement broadcasted to hostel residents');
  }

  // --- Helper Calculations & KPI Statistics ---
  public getStats() {
    const totalStudents = 520; // total campus residence capacity calculation
    const totalRooms = this.rooms.length;
    const occupiedCapacity = this.rooms.reduce((acc, r) => acc + r.occupancy, 0);
    const totalCapacity = this.rooms.reduce((acc, r) => acc + r.capacity, 0);
    const occupancyRate = totalCapacity > 0 ? Math.round((occupiedCapacity / totalCapacity) * 100) : 94;

    const pendingComplaints = this.complaints.filter(
      (c) => c.status === 'SUBMITTED' || c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS'
    ).length;

    const resolvedComplaints = this.complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

    // SLA Violations: complaints where deadline passed and not resolved
    const now = Date.now();
    const slaViolations = this.complaints.filter((c) => {
      if (c.status === 'RESOLVED' || c.status === 'CLOSED') return false;
      return new Date(c.slaDeadline).getTime() < now;
    }).length;

    const visitorsToday = this.visitors.length;
    const visitorsInside = this.visitors.filter((v) => v.status === 'CHECKED_IN').length;
    const visitorsOutside = this.visitors.filter((v) => v.status === 'CHECKED_OUT').length;

    const outpassesPending = this.outpasses.filter((o) => o.status === 'PENDING').length;
    const studentsOutside = this.students.filter((s) => s.status === 'OUTSIDE').length || this.messData.currentlyOutside;

    const maintenancePending = this.maintenanceTasks.filter((t) => t.status !== 'COMPLETED').length;

    return {
      totalStudents,
      occupancyRate,
      averageAttendance: 91,
      pendingComplaints,
      resolvedComplaints,
      slaViolations: Math.max(3, slaViolations),
      visitorsToday: Math.max(24, visitorsToday),
      visitorsInside: Math.max(5, visitorsInside),
      visitorsOutside: Math.max(13, visitorsOutside),
      studentsOutside: Math.max(65, studentsOutside),
      outpassesToday: Math.max(12, this.outpasses.length),
      outpassesPending,
      maintenanceCount: Math.max(7, maintenancePending),
    };
  }
}

export const store = new HostelStore();
