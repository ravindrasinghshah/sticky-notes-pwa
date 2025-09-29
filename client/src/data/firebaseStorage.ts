import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
  writeBatch,
  or,
  and,
} from "firebase/firestore";
import {
  db,
  FirebaseBucket,
  FirebaseNote,
  FirebaseNoteWithBuckets,
  FirebaseBucketWithCount,
  convertTimestampToDate,
  convertDateToTimestamp,
  getUserBucketsCollection,
  getUserBucketDoc,
  getUserNotesCollection,
  getUserNoteDoc,
} from "./firebase";

export interface IStorage {
  // Bucket operations
  getUserBuckets(userId: string): Promise<FirebaseBucketWithCount[]>;
  createBucket(bucket: Omit<FirebaseBucket, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, userId: string): Promise<FirebaseBucket>;
  updateBucket(id: string, bucket: Partial<Omit<FirebaseBucket, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>, userId: string): Promise<FirebaseBucket | undefined>;
  deleteBucket(id: string, userId: string): Promise<boolean>;
  getBucket(id: string, userId: string): Promise<FirebaseBucket | undefined>;
  
  // Note operations
  getBucketNotes(bucketId: string, userId: string): Promise<FirebaseNoteWithBuckets[]>;
  createNote(note: Omit<FirebaseNote, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'sharedBucketIds'>, userId: string, bucketIds: string[]): Promise<FirebaseNote>;
  updateNote(id: string, note: Partial<Omit<FirebaseNote, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'sharedBucketIds'>>, userId: string, bucketIds?: string[]): Promise<FirebaseNote | undefined>;
  deleteNote(id: string, userId: string): Promise<boolean>;
  getNote(id: string, userId: string): Promise<FirebaseNoteWithBuckets | undefined>;
  
  // Search operations
  searchNotes(query: string, userId: string, bucketId?: string): Promise<FirebaseNoteWithBuckets[]>;
}

export class FirebaseStorage implements IStorage {
  // Bucket operations
  async getUserBuckets(userId: string): Promise<FirebaseBucketWithCount[]> {
    try {
      const bucketsQuery = query(
        getUserBucketsCollection(userId),
        orderBy('createdAt', 'asc')
      );
      
      const bucketsSnapshot = await getDocs(bucketsQuery);
      const buckets: FirebaseBucketWithCount[] = [];
      
      for (const bucketDoc of bucketsSnapshot.docs) {
        const bucketData = bucketDoc.data() as FirebaseBucket;
        
        // Count notes in this bucket
        const notesQuery = query(
          getUserNotesCollection(userId),
          where('primaryBucketId', '==', bucketDoc.id)
        );
        const notesSnapshot = await getDocs(notesQuery);
        
        // Count notes that have this bucket in sharedBucketIds
        const sharedNotesQuery = query(
          getUserNotesCollection(userId),
          where('sharedBucketIds', 'array-contains', bucketDoc.id)
        );
        const sharedNotesSnapshot = await getDocs(sharedNotesQuery);
        
        const noteCount = notesSnapshot.size + sharedNotesSnapshot.size;
        
        buckets.push({
          ...bucketData,
          id: bucketDoc.id,
          noteCount,
        });
      }
      
      return buckets;
    } catch (error) {
      console.error("Error fetching user buckets:", error);
      return [];
    }
  }

  async createBucket(bucket: Omit<FirebaseBucket, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, userId: string): Promise<FirebaseBucket> {
    try {
      const now = convertDateToTimestamp(new Date());
      
      // Clean the data to remove undefined values
      const cleanBucketData = Object.fromEntries(
        Object.entries(bucket).filter(([_, value]) => value !== undefined)
      );
      
      const bucketData = {
        ...cleanBucketData,
        userId,
        createdAt: now,
        updatedAt: now,
      };
      
      const docRef = await addDoc(getUserBucketsCollection(userId), bucketData);
      
      return {
        ...bucketData,
        id: docRef.id,
      } as FirebaseBucket;
    } catch (error) {
      console.error("Error creating bucket:", error);
      throw error;
    }
  }

  async updateBucket(id: string, bucket: Partial<Omit<FirebaseBucket, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>, userId: string): Promise<FirebaseBucket | undefined> {
    try {
      const bucketRef = getUserBucketDoc(userId, id);
      const bucketDoc = await getDoc(bucketRef);
      
      if (!bucketDoc.exists()) {
        return undefined;
      }
      
      // Clean the data to remove undefined values
      const cleanBucketData = Object.fromEntries(
        Object.entries(bucket).filter(([_, value]) => value !== undefined)
      );
      
      const updateData = {
        ...cleanBucketData,
        updatedAt: convertDateToTimestamp(new Date()),
      };
      
      await updateDoc(bucketRef, updateData);
      
      const updatedDoc = await getDoc(bucketRef);
      return {
        ...updatedDoc.data() as FirebaseBucket,
        id: updatedDoc.id,
      };
    } catch (error) {
      console.error("Error updating bucket:", error);
      return undefined;
    }
  }

