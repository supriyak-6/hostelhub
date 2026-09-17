/**
 * HostelHub Firebase Integration Service
 * 
 * Provides configuration, Firestore collection bindings,
 * security rules definition, and setup guide for hackathon deployment.
 */

export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  STUDENTS: 'students',
  WARDENS: 'wardens',
  SECURITY_STAFF: 'securityStaff',
  MAINTENANCE_STAFF: 'maintenanceStaff',
  HOSTELS: 'hostels',
  BLOCKS: 'blocks',
  FLOORS: 'floors',
  ROOMS: 'rooms',
  ROOM_ALLOCATIONS: 'roomAllocations',
  ATTENDANCE: 'attendance',
  COMPLAINTS: 'complaints',
  MAINTENANCE_REQUESTS: 'maintenanceRequests',
  VISITORS: 'visitors',
  VISITOR_REQUESTS: 'visitorRequests',
  OUTPASS_REQUESTS: 'outpassRequests',
  NOTIFICATIONS: 'notifications',
  EMERGENCY_ALERTS: 'emergencyAlerts',
  ROOM_TRANSFER_REQUESTS: 'roomTransferRequests',
  MESS_ATTENDANCE: 'messAttendance',
  ANNOUNCEMENTS: 'announcements',
  EVACUATION_MAPS: 'evacuationMaps',
  AUDIT_LOGS: 'auditLogs',
};

export const FIRESTORE_SECURITY_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return request.auth.token.role;
    }
    
    function isStudent() {
      return isAuthenticated() && (getUserRole() == 'STUDENT' || request.auth.token.email.matches('.*student.*'));
    }
    
    function isWarden() {
      return isAuthenticated() && (getUserRole() == 'WARDEN' || request.auth.token.email.matches('.*warden.*'));
    }
    
    function isSecurity() {
      return isAuthenticated() && (getUserRole() == 'SECURITY' || request.auth.token.email.matches('.*security.*'));
    }
    
    function isMaintenance() {
      return isAuthenticated() && (getUserRole() == 'MAINTENANCE' || request.auth.token.email.matches('.*maintenance.*'));
    }
    
    function isAdmin() {
      return isAuthenticated() && (getUserRole() == 'ADMIN' || request.auth.token.email.matches('.*admin.*'));
    }

    // Students collection
    match /students/{studentId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isWarden() || isAdmin();
    }
    
    // Rooms collection
    match /rooms/{roomId} {
      allow read: if isAuthenticated();
      allow write: if isWarden() || isAdmin();
    }
    
    // Complaints
    match /complaints/{complaintId} {
      allow read: if isAuthenticated();
      allow create: if isStudent() || isWarden() || isAdmin();
      allow update: if isWarden() || isMaintenance() || (isStudent() && resource.data.studentId == request.auth.uid) || isAdmin();
      allow delete: if isAdmin() || isWarden();
    }
    
    // Maintenance Tasks
    match /maintenanceRequests/{taskId} {
      allow read: if isAuthenticated();
      allow create, delete: if isWarden() || isAdmin();
      allow update: if isMaintenance() || isWarden() || isAdmin();
    }
    
    // Visitors & Passes
    match /visitors/{visitorId} {
      allow read: if isAuthenticated();
      allow create: if isStudent() || isWarden() || isAdmin();
      allow update: if isWarden() || isSecurity() || isAdmin();
    }
    
    // Outpasses
    match /outpassRequests/{outpassId} {
      allow read: if isAuthenticated();
      allow create: if isStudent() || isWarden() || isAdmin();
      allow update: if isWarden() || isSecurity() || isAdmin();
    }
    
    // Emergency Alerts - public write in case of urgent distress, verified read
    match /emergencyAlerts/{alertId} {
      allow read: if isAuthenticated();
      allow create: if true;
      allow update: if isWarden() || isSecurity() || isAdmin();
    }
    
    // Audit logs - append-only
    match /auditLogs/{logId} {
      allow read: if isWarden() || isAdmin();
      allow create: if isAuthenticated();
    }
  }
}`;
