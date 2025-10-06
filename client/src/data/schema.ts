// Shared schema types for the sticky notes PWA
// These types are used across both client and server

export interface User {
  id: string;
  email: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface UpsertUser {
  id?: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface Bucket {
  id: string;
  name: string;
  description?: string | null;
  color: string;
  icon: string;
  userId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface InsertBucket {
  name: string;
  description?: string | null;
  color?: string;
  icon?: string;
}

export interface BucketWithCount extends Bucket {
  noteCount: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  fontFamily: string;
  userId: string;
  primaryBucketId: string;
  pinned: boolean;
  tags: string[];
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface InsertNote {
  title: string;
  content: string;
  primaryBucketId: string;
  color?: string;
  fontFamily?: string;
  pinned?: boolean;
  tags?: string[];
}

export interface NoteWithBuckets extends Note {
  sharedBuckets: Bucket[];
}

// Validation schemas using Zod
import { z } from "zod";

export const insertBucketSchema = z.object({
  name: z.string().min(1, "Bucket name is required"),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export const insertNoteSchema = z.object({
  title: z.string().min(1, "Note title is required"),
  content: z.string().min(1, "Note content is required"),
  primaryBucketId: z.string().min(1, "Primary bucket is required"),
  color: z.string().optional(),
  fontFamily: z.string().optional(),
  pinned: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});
