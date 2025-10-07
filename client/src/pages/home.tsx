import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCachedBuckets, useCachedNotes, useCachedAllNotes } from "@/hooks/use-cached-query";
import { useState, useEffect, useCallback } from "react";
import { useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useStateValue } from "@/providers/StateProvider.tsx";
import { storage } from "@/data";
import type {
  BucketWithCount,
  NoteWithBuckets,
  Bucket,
  Note,
} from "@/data/schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTagDefinitions } from "@/lib/tags";
import { getBucketIcon, getBucketIconColorClass, getBucketColorClass, getNoteColorClasses } from "@/lib/bucket-utils";
import { Skeleton } from "@/components/ui/skeleton";
import NoteContent from "@/components/note-content";

import {
  StickyNote,
  Plus,
  Trash2,
  Edit,
  Pin,
  PinOff,
} from "lucide-react";
import NoteEditor from "@/components/note-editor";
import BucketManager from "@/components/bucket-manager";
import BucketEditor from "@/components/bucket-editor";
import DeleteBucketDialog from "@/components/delete-bucket-dialog";
import LayoutWrapper from "@/components/layout-wrapper";

export default function Home() {
  const { toast } = useToast();
  const [{ user }] = useStateValue();
  const queryClient = useQueryClient();
  const [match, params] = useRoute("/bucket/:bucketId");

  const [selectedBucketId, setSelectedBucketId] = useState<string | null>(
    params?.bucketId || null
  );
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [showBucketManager, setShowBucketManager] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showBucketEditor, setShowBucketEditor] = useState(false);
  const [editingBucket, setEditingBucket] = useState<BucketWithCount | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(
    null
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [bucketToDelete, setBucketToDelete] = useState<BucketWithCount | null>(
    null
  );

  // Fetch buckets with cache-first strategy
  const { data: buckets = [], isLoading: bucketsLoading } = useCachedBuckets(
    user?.uid
  );

  // Fetch notes for selected bucket with cache-first strategy
  const {
    data: notes = [],
    isLoading: notesLoading,
    error: notesError,
  } = useCachedNotes(selectedBucketId || undefined, user?.uid);

  // Fetch all user notes for the bottom sheet
  const {
    data: allNotes = [],
    isLoading: allNotesLoading,
  } = useCachedAllNotes(user?.uid);

  // Get current bucket info
  const currentBucket = buckets.find((b) => b.id === selectedBucketId);

  // Set default bucket when buckets load
  useEffect(() => {
    if (buckets.length > 0 && !selectedBucketId) {
      const defaultBucket = buckets[0];
      setSelectedBucketId(defaultBucket.id);
      // setLocation(`/home/bucket/${defaultBucket.id}`);
    }
  }, [buckets, selectedBucketId]);

  // Handle bucket selection
  const handleBucketSelect = (bucketId: string) => {
    console.log("Bucket selected:", bucketId);
    setSelectedBucketId(bucketId);
    // setLocation(`/home/bucket/${bucketId}`);
    setSearchQuery("");
    setIsSearching(false);
  };

  // Handle adding note
  const handleAddNote = () => {
    if (!selectedBucketId) return;
    setEditingNote(null);
    setShowNoteEditor(true);
  };

  // Handle bucket deletion
  const handleDeleteBucket = (bucket: BucketWithCount, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bucket selection
    setBucketToDelete(bucket);
    setShowDeleteDialog(true);
  };

  // Handle bucket editing
  const handleEditBucket = (bucket: BucketWithCount, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bucket selection
    setEditingBucket(bucket);
    setShowBucketEditor(true);
  };

  const handleBucketDeleted = () => {
    // If the deleted bucket was selected, select the first available bucket
    if (bucketToDelete && selectedBucketId === bucketToDelete.id) {
      const remainingBuckets = buckets.filter(
        (b) => b.id !== bucketToDelete.id
      );
      if (remainingBuckets.length > 0) {
        setSelectedBucketId(remainingBuckets[0].id);
        // setLocation(`/home/bucket/${remainingBuckets[0].id}`);
      } else {
        setSelectedBucketId(null);
        // setLocation("/home");
      }
    }
  };

  // Handle editing note
  const handleEditNote = (note: NoteWithBuckets) => {
    setEditingNote(note);
    setShowNoteEditor(true);
  };

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      return await storage.deleteNote(noteId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buckets"] });
      queryClient.invalidateQueries({ queryKey: ["notes", selectedBucketId] });
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    },
  });

  // Toggle pin mutation
  const togglePinMutation = useMutation({
    mutationFn: async ({
      noteId,
      pinned,
    }: {
      noteId: string;
      pinned: boolean;
    }) => {
      return await storage.updateNote(noteId, { pinned });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", selectedBucketId] });
      toast({
        title: "Success",
        description: "Note pin status updated",
      });
    },
    onError: (error) => {
      console.error("Error toggling pin:", error);
      toast({
        title: "Error",
        description: "Failed to update pin status",
        variant: "destructive",
      });
    },
  });

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, []);

  // Search query - moved from SearchBar to parent component
  const { data: searchResults = [] } = useQuery<NoteWithBuckets[]>({
    queryKey: ["search", searchQuery],
    enabled: searchQuery.length > 0 && !!user?.uid,
    queryFn: async () => {
      return await storage.searchNotes(searchQuery); // Search across all buckets
    },
  });


  // Filter notes by tag if selected
  const filteredNotes = selectedTagFilter
    ? notes.filter((note) => note.tags && note.tags.includes(selectedTagFilter))
    : notes;

  const displayNotes = isSearching ? searchResults : filteredNotes;

  // Debug logging
  console.log("Current state:", {
    selectedBucketId,
    notes: notes.length,
    notesLoading,
    notesError,
    isSearching,
    searchResults: searchResults.length,
    displayNotes: displayNotes.length,
  });

  return (
    <LayoutWrapper
      showSearch={true}
      onSearch={handleSearch}
      currentBucketId={selectedBucketId || undefined}
      notes={allNotes}
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
                        className={`group relative p-4 rounded-lg cursor-pointer border transition-all hover:shadow-md ${
                          selectedBucketId === bucket.id
                            ? "bg-muted border-border"
                            : "hover:bg-muted/50 border-transparent hover:border-border"
                        }`}
                        onClick={() => handleBucketSelect(bucket.id)}
                        data-testid={`bucket-item-${bucket.id}`}
                      >
                        {/* Main content */}
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {(() => {
                              const IconComponent = getBucketIcon(bucket.icon);
                              return (
                                <IconComponent
                                  className={`w-5 h-5 ${getBucketIconColorClass(
                                    bucket.color
                                  )}`}
                                />
                              );
                            })()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground truncate">
                              {bucket.name}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-1"
                            >
                              {bucket.noteCount}
                            </Badge>
                          </div>
                        </div>

                        {/* Floating action buttons */}
                        <div className="absolute top-2 right-2 bg-background rounded-lg p-1 shadow-lg border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-primary hover:text-primary-foreground"
                              onClick={(e) => handleEditBucket(bucket, e)}
                              data-testid={`button-edit-bucket-${bucket.id}`}
                              title="Edit bucket"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={(e) => handleDeleteBucket(bucket, e)}
                              data-testid={`button-delete-bucket-${bucket.id}`}
                              title="Delete bucket"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
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
                  : selectedTagFilter
                  ? `Filtered by tag: ${
                      getTagDefinitions([selectedTagFilter])[0]?.label ||
                      selectedTagFilter
                    }`
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
              {displayNotes.map((note: NoteWithBuckets) => (
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
                      <div className="flex items-center gap-2 flex-1">
                        {note.pinned && (
                          <Pin className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        )}
                        <h3
                          className="font-semibold mb-2 flex-1"
                          data-testid={`text-note-title-${note.id}`}
                        >
                          {note.title}
                        </h3>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-6 h-6 bg-black/10 hover:bg-black/20"
                          title={note.pinned ? "Unpin note" : "Pin note"}
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePinMutation.mutate({
                              noteId: note.id,
                              pinned: !note.pinned,
                            });
                          }}
                          data-testid={`button-toggle-pin-${note.id}`}
                        >
                          {note.pinned ? (
                            <PinOff className="h-3 w-3" />
                          ) : (
                            <Pin className="h-3 w-3" />
                          )}
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

                    <NoteContent
                      content={note.content}
                      className="text-sm leading-relaxed flex-1 line-clamp-6 whitespace-pre-line"
                      data-testid={`text-note-content-${note.id}`}
                    />

                    <div className="mt-4 space-y-2">
                      {/* Buckets row */}
                      <div className="flex flex-wrap gap-1">
                        {/* Show primary bucket in search results */}
                        {isSearching && (
                          <Badge variant="default" className="text-xs">
                            {buckets.find((b) => b.id === note.primaryBucketId)
                              ?.name || "Unknown Bucket"}
                          </Badge>
                        )}
                        {/* Show shared buckets */}
                        {note.sharedBuckets.length > 0 && (
                          <>
                            {note.sharedBuckets
                              .slice(0, isSearching ? 1 : 2)
                              .map((bucket: Bucket) => (
                                <Badge
                                  key={bucket.id}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {bucket.name}
                                </Badge>
                              ))}
                            {note.sharedBuckets.length >
                              (isSearching ? 1 : 2) && (
                              <Badge variant="outline" className="text-xs">
                                +
                                {note.sharedBuckets.length -
                                  (isSearching ? 1 : 2)}
                              </Badge>
                            )}
                          </>
                        )}
                      </div>

                      {/* Tags and date row */}
                      <div className="flex items-center justify-between">
                        {/* Show tags */}
                        {note.tags && note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {getTagDefinitions(note.tags)
                              .slice(0, isSearching ? 2 : 3)
                              .map((tag) => {
                                const IconComponent = tag.icon;
                                return (
                                  <div
                                    key={tag.id}
                                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${tag.bgColor} ${tag.color} border-0 cursor-pointer relative hover:scale-110 transition-transform duration-200`}
                                    title={tag.label}
                                    onMouseEnter={(e) => {
                                      const tooltip =
                                        e.currentTarget.querySelector(
                                          ".tag-tooltip"
                                        );
                                      if (tooltip) {
                                        tooltip.classList.remove("opacity-0");
                                        tooltip.classList.add("opacity-100");
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      const tooltip =
                                        e.currentTarget.querySelector(
                                          ".tag-tooltip"
                                        );
                                      if (tooltip) {
                                        tooltip.classList.remove("opacity-100");
                                        tooltip.classList.add("opacity-0");
                                      }
                                    }}
                                  >
                                    <IconComponent className="w-3 h-3" />
                                    {/* Tooltip on hover */}
                                    <div className="tag-tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
                                      {tag.label.toLowerCase()}
                                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                                    </div>
                                  </div>
                                );
                              })}
                            {note.tags.length > (isSearching ? 2 : 3) && (
                              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground border border-border text-xs font-medium">
                                +{note.tags.length - (isSearching ? 2 : 3)}
                              </div>
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

      {/* Bucket Editor Modal */}
      {showBucketEditor && (
        <BucketEditor
          isOpen={showBucketEditor}
          onClose={() => {
            setShowBucketEditor(false);
            setEditingBucket(null);
          }}
          bucket={editingBucket}
        />
      )}

      {/* Delete Bucket Dialog */}
      <DeleteBucketDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        bucket={bucketToDelete}
        onBucketDeleted={handleBucketDeleted}
      />
    </LayoutWrapper>
  );
}
