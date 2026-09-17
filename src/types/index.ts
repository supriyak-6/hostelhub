export type UserRole = 'STUDENT' | 'WARDEN' | 'SECURITY' | 'MAINTENANCE' | 'ADMIN';

export interface UserProfile {
  id: string;
  userId?: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  studentId?: string;
  room?: string;
  block?: string;
  department?: string;
  specialization?: string; // e.g. "Electrician" for maintenance
}

export type RoomStatus = 'AVAILABLE' | 'PARTIALLY_OCCUPIED' | 'FULL' | 'MAINTENANCE';
export type RoomType = 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'DORMITORY' | string;

export interface Room {
  id: string;
  roomNumber: string;
  block: string;
  floor: number;
  capacity: number;
  occupancy: number;
  type: RoomType;
  status: RoomStatus;
  amenities: string[];
  studentIds: string[];
  monthlyRent?: number;
}

export interface HostelBlock {
  id: string;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'COED';
  floors: number;
  totalRooms: number;
  wardenName: string;
  wardenPhone: string;
}

export type StudentStatus = 'ACTIVE' | 'ON_LEAVE' | 'OUTSIDE' | 'TRANSFERRED' | 'INACTIVE';

export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  gender: 'FEMALE' | 'MALE' | 'OTHER' | string;
  course: string;
  year: string;
  department: string;
  guardianName: string;
  guardianPhone: string;
  hostel: string;
  block: string;
  floor: number;
  room: string;
  roomNumber?: string;
  admissionDate: string;
  status: StudentStatus;
  photo?: string;
  photoUrl?: string;
  attendanceRate: number;
  attendancePercentage?: number;
  emergencyContact?: string;
  bloodGroup?: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'OUTPASS' | 'ON_LEAVE';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  room: string;
  block: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  status: AttendanceStatus;
  rollCallTime: string;
  verifiedBy: string;
  remarks?: string;
  outpassId?: string;
}

export type ComplaintCategory =
  | 'Electrical'
  | 'Plumbing'
  | 'Cleaning'
  | 'Water'
  | 'AC'
  | 'Furniture'
  | 'Internet'
  | 'Security'
  | 'Other'
  | string;

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ComplaintStatus =
  | 'SUBMITTED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REJECTED';

export interface Complaint {
  id: string; // CMP-2026-XXXXX
  studentId: string;
  studentName: string;
  studentRoom: string;
  studentBlock: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  location: string;
  priority: PriorityLevel;
  status: ComplaintStatus;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string; // ISO string
  slaHoursTotal: number;
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedStaffRole?: string;
  resolutionNotes?: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  resolvedAt?: string;
  feedbackRating?: number;
}

export type MaintenanceTaskStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';

export interface MaintenanceTask {
  id: string;
  complaintId: string;
  title: string;
  location: string;
  category: ComplaintCategory;
  priority: PriorityLevel;
  slaDeadline: string;
  assignedToId: string;
  assignedToName: string;
  assignedToRole: string; // e.g. "Electrician"
  status: MaintenanceTaskStatus;
  startedAt?: string;
  completedAt?: string;
  beforePhoto?: string;
  afterPhoto?: string;
  resolutionNotes?: string;
  createdAt: string;
  roomNumber?: string;
  studentName?: string;
  description?: string;
  slaHoursTotal?: number;
  photoBeforeUrl?: string;
  photoAfterUrl?: string;
}

export type VisitorStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHECKED_IN' | 'CHECKED_OUT';

export interface Visitor {
  id: string; // VIS-XXXX
  studentId: string;
  studentName: string;
  studentRoom: string;
  visitorName: string;
  relationship: string;
  phoneNumber: string;
  visitDate: string;
  visitTime: string;
  purpose: string;
  status: VisitorStatus;
  qrCodeData?: string;
  checkedInAt?: string;
  checkedOutAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  visitorPhoto?: string;
}

export type OutpassStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE_OUT' | 'RETURNED' | 'EXPIRED';

export interface Outpass {
  id: string; // OUT-XXXX
  studentId: string;
  studentName: string;
  studentRoom: string;
  studentBlock: string;
  studentPhone: string;
  fromDateTime: string;
  toDateTime: string;
  destination: string;
  reason: string;
  status: OutpassStatus;
  qrCodeData?: string;
  parentContacted?: boolean;
  approvedBy?: string;
  rejectionReason?: string;
  actualExitTime?: string;
  actualReturnTime?: string;
  createdAt: string;
}

export type RoomTransferStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface RoomTransferRequest {
  id: string;
  studentId: string;
  studentName: string;
  currentRoom: string;
  currentBlock: string;
  requestedRoom: string;
  requestedBlock: string;
  reason: string;
  additionalNote?: string;
  status: RoomTransferStatus;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export type EmergencyType = 'Fire' | 'Medical' | 'Security' | 'Electrical' | 'Other';
export type EmergencyStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface EmergencyAlert {
  id: string;
  studentId: string;
  studentName: string;
  studentRoom: string;
  studentBlock: string;
  studentFloor: number;
  emergencyType: EmergencyType;
  status: EmergencyStatus;
  message?: string;
  createdAt: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  actionTaken?: string;
}

export interface MessAttendanceData {
  date: string;
  totalResidents: number;
  currentlyOutside: number;
  breakfastExpected: number;
  lunchExpected: number;
  dinnerExpected: number;
  breakfastServed: number;
  lunchServed: number;
  dinnerServed: number;
  menu: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
  };
}

export interface HostelAnnouncement {
  id: string;
  title: string;
  message: string;
  audience?: 'All Students' | 'Block A' | 'Block B' | 'Block C' | 'Final Year' | string;
  priority?: 'NORMAL' | 'HIGH' | 'URGENT' | string;
  date?: string;
  authorName?: string;
  content?: string;
  category?: 'URGENT' | 'GENERAL' | 'MAINTENANCE' | 'EVENT' | string;
  targetAudience?: string;
  postedAt?: string;
  postedBy?: string;
  isPinned?: boolean;
}

export interface AppNotification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: 'COMPLAINT' | 'VISITOR' | 'OUTPASS' | 'ROOM_TRANSFER' | 'EMERGENCY' | 'ANNOUNCEMENT' | 'MAINTENANCE';
  read: boolean;
  timestamp: string;
  linkAction?: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  role: UserRole;
  action: string;
  target: string;
  timestamp: string;
  details?: string;
}

export interface ProblemHeatmapCell {
  roomId: string;
  roomNumber: string;
  block: string;
  floor: number;
  totalComplaints: number;
  openComplaints: number;
  resolvedComplaints: number;
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  categories: ComplaintCategory[];
}
