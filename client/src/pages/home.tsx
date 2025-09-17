import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useState, useEffect, useCallback } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type {
  BucketWithCount,
  NoteWithBuckets,
  Bucket,
  Note,
} from "@shared/schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  StickyNote,
  Plus,
  Share2,
  Trash2,
} from "lucide-react";
import NoteEditor from "@/components/note-editor";
import BucketManager from "@/components/bucket-manager";
import LayoutWrapper from "@/components/layout-wrapper";

export default function Home() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute("/bucket/:bucketId");

  const [selectedBucketId, setSelectedBucketId] = useState<string | null>(
    params?.bucketId || null
  );
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [showBucketManager, setShowBucketManager] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NoteWithBuckets[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch buckets
  const { data: buckets = [], isLoading: bucketsLoading } = useQuery<
    BucketWithCount[]
  >({
    queryKey: ["/api/buckets"],
    enabled: true, // AuthGuard handles authentication
  });

  // Fetch notes for selected bucket
  const { data: notes = [], isLoading: notesLoading } = useQuery<
    NoteWithBuckets[]
  >({
    queryKey: ["/api/buckets", selectedBucketId, "notes"],
    enabled: !!selectedBucketId,
  });

  // Get current bucket info
  const currentBucket = buckets.find((b) => b.id === selectedBucketId);

  // Set default bucket when buckets load
  useEffect(() => {
    if (buckets.length > 0 && !selectedBucketId) {
      const defaultBucket = buckets[0];
      setSelectedBucketId(defaultBucket.id);
      setLocation(`/bucket/${defaultBucket.id}`);
    }
  }, [buckets, selectedBucketId, setLocation]);

  // Handle bucket selection
  const handleBucketSelect = (bucketId: string) => {
    setSelectedBucketId(bucketId);
    setLocation(`/bucket/${bucketId}`);
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  // Handle adding note
  const handleAddNote = () => {
    if (!selectedBucketId) return;
    setEditingNote(null);
    setShowNoteEditor(true);
  };

  // Handle editing note
  const handleEditNote = (note: NoteWithBuckets) => {
    setEditingNote(note);
    setShowNoteEditor(true);
  };

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/buckets"] });
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    },
  });

  // Handle search
  const handleSearch = useCallback((query: string, bucketId?: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, []);

  const handleSearchResults = useCallback((results: NoteWithBuckets[]) => {
    setSearchResults(results);
  }, []);


  // Get note color classes
  const getNoteColorClasses = (color: string) => {
    switch (color) {
      case "accent":
        return "bg-accent text-accent-foreground";
      case "green":
        return "bg-green-200 text-green-800";
      case "blue":
        return "bg-blue-200 text-blue-800";
      case "pink":
        return "bg-pink-200 text-pink-800";
      case "orange":
        return "bg-orange-200 text-orange-800";
      case "purple":
        return "bg-purple-200 text-purple-800";
      default:
        return "bg-accent text-accent-foreground";
    }
  };

  // Get bucket color classes
  const getBucketColorClass = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary";
      case "accent":
        return "bg-accent";
      case "green":
        return "bg-green-500";
      case "red":
        return "bg-red-500";
      case "blue":
        return "bg-blue-500";
      case "purple":
        return "bg-purple-500";
      default:
        return "bg-primary";
    }
  };

  const displayNotes = isSearching ? searchResults : notes;

  return (
    <LayoutWrapper
      showSearch={true}
      onSearch={handleSearch}
      onSearchResults={handleSearchResults}
      currentBucketId={selectedBucketId || undefined}
    >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar: Buckets */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">
                      Buckets
                    </h2>
                    <Button
                      size="icon"
                      onClick={() => setShowBucketManager(true)}
                      className="w-8 h-8 rounded-full"
                      data-testid="button-add-bucket"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {bucketsLoading
                      ? Array.from({ length: 3 }).map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))
                      : buckets.map((bucket) => (
                          <div
                            key={bucket.id}
                            className={`p-3 rounded-md cursor-pointer border transition-all hover:shadow-sm ${
                              selectedBucketId === bucket.id
                                ? "bg-muted border-border"
                                : "hover:bg-muted/50 border-transparent hover:border-border"
                            }`}
                            onClick={() => handleBucketSelect(bucket.id)}
                            data-testid={`bucket-item-${bucket.id}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div
                                  className={`w-3 h-3 rounded-full mr-3 ${getBucketColorClass(
                                    bucket.color
                                  )}`}
                                ></div>
                                <span className="font-medium text-foreground">
                                  {bucket.name}
                                </span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {bucket.noteCount}
                              </Badge>
                            </div>
                          </div>
                        ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content: Notes Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2
                    className="text-2xl font-bold text-foreground"
                    data-testid="text-bucket-name"
                  >
                    {isSearching
                      ? `Search results for "${searchQuery}"`
                      : currentBucket?.name || "Select a bucket"}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {isSearching
                      ? `Found ${searchResults.length} notes`
                      : currentBucket?.description ||
                        "Manage your notes and organize your thoughts"}
                  </p>
                </div>
                {!isSearching && (
                  <Button
                    onClick={handleAddNote}
                    disabled={!selectedBucketId}
                    data-testid="button-add-note"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                )}
              </div>

              {/* Notes Grid */}
              {notesLoading && !isSearching ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-48 w-full" />
                  ))}
                </div>
              ) : displayNotes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayNotes.map((note) => (
                    <Card
                      key={note.id}
                      className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 group sticky-note min-h-[200px] ${getNoteColorClasses(
                        note.color
                      )}`}
                      onClick={() => handleEditNote(note)}
                      style={{ fontFamily: note.fontFamily }}
                      data-testid={`note-card-${note.id}`}
                    >
                      <CardContent className="p-4 h-full flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                          <h3
                            className="font-semibold mb-2 flex-1"
                            data-testid={`text-note-title-${note.id}`}
                          >
                            {note.title}
                          </h3>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="w-6 h-6 bg-black/10 hover:bg-black/20"
                              title="Share"
                              onClick={(e) => {
                                e.stopPropagation();
                                // TODO: Implement share functionality
                              }}
                              data-testid={`button-share-${note.id}`}
                            >
                              <Share2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="w-6 h-6 bg-black/10 hover:bg-black/20"
                              title="Delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNoteMutation.mutate(note.id);
                              }}
                              data-testid={`button-delete-${note.id}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <p
                          className="text-sm leading-relaxed flex-1 line-clamp-6"
                          data-testid={`text-note-content-${note.id}`}
                        >
                          {note.content}
                        </p>

                        <div className="mt-4 flex items-end justify-between">
                          {note.sharedBuckets.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {note.sharedBuckets.slice(0, 2).map((bucket) => (
                                <Badge
                                  key={bucket.id}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {bucket.name}
                                </Badge>
                              ))}
                              {note.sharedBuckets.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{note.sharedBuckets.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                          <div
                            className="text-xs opacity-70 ml-auto"
                            data-testid={`text-note-date-${note.id}`}
                          >
                            {note.updatedAt
                              ? new Date(note.updatedAt).toLocaleDateString()
                              : "No date"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <StickyNote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {isSearching ? "No notes found" : "No notes yet"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {isSearching
                      ? `No notes match your search for "${searchQuery}"`
                      : "Create your first note to get started"}
                  </p>
                  {!isSearching && selectedBucketId && (
                    <Button
                      onClick={handleAddNote}
                      data-testid="button-add-first-note"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Note
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

      {/* Note Editor Modal */}
      {showNoteEditor && (
        <NoteEditor
          note={editingNote}
          buckets={buckets}
          selectedBucketId={selectedBucketId!}
          isOpen={showNoteEditor}
          onClose={() => {
            setShowNoteEditor(false);
            setEditingNote(null);
          }}
        />
      )}

      {/* Bucket Manager Modal */}
      {showBucketManager && (
        <BucketManager
          isOpen={showBucketManager}
          onClose={() => setShowBucketManager(false)}
        />
      )}
    </LayoutWrapper>
  );
}
