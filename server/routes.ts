import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertBucketSchema, insertNoteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Bucket routes
  app.get('/api/buckets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const buckets = await storage.getUserBuckets(userId);
      res.json(buckets);
    } catch (error) {
      console.error("Error fetching buckets:", error);
      res.status(500).json({ message: "Failed to fetch buckets" });
    }
  });

  app.post('/api/buckets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bucketData = insertBucketSchema.parse(req.body);
      const bucket = await storage.createBucket(bucketData, userId);
      res.status(201).json(bucket);
    } catch (error) {
      console.error("Error creating bucket:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid bucket data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create bucket" });
      }
    }
  });

  app.put('/api/buckets/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bucketId = req.params.id;
      const bucketData = insertBucketSchema.partial().parse(req.body);
      const bucket = await storage.updateBucket(bucketId, bucketData, userId);
      
      if (!bucket) {
        return res.status(404).json({ message: "Bucket not found" });
      }
      
      res.json(bucket);
    } catch (error) {
      console.error("Error updating bucket:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid bucket data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update bucket" });
      }
    }
  });

  app.delete('/api/buckets/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bucketId = req.params.id;
      const deleted = await storage.deleteBucket(bucketId, userId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Bucket not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting bucket:", error);
      res.status(500).json({ message: "Failed to delete bucket" });
    }
  });

  // Note routes
  app.get('/api/buckets/:bucketId/notes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bucketId = req.params.bucketId;
      const notes = await storage.getBucketNotes(bucketId, userId);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.post('/api/notes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { bucketIds, ...noteData } = req.body;
      const parsedNoteData = insertNoteSchema.parse(noteData);
      const note = await storage.createNote(parsedNoteData, userId, bucketIds || []);
      res.status(201).json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid note data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create note" });
      }
    }
  });

  app.put('/api/notes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const noteId = req.params.id;
      const { bucketIds, ...noteData } = req.body;
      const parsedNoteData = insertNoteSchema.partial().parse(noteData);
      const note = await storage.updateNote(noteId, parsedNoteData, userId, bucketIds);
      
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.json(note);
    } catch (error) {
      console.error("Error updating note:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid note data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update note" });
      }
    }
  });

  app.delete('/api/notes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const noteId = req.params.id;
      const deleted = await storage.deleteNote(noteId, userId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  app.get('/api/notes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const noteId = req.params.id;
      const note = await storage.getNote(noteId, userId);
      
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.json(note);
    } catch (error) {
      console.error("Error fetching note:", error);
      res.status(500).json({ message: "Failed to fetch note" });
    }
  });

  // Search routes
  app.get('/api/search', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const query = req.query.q as string;
      const bucketId = req.query.bucketId as string;
      
      if (!query || query.trim().length === 0) {
        return res.json([]);
      }
      
      const notes = await storage.searchNotes(query.trim(), userId, bucketId);
      res.json(notes);
    } catch (error) {
      console.error("Error searching notes:", error);
      res.status(500).json({ message: "Failed to search notes" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
