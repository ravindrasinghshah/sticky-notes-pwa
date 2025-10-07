import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tags, StickyNote, Calendar, Tag, Folder } from "lucide-react";
import { getTagDefinitions, type TagDefinition } from "@/lib/tags";
import { getBucketIcon, getBucketIconColorClass } from "@/lib/bucket-utils";
import type { NoteWithBuckets } from "@/data/schema";
import NoteViewer from "@/components/note-viewer";

interface TagBottomSheetProps {
  notes: NoteWithBuckets[];
}

interface TagWithCount extends TagDefinition {
  count: number;
  notes: NoteWithBuckets[];
}

export default function TagBottomSheet({ notes }: TagBottomSheetProps) {
  const [tagStats, setTagStats] = useState<TagWithCount[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteWithBuckets | null>(
    null
  );
  const [isNoteViewerOpen, setIsNoteViewerOpen] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calculate tag statistics
  useEffect(() => {
    const tagMap = new Map<
      string,
      { tag: TagDefinition; notes: NoteWithBuckets[] }
    >();

    // Get all unique tags from notes
    notes.forEach((note) => {
      if (note.tags) {
        note.tags.forEach((tagId) => {
          const tag = getTagDefinitions([tagId])[0];
          if (tag) {
            if (!tagMap.has(tagId)) {
              tagMap.set(tagId, { tag, notes: [] });
            }
            tagMap.get(tagId)!.notes.push(note);
          }
        });
      }
    });

    // Convert to array and sort by count (descending)
    const stats = Array.from(tagMap.values())
      .map(({ tag, notes }) => ({
        ...tag,
        count: notes.length,
        notes: notes, // Show all notes for the tag
      }))
      .sort((a, b) => b.count - a.count);

    setTagStats(stats);
  }, [notes]);

  const handleTagClick = (tagId: string) => {
    const actualTagId = tagId === "" ? null : tagId;
    setSelectedTag(actualTagId);
    // Don't close the sheet or apply filter - just show notes for viewing
  };

  const handleMobileTagSelect = (value: string) => {
    setSelectedTag(value === "all" ? null : value);
  };

  const handleNoteClick = (note: NoteWithBuckets) => {
    setSelectedNote(note);
    setIsNoteViewerOpen(true);
  };

  const handleCloseNoteViewer = () => {
    setIsNoteViewerOpen(false);
    setSelectedNote(null);
  };

  const formatNotePreview = (content: string) => {
    return content.length > 40 ? content.substring(0, 40) + "..." : content;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" title="Quick look at tags">
          <Tags className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[90vh] p-0 flex flex-col max-w-7xl mx-auto w-full border-2 border-primary/50 shadow-2xl rounded-t-[30px] bg-gradient-to-b from-background to-background/90 ring-2 ring-primary/20 dark:border-blue-400/40 dark:shadow-blue-500/20 dark:shadow-2xl "
      >
        <SheetHeader className="px-4 sm:px-6 lg:px-8 py-4 border-b flex-shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Tags className="h-5 w-5" />
            Tags & Notes
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 min-h-0">
          {/* Mobile: Dropdown + Full Width Content */}
          {isMobile ? (
            <div className="flex flex-col w-full">
              {/* Mobile Tag Selector */}
              <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-border">
                <Select
                  value={selectedTag || "all"}
                  onValueChange={handleMobileTagSelect}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a tag to view notes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <StickyNote className="h-4 w-4" />
                        All Notes ({notes.length})
                      </div>
                    </SelectItem>
                    {tagStats.map((tag) => {
                      const IconComponent = tag.icon;
                      return (
                        <SelectItem key={tag.id} value={tag.id}>
                          <div className="flex items-center gap-2">
                            <div style={{ color: tag.color }}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            {tag.label} ({tag.count})
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile Notes Content */}
              <div className="px-4 sm:px-6 lg:px-8 py-4 pb-6 overflow-y-auto flex-1">
                {selectedTag === null ? (
                  // Show all notes
                  <div>
                    <div className="flex items-center justify-between mb-4 sticky top-0 bg-background z-10 pb-2">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <StickyNote className="h-5 w-5" />
                        All Notes ({notes.length})
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => handleNoteClick(note)}
                        >
                          <div className="font-medium text-sm mb-1">
                            {note.title}
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {formatNotePreview(note.content)}
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {note.updatedAt
                                ? new Date(note.updatedAt).toLocaleDateString()
                                : "No date"}
                            </div>
                            <div className="flex items-center gap-1">
                              {note.sharedBuckets.length > 0 ? (
                                <>
                                  {(() => {
                                    const IconComponent = getBucketIcon(
                                      note.sharedBuckets[0].icon
                                    );
                                    return (
                                      <IconComponent
                                        className={`h-3 w-3 ${getBucketIconColorClass(
                                          note.sharedBuckets[0].color
                                        )}`}
                                      />
                                    );
                                  })()}
                                  <span className="text-xs">
                                    {note.sharedBuckets[0].name}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Folder className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    No bucket
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Show notes for selected tag
                  (() => {
                    const selectedTagData = tagStats.find(
                      (tag) => tag.id === selectedTag
                    );
                    if (!selectedTagData) return null;

                    return (
                      <div>
                        <div className="flex items-center justify-between mb-4 sticky top-0 bg-background z-10 pb-2">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            {(() => {
                              const IconComponent = selectedTagData.icon;
                              return <IconComponent className="h-5 w-5" />;
                            })()}
                            {selectedTagData.label} ({selectedTagData.count})
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {selectedTagData.notes.map((note) => (
                            <div
                              key={note.id}
                              className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                              onClick={() => handleNoteClick(note)}
                            >
                              <div className="font-medium text-sm mb-1">
                                {note.title}
                              </div>
                              <div className="text-xs text-muted-foreground mb-2">
                                {formatNotePreview(note.content)}
                              </div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-3 w-3" />
                                  {note.updatedAt
                                    ? new Date(
                                        note.updatedAt
                                      ).toLocaleDateString()
                                    : "No date"}
                                </div>
                                <div className="flex items-center gap-1">
                                  {note.sharedBuckets.length > 0 ? (
                                    <>
                                      {(() => {
                                        const IconComponent = getBucketIcon(
                                          note.sharedBuckets[0].icon
                                        );
                                        return (
                                          <IconComponent
                                            className={`h-3 w-3 ${getBucketIconColorClass(
                                              note.sharedBuckets[0].color
                                            )}`}
                                          />
                                        );
                                      })()}
                                      <span className="text-xs">
                                        {note.sharedBuckets[0].name}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Folder className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-xs text-muted-foreground">
                                        No bucket
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            </div>
          ) : (
            // Desktop: Sidebar + Content
            <>
              {/* Left Panel - Tags */}
              <div className="w-1/3 border-r border-border flex flex-col min-h-0">
                <div className="px-4 sm:px-6 lg:px-8 py-4 pb-6 space-y-2 overflow-y-auto flex-1">
                  {/* All Notes */}
                  <div
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTag === null
                        ? "bg-background border-2 border-primary"
                        : "hover:bg-muted/50 border-border"
                    }`}
                    onClick={() => handleTagClick("")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-muted">
                          <StickyNote className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">All Notes</div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {notes.length}
                      </Badge>
                    </div>
                  </div>

                  {/* Tag List */}
                  {tagStats.map((tag) => {
                    const IconComponent = tag.icon;
                    const isSelected = selectedTag === tag.id;

                    return (
                      <div
                        key={tag.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-background border-2 border-primary"
                            : "hover:bg-muted/50 border-border"
                        }`}
                        onClick={() => handleTagClick(tag.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-1.5 rounded-full ${
                                isSelected ? tag.color : "bg-muted"
                              }`}
                            >
                              <IconComponent className="h-3 w-3" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">
                                {tag.label}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {tag.description}
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {tag.count}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}

                  {tagStats.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No tags found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Notes */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="px-4 sm:px-6 lg:px-8 py-4 pb-6 overflow-y-auto flex-1">
                  {selectedTag === null ? (
                    // Show all notes
                    <div>
                      <div className="flex items-center justify-between mb-4 sticky top-0 bg-background z-10 pb-2">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <StickyNote className="h-5 w-5" />
                          All Notes ({notes.length})
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {notes.map((note) => (
                          <div
                            key={note.id}
                            className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => handleNoteClick(note)}
                          >
                            <div className="font-medium text-sm mb-1">
                              {note.title}
                            </div>
                            <div className="text-xs text-muted-foreground mb-2">
                              {formatNotePreview(note.content)}
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                {note.updatedAt
                                  ? new Date(
                                      note.updatedAt
                                    ).toLocaleDateString()
                                  : "No date"}
                              </div>
                              <div className="flex items-center gap-1">
                                {note.sharedBuckets.length > 0 ? (
                                  <>
                                    {(() => {
                                      const IconComponent = getBucketIcon(
                                        note.sharedBuckets[0].icon
                                      );
                                      return (
                                        <IconComponent
                                          className={`h-3 w-3 ${getBucketIconColorClass(
                                            note.sharedBuckets[0].color
                                          )}`}
                                        />
                                      );
                                    })()}
                                    <span className="text-xs">
                                      {note.sharedBuckets[0].name}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Folder className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                      No bucket
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Show notes for selected tag
                    (() => {
                      const selectedTagData = tagStats.find(
                        (tag) => tag.id === selectedTag
                      );
                      if (!selectedTagData) return null;

                      return (
                        <div>
                          <div className="flex items-center justify-between mb-4 sticky top-0 bg-background z-10 pb-2">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                              {(() => {
                                const IconComponent = selectedTagData.icon;
                                return <IconComponent className="h-5 w-5" />;
                              })()}
                              {selectedTagData.label} ({selectedTagData.count})
                            </h3>
                          </div>
                          <div className="space-y-3">
                            {selectedTagData.notes.map((note) => (
                              <div
                                key={note.id}
                                className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                onClick={() => handleNoteClick(note)}
                              >
                                <div className="font-medium text-sm mb-1">
                                  {note.title}
                                </div>
                                <div className="text-xs text-muted-foreground mb-2">
                                  {formatNotePreview(note.content)}
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-3 w-3" />
                                    {note.updatedAt
                                      ? new Date(
                                          note.updatedAt
                                        ).toLocaleDateString()
                                      : "No date"}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {note.sharedBuckets.length > 0 ? (
                                      <>
                                        {(() => {
                                          const IconComponent = getBucketIcon(
                                            note.sharedBuckets[0].icon
                                          );
                                          return (
                                            <IconComponent
                                              className={`h-3 w-3 ${getBucketIconColorClass(
                                                note.sharedBuckets[0].color
                                              )}`}
                                            />
                                          );
                                        })()}
                                        <span className="text-xs">
                                          {note.sharedBuckets[0].name}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <Folder className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">
                                          No bucket
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>

      {/* Note Viewer Modal */}
      <NoteViewer
        note={selectedNote}
        isOpen={isNoteViewerOpen}
        onClose={handleCloseNoteViewer}
      />
    </Sheet>
  );
}
