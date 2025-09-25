import { collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, query, where, orderBy, limit, startAfter, QueryDocumentSnapshot, DocumentData, Timestamp } from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { db, auth } from "../../../firebase-config";

// Firebase types - User data is managed by Firebase Auth, so we don't need a separate user collection

export interface FirebaseBucket {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebaseNote {
  id: string;
  title: string;
  content: string;
  color: string;
  fontFamily: string;
  userId: string;
  primaryBucketId: string;
  sharedBucketIds: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebaseNoteWithBuckets extends FirebaseNote {
  sharedBuckets: FirebaseBucket[];
}

export interface FirebaseBucketWithCount extends FirebaseBucket {
  noteCount: number;
}

// Helper functions for data conversion
export const convertTimestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

export const convertDateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Collection references - Users are managed by Firebase Auth
export const getUserBucketsCollection = (userId: string) => collection(db, 'users', userId, 'buckets');
export const getUserBucketDoc = (userId: string, bucketId: string) => doc(db, 'users', userId, 'buckets', bucketId);
export const getUserNotesCollection = (userId: string) => collection(db, 'users', userId, 'notes');
export const getUserNoteDoc = (userId: string, noteId: string) => doc(db, 'users', userId, 'notes', noteId);

// Auth state management
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Re-export db and auth for convenience
export { db, auth };
