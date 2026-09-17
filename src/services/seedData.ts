import {
  UserProfile,
  Student,
  Room,
  Complaint,
  MaintenanceTask,
  Visitor,
  Outpass,
  EmergencyAlert,
  HostelAnnouncement,
  AuditLogEntry,
  AppNotification,
  UserRole,
  AttendanceRecord,
} from '../types';

export interface DatabaseUser {
  id: string; // Auth UID
  userId: string; // Identifier e.g. STU0001, WRD0001
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  isActive: boolean;
  createdAt: string;
  passwordHash?: string; // Standard demo hash
  avatarUrl?: string;
  room?: string;
  block?: string;
  department?: string;
  specialization?: string;
}

export interface StaffMember {
  id: string;
  staffId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: 'WARDEN' | 'SECURITY' | 'MAINTENANCE' | 'ADMIN';
  department: string;
  specialization?: string;
  assignedHostelId: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'OFF_DUTY';
  createdAt: string;
}

const INDIAN_FIRST_NAMES = [
  'Divya', 'Aarav', 'Ananya', 'Rohan', 'Priya', 'Kabir', 'Sneha', 'Vikram', 'Neha', 'Aditya',
  'Meera', 'Arjun', 'Isha', 'Rahul', 'Tanvi', 'Siddharth', 'Pooja', 'Karan', 'Riya', 'Harsh',
  'Anika', 'Varun', 'Shreya', 'Amit', 'Kavya', 'Gaurav', 'Tara', 'Manish', 'Simran', 'Akash',
  'Diya', 'Nikhil', 'Kriti', 'Pranav', 'Sanjana', 'Dev', 'Aditi', 'Alok', 'Bhavna', 'Chetan',
  'Deepika', 'Eshan', 'Geeta', 'Himanshu', 'Juhi', 'Kunal', 'Lavanya', 'Mayank', 'Nandini', 'Omkar',
];

const INDIAN_LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Reddy', 'Gupta', 'Singh', 'Nair', 'Iyer', 'Chopra', 'Rao',
  'Mehta', 'Joshi', 'Bhat', 'Saxena', 'Kulkarni', 'Deshmukh', 'Mishra', 'Pandey', 'Malhotra', 'Kapoor',
  'Choudhury', 'Aggarwal', 'Menon', 'Pillai', 'Shetty', 'Ghosh', 'Banerjee', 'Das', 'Sen', 'Dutta',
];

const DEPARTMENTS = [
  'Computer Science & Engg',
  'Electronics & Comm Engg',
  'Mechanical Engineering',
  'Electrical & Electronics',
  'Information Technology',
  'Civil Engineering',
  'Biotechnology',
  'Data Science & AI',
];

const MAINTENANCE_SKILLS = [
  'Electrician',
  'Plumbing Specialist',
  'HVAC & AC Technician',
  'Carpenter & Furniture',
  'Masonry & Civil Maintenance',
  'Network & WiFi Technician',
];

// Helper to format 4-digit ID
export function formatId(prefix: string, index: number): string {
  return `${prefix}${index.toString().padStart(4, '0')}`;
}