  async deleteBucket(id: string, userId: string): Promise<boolean> {
    try {
      const batch = writeBatch(db);
      
      // Delete all notes that have this bucket as primary
      const primaryNotesQuery = query(
        getUserNotesCollection(userId),
        where('primaryBucketId', '==', id)
      );
      const primaryNotesSnapshot = await getDocs(primaryNotesQuery);
      
      primaryNotesSnapshot.docs.forEach(noteDoc => {
        batch.delete(noteDoc.ref);
      });
      
      // Update notes that have this bucket in sharedBucketIds
      const sharedNotesQuery = query(
        getUserNotesCollection(userId),
        where('sharedBucketIds', 'array-contains', id)
      );
      const sharedNotesSnapshot = await getDocs(sharedNotesQuery);
      
      sharedNotesSnapshot.docs.forEach(noteDoc => {
        const noteData = noteDoc.data() as FirebaseNote;
        const updatedSharedBucketIds = noteData.sharedBucketIds.filter(bucketId => bucketId !== id);
        batch.update(noteDoc.ref, { 
          sharedBucketIds: updatedSharedBucketIds,
          updatedAt: convertDateToTimestamp(new Date())
        });
      });
      
      // Delete the bucket
      batch.delete(getUserBucketDoc(userId, id));
      
      await batch.commit();
      return true;
    } catch (error) {
      console.error("Error deleting bucket:", error);
      return false;
    }
  }

  async getBucket(id: string, userId: string): Promise<FirebaseBucket | undefined> {
    try {
      const bucketDoc = await getDoc(getUserBucketDoc(userId, id));
      if (!bucketDoc.exists()) {
        return undefined;
      }
      
      return {
        ...bucketDoc.data() as FirebaseBucket,
        id: bucketDoc.id,
      };
    } catch (error) {
      console.error("Error fetching bucket:", error);
      return undefined;
    }
  }

  // Note operations
  async getBucketNotes(bucketId: string, userId: string): Promise<FirebaseNoteWithBuckets[]> {
    try {
      // Get notes where this bucket is the primary bucket
      const primaryNotesQuery = query(
        getUserNotesCollection(userId),
        where('primaryBucketId', '==', bucketId),
        orderBy('updatedAt', 'desc')
      );
      const primaryNotesSnapshot = await getDocs(primaryNotesQuery);
      
      // Get notes where this bucket is in sharedBucketIds
      const sharedNotesQuery = query(
        getUserNotesCollection(userId),
        where('sharedBucketIds', 'array-contains', bucketId),
        orderBy('updatedAt', 'desc')
      );
      const sharedNotesSnapshot = await getDocs(sharedNotesQuery);
      
      // Combine and deduplicate notes
      const allNotes = new Map<string, FirebaseNote>();
      
      primaryNotesSnapshot.docs.forEach(doc => {
        const noteData = doc.data() as FirebaseNote;
        allNotes.set(doc.id, { ...noteData, id: doc.id });
      });
      
      sharedNotesSnapshot.docs.forEach(doc => {
        const noteData = doc.data() as FirebaseNote;
        allNotes.set(doc.id, { ...noteData, id: doc.id });
      });
      
      // Get shared buckets for each note
      const notesWithBuckets: FirebaseNoteWithBuckets[] = [];
      
      for (const note of Array.from(allNotes.values())) {
        const sharedBuckets: FirebaseBucket[] = [];
        
        for (const bucketId of note.sharedBucketIds) {
          const bucketDoc = await getDoc(getUserBucketDoc(userId, bucketId));
          if (bucketDoc.exists()) {
            sharedBuckets.push({
              ...bucketDoc.data() as FirebaseBucket,
              id: bucketDoc.id,
            });
          }
        }
        
        notesWithBuckets.push({
          ...note,
          sharedBuckets,
        });
      }
      
      // Sort by pinned status first, then by updatedAt
      notesWithBuckets.sort((a, b) => {
        // Pinned notes first
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        // Then by updatedAt
        return b.updatedAt.toMillis() - a.updatedAt.toMillis();
      });
      
      return notesWithBuckets;
    } catch (error) {
      console.error("Error fetching bucket notes:", error);
      return [];
    }
  }

