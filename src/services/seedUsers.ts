import { UserProfile, Student, UserRole } from '../types';

export interface SeedAccount {
  uid: string;
  id: string; // e.g. STU0001, WRD0001, SEC0001, MNT0001, ADM0001
  name: string;
  email: string;
  passwordHash: string; // "Demo@123"
  role: UserRole;
  phone: string;
  avatarUrl: string;
  isActive: boolean;
  createdAt: string;
  // Role specific details:
  studentId?: string;
  department?: string;
  course?: string;
  year?: string;
  gender?: string;
  guardianName?: string;
  guardianPhone?: string;
  room?: string;
  block?: string;
  floor?: number;
  specialization?: string;
  status?: string;
}

const FIRST_NAMES_FEMALE = [
  'Divya', 'Ananya', 'Priya', 'Sneha', 'Meera', 'Pooja', 'Aarohi', 'Kavya', 'Deepika', 'Ishita',
  'Tanvi', 'Rhea', 'Aditi', 'Shreya', 'Anushka', 'Roshni', 'Neha', 'Sunita', 'Bhavna', 'Swati'
];

const FIRST_NAMES_MALE = [
  'Rajesh', 'Vikram', 'Ramesh', 'Amit', 'Rohit', 'Suresh', 'Kiran', 'Arun', 'Manish', 'Naveen',
  'Deepak', 'Sanjay', 'Rahul', 'Manoj', 'Prashant', 'Vijay', 'Alok', 'Sachin', 'Dinesh', 'Gaurav'
];

const LAST_NAMES = [
  'Kumar', 'Sharma', 'Singh', 'Rao', 'Reddy', 'Patel', 'Verma', 'Gogineni', 'Gupta', 'Iyer',
  'Nair', 'Deshmukh', 'Mehta', 'Joshi', 'Choudhary', 'Bose', 'Pillai', 'Saxena', 'Pandey', 'Mishra'
];

const DEPARTMENTS = [
  'Computer Science & Engg',
  'Electronics & Comm Engg',
  'Information Technology',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical & Electronics',
  'Biotechnology',
  'Data Science & AI'
];

const BLOCKS = ['Block A', 'Block B', 'Block C'];

function pad4(num: number): string {
  return num.toString().padStart(4, '0');
}