export function generateSeedData() {
  const users: DatabaseUser[] = [];
  const students: Student[] = [];
  const staff: StaffMember[] = [];

  // 1. Generate 100 Students (STU0001 - STU0100)
  for (let i = 1; i <= 100; i++) {
    const studentId = formatId('STU', i);
    const email = `student${i}@hostelhub.demo`;
    const isFirst = i === 1;

    const firstName = isFirst ? 'Divya' : INDIAN_FIRST_NAMES[(i - 1) % INDIAN_FIRST_NAMES.length];
    const lastName = isFirst ? 'Sharma' : INDIAN_LAST_NAMES[(i * 3) % INDIAN_LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;

    const block = i <= 40 ? 'Block A' : i <= 75 ? 'Block B' : 'Block C';
    const floor = ((i - 1) % 4) + 1;
    const roomNumber = isFirst ? 'A302' : `${block.charAt(6)}${floor}0${((i % 12) + 1).toString().padStart(2, '0')}`;

    const studentUser: DatabaseUser = {
      id: `uid_student_${studentId.toLowerCase()}`,
      userId: studentId,
      name: fullName,
      email,
      role: 'STUDENT',
      phone: `+91 ${9800000000 + i}`,
      isActive: true,
      createdAt: '2026-08-01T08:00:00.000Z',
      room: roomNumber,
      block,
      department: DEPARTMENTS[(i - 1) % DEPARTMENTS.length],
      avatarUrl: isFirst
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
        : `https://images.unsplash.com/photo-${1500000000000 + (i % 20) * 100000}?auto=format&fit=crop&q=80&w=200`,
    };

    users.push(studentUser);

    const studentRecord: Student = {
      id: studentUser.id,
      studentId,
      name: fullName,
      email,
      phone: studentUser.phone,
      gender: block === 'Block A' || block === 'Block B' ? 'FEMALE' : 'MALE',
      course: 'B.Tech',
      year: `${((i % 4) + 1)}th Year`,
      department: studentUser.department || 'Computer Science & Engg',
      guardianName: `${INDIAN_FIRST_NAMES[(i + 5) % INDIAN_FIRST_NAMES.length]} ${lastName}`,
      guardianPhone: `+91 ${9700000000 + i}`,
      hostel: 'Main Campus Hostel',
      block,
      floor,
      room: roomNumber,
      roomNumber,
      admissionDate: '2024-08-10',
      status: i === 4 ? 'OUTSIDE' : i === 9 ? 'ON_LEAVE' : 'ACTIVE',
      photo: studentUser.avatarUrl,
      photoUrl: studentUser.avatarUrl,
      attendanceRate: 88 + (i % 12),
      attendancePercentage: 88 + (i % 12),
      emergencyContact: `+91 ${9700000000 + i}`,
      bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'O-'][(i - 1) % 5],
    };

    students.push(studentRecord);
  }

  // 2. Generate 100 Wardens (WRD0001 - WRD0100)
  for (let i = 1; i <= 100; i++) {
    const wardenId = formatId('WRD', i);
    const email = `warden${i}@hostelhub.demo`;
    const isFirst = i === 1;

    const firstName = isFirst ? 'Dr. Rajesh' : `Dr. ${INDIAN_FIRST_NAMES[(i + 10) % INDIAN_FIRST_NAMES.length]}`;
    const lastName = isFirst ? 'Sharma' : INDIAN_LAST_NAMES[(i * 7) % INDIAN_LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;
    const assignedBlock = ['Block A', 'Block B', 'Block C', 'Block D'][(i - 1) % 4];

    const wardenUser: DatabaseUser = {
      id: `uid_warden_${wardenId.toLowerCase()}`,
      userId: wardenId,
      name: fullName,
      email,
      role: 'WARDEN',
      phone: `+91 ${9810000000 + i}`,
      isActive: true,
      createdAt: '2025-06-15T09:00:00.000Z',
      block: assignedBlock,
      avatarUrl: isFirst
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
        : undefined,
    };

    users.push(wardenUser);

    staff.push({
      id: wardenUser.id,
      staffId: wardenId,
      userId: wardenUser.id,
      name: fullName,
      email,
      phone: wardenUser.phone,
      role: 'WARDEN',
      department: 'Hostel Administration & Student Welfare',
      assignedHostelId: 'HOSTEL_MAIN',
      status: 'ACTIVE',
      createdAt: wardenUser.createdAt,
    });
  }

  // 3. Generate 100 Security Staff (SEC0001 - SEC0100)
  for (let i = 1; i <= 100; i++) {
    const secId = formatId('SEC', i);
    const email = `security${i}@hostelhub.demo`;
    const isFirst = i === 1;

    const firstName = isFirst ? 'Vikram' : INDIAN_FIRST_NAMES[(i + 15) % INDIAN_FIRST_NAMES.length];
    const lastName = isFirst ? 'Singh' : INDIAN_LAST_NAMES[(i * 5) % INDIAN_LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;

    const secUser: DatabaseUser = {
      id: `uid_security_${secId.toLowerCase()}`,
      userId: secId,
      name: fullName,
      email,
      role: 'SECURITY',
      phone: `+91 ${9820000000 + i}`,
      isActive: true,
      createdAt: '2025-07-01T06:00:00.000Z',
      avatarUrl: isFirst
        ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
        : undefined,
    };

    users.push(secUser);

    staff.push({
      id: secUser.id,
      staffId: secId,
      userId: secUser.id,
      name: fullName,
      email,
      phone: secUser.phone,
      role: 'SECURITY',
      department: 'Campus Security & Gate Operations',
      assignedHostelId: 'HOSTEL_MAIN',
      status: 'ACTIVE',
      createdAt: secUser.createdAt,
    });
  }

  // 4. Generate 100 Maintenance Staff (MNT0001 - MNT0100)
  for (let i = 1; i <= 100; i++) {
    const mntId = formatId('MNT', i);
    const email = `maintenance${i}@hostelhub.demo`;
    const isFirst = i === 1;

    const firstName = isFirst ? 'Ramesh' : INDIAN_FIRST_NAMES[(i + 20) % INDIAN_FIRST_NAMES.length];
    const lastName = isFirst ? 'Kumar' : INDIAN_LAST_NAMES[(i * 9) % INDIAN_LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;
    const specialization = isFirst ? 'Electrician' : MAINTENANCE_SKILLS[(i - 1) % MAINTENANCE_SKILLS.length];

    const mntUser: DatabaseUser = {
      id: `uid_maintenance_${mntId.toLowerCase()}`,
      userId: mntId,
      name: fullName,
      email,
      role: 'MAINTENANCE',
      phone: `+91 ${9830000000 + i}`,
      isActive: true,
      createdAt: '2025-07-15T08:00:00.000Z',
      specialization,
      avatarUrl: isFirst
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300'
        : undefined,
    };

    users.push(mntUser);

    staff.push({
      id: mntUser.id,
      staffId: mntId,
      userId: mntUser.id,
      name: fullName,
      email,
      phone: mntUser.phone,
      role: 'MAINTENANCE',
      department: 'Hostel Maintenance & Facilities',
      specialization,
      assignedHostelId: 'HOSTEL_MAIN',
      status: 'ACTIVE',
      createdAt: mntUser.createdAt,
    });
  }

  // 5. Generate 100 Admins (ADM0001 - ADM0100)
  for (let i = 1; i <= 100; i++) {
    const admId = formatId('ADM', i);
    const email = `admin${i}@hostelhub.demo`;
    const isFirst = i === 1;

    const firstName = isFirst ? 'Chief Administrator Sunita' : INDIAN_FIRST_NAMES[(i + 25) % INDIAN_FIRST_NAMES.length];
    const lastName = isFirst ? 'Rao' : INDIAN_LAST_NAMES[(i * 11) % INDIAN_LAST_NAMES.length];
    const fullName = isFirst ? firstName + ' ' + lastName : `Admin ${firstName} ${lastName}`;

    const admUser: DatabaseUser = {
      id: `uid_admin_${admId.toLowerCase()}`,
      userId: admId,
      name: fullName,
      email,
      role: 'ADMIN',
      phone: `+91 ${9840000000 + i}`,
      isActive: true,
      createdAt: '2025-01-01T00:00:00.000Z',
      avatarUrl: isFirst
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
        : undefined,
    };

    users.push(admUser);

    staff.push({
      id: admUser.id,
      staffId: admId,
      userId: admUser.id,
      name: fullName,
      email,
      phone: admUser.phone,
      role: 'ADMIN',
      department: 'University Residence Oversight & IT',
      assignedHostelId: 'HOSTEL_MAIN',
      status: 'ACTIVE',
      createdAt: admUser.createdAt,
    });
  }

  // 6. Generate 60 realistic Hostel Rooms across Blocks A, B, and C
  const rooms: Room[] = [];
  const blocks = ['Block A', 'Block B', 'Block C'];
  blocks.forEach((block) => {
    for (let floor = 1; floor <= 4; floor++) {
      for (let roomIdx = 1; roomIdx <= 5; roomIdx++) {
        const roomNumber = `${block.charAt(6)}${floor}0${roomIdx.toString().padStart(2, '0')}`;
        const isDivyaRoom = roomNumber === 'A302';
        const capacity = roomIdx === 1 ? 1 : roomIdx <= 4 ? 2 : 3;
        
        // Find students assigned to this room
        const roomStudents = students.filter((s) => s.room === roomNumber || (isDivyaRoom && s.studentId === 'STU0001'));
        const occupancy = roomStudents.length;

        rooms.push({
          id: `room_${roomNumber.toLowerCase()}`,
          roomNumber,
          block,
          floor,
          capacity,
          occupancy,
          type: capacity === 1 ? 'SINGLE' : capacity === 2 ? 'DOUBLE' : 'TRIPLE',
          status: occupancy >= capacity ? 'FULL' : occupancy > 0 ? 'PARTIALLY_OCCUPIED' : 'AVAILABLE',
          amenities: ['Study Desk', 'High-Speed LAN', 'Geyser', 'Balcony', 'Ceiling Fan', 'Attached Bath'],
          studentIds: roomStudents.map((s) => s.id),
          monthlyRent: capacity === 1 ? 9500 : capacity === 2 ? 7500 : 6000,
        });
      }
    }
  });

  // 7. Generate Seed Complaints (including active one for Divya)
  const complaints: Complaint[] = [
    {
      id: 'CMP-2026-00125',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      studentRoom: 'A302',
      studentBlock: 'Block A',
      category: 'Electrical',
      title: 'Ceiling fan bearing rattling loudly and speed regulator stuck',
      description: 'The ceiling fan in Room A302 has been making heavy rattling grinding noise since yesterday night and regulator knob is completely jammed on speed 5.',
      location: 'Room A302, 3rd Floor, Block A',
      priority: 'HIGH',
      status: 'ASSIGNED',
      createdAt: '2026-09-16T18:30:00.000Z',
      updatedAt: '2026-09-16T19:00:00.000Z',
      slaDeadline: '2026-09-17T06:30:00.000Z',
      slaHoursTotal: 12,
      assignedStaffId: 'uid_maintenance_mnt0001',
      assignedStaffName: 'Ramesh Kumar',
      assignedStaffRole: 'Electrician',
      photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
      beforePhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'CMP-2026-00098',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      studentRoom: 'A302',
      studentBlock: 'Block A',
      category: 'Plumbing',
      title: 'Washbasin faucet cartridge leaking water under study shelf',
      description: 'The tap connection beneath the washbasin counter was continuously dripping and accumulating on the lower plywood shelf.',
      location: 'Room A302, 3rd Floor, Block A',
      priority: 'MEDIUM',
      status: 'RESOLVED',
      createdAt: '2026-09-11T08:30:00.000Z',
      updatedAt: '2026-09-11T16:00:00.000Z',
      slaDeadline: '2026-09-12T08:30:00.000Z',
      slaHoursTotal: 24,
      assignedStaffId: 'uid_maintenance_mnt0002',
      assignedStaffName: 'Suresh Verma',
      assignedStaffRole: 'Senior Plumber',
      photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
      beforePhotoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
      afterPhotoUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=600',
      resolutionNotes: 'Replaced 35mm ceramic mixer cartridge, wrapped threads with heavy-duty Teflon tape, and sealed supply pipe gasket. Water tested at high pressure without any leakage.',
      resolvedAt: '2026-09-11T16:00:00.000Z',
      feedbackRating: 5,
    },
    {
      id: 'CMP-2026-00054',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      studentRoom: 'A302',
      studentBlock: 'Block A',
      category: 'Internet',
      title: 'Ethernet wall port RJ45 pins loose and intermittent DNS disconnects',
      description: 'LAN cable would slip out of wall socket and campus portal would disconnect every 15 minutes during coding assignment.',
      location: 'Room A302, Study Desk 1',
      priority: 'LOW',
      status: 'RESOLVED',
      createdAt: '2026-08-28T10:15:00.000Z',
      updatedAt: '2026-08-29T11:45:00.000Z',
      slaDeadline: '2026-08-30T10:15:00.000Z',
      slaHoursTotal: 48,
      assignedStaffId: 'uid_maintenance_mnt0006',
      assignedStaffName: 'Nikhil Saxena',
      assignedStaffRole: 'Network Technician',
      photoUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600',
      resolutionNotes: 'Crimped fresh CAT-6 RJ45 keystone jack and replaced wall faceplate. Speed verified at 850 Mbps symmetrical.',
      resolvedAt: '2026-08-29T11:45:00.000Z',
      feedbackRating: 5,
    },
    {
      id: 'CMP-2026-00021',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      studentRoom: 'A302',
      studentBlock: 'Block A',
      category: 'Furniture',
      title: 'Study chair hydraulic piston sinking under load',
      description: 'Ergonomic study desk chair does not hold height adjustment and drops to minimum height.',
      location: 'Room A302, Block A',
      priority: 'LOW',
      status: 'CLOSED',
      createdAt: '2026-08-14T09:00:00.000Z',
      updatedAt: '2026-08-15T15:30:00.000Z',
      slaDeadline: '2026-08-17T09:00:00.000Z',
      slaHoursTotal: 72,
      assignedStaffId: 'uid_maintenance_mnt0004',
      assignedStaffName: 'Kishore Patel',
      assignedStaffRole: 'Carpenter & Furniture Specialist',
      photoUrl: 'https://images.unsplash.com/photo-1580481077195-c3a8b417e997?auto=format&fit=crop&q=80&w=600',
      resolutionNotes: 'Fitted heavy-duty Class-4 gas spring cylinder. Tested and verified.',
      resolvedAt: '2026-08-15T15:30:00.000Z',
      feedbackRating: 4,
    },
    {
      id: 'CMP-2026-00124',
      studentId: 'uid_student_stu0002',
      studentName: 'Aarav Patel',
      studentRoom: 'B201',
      studentBlock: 'Block B',
      category: 'Plumbing',
      title: 'Bathroom shower pipe leaking continuously',
      description: 'Water dripping heavily from the mixer valve connection causing minor dampness on the floor.',
      location: 'Room B201, 2nd Floor, Block B',
      priority: 'MEDIUM',
      status: 'SUBMITTED',
      createdAt: '2026-09-16T19:15:00.000Z',
      updatedAt: '2026-09-16T19:15:00.000Z',
      slaDeadline: '2026-09-17T19:15:00.000Z',
      slaHoursTotal: 24,
    },
    {
      id: 'CMP-2026-00123',
      studentId: 'uid_student_stu0003',
      studentName: 'Ananya Verma',
      studentRoom: 'A104',
      studentBlock: 'Block A',
      category: 'Internet',
      title: 'Wi-Fi access point in 1st floor corridor dropping packets',
      description: 'Frequent disconnection when attending online classes on campus network.',
      location: '1st Floor Corridor, Block A',
      priority: 'LOW',
      status: 'RESOLVED',
      createdAt: '2026-09-15T10:00:00.000Z',
      updatedAt: '2026-09-15T15:30:00.000Z',
      slaDeadline: '2026-09-17T10:00:00.000Z',
      slaHoursTotal: 48,
      assignedStaffId: 'uid_maintenance_mnt0006',
      assignedStaffName: 'Nikhil Saxena',
      assignedStaffRole: 'Network & WiFi Technician',
      resolutionNotes: 'Power cycled PoE switch and re-crimped RJ45 patch cable. Signal strength tested at -42dBm.',
      resolvedAt: '2026-09-15T15:30:00.000Z',
      feedbackRating: 5,
    },
  ];

  // 8. Maintenance Tasks
  const maintenanceTasks: MaintenanceTask[] = [
    {
      id: 'TSK-1001',
      complaintId: 'CMP-2026-00125',
      title: 'Ceiling fan bearing repair & regulator replacement',
      location: 'Room A302, Block A',
      category: 'Electrical',
      priority: 'HIGH',
      slaDeadline: '2026-09-17T06:30:00.000Z',
      assignedToId: 'uid_maintenance_mnt0001',
      assignedToName: 'Ramesh Kumar',
      assignedToRole: 'Electrician',
      status: 'ASSIGNED',
      createdAt: '2026-09-16T19:00:00.000Z',
      beforePhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
      roomNumber: 'A302',
      studentName: 'Divya Sharma',
      description: 'Replace fan capacitor and check ceiling hook anchor bolt.',
      slaHoursTotal: 12,
    },
  ];

  // 9. Visitors
  const visitors: Visitor[] = [
    {
      id: 'VIS-2026-0081',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      studentRoom: 'A302',
      visitorName: 'Sunita Sharma',
      relationship: 'Mother',
      phoneNumber: '+91 98765 11223',
      visitDate: '2026-09-17',
      visitTime: '16:00',
      purpose: 'Delivering semester textbooks and winter clothing',
      status: 'APPROVED',
      qrCodeData: 'HOSTELHUB:VIS:VIS-2026-0081:SUNITA SHARMA:A302',
      approvedBy: 'Dr. Rajesh Sharma',
      createdAt: '2026-09-16T14:20:00.000Z',
    },
    {
      id: 'VIS-2026-0082',
      studentId: 'uid_student_stu0002',
      studentName: 'Aarav Patel',
      studentRoom: 'B201',
      visitorName: 'Rajesh Patel',
      relationship: 'Father',
      phoneNumber: '+91 98765 44332',
      visitDate: '2026-09-17',
      visitTime: '11:00',
      purpose: 'Family visit & medical consultation drop-off',
      status: 'PENDING',
      createdAt: '2026-09-16T20:10:00.000Z',
    },
  ];

  // 10. Outpasses
  const outpasses: Outpass[] = [
    {
      id: 'OUT-2026-0192',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      studentRoom: 'A302',
      studentBlock: 'Block A',
      studentPhone: '+91 9800000001',
      fromDateTime: '2026-09-18T10:00',
      toDateTime: '2026-09-18T20:00',
      destination: 'City Center Library & Tech Park',
      reason: 'Attending IEEE Student Technical Conference workshop',
      status: 'APPROVED',
      parentContacted: true,
      approvedBy: 'Dr. Rajesh Sharma',
      qrCodeData: 'HOSTELHUB:OUT:OUT-2026-0192:Divya Sharma:A302',
      createdAt: '2026-09-16T15:00:00.000Z',
    },
    {
      id: 'OUT-2026-0193',
      studentId: 'uid_student_stu0004',
      studentName: 'Rohan Gupta',
      studentRoom: 'C104',
      studentBlock: 'Block C',
      studentPhone: '+91 9800000004',
      fromDateTime: '2026-09-16T16:00',
      toDateTime: '2026-09-16T21:00',
      destination: 'District Hospital',
      reason: 'Dental appointment routine follow-up',
      status: 'ACTIVE_OUT',
      parentContacted: true,
      approvedBy: 'Dr. Rajesh Sharma',
      qrCodeData: 'HOSTELHUB:OUT:OUT-2026-0193:Rohan Gupta:C104',
      actualExitTime: '16:15',
      createdAt: '2026-09-16T12:00:00.000Z',
    },
  ];

  // 11. Emergencies
  const emergencies: EmergencyAlert[] = [
    {
      id: 'EMG-2026-0004',
      studentId: 'uid_student_stu0005',
      studentName: 'Sneha Reddy',
      studentRoom: 'B305',
      studentBlock: 'Block B',
      studentFloor: 3,
      emergencyType: 'Medical',
      status: 'RESOLVED',
      message: 'Acute asthma flare-up, requested nebulizer from campus clinic',
      createdAt: '2026-09-15T22:10:00.000Z',
      acknowledgedBy: 'Dr. Rajesh Sharma',
      acknowledgedAt: '2026-09-15T22:12:00.000Z',
      resolvedAt: '2026-09-15T22:45:00.000Z',
      actionTaken: 'Campus ambulance dispatched, paramedic administered salbutamol. Resident resting safely.',
    },
  ];

  // 12. Announcements
  const announcements: HostelAnnouncement[] = [
    {
      id: 'ANN-901',
      title: 'Water Supply Overhead Tank Disinfection & Maintenance',
      message: 'Routine water tank cleaning scheduled for Block A & B tomorrow 10:00 AM - 1:00 PM. Please store drinking water in advance.',
      content: 'Routine water tank cleaning scheduled for Block A & B tomorrow 10:00 AM - 1:00 PM. Please store drinking water in advance.',
      audience: 'All Students',
      targetAudience: 'ALL',
      priority: 'HIGH',
      category: 'MAINTENANCE',
      date: '16 Sep 2026',
      postedAt: '2 hours ago',
      postedBy: 'Dr. Rajesh Sharma',
      authorName: 'Dr. Rajesh Sharma',
      isPinned: true,
    },
    {
      id: 'ANN-902',
      title: 'Hostel Annual Sports & Cultural Meet Registrations Open',
      message: 'Intra-hostel badminton, chess, and table tennis championships begin this weekend. Register at the warden office or via applet.',
      content: 'Intra-hostel badminton, chess, and table tennis championships begin this weekend. Register at the warden office or via applet.',
      audience: 'All Students',
      targetAudience: 'ALL',
      priority: 'NORMAL',
      category: 'EVENT',
      date: '15 Sep 2026',
      postedAt: 'Yesterday',
      postedBy: 'Chief Administrator Sunita Rao',
      authorName: 'Chief Administrator Sunita Rao',
      isPinned: false,
    },
  ];

  // 13. Audit Logs
  const auditLogs: AuditLogEntry[] = [
    {
      id: 'LOG-001',
      actor: 'Dr. Rajesh Sharma',
      role: 'WARDEN',
      action: 'Assigned Complaint',
      target: 'CMP-2026-00125 -> Ramesh Kumar',
      timestamp: '16 Sep 2026, 19:00',
      details: 'Priority set to HIGH with 12-hour SLA',
    },
    {
      id: 'LOG-002',
      actor: 'Divya Sharma',
      role: 'STUDENT',
      action: 'Raised Complaint',
      target: 'CMP-2026-00125',
      timestamp: '16 Sep 2026, 18:30',
      details: 'Ceiling fan bearing rattling loudly',
    },
    {
      id: 'LOG-003',
      actor: 'Dr. Rajesh Sharma',
      role: 'WARDEN',
      action: 'Approved Outpass',
      target: 'OUT-2026-0192 (Divya Sharma)',
      timestamp: '16 Sep 2026, 16:30',
      details: 'Parent confirmation recorded',
    },
    {
      id: 'LOG-004',
      actor: 'Vikram Singh',
      role: 'SECURITY',
      action: 'Gate Exit Scan',
      target: 'OUT-2026-0193 (Rohan Gupta)',
      timestamp: '16 Sep 2026, 16:15',
      details: 'Exit validated via digital QR pass',
    },
  ];

  // 14. Daily Attendance Records (with explicit absent dates for student)
  const attendanceRecords: AttendanceRecord[] = [
    {
      id: 'ATT-2026-09-16-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-09-16',
      dayOfWeek: 'Wednesday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Dr. Rajesh Sharma (Chief Warden)',
      remarks: 'Present in Room A302. Biometric scanner verified.',
    },
    {
      id: 'ATT-2026-09-15-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-09-15',
      dayOfWeek: 'Tuesday',
      status: 'PRESENT',
      rollCallTime: '09:32 PM',
      verifiedBy: 'Mrs. Lakshmi Devi (Block A Floor Warden)',
      remarks: 'Present during physical inspection.',
    },
    {
      id: 'ATT-2026-09-14-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-09-14',
      dayOfWeek: 'Monday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Mrs. Lakshmi Devi (Block A Floor Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-09-13-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-09-13',
      dayOfWeek: 'Sunday',
      status: 'PRESENT',
      rollCallTime: '09:35 PM',
      verifiedBy: 'Dr. Rajesh Sharma (Chief Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-09-12-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-09-12',
      dayOfWeek: 'Saturday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Mrs. Lakshmi Devi (Block A Floor Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-09-11-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-09-11',
      dayOfWeek: 'Friday',
      status: 'PRESENT',
      rollCallTime: '09:31 PM',
      verifiedBy: 'Mrs. Lakshmi Devi (Block A Floor Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-09-10-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-09-10',
      dayOfWeek: 'Thursday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Dr. Rajesh Sharma (Chief Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-09-09-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-09-09',
      dayOfWeek: 'Wednesday',
      status: 'PRESENT',
      rollCallTime: '09:34 PM',
      verifiedBy: 'Mrs. Lakshmi Devi (Block A Floor Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-09-08-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-09-08',
      dayOfWeek: 'Tuesday',
      status: 'ABSENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Dr. Rajesh Sharma (Chief Warden)',
      remarks: 'ABSENT: Missed night curfew roll call. Biometric scanner not tapped. SMS alert dispatched to guardian (+91 9700000001). Student reported returning late from library study group at 10:18 PM.',
    },
    {
      id: 'ATT-2026-09-07-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-09-07',
      dayOfWeek: 'Monday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Mrs. Lakshmi Devi (Block A Floor Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-09-06-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-09-06',
      dayOfWeek: 'Sunday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Mrs. Lakshmi Devi (Block A Floor Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-09-05-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-09-05',
      dayOfWeek: 'Saturday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Dr. Rajesh Sharma (Chief Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-09-04-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-09-04',
      dayOfWeek: 'Friday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Mrs. Lakshmi Devi (Block A Floor Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-09-03-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-09-03',
      dayOfWeek: 'Thursday',
      status: 'OUTPASS',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Security Vikram Singh (Main Gate)',
      remarks: 'ON LEAVE: Authorized Home Outpass OUT-2026-0192. Gate QR scanned at 04:30 PM.',
      outpassId: 'OUT-2026-0192',
    },
    {
      id: 'ATT-2026-09-02-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-09-02',
      dayOfWeek: 'Wednesday',
      status: 'OUTPASS',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Security Vikram Singh (Main Gate)',
      remarks: 'ON LEAVE: Authorized Home Outpass OUT-2026-0192.',
      outpassId: 'OUT-2026-0192',
    },
    {
      id: 'ATT-2026-09-01-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-09-01',
      dayOfWeek: 'Tuesday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Mrs. Lakshmi Devi (Block A Floor Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-08-31-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-08-31',
      dayOfWeek: 'Monday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Dr. Rajesh Sharma (Chief Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-08-30-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-08-30',
      dayOfWeek: 'Sunday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Mrs. Lakshmi Devi (Block A Floor Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-08-29-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-08-29',
      dayOfWeek: 'Saturday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Mrs. Lakshmi Devi (Block A Floor Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-08-28-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-08-28',
      dayOfWeek: 'Friday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Dr. Rajesh Sharma (Chief Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-08-27-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-08-27',
      dayOfWeek: 'Thursday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Mrs. Lakshmi Devi (Block A Floor Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-08-26-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-08-26',
      dayOfWeek: 'Wednesday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Mrs. Lakshmi Devi (Block A Floor Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-08-25-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-08-25',
      dayOfWeek: 'Tuesday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Dr. Rajesh Sharma (Chief Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-08-24-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-08-24',
      dayOfWeek: 'Monday',
      status: 'ABSENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Mrs. Lakshmi Devi (Block A Floor Warden)',
      remarks: 'ABSENT: Absent during room physical roll call audit. No approved outpass on file. Arrived at gate 10:15 PM with late entry disciplinary slip.',
    },
    {
      id: 'ATT-2026-08-23-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-08-23',
      dayOfWeek: 'Sunday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Mrs. Lakshmi Devi (Block A Floor Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-08-22-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-08-22',
      dayOfWeek: 'Saturday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Dr. Rajesh Sharma (Chief Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-08-21-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-08-21',
      dayOfWeek: 'Friday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Mrs. Lakshmi Devi (Block A Floor Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-08-20-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-08-20',
      dayOfWeek: 'Thursday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Dr. Rajesh Sharma (Chief Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-08-19-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-08-19',
      dayOfWeek: 'Wednesday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Mrs. Lakshmi Devi (Block A Floor Warden)',
      remarks: 'Present in Room A302.',
    },
    {
      id: 'ATT-2026-08-18-DIVYA',
      studentId: 'uid_student_stu0001',
      studentName: 'Divya Sharma',
      room: 'A302',
      block: 'Block A',
      date: '2026-08-18',
      dayOfWeek: 'Tuesday',
      status: 'PRESENT',
      rollCallTime: '09:30 PM',
      verifiedBy: 'Dr. Rajesh Sharma (Chief Warden)',
      remarks: 'Present in Room A302.',
    },
  ];

  // 15. Rich Student & Staff Notifications
  const notifications: AppNotification[] = [
    {
      id: 'NOTIF-001',
      recipientId: 'uid_student_stu0001',
      title: 'Complaint Assigned',
      message: 'Your complaint CMP-2026-00125 (Ceiling fan) has been assigned to Ramesh Kumar (Senior Electrician). Expected resolution within 12 hours.',
      type: 'COMPLAINT',
      read: false,
      timestamp: 'Today, 07:00 PM',
      linkAction: 'complaints',
    },
    {
      id: 'NOTIF-002',
      recipientId: 'uid_student_stu0001',
      title: 'Visitor Pass Approved',
      message: 'Visitor pass for Sunita Sharma has been approved by Warden Dr. Rajesh. Digital QR entry code is now available.',
      type: 'VISITOR',
      read: false,
      timestamp: 'Today, 02:20 PM',
      linkAction: 'visitors',
    },
    {
      id: 'NOTIF-003',
      recipientId: 'uid_student_stu0001',
      title: 'Night Curfew & Roll Call Alert',
      message: 'Mandatory 09:30 PM biometric night roll call in Block A. Ensure you are present in Room A302.',
      type: 'ANNOUNCEMENT',
      read: false,
      timestamp: 'Today, 08:30 PM',
      linkAction: 'attendance',
    },
    {
      id: 'NOTIF-004',
      recipientId: 'uid_student_stu0001',
      title: 'Attendance Alert: Absence Recorded',
      message: 'You were recorded ABSENT during the 09:30 PM night roll call on Tuesday, 08-Sep-2026. Submit any official leave justification to Block A Warden office.',
      type: 'ANNOUNCEMENT',
      read: true,
      timestamp: '08 Sep 2026, 10:20 PM',
      linkAction: 'attendance',
    },
    {
      id: 'NOTIF-005',
      recipientId: 'uid_student_stu0001',
      title: 'Maintenance Ticket Resolved',
      message: 'Plumbing complaint CMP-2026-00098 (Washbasin mixer leak) has been successfully resolved by Suresh Verma. Thank you for your 5-star rating.',
      type: 'MAINTENANCE',
      read: true,
      timestamp: '11 Sep 2026, 04:30 PM',
      linkAction: 'complaints',
    },
    {
      id: 'NOTIF-006',
      recipientId: 'uid_student_stu0001',
      title: 'Hostel Dining & Feast Menu',
      message: 'Special holiday dinner menu updated for tomorrow. North Indian buffet & sweets served at Hall 1 from 07:30 PM.',
      type: 'ANNOUNCEMENT',
      read: true,
      timestamp: '15 Sep 2026, 01:00 PM',
      linkAction: 'mess',
    },
    {
      id: 'NOTIF-007',
      recipientId: 'uid_maintenance_mnt0001',
      title: 'New Work Order Assigned',
      message: 'Work order for Room A302 ceiling fan repair assigned to you.',
      type: 'MAINTENANCE',
      read: false,
      timestamp: 'Today, 07:00 PM',
    },
  ];

  return {
    users,
    students,
    staff,
    rooms,
    complaints,
    maintenanceTasks,
    visitors,
    outpasses,
    emergencies,
    announcements,
    auditLogs,
    notifications,
    attendanceRecords,
  };
}

