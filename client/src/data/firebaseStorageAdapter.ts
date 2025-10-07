import { firebaseStorage } from "./firebaseStorage";
import type { IStorage } from "./storageInterface";
import type { 
  Bucket, 
  InsertBucket, 
  BucketWithCount, 
  Note, 
  InsertNote, 
  NoteWithBuckets 
} from "./schema";
import {
  convertFirebaseBucketToBucket,
  convertFirebaseNoteToNote,
  convertFirebaseBucketWithCountToBucketWithCount,
  convertFirebaseNoteWithBucketsToNoteWithBuckets,
  convertInsertBucketToFirebaseBucket,
  convertInsertNoteToFirebaseNote,
} from "./typeAdapters";
import { auth } from "./firebase";
import { User } from "firebase/auth";

/**
 * Helper function to get the current authenticated user
 */
const getCurrentUser = (): User => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }
  return user;
};

/**
 * Adapter that wraps Firebase storage to maintain compatibility with PostgreSQL storage interface
 */
export class FirebaseStorageAdapter implements IStorage {
  // Bucket operations
  async getUserBuckets(): Promise<BucketWithCount[]> {
    const user = getCurrentUser();
    const firebaseBuckets = await firebaseStorage.getUserBuckets(user.uid);
    return firebaseBuckets.map(convertFirebaseBucketWithCountToBucketWithCount);
  }

  async createBucket(bucket: InsertBucket): Promise<Bucket> {
    const user = getCurrentUser();
    const firebaseBucketData = convertInsertBucketToFirebaseBucket(bucket);
    const firebaseBucket = await firebaseStorage.createBucket(firebaseBucketData, user.uid);
    return convertFirebaseBucketToBucket(firebaseBucket);
  }

  async updateBucket(id: string, bucket: Partial<InsertBucket>): Promise<Bucket | undefined> {
    const user = getCurrentUser();
    const firebaseBucketData = bucket ? convertInsertBucketToFirebaseBucket(bucket as InsertBucket) : {};
    const firebaseBucket = await firebaseStorage.updateBucket(id, firebaseBucketData, user.uid);
    return firebaseBucket ? convertFirebaseBucketToBucket(firebaseBucket) : undefined;
  }

  async deleteBucket(id: string): Promise<boolean> {
    const user = getCurrentUser();
    return await firebaseStorage.deleteBucket(id, user.uid);
  }

  async getBucket(id: string): Promise<Bucket | undefined> {
    const user = getCurrentUser();
    const firebaseBucket = await firebaseStorage.getBucket(id, user.uid);
    return firebaseBucket ? convertFirebaseBucketToBucket(firebaseBucket) : undefined;
  }

  // Note operations
  async getBucketNotes(bucketId: string): Promise<NoteWithBuckets[]> {
    const user = getCurrentUser();
    const firebaseNotes = await firebaseStorage.getBucketNotes(bucketId, user.uid);
    return firebaseNotes.map(convertFirebaseNoteWithBucketsToNoteWithBuckets);
  }

  async createNote(note: InsertNote, bucketIds: string[] = []): Promise<Note> {
    const user = getCurrentUser();
    const firebaseNoteData = convertInsertNoteToFirebaseNote(note);
    const firebaseNote = await firebaseStorage.createNote(firebaseNoteData, user.uid, bucketIds);
    return convertFirebaseNoteToNote(firebaseNote);
  }

  async updateNote(id: string, note: Partial<InsertNote>, bucketIds?: string[]): Promise<Note | undefined> {
    const user = getCurrentUser();
    const firebaseNoteData = note ? convertInsertNoteToFirebaseNote(note as InsertNote) : {};
    const firebaseNote = await firebaseStorage.updateNote(id, firebaseNoteData, user.uid, bucketIds);
    return firebaseNote ? convertFirebaseNoteToNote(firebaseNote) : undefined;
  }

  async deleteNote(id: string): Promise<boolean> {
    const user = getCurrentUser();
    return await firebaseStorage.deleteNote(id, user.uid);
  }

  async getNote(id: string): Promise<NoteWithBuckets | undefined> {
    const user = getCurrentUser();
    const firebaseNote = await firebaseStorage.getNote(id, user.uid);
    return firebaseNote ? convertFirebaseNoteWithBucketsToNoteWithBuckets(firebaseNote) : undefined;
  }

  // Search operations
  async searchNotes(query: string, bucketId?: string): Promise<NoteWithBuckets[]> {
    const user = getCurrentUser();
    const firebaseNotes = await firebaseStorage.searchNotes(query, user.uid, bucketId);
    return firebaseNotes.map(convertFirebaseNoteWithBucketsToNoteWithBuckets);
  }

  // Get all user notes across all buckets
  async getAllUserNotes(): Promise<NoteWithBuckets[]> {
    const user = getCurrentUser();
    const firebaseNotes = await firebaseStorage.getAllUserNotes(user.uid);
    return firebaseNotes.map(convertFirebaseNoteWithBucketsToNoteWithBuckets);
  }
}

export const storage = new FirebaseStorageAdapter();
