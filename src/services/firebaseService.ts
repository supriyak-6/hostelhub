import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { UserRole, UserProfile } from '../types';
import { generateSeedData, DatabaseUser, StaffMember } from './seedData';

// Check if Firebase credentials are provided via environment variables
const env = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || '',
};

const hasValidFirebaseConfig = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'MY_FIREBASE_API_KEY'
);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (hasValidFirebaseConfig) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log('Firebase initialized successfully with Project ID:', firebaseConfig.projectId);
  } catch (error) {
    console.warn('Firebase initialization error, falling back to Local Synchronized DB:', error);
  }
}

export type ConnectionStatus = 'CONNECTED' | 'LOCAL_SYNC';

export function getDatabaseConnectionStatus(): {
  status: ConnectionStatus;
  label: string;
  projectId?: string;
} {
  if (hasValidFirebaseConfig && db) {
    return {
      status: 'CONNECTED',
      label: 'Connected to Firebase Firestore',
      projectId: firebaseConfig.projectId,
    };
  }
  return {
    status: 'LOCAL_SYNC',
    label: 'HostelHub High-Performance Synchronized DB (500 Seeded Accounts)',
  };
}

export { app, db, auth };
