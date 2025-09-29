import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { cacheUtils } from "@/lib/localStorageCache";
import type { BucketWithCount, NoteWithBuckets } from "@/data/schema";

interface CachedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryFn'> {
  queryFn: () => Promise<T>;
  cacheKey: string;
  userId: string;
  cacheData?: T;
}

/**
 * Custom hook that implements cache-first data fetching strategy
 * - First renders data from localStorage if available
 * - Then fetches fresh data from backend in background
 * - Updates cache with fresh data
 */
export function useCachedQuery<T>({
  queryKey,
  queryFn,
  cacheKey,
  userId,
  cacheData,
  ...options
}: CachedQueryOptions<T>) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Always fetch fresh data from backend
      const freshData = await queryFn();
      
      // Update cache with fresh data
      if (cacheKey === 'buckets') {
        cacheUtils.setBuckets(freshData as BucketWithCount[], userId);
      } else if (cacheKey.startsWith('notes_')) {
        const bucketId = cacheKey.replace('notes_', '');
        cacheUtils.setNotes(bucketId, freshData as NoteWithBuckets[], userId);
      }
      
      return freshData;
    },
    // Use cached data as initial data if available
    initialData: cacheData,
    // Set stale time to 30 seconds to prevent unnecessary refetches
    staleTime: 30 * 1000,
    // Cache time of 5 minutes
    gcTime: 5 * 60 * 1000,
    // Retry on error
    retry: 2,
    // Don't refetch on window focus if cache is fresh
    refetchOnWindowFocus: !cacheUtils.isCacheFresh(userId),
    ...options,
  });
}

/**
 * Hook specifically for buckets with cache-first strategy
 */
export function useCachedBuckets(userId: string | undefined) {
  const cachedBuckets = userId ? cacheUtils.getBuckets(userId) : null;
  
  return useCachedQuery({
    queryKey: ["buckets"],
    queryFn: async () => {
      const { storage } = await import("@/data");
      return await storage.getUserBuckets();
    },
    cacheKey: 'buckets',
    userId: userId || '',
    cacheData: cachedBuckets || undefined,
    enabled: !!userId,
  });
}

/**
 * Hook specifically for notes with cache-first strategy
 */
export function useCachedNotes(bucketId: string | undefined, userId: string | undefined) {
  const cachedNotes = bucketId && userId ? cacheUtils.getNotes(bucketId, userId) : null;
  
  return useCachedQuery({
    queryKey: ["notes", bucketId],
    queryFn: async () => {
      if (!bucketId) {
        throw new Error("No bucket selected");
      }
      const { storage } = await import("@/data");
      return await storage.getBucketNotes(bucketId);
    },
    cacheKey: `notes_${bucketId}`,
    userId: userId || '',
    cacheData: cachedNotes || undefined,
    enabled: !!userId && !!bucketId,
  });
}

/**
 * Utility hook to clear cache when user logs out
 */
export function useCacheManager() {
  const clearUserCache = (userId: string) => {
    cacheUtils.clearUserCache(userId);
  };

  const clearAllCache = () => {
    cacheUtils.clearAllCache();
  };

  const getCacheInfo = () => {
    return {
      size: cacheUtils.getCacheSize(),
      isAvailable: typeof window !== 'undefined' && 'localStorage' in window,
    };
  };

  return {
    clearUserCache,
    clearAllCache,
    getCacheInfo,
  };
}