export function generateAllSeedAccounts(): SeedAccount[] {
  const accounts: SeedAccount[] = [];

  // 1. 100 Students (STU0001 to STU0100)
  for (let i = 1; i <= 100; i++) {
    const id = `STU${pad4(i)}`;
    const email = `student${i}@hostelhub.demo`;
    const isFemale = i % 2 === 1;
    const firstName = i === 1 ? 'Divya' : (isFemale ? FIRST_NAMES_FEMALE[i % FIRST_NAMES_FEMALE.length] : FIRST_NAMES_MALE[i % FIRST_NAMES_MALE.length]);
    const lastName = i === 1 ? 'Sharma' : LAST_NAMES[i % LAST_NAMES.length];
    const name = `${firstName} ${lastName}`;
    const block = i <= 50 ? 'Block A' : (i <= 80 ? 'Block B' : 'Block C');
    const floor = i === 1 ? 3 : (1 + (i % 4));
    const roomNumber = i === 1 ? 'A302' : `${block.charAt(6)}${floor}0${(i % 4) + 1}`;
    const dept = DEPARTMENTS[i % DEPARTMENTS.length];

    accounts.push({
      uid: `uid_student_${id.toLowerCase()}`,
      id,
      name,
      email,
      passwordHash: 'Demo@123',
      role: 'STUDENT',
      phone: `+91 98${pad4(i * 3)} ${pad4(i * 7)}`,
      avatarUrl: isFemale
        ? `https://images.unsplash.com/photo-${1494790108377 + (i % 10)}?w=150&auto=format&fit=crop&q=80`
        : `https://images.unsplash.com/photo-${1507003211169 + (i % 10)}?w=150&auto=format&fit=crop&q=80`,
      isActive: true,
      createdAt: '2026-08-01T09:00:00Z',
      studentId: id,
      department: dept,
      course: 'B.Tech',
      year: `${((i % 4) + 1)}th Year`,
      gender: isFemale ? 'FEMALE' : 'MALE',
      guardianName: `Smt./Sri. ${LAST_NAMES[(i + 3) % LAST_NAMES.length]}`,
      guardianPhone: `+91 94${pad4(i * 5)} 11223`,
      room: roomNumber,
      block,
      floor,
      status: 'ACTIVE',
    });
  }

  // 2. 100 Wardens (WRD0001 to WRD0100)
  for (let i = 1; i <= 100; i++) {
    const id = `WRD${pad4(i)}`;
    const email = `warden${i}@hostelhub.demo`;
    const firstName = i === 1 ? 'Dr. Rajesh' : (i % 2 === 0 ? FIRST_NAMES_MALE[i % FIRST_NAMES_MALE.length] : FIRST_NAMES_FEMALE[i % FIRST_NAMES_FEMALE.length]);
    const lastName = i === 1 ? 'Kumar' : LAST_NAMES[(i + 1) % LAST_NAMES.length];
    const name = i === 1 ? 'Dr. Rajesh Kumar (Chief Warden)' : `Dr. ${firstName} ${lastName}`;
    const assignedBlock = BLOCKS[i % BLOCKS.length];

    accounts.push({
      uid: `uid_warden_${id.toLowerCase()}`,
      id,
      name,
      email,
      passwordHash: 'Demo@123',
      role: 'WARDEN',
      phone: `+91 9440${pad4(i + 1000)}`,
      avatarUrl: `https://images.unsplash.com/photo-${1472099645785 + (i % 10)}?w=150&auto=format&fit=crop&q=80`,
      isActive: true,
      createdAt: '2025-06-15T10:00:00Z',
      block: assignedBlock,
      department: 'Hostel Administration',
      status: 'ACTIVE',
    });
  }

  // 3. 100 Security Staff (SEC0001 to SEC0100)
  for (let i = 1; i <= 100; i++) {
    const id = `SEC${pad4(i)}`;
    const email = `security${i}@hostelhub.demo`;
    const firstName = i === 1 ? 'Vikram' : FIRST_NAMES_MALE[(i + 2) % FIRST_NAMES_MALE.length];
    const lastName = i === 1 ? 'Singh' : LAST_NAMES[(i + 4) % LAST_NAMES.length];
    const name = i === 1 ? 'Vikram Singh (Head Security)' : `${firstName} ${lastName}`;

    accounts.push({
      uid: `uid_security_${id.toLowerCase()}`,
      id,
      name,
      email,
      passwordHash: 'Demo@123',
      role: 'SECURITY',
      phone: `+91 9811${pad4(i + 2000)}`,
      avatarUrl: `https://images.unsplash.com/photo-${1507003211169 + (i % 10)}?w=150&auto=format&fit=crop&q=80`,
      isActive: true,
      createdAt: '2025-07-01T08:00:00Z',
      specialization: i % 2 === 0 ? 'Main Gate Surveillance' : 'Night Patrol & Access Control',
      department: 'Campus Security Bureau',
      status: 'ACTIVE',
    });
  }

  // 4. 100 Maintenance Staff (MNT0001 to MNT0100)
  const SPECIALIZATIONS = ['Electrical', 'Plumbing', 'Carpentry', 'HVAC & AC', 'Water Tank & RO', 'Painting & Civil'];
  for (let i = 1; i <= 100; i++) {
    const id = `MNT${pad4(i)}`;
    const email = `maintenance${i}@hostelhub.demo`;
    const firstName = i === 1 ? 'Ramesh' : FIRST_NAMES_MALE[(i + 5) % FIRST_NAMES_MALE.length];
    const lastName = i === 1 ? 'Kumar' : LAST_NAMES[(i + 2) % LAST_NAMES.length];
    const spec = i === 1 ? 'Senior Electrician & General' : SPECIALIZATIONS[i % SPECIALIZATIONS.length];
    const name = `${firstName} ${lastName} (${spec})`;

    accounts.push({
      uid: `uid_maint_${id.toLowerCase()}`,
      id,
      name,
      email,
      passwordHash: 'Demo@123',
      role: 'MAINTENANCE',
      phone: `+91 9877${pad4(i + 3000)}`,
      avatarUrl: `https://images.unsplash.com/photo-${1500648767791 + (i % 10)}?w=150&auto=format&fit=crop&q=80`,
      isActive: true,
      createdAt: '2025-08-10T09:30:00Z',
      specialization: spec,
      department: 'Hostel Maintenance Services',
      status: 'ACTIVE',
    });
  }

  // 5. 100 Admins (ADM0001 to ADM0100)
  for (let i = 1; i <= 100; i++) {
    const id = `ADM${pad4(i)}`;
    const email = `admin${i}@hostelhub.demo`;
    const firstName = i === 1 ? 'Chief Registrar' : (i % 2 === 0 ? FIRST_NAMES_MALE[i % FIRST_NAMES_MALE.length] : FIRST_NAMES_FEMALE[i % FIRST_NAMES_FEMALE.length]);
    const lastName = i === 1 ? 'Administration' : LAST_NAMES[i % LAST_NAMES.length];
    const name = i === 1 ? 'Registrar & Chief Administrator' : `Admin ${firstName} ${lastName}`;

    accounts.push({
      uid: `uid_admin_${id.toLowerCase()}`,
      id,
      name,
      email,
      passwordHash: 'Demo@123',
      role: 'ADMIN',
      phone: `+91 9900${pad4(i + 4000)}`,
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + (i % 10)}?w=150&auto=format&fit=crop&q=80`,
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      department: 'University Residence Board',
      status: 'ACTIVE',
    });
  }

  return accounts;
}
