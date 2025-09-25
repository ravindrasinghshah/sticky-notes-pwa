// Export all Firebase-related modules
export * from './firebase';
export * from './firebaseStorage';
export * from './firebaseStorageAdapter';
export * from './typeAdapters';

// Re-export types for convenience
export type {
  FirebaseBucket,
  FirebaseNote,
  FirebaseNoteWithBuckets,
  FirebaseBucketWithCount,
} from './firebase';

export type {
  IStorage,
} from './firebaseStorage';

// Export the main storage instance
export { storage } from './firebaseStorageAdapter';
