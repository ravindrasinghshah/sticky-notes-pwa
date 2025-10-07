import type { 
  Bucket, 
  InsertBucket, 
  BucketWithCount, 
  Note, 
  InsertNote, 
  NoteWithBuckets 
} from "./schema";

export interface IStorage {
  // Bucket operations
  getUserBuckets(): Promise<BucketWithCount[]>;
  createBucket(bucket: InsertBucket): Promise<Bucket>;
  updateBucket(id: string, bucket: Partial<InsertBucket>): Promise<Bucket | undefined>;
  deleteBucket(id: string): Promise<boolean>;
  getBucket(id: string): Promise<Bucket | undefined>;

  // Note operations
  getBucketNotes(bucketId: string): Promise<NoteWithBuckets[]>;
  createNote(note: InsertNote, bucketIds?: string[]): Promise<Note>;
  updateNote(id: string, note: Partial<InsertNote>, bucketIds?: string[]): Promise<Note | undefined>;
  deleteNote(id: string): Promise<boolean>;
  getNote(id: string): Promise<NoteWithBuckets | undefined>;

  // Search operations
  searchNotes(query: string, bucketId?: string): Promise<NoteWithBuckets[]>;
  
  // Get all user notes across all buckets
  getAllUserNotes(): Promise<NoteWithBuckets[]>;
}
