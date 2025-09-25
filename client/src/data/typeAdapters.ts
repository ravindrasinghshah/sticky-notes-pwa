import { Timestamp } from "firebase/firestore";
import type { Bucket, Note, BucketWithCount, NoteWithBuckets } from "./schema";
import type { 
  FirebaseBucket, 
  FirebaseNote, 
  FirebaseBucketWithCount, 
  FirebaseNoteWithBuckets 
} from "./firebase";

// Convert Firebase types to PostgreSQL-compatible types
// Note: User data is managed by Firebase Auth, so no conversion needed

export const convertFirebaseBucketToBucket = (firebaseBucket: FirebaseBucket): Bucket => ({
  id: firebaseBucket.id,
  name: firebaseBucket.name,
  description: firebaseBucket.description || null,
  color: firebaseBucket.color,
  icon: firebaseBucket.icon,
  userId: firebaseBucket.userId,
  createdAt: firebaseBucket.createdAt.toDate(),
  updatedAt: firebaseBucket.updatedAt.toDate(),
});

export const convertFirebaseNoteToNote = (firebaseNote: FirebaseNote): Note => ({
  id: firebaseNote.id,
  title: firebaseNote.title,
  content: firebaseNote.content,
  color: firebaseNote.color,
  fontFamily: firebaseNote.fontFamily,
  userId: firebaseNote.userId,
  primaryBucketId: firebaseNote.primaryBucketId,
  createdAt: firebaseNote.createdAt.toDate(),
  updatedAt: firebaseNote.updatedAt.toDate(),
});

export const convertFirebaseBucketWithCountToBucketWithCount = (firebaseBucket: FirebaseBucketWithCount): BucketWithCount => ({
  ...convertFirebaseBucketToBucket(firebaseBucket),
  noteCount: firebaseBucket.noteCount,
});

export const convertFirebaseNoteWithBucketsToNoteWithBuckets = (firebaseNote: FirebaseNoteWithBuckets): NoteWithBuckets => {
  const note = convertFirebaseNoteToNote(firebaseNote);
  return {
    ...note,
    sharedBuckets: firebaseNote.sharedBuckets.map(convertFirebaseBucketToBucket),
  };
};

// Convert PostgreSQL types to Firebase types
// Note: User data is managed by Firebase Auth, so no conversion needed

// Helper function to convert null to undefined
const nullToUndefined = <T>(value: T | null): T | undefined => value === null ? undefined : value;

export const convertBucketToFirebaseBucket = (bucket: Omit<Bucket, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Omit<FirebaseBucket, 'id' | 'userId' | 'createdAt' | 'updatedAt'> => ({
  name: bucket.name,
  description: nullToUndefined(bucket.description),
  color: bucket.color,
  icon: bucket.icon,
});

export const convertNoteToFirebaseNote = (note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Omit<FirebaseNote, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'sharedBucketIds'> => ({
  title: note.title,
  content: note.content,
  color: note.color,
  fontFamily: note.fontFamily,
  primaryBucketId: note.primaryBucketId,
});

// Conversion functions for insert types (with default values)
export const convertInsertBucketToFirebaseBucket = (bucket: import("./schema").InsertBucket): Omit<FirebaseBucket, 'id' | 'userId' | 'createdAt' | 'updatedAt'> => ({
  name: bucket.name,
  description: bucket.description || undefined,
  color: bucket.color || 'primary',
  icon: bucket.icon || 'sticky-note',
});

export const convertInsertNoteToFirebaseNote = (note: import("./schema").InsertNote): Omit<FirebaseNote, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'sharedBucketIds'> => ({
  title: note.title,
  content: note.content,
  color: note.color || 'accent',
  fontFamily: note.fontFamily || 'Inter',
  primaryBucketId: note.primaryBucketId,
});
