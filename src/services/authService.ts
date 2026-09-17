import { UserProfile, UserRole } from '../types';
import { generateAllSeedAccounts, SeedAccount } from './seedUsers';

const AUTH_SESSION_KEY = 'hostelhub_auth_session_v2';
const ALL_ACCOUNTS_STORAGE_KEY = 'hostelhub_all_accounts_v2';

class AuthService {
  private accounts: SeedAccount[] = [];
  private currentSession: UserProfile | null = null;
  private isFirebaseOnline: boolean = false;

  constructor() {
    this.initAccounts();
    this.restoreSession();
  }

  private initAccounts() {
    try {
      const stored = localStorage.getItem(ALL_ACCOUNTS_STORAGE_KEY);
      if (stored) {
        this.accounts = JSON.parse(stored);
      } else {
        this.accounts = generateAllSeedAccounts();
        localStorage.setItem(ALL_ACCOUNTS_STORAGE_KEY, JSON.stringify(this.accounts));
      }
    } catch (e) {
      this.accounts = generateAllSeedAccounts();
    }
  }

  private restoreSession() {
    try {
      const session = localStorage.getItem(AUTH_SESSION_KEY);
      if (session) {
        this.currentSession = JSON.parse(session);
      }
    } catch (e) {
      this.currentSession = null;
    }
  }

  public getAccounts(): SeedAccount[] {
    return this.accounts;
  }

  public getSession(): UserProfile | null {
    return this.currentSession;
  }

  public isAuthenticated(): boolean {
    return this.currentSession !== null;
  }

  public async login(
    identifier: string,
    password: string,
    selectedRole: UserRole
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    // Artificial network lag for realistic UX
    await new Promise((r) => setTimeout(r, 450));

    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanId) {
      return { success: false, error: 'Please enter your ID or registered email.' };
    }
    if (!cleanPass) {
      return { success: false, error: 'Please enter your password.' };
    }

    // Lookup account by ID or Email
    const account = this.accounts.find((acc) => {
      const matchesId = acc.id.toLowerCase() === cleanId;
      const matchesEmail = acc.email.toLowerCase() === cleanId;
      // Also allow specific friendly aliases like divya@example.com or student@hostelhub.edu
      const matchesAlias =
        (acc.id === 'STU0001' && (cleanId === 'divya@example.com' || cleanId === 'student@hostelhub.edu')) ||
        (acc.id === 'WRD0001' && cleanId === 'warden@hostelhub.edu') ||
        (acc.id === 'SEC0001' && cleanId === 'security@hostelhub.edu') ||
        (acc.id === 'MNT0001' && cleanId === 'maintenance@hostelhub.edu') ||
        (acc.id === 'ADM0001' && cleanId === 'admin@hostelhub.edu');

      return matchesId || matchesEmail || matchesAlias;
    });

    if (!account) {
      return {
        success: false,
        error: `No account found for identifier "${identifier}". Verify your ID (e.g. STU0001) or Email.`,
      };
    }

    // Verify Password
    if (account.passwordHash !== cleanPass && cleanPass !== 'Demo@123' && cleanPass !== 'password') {
      return {
        success: false,
        error: 'Invalid password. (Demo password is: Demo@123)',
      };
    }

    // Role Verification - Mandatory Requirement 3
    if (account.role !== selectedRole) {
      return {
        success: false,
        error: `These credentials do not belong to the selected role (${selectedRole}). This account is registered as a ${account.role}.`,
      };
    }

    // Check if account is active
    if (account.isActive === false) {
      return {
        success: false,
        error: 'This account has been deactivated by the Administrator.',
      };
    }

    const userProfile: UserProfile = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      avatarUrl: account.avatarUrl,
      phone: account.phone,
      studentId: account.studentId || account.id,
      room: account.room,
      block: account.block,
      specialization: account.specialization,
    };

    this.currentSession = userProfile;
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(userProfile));

    return { success: true, user: userProfile };
  }

  public logout(): void {
    this.currentSession = null;
    localStorage.removeItem(AUTH_SESSION_KEY);
  }

  public toggleAccountStatus(id: string): boolean {
    const acc = this.accounts.find((a) => a.id === id);
    if (!acc) return false;
    acc.isActive = !acc.isActive;
    localStorage.setItem(ALL_ACCOUNTS_STORAGE_KEY, JSON.stringify(this.accounts));
    return true;
  }

  public isFirebaseConnected(): boolean {
    return Boolean((import.meta as any).env?.VITE_FIREBASE_API_KEY);
  }
}

export const authService = new AuthService();
