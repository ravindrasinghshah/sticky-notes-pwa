import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { NoteWithBuckets } from "@shared/schema";

interface SearchBarProps {
  onSearch: (query: string, bucketId?: string) => void;
  onResults: (results: NoteWithBuckets[]) => void;
  currentBucketId?: string | null;
}

export default function SearchBar({ onSearch, onResults, currentBucketId }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Search query
  const { data: searchResults = [] } = useQuery<NoteWithBuckets[]>({
    queryKey: ["/api/search", { q: debouncedQuery, bucketId: currentBucketId }],
    enabled: debouncedQuery.length > 0,
    queryFn: async () => {
      const params = new URLSearchParams({ q: debouncedQuery });
      if (currentBucketId) {
        params.append("bucketId", currentBucketId);
      }
      
      const res = await fetch(`/api/search?${params}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
      return res.json();
    },
  });

  // Update parent component with search state and results
  useEffect(() => {
    onSearch(debouncedQuery, currentBucketId || undefined);
    onResults(searchResults);
  }, [debouncedQuery, currentBucketId, searchResults, onSearch, onResults]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        type="search"
        placeholder="Search notes and buckets..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4"
        data-testid="input-search"
      />
    </div>
  );
}
