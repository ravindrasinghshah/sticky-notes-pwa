import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Buckets/Categories for organizing notes
export const buckets = pgTable("buckets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 50 }).notNull().default("primary"),
  icon: varchar("icon", { length: 50 }).notNull().default("sticky-note"),
  userId: varchar("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notes table
export const notes = pgTable("notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  color: varchar("color", { length: 50 }).notNull().default("accent"),
  fontFamily: varchar("font_family", { length: 100 }).notNull().default("Inter"),
  userId: varchar("user_id").notNull(),
  primaryBucketId: varchar("primary_bucket_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Junction table for notes shared across multiple buckets
export const noteBuckets = pgTable("note_buckets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  noteId: varchar("note_id").notNull(),
  bucketId: varchar("bucket_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  buckets: many(buckets),
  notes: many(notes),
}));

export const bucketsRelations = relations(buckets, ({ one, many }) => ({
  user: one(users, {
    fields: [buckets.userId],
    references: [users.id],
  }),
  primaryNotes: many(notes),
  noteBuckets: many(noteBuckets),
}));

export const notesRelations = relations(notes, ({ one, many }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
  primaryBucket: one(buckets, {
    fields: [notes.primaryBucketId],
    references: [buckets.id],
  }),
  noteBuckets: many(noteBuckets),
}));

export const noteBucketsRelations = relations(noteBuckets, ({ one }) => ({
  note: one(notes, {
    fields: [noteBuckets.noteId],
    references: [notes.id],
  }),
  bucket: one(buckets, {
    fields: [noteBuckets.bucketId],
    references: [buckets.id],
  }),
}));

// Insert schemas
export const insertBucketSchema = createInsertSchema(buckets).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNoteBucketSchema = createInsertSchema(noteBuckets).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Bucket = typeof buckets.$inferSelect;
export type InsertBucket = z.infer<typeof insertBucketSchema>;
export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type NoteBucket = typeof noteBuckets.$inferSelect;
export type InsertNoteBucket = z.infer<typeof insertNoteBucketSchema>;

// Extended types for API responses
export type BucketWithCount = Bucket & {
  noteCount: number;
};

export type NoteWithBuckets = Note & {
  sharedBuckets: Bucket[];
};