  async createNote(note: Omit<FirebaseNote, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'sharedBucketIds'>, userId: string, bucketIds: string[] = []): Promise<FirebaseNote> {
    try {
      const now = convertDateToTimestamp(new Date());
      const [primaryBucketId, ...sharedBucketIds] = bucketIds;
      
      // Clean the data to remove undefined values
      const cleanNoteData = Object.fromEntries(
        Object.entries(note).filter(([_, value]) => value !== undefined)
      );
      
      const noteData = {
        ...cleanNoteData,
        userId,
        primaryBucketId: primaryBucketId || note.primaryBucketId,
        sharedBucketIds: sharedBucketIds.filter(id => id !== primaryBucketId),
        createdAt: now,
        updatedAt: now,
      };
      
      const docRef = await addDoc(getUserNotesCollection(userId), noteData);
      
      return {
        ...noteData,
        id: docRef.id,
      } as FirebaseNote;
    } catch (error) {
      console.error("Error creating note:", error);
      throw error;
    }
  }

  async updateNote(id: string, note: Partial<Omit<FirebaseNote, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'sharedBucketIds'>>, userId: string, bucketIds?: string[]): Promise<FirebaseNote | undefined> {
    try {
      const noteRef = getUserNoteDoc(userId, id);
      const noteDoc = await getDoc(noteRef);
      
      if (!noteDoc.exists()) {
        return undefined;
      }
      
      // Clean the data to remove undefined values
      const cleanNoteData = Object.fromEntries(
        Object.entries(note).filter(([_, value]) => value !== undefined)
      );
      
      const updateData: any = {
        ...cleanNoteData,
        updatedAt: convertDateToTimestamp(new Date()),
      };
      
      if (bucketIds !== undefined) {
        const [primaryBucketId, ...sharedBucketIds] = bucketIds;
        updateData.primaryBucketId = primaryBucketId || note.primaryBucketId;
        updateData.sharedBucketIds = sharedBucketIds.filter(id => id !== primaryBucketId);
      }
      
      await updateDoc(noteRef, updateData);
      
      const updatedDoc = await getDoc(noteRef);
      return {
        ...updatedDoc.data() as FirebaseNote,
        id: updatedDoc.id,
      };
    } catch (error) {
      console.error("Error updating note:", error);
      return undefined;
    }
  }

  async deleteNote(id: string, userId: string): Promise<boolean> {
    try {
      await deleteDoc(getUserNoteDoc(userId, id));
      return true;
    } catch (error) {
      console.error("Error deleting note:", error);
      return false;
    }
  }

  async getNote(id: string, userId: string): Promise<FirebaseNoteWithBuckets | undefined> {
    try {
      const noteDoc = await getDoc(getUserNoteDoc(userId, id));
      if (!noteDoc.exists()) {
        return undefined;
      }
      
      const noteData = noteDoc.data() as FirebaseNote;
      
      // Get shared buckets
      const sharedBuckets: FirebaseBucket[] = [];
      for (const bucketId of noteData.sharedBucketIds) {
        const bucketDoc = await getDoc(getUserBucketDoc(userId, bucketId));
        if (bucketDoc.exists()) {
          sharedBuckets.push({
            ...bucketDoc.data() as FirebaseBucket,
            id: bucketDoc.id,
          });
        }
      }
      
      return {
        ...noteData,
        id: noteDoc.id,
        sharedBuckets,
      };
    } catch (error) {
      console.error("Error fetching note:", error);
      return undefined;
    }
  }

  // Search operations
  async searchNotes(searchQuery: string, userId: string, bucketId?: string): Promise<FirebaseNoteWithBuckets[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation that searches in title and content
      // For production, consider using Algolia or similar search service
      
      const notesQuery = query(
        getUserNotesCollection(userId),
        orderBy('updatedAt', 'desc')
      );
      
      const notesSnapshot = await getDocs(notesQuery);
      const allNotes: FirebaseNote[] = [];
      
      notesSnapshot.docs.forEach(doc => {
        const noteData = doc.data() as FirebaseNote;
        allNotes.push({ ...noteData, id: doc.id });
      });
      
      // Filter by search query
      const filteredNotes = allNotes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Filter by bucket if specified
      const bucketFilteredNotes = bucketId 
        ? filteredNotes.filter(note => 
            note.primaryBucketId === bucketId || 
            note.sharedBucketIds.includes(bucketId)
          )
        : filteredNotes;
      
      // Get shared buckets for each note
      const notesWithBuckets: FirebaseNoteWithBuckets[] = [];
      
      for (const note of bucketFilteredNotes) {
        const sharedBuckets: FirebaseBucket[] = [];
        
        for (const bucketId of note.sharedBucketIds) {
          const bucketDoc = await getDoc(getUserBucketDoc(userId, bucketId));
          if (bucketDoc.exists()) {
            sharedBuckets.push({
              ...bucketDoc.data() as FirebaseBucket,
              id: bucketDoc.id,
            });
          }
        }
        
        notesWithBuckets.push({
          ...note,
          sharedBuckets,
        });
      }
      
      return notesWithBuckets;
    } catch (error) {
      console.error("Error searching notes:", error);
      return [];
    }
  }
}

export const firebaseStorage = new FirebaseStorage();
