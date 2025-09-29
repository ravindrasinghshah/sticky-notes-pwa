import type { BucketWithCount, NoteWithBuckets } from "@/data/schema";

// Cache keys
const CACHE_KEYS = {
  BUCKETS: 'sticky_notes_buckets',
  NOTES: 'sticky_notes_notes',
  LAST_SYNC: 'sticky_notes_last_sync',
  USER_ID: 'sticky_notes_user_id',
} as const;

// Cache expiration time (5 minutes)
const CACHE_EXPIRY_MS = 5 * 60 * 1000;

interface CacheData<T> {
  data: T;
  timestamp: number;
  userId: string;
}

interface CacheMetadata {
  lastSync: number;
  userId: string;
}

/**
 * Generic localStorage cache utility
 */
class LocalStorageCache {
  private isAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && 'localStorage' in window;
    } catch {
      return false;
    }
  }

  private getKey(key: string, userId: string): string {
    return `${key}_${userId}`;
  }

  private setItem<T>(key: string, data: T, userId: string): void {
    if (!this.isAvailable()) return;

    try {
      const cacheData: CacheData<T> = {
        data,
        timestamp: Date.now(),
        userId,
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  private getItem<T>(key: string, userId: string): T | null {
    if (!this.isAvailable()) return null;

    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const cacheData: CacheData<T> = JSON.parse(cached);
      
      // Check if cache belongs to current user
      if (cacheData.userId !== userId) {
        this.clearUserCache(userId);
        return null;
      }

      // Check if cache is expired
      if (Date.now() - cacheData.timestamp > CACHE_EXPIRY_MS) {
        localStorage.removeItem(key);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  }

  private removeItem(key: string): void {
    if (!this.isAvailable()) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }

  // Bucket operations
  setBuckets(buckets: BucketWithCount[], userId: string): void {
    this.setItem(CACHE_KEYS.BUCKETS, buckets, userId);
    this.updateLastSync(userId);
  }

  getBuckets(userId: string): BucketWithCount[] | null {
    return this.getItem<BucketWithCount[]>(CACHE_KEYS.BUCKETS, userId);
  }

  // Notes operations
  setNotes(bucketId: string, notes: NoteWithBuckets[], userId: string): void {
    const key = `${CACHE_KEYS.NOTES}_${bucketId}`;
    this.setItem(key, notes, userId);
  }

  getNotes(bucketId: string, userId: string): NoteWithBuckets[] | null {
    const key = `${CACHE_KEYS.NOTES}_${bucketId}`;
    return this.getItem<NoteWithBuckets[]>(key, userId);
  }

  // Cache management
  updateLastSync(userId: string): void {
    const metadata: CacheMetadata = {
      lastSync: Date.now(),
      userId,
    };
    this.setItem(CACHE_KEYS.LAST_SYNC, metadata, userId);
  }

  getLastSync(userId: string): number | null {
    const metadata = this.getItem<CacheMetadata>(CACHE_KEYS.LAST_SYNC, userId);
    return metadata?.lastSync || null;
  }

  // Clear cache for specific user
  clearUserCache(userId: string): void {
    if (!this.isAvailable()) return;

    try {
      // Get all localStorage keys
      const keys = Object.keys(localStorage);
      
      // Remove all keys that belong to this user
      keys.forEach(key => {
        if (key.includes(userId)) {
          localStorage.removeItem(key);
        }
      });

      // Also remove the main cache keys
      Object.values(CACHE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.warn('Failed to clear user cache:', error);
    }
  }

  // Clear all cache
  clearAllCache(): void {
    if (!this.isAvailable()) return;

    try {
      Object.values(CACHE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });

      // Remove all notes cache keys
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_KEYS.NOTES)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear all cache:', error);
    }
  }

  // Check if cache is fresh (less than 1 minute old)
  isCacheFresh(userId: string): boolean {
    const lastSync = this.getLastSync(userId);
    if (!lastSync) return false;
    
    return Date.now() - lastSync < 60 * 1000; // 1 minute
  }

  // Get cache size (for debugging)
  getCacheSize(): number {
    if (!this.isAvailable()) return 0;

    try {
      let totalSize = 0;
      Object.keys(localStorage).forEach(key => {
        if (key.includes('sticky_notes')) {
          totalSize += localStorage.getItem(key)?.length || 0;
        }
      });
      return totalSize;
    } catch {
      return 0;
    }
  }
}

// Export singleton instance
export const localStorageCache = new LocalStorageCache();

// Export utility functions for easy use
export const cacheUtils = {
  setBuckets: (buckets: BucketWithCount[], userId: string) => 
    localStorageCache.setBuckets(buckets, userId),
  
  getBuckets: (userId: string) => 
    localStorageCache.getBuckets(userId),
  
  setNotes: (bucketId: string, notes: NoteWithBuckets[], userId: string) => 
    localStorageCache.setNotes(bucketId, notes, userId),
  
  getNotes: (bucketId: string, userId: string) => 
    localStorageCache.getNotes(bucketId, userId),
  
  clearUserCache: (userId: string) => 
    localStorageCache.clearUserCache(userId),
  
  clearAllCache: () => 
    localStorageCache.clearAllCache(),
  
  isCacheFresh: (userId: string) => 
    localStorageCache.isCacheFresh(userId),
  
  getCacheSize: () => 
    localStorageCache.getCacheSize(),
};
