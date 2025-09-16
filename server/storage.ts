import {
  users,
  buckets,
  notes,
  noteBuckets,
  type User,
  type UpsertUser,
  type Bucket,
  type InsertBucket,
  type BucketWithCount,
  type Note,
  type InsertNote,
  type NoteWithBuckets,
  type NoteBucket,
  type InsertNoteBucket,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, ilike, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Bucket operations
  getUserBuckets(userId: string): Promise<BucketWithCount[]>;
  createBucket(bucket: InsertBucket, userId: string): Promise<Bucket>;
  updateBucket(id: string, bucket: Partial<InsertBucket>, userId: string): Promise<Bucket | undefined>;
  deleteBucket(id: string, userId: string): Promise<boolean>;
  getBucket(id: string, userId: string): Promise<Bucket | undefined>;
  
  // Note operations
  getBucketNotes(bucketId: string, userId: string): Promise<NoteWithBuckets[]>;
  createNote(note: InsertNote, userId: string, bucketIds: string[]): Promise<Note>;
  updateNote(id: string, note: Partial<InsertNote>, userId: string, bucketIds?: string[]): Promise<Note | undefined>;
  deleteNote(id: string, userId: string): Promise<boolean>;
  getNote(id: string, userId: string): Promise<NoteWithBuckets | undefined>;
  
  // Search operations
  searchNotes(query: string, userId: string, bucketId?: string): Promise<NoteWithBuckets[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Bucket operations
  async getUserBuckets(userId: string): Promise<BucketWithCount[]> {
    const result = await db
      .select({
        id: buckets.id,
        name: buckets.name,
        description: buckets.description,
        color: buckets.color,
        icon: buckets.icon,
        userId: buckets.userId,
        createdAt: buckets.createdAt,
        updatedAt: buckets.updatedAt,
        noteCount: sql<number>`cast(count(${notes.id}) as int)`,
      })
      .from(buckets)
      .leftJoin(notes, eq(notes.primaryBucketId, buckets.id))
      .where(eq(buckets.userId, userId))
      .groupBy(buckets.id)
      .orderBy(buckets.createdAt);

    return result;
  }

  async createBucket(bucket: InsertBucket, userId: string): Promise<Bucket> {
    const [newBucket] = await db
      .insert(buckets)
      .values({ ...bucket, userId })
      .returning();
    return newBucket;
  }

  async updateBucket(id: string, bucket: Partial<InsertBucket>, userId: string): Promise<Bucket | undefined> {
    const [updatedBucket] = await db
      .update(buckets)
      .set({ ...bucket, updatedAt: new Date() })
      .where(and(eq(buckets.id, id), eq(buckets.userId, userId)))
      .returning();
    return updatedBucket;
  }

  async deleteBucket(id: string, userId: string): Promise<boolean> {
    // First delete all note-bucket relationships
    await db.delete(noteBuckets).where(eq(noteBuckets.bucketId, id));
    
    // Delete all notes with this as primary bucket
    await db.delete(notes).where(and(eq(notes.primaryBucketId, id), eq(notes.userId, userId)));
    
    // Delete the bucket
    const result = await db
      .delete(buckets)
      .where(and(eq(buckets.id, id), eq(buckets.userId, userId)));
    
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getBucket(id: string, userId: string): Promise<Bucket | undefined> {
    const [bucket] = await db
      .select()
      .from(buckets)
      .where(and(eq(buckets.id, id), eq(buckets.userId, userId)));
    return bucket;
  }

  // Note operations
  async getBucketNotes(bucketId: string, userId: string): Promise<NoteWithBuckets[]> {
    const notesResult = await db
      .select()
      .from(notes)
      .where(and(
        or(
          eq(notes.primaryBucketId, bucketId),
          sql`${notes.id} IN (SELECT note_id FROM note_buckets WHERE bucket_id = ${bucketId})`
        ),
        eq(notes.userId, userId)
      ))
      .orderBy(notes.updatedAt);

    // Get shared buckets for each note
    const notesWithBuckets: NoteWithBuckets[] = [];
    for (const note of notesResult) {
      const sharedBuckets = await db
        .select({
          id: buckets.id,
          name: buckets.name,
          description: buckets.description,
          color: buckets.color,
          icon: buckets.icon,
          userId: buckets.userId,
          createdAt: buckets.createdAt,
          updatedAt: buckets.updatedAt,
        })
        .from(buckets)
        .innerJoin(noteBuckets, eq(noteBuckets.bucketId, buckets.id))
        .where(and(
          eq(noteBuckets.noteId, note.id),
          eq(buckets.userId, userId)
        ));

      notesWithBuckets.push({
        ...note,
        sharedBuckets,
      });
    }

    return notesWithBuckets;
  }

  async createNote(note: InsertNote, userId: string, bucketIds: string[] = []): Promise<Note> {
    const [newNote] = await db
      .insert(notes)
      .values({ ...note, userId })
      .returning();

    // Add note to additional buckets
    if (bucketIds.length > 0) {
      const noteBucketData = bucketIds
        .filter(id => id !== note.primaryBucketId) // Don't duplicate primary bucket
        .map(bucketId => ({
          noteId: newNote.id,
          bucketId,
        }));

      if (noteBucketData.length > 0) {
        await db.insert(noteBuckets).values(noteBucketData);
      }
    }

    return newNote;
  }

  async updateNote(id: string, note: Partial<InsertNote>, userId: string, bucketIds?: string[]): Promise<Note | undefined> {
    const [updatedNote] = await db
      .update(notes)
      .set({ ...note, updatedAt: new Date() })
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
      .returning();

    if (!updatedNote) return undefined;

    // Update bucket relationships if provided
    if (bucketIds !== undefined) {
      // Remove existing relationships
      await db.delete(noteBuckets).where(eq(noteBuckets.noteId, id));
      
      // Add new relationships (excluding primary bucket)
      const noteBucketData = bucketIds
        .filter(bucketId => bucketId !== updatedNote.primaryBucketId)
        .map(bucketId => ({
          noteId: id,
          bucketId,
        }));

      if (noteBucketData.length > 0) {
        await db.insert(noteBuckets).values(noteBucketData);
      }
    }

    return updatedNote;
  }

  async deleteNote(id: string, userId: string): Promise<boolean> {
    // Delete note-bucket relationships first
    await db.delete(noteBuckets).where(eq(noteBuckets.noteId, id));
    
    // Delete the note
    const result = await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)));
    
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getNote(id: string, userId: string): Promise<NoteWithBuckets | undefined> {
    const [note] = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)));

    if (!note) return undefined;

    const sharedBuckets = await db
      .select({
        id: buckets.id,
        name: buckets.name,
        description: buckets.description,
        color: buckets.color,
        icon: buckets.icon,
        userId: buckets.userId,
        createdAt: buckets.createdAt,
        updatedAt: buckets.updatedAt,
      })
      .from(buckets)
      .innerJoin(noteBuckets, eq(noteBuckets.bucketId, buckets.id))
      .where(and(
        eq(noteBuckets.noteId, id),
        eq(buckets.userId, userId)
      ));

    return {
      ...note,
      sharedBuckets,
    };
  }

  // Search operations
  async searchNotes(query: string, userId: string, bucketId?: string): Promise<NoteWithBuckets[]> {
    const searchQuery = `%${query}%`;
    
    let baseQuery = db
      .select()
      .from(notes)
      .where(and(
        eq(notes.userId, userId),
        or(
          ilike(notes.title, searchQuery),
          ilike(notes.content, searchQuery)
        )
      ));

    // Filter by bucket if specified
    if (bucketId) {
      baseQuery = db
        .select()
        .from(notes)
        .where(and(
          eq(notes.userId, userId),
          or(
            ilike(notes.title, searchQuery),
            ilike(notes.content, searchQuery)
          ),
          or(
            eq(notes.primaryBucketId, bucketId),
            sql`${notes.id} IN (SELECT note_id FROM note_buckets WHERE bucket_id = ${bucketId})`
          )
        ));
    }

    const notesResult = await baseQuery.orderBy(notes.updatedAt);

    // Get shared buckets for each note
    const notesWithBuckets: NoteWithBuckets[] = [];
    for (const note of notesResult) {
      const sharedBuckets = await db
        .select({
          id: buckets.id,
          name: buckets.name,
          description: buckets.description,
          color: buckets.color,
          icon: buckets.icon,
          userId: buckets.userId,
          createdAt: buckets.createdAt,
          updatedAt: buckets.updatedAt,
        })
        .from(buckets)
        .innerJoin(noteBuckets, eq(noteBuckets.bucketId, buckets.id))
        .where(and(
          eq(noteBuckets.noteId, note.id),
          eq(buckets.userId, userId)
        ));

      notesWithBuckets.push({
        ...note,
        sharedBuckets,
      });
    }

    return notesWithBuckets;
  }
}

export const storage = new DatabaseStorage();
