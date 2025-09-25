import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useStateValue } from "@/providers/StateProvider.tsx";
import { storage } from "@/data";
import type { NoteWithBuckets } from "@/data/schema";

interface SearchBarProps {
  onSearch: (query: string) => void;
  currentBucketId?: string | null; // Keep for potential future use
}

export default function SearchBar({
  onSearch,
  currentBucketId,
}: SearchBarProps) {
  const [{ user }] = useStateValue();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Update parent component with search state
  useEffect(() => {
    onSearch(debouncedQuery); // Search across all buckets, not just current one
  }, [debouncedQuery, onSearch]);

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
